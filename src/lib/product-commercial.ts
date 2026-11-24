// Commercial details for quote-led catalogue lines (first use: Vaillant heat
// pumps). Pure module: safe to import from server and client components.
//
// Only data that may be shown publicly is modelled here. Price review
// metadata (verification date, approval source, re-verification flag) is
// internal and lives in src/lib/product-price-review.ts (server/admin only).

export type PowerSupply = '230V' | '400V';

export interface ProductDocument {
  label: string;
  url: string;
}

export interface ProductCommercialDetails {
  manufacturerCode?: string;
  productLine?: string;
  powerSupply?: PowerSupply;
  includedComponents: string[];
  excludedComponents: string[];
  documents: ProductDocument[];
  quoteOnly: boolean;
}

export const EMPTY_COMMERCIAL_DETAILS: ProductCommercialDetails = {
  includedComponents: [],
  excludedComponents: [],
  documents: [],
  quoteOnly: false,
};

/** Columns read by the tolerant commercial-details query. */
export const PRODUCT_COMMERCIAL_COLUMNS =
  'manufacturer_code, product_line, power_supply, included_components, excluded_components, documents, quote_only';

export interface DbProductCommercialRow {
  manufacturer_code?: string | null;
  product_line?: string | null;
  power_supply?: string | null;
  included_components?: unknown;
  excluded_components?: unknown;
  documents?: unknown;
  quote_only?: boolean | null;
}

// Fixed wording required by the commercial brief — keep verbatim.
export const POWER_SELECTION_NOTICE =
  'Alegerea puterii se face după calculul necesarului termic și verificarea instalației.';
export const PRICE_AVAILABILITY_NOTICE = 'Preț supus confirmării disponibilității.';
export const QUOTE_ONLY_AVAILABILITY_NOTICE = 'Disponibilitatea și termenul de livrare se confirmă în oferta PRO TERM.';
export const SYSTEM_QUOTE_CTA = 'Solicită ofertă pentru sistem complet';
export const VAILLANT_REPAIR_NOTICE =
  'Reparațiile sunt realizate prin rețeaua de parteneri service autorizați Vaillant.';

export const POWER_SUPPLY_LABEL: Record<PowerSupply, string> = {
  '230V': '230 V (monofazat)',
  '400V': '400 V (trifazat)',
};

const MAX_LIST_ITEMS = 30;
const MAX_ITEM_LENGTH = 200;

function cleanText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parsePowerSupply(value: unknown): PowerSupply | undefined {
  return value === '230V' || value === '400V' ? value : undefined;
}

export function parseStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= MAX_ITEM_LENGTH)
    .slice(0, MAX_LIST_ITEMS);
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.length > 0;
  } catch {
    return false;
  }
}

export function parseDocuments(value: unknown): ProductDocument[] {
  if (!Array.isArray(value)) return [];
  const documents: ProductDocument[] = [];
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue;
    const label = cleanText((item as Record<string, unknown>).label);
    const url = cleanText((item as Record<string, unknown>).url);
    if (!label || !url || label.length > MAX_ITEM_LENGTH || !isSafeHttpsUrl(url)) continue;
    documents.push({ label, url });
    if (documents.length >= MAX_LIST_ITEMS) break;
  }
  return documents;
}

export function parseCommercialDetails(row: DbProductCommercialRow | null | undefined): ProductCommercialDetails {
  if (!row) return EMPTY_COMMERCIAL_DETAILS;
  return {
    manufacturerCode: cleanText(row.manufacturer_code),
    productLine: cleanText(row.product_line),
    powerSupply: parsePowerSupply(row.power_supply),
    includedComponents: parseStringList(row.included_components),
    excludedComponents: parseStringList(row.excluded_components),
    documents: parseDocuments(row.documents),
    quoteOnly: row.quote_only === true,
  };
}

/**
 * Draft content (inactive products, unlaunched brand pages) is viewable only
 * in local development and on Vercel Preview deployments. Fail-closed: any
 * other environment — including production or an unknown host — hides drafts.
 */
export function isDraftPreviewEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === 'development' || env.VERCEL_ENV === 'preview';
}
