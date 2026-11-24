// Admin-only commercial data: validation of the protected admin form and the
// publication rules for quote-only products. Pure module (no I/O).
//
// INTERNAL: price review metadata must never reach public pages, structured
// data, analytics or public API responses. Purchase prices, margins, contract
// terms, logistics costs and negotiation thresholds are deliberately NOT
// modelled anywhere in the site.

import {
  parseDocuments,
  parsePowerSupply,
  parseStringList,
  type PowerSupply,
  type ProductDocument,
} from '@/lib/product-commercial';
import { normalizeStockStatus, type StockStatus } from '@/lib/products';

export interface PriceReview {
  priceVerifiedAt: string | null;
  approvalSource: string | null;
  needsReverification: boolean;
}

export const EMPTY_PRICE_REVIEW: PriceReview = {
  priceVerifiedAt: null,
  approvalSource: null,
  needsReverification: true,
};

export interface CommercialUpdate {
  id: string;
  price: number;
  stockStatus: StockStatus;
  manufacturerCode: string | null;
  powerSupply: PowerSupply | null;
  includedComponents: string[];
  excludedComponents: string[];
  documents: ProductDocument[];
  quoteOnly: boolean;
  active: boolean;
  review: PriceReview;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_PRICE = 10_000_000;

function lines(value: unknown): unknown {
  return typeof value === 'string' ? value.split('\n') : value;
}

function parseDocumentLines(value: unknown): ProductDocument[] {
  if (Array.isArray(value)) return parseDocuments(value);
  if (typeof value !== 'string') return [];
  // Admin textarea format: "Label | https://url" per line.
  return parseDocuments(
    value
      .split('\n')
      .map((line) => line.split('|'))
      .filter((parts) => parts.length >= 2)
      .map(([label, ...rest]) => ({ label: label.trim(), url: rest.join('|').trim() })),
  );
}

/** Accepts YYYY-MM-DD or a full ISO timestamp; never a date in the future. */
export function parseVerifiedAt(value: unknown, now: Date = new Date()): string | null | 'invalid' {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return 'invalid';
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value);
  if (Number.isNaN(date.getTime()) || date.getTime() > now.getTime() + 24 * 3600 * 1000) return 'invalid';
  return date.toISOString();
}

export function parseCommercialUpdate(
  body: unknown,
  now: Date = new Date(),
): { ok: true; update: CommercialUpdate } | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return { ok: false, error: 'Date invalide.' };
  const b = body as Record<string, unknown>;

  const id = typeof b.id === 'string' ? b.id.trim() : '';
  if (!UUID_PATTERN.test(id)) return { ok: false, error: 'ID produs invalid.' };

  const price = Number(b.price);
  if (!Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
    return { ok: false, error: 'Prețul public trebuie să fie un număr pozitiv (cu TVA).' };
  }

  const powerSupplyRaw = b.powerSupply;
  const powerSupply = powerSupplyRaw === '' || powerSupplyRaw === null || powerSupplyRaw === undefined ? null : parsePowerSupply(powerSupplyRaw);
  if (powerSupply === undefined) return { ok: false, error: 'Alimentarea trebuie să fie 230V sau 400V.' };

  const manufacturerCode = typeof b.manufacturerCode === 'string' && b.manufacturerCode.trim() ? b.manufacturerCode.trim() : null;
  if (manufacturerCode && !/^[A-Za-z0-9./-]{3,40}$/.test(manufacturerCode)) {
    return { ok: false, error: 'Codul SKU conține caractere nepermise.' };
  }

  const verifiedAt = parseVerifiedAt(b.priceVerifiedAt, now);
  if (verifiedAt === 'invalid') return { ok: false, error: 'Data verificării prețului este invalidă sau în viitor.' };

  const approvalSource = typeof b.approvalSource === 'string' && b.approvalSource.trim() ? b.approvalSource.trim() : null;
  if (approvalSource && approvalSource.length > 300) return { ok: false, error: 'Sursa aprobării este prea lungă (max. 300 caractere).' };

  return {
    ok: true,
    update: {
      id,
      price: Math.round(price * 100) / 100,
      stockStatus: normalizeStockStatus(typeof b.stockStatus === 'string' ? b.stockStatus : undefined),
      manufacturerCode,
      powerSupply,
      includedComponents: parseStringList(lines(b.includedComponents)),
      excludedComponents: parseStringList(lines(b.excludedComponents)),
      documents: parseDocumentLines(b.documents),
      quoteOnly: b.quoteOnly === true,
      active: b.active === true,
      review: {
        priceVerifiedAt: verifiedAt,
        approvalSource,
        needsReverification: b.needsReverification !== false,
      },
    },
  };
}

export interface PublishCheckInput {
  quoteOnly: boolean;
  price: number;
  manufacturerCode?: string | null;
  powerSupply?: string | null;
  includedComponents: readonly string[];
  excludedComponents: readonly string[];
  review: PriceReview;
}

/** Reasons a quote-only product may not be published (empty = publishable). */
export function getPublishBlockers(input: PublishCheckInput): string[] {
  if (!input.quoteOnly) return [];
  const blockers: string[] = [];
  if (input.review.needsReverification) blockers.push('Produsul este marcat „necesită reverificare”.');
  if (!input.review.priceVerifiedAt) blockers.push('Lipsește data verificării prețului.');
  if (!input.review.approvalSource) blockers.push('Lipsește sursa aprobării prețului.');
  if (!(input.price > 0)) blockers.push('Lipsește prețul public cu TVA.');
  if (!input.manufacturerCode) blockers.push('Lipsește codul SKU.');
  if (!input.powerSupply) blockers.push('Lipsește alimentarea (230V / 400V).');
  if (input.includedComponents.length === 0) blockers.push('Lipsesc componentele incluse.');
  if (input.excludedComponents.length === 0) blockers.push('Lipsesc componentele neincluse.');
  return blockers;
}
