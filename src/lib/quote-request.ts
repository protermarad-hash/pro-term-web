// Heat pump quote request: shared option lists (form + email) and the
// server-side validation used by /api/quote-request. Pure module.

import { OFFER_OPTIONS, isOfferOptionId, type OfferOptionId } from '@/lib/vaillant-catalog';

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
}

export const INSULATION_OPTIONS = [
  { value: 'fara', label: 'Fără izolație' },
  { value: 'partiala', label: 'Izolație parțială' },
  { value: 'completa', label: 'Izolație completă (pereți și acoperiș)' },
  { value: 'nu-stiu', label: 'Nu știu' },
] as const satisfies readonly ChoiceOption<string>[];

export const EXISTING_SYSTEM_OPTIONS = [
  { value: 'centrala-gaz', label: 'Centrală pe gaz' },
  { value: 'combustibil-solid', label: 'Centrală pe lemne / peleți' },
  { value: 'electric', label: 'Încălzire electrică' },
  { value: 'pompa-caldura', label: 'Pompă de căldură existentă' },
  { value: 'constructie-noua', label: 'Construcție nouă, fără sistem' },
  { value: 'altul', label: 'Alt sistem' },
] as const satisfies readonly ChoiceOption<string>[];

export const EMITTER_OPTIONS = [
  { value: 'radiatoare', label: 'Radiatoare' },
  { value: 'pardoseala', label: 'Încălzire în pardoseală' },
  { value: 'mixt', label: 'Radiatoare și pardoseală' },
  { value: 'nu-stiu', label: 'Nu știu încă' },
] as const satisfies readonly ChoiceOption<string>[];

export const HOT_WATER_OPTIONS = [
  { value: 'da', label: 'Da, și pentru apă caldă menajeră' },
  { value: 'nu', label: 'Nu, doar încălzire' },
  { value: 'nu-stiu', label: 'Nu știu încă' },
] as const satisfies readonly ChoiceOption<string>[];

export const ELECTRICAL_SUPPLY_OPTIONS = [
  { value: 'monofazat', label: 'Monofazată (230 V)' },
  { value: 'trifazat', label: 'Trifazată (400 V)' },
  { value: 'nu-stiu', label: 'Nu știu' },
] as const satisfies readonly ChoiceOption<string>[];

type ValueOf<T extends readonly ChoiceOption<string>[]> = T[number]['value'];

export interface QuoteRequestData {
  offerOption: OfferOptionId;
  product: string;
  locality: string;
  areaSqm: number;
  constructionYear?: number;
  insulation: ValueOf<typeof INSULATION_OPTIONS>;
  existingSystem: ValueOf<typeof EXISTING_SYSTEM_OPTIONS>;
  emitters: ValueOf<typeof EMITTER_OPTIONS>;
  hotWater: ValueOf<typeof HOT_WATER_OPTIONS>;
  occupants: number;
  electricalSupply: ValueOf<typeof ELECTRICAL_SUPPLY_OPTIONS>;
  name: string;
  phone: string;
  email?: string;
  details: string;
}

export type QuoteValidationResult =
  | { ok: true; data: QuoteRequestData }
  | { ok: false; field: string }
  | { ok: false; spam: true };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()./\s-]{6,30}$/;

export const QUOTE_LIMITS = {
  name: 100,
  phone: 30,
  email: 200,
  locality: 100,
  product: 150,
  details: 2000,
  areaMin: 10,
  areaMax: 5000,
  yearMin: 1850,
  occupantsMin: 1,
  occupantsMax: 30,
} as const;

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > max ? null : trimmed;
}

function intInRange(value: unknown, min: number, max: number): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

function choice<T extends readonly ChoiceOption<string>[]>(options: T, value: unknown): ValueOf<T> | null {
  return options.some((option) => option.value === value) ? (value as ValueOf<T>) : null;
}

export function labelFor(options: readonly ChoiceOption<string>[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function offerOptionLabel(id: OfferOptionId): string {
  return OFFER_OPTIONS.find((option) => option.id === id)?.title ?? id;
}

export function validateQuoteRequest(body: unknown, now: Date = new Date()): QuoteValidationResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return { ok: false, field: 'body' };
  const p = body as Record<string, unknown>;

  if (typeof p.honeypot === 'string' && p.honeypot.trim().length > 0) return { ok: false, spam: true };

  if (p.gdprConsent !== true) return { ok: false, field: 'gdprConsent' };
  if (!isOfferOptionId(p.offerOption)) return { ok: false, field: 'offerOption' };

  const name = text(p.name, QUOTE_LIMITS.name);
  if (!name) return { ok: false, field: 'name' };

  const phone = text(p.phone, QUOTE_LIMITS.phone);
  if (!phone || !PHONE_RE.test(phone)) return { ok: false, field: 'phone' };

  let email: string | undefined;
  if (p.email !== undefined && p.email !== null && p.email !== '') {
    const cleaned = text(p.email, QUOTE_LIMITS.email);
    if (!cleaned || !EMAIL_RE.test(cleaned)) return { ok: false, field: 'email' };
    email = cleaned;
  }

  const locality = text(p.locality, QUOTE_LIMITS.locality);
  if (!locality) return { ok: false, field: 'locality' };

  const areaSqm = intInRange(p.areaSqm, QUOTE_LIMITS.areaMin, QUOTE_LIMITS.areaMax);
  if (areaSqm === null) return { ok: false, field: 'areaSqm' };

  let constructionYear: number | undefined;
  if (p.constructionYear !== undefined && p.constructionYear !== null && p.constructionYear !== '') {
    const year = intInRange(p.constructionYear, QUOTE_LIMITS.yearMin, now.getFullYear() + 2);
    if (year === null) return { ok: false, field: 'constructionYear' };
    constructionYear = year;
  }

  const insulation = choice(INSULATION_OPTIONS, p.insulation);
  if (!insulation) return { ok: false, field: 'insulation' };
  const existingSystem = choice(EXISTING_SYSTEM_OPTIONS, p.existingSystem);
  if (!existingSystem) return { ok: false, field: 'existingSystem' };
  const emitters = choice(EMITTER_OPTIONS, p.emitters);
  if (!emitters) return { ok: false, field: 'emitters' };
  const hotWater = choice(HOT_WATER_OPTIONS, p.hotWater);
  if (!hotWater) return { ok: false, field: 'hotWater' };
  const electricalSupply = choice(ELECTRICAL_SUPPLY_OPTIONS, p.electricalSupply);
  if (!electricalSupply) return { ok: false, field: 'electricalSupply' };

  const occupants = intInRange(p.occupants, QUOTE_LIMITS.occupantsMin, QUOTE_LIMITS.occupantsMax);
  if (occupants === null) return { ok: false, field: 'occupants' };

  const product = p.product === undefined || p.product === null ? '' : text(p.product, QUOTE_LIMITS.product);
  if (product === null) return { ok: false, field: 'product' };

  const details = p.details === undefined || p.details === null ? '' : text(p.details, QUOTE_LIMITS.details);
  if (details === null) return { ok: false, field: 'details' };

  return {
    ok: true,
    data: {
      offerOption: p.offerOption,
      product,
      locality,
      areaSqm,
      constructionYear,
      insulation,
      existingSystem,
      emitters,
      hotWater,
      occupants,
      electricalSupply,
      name,
      phone,
      email,
      details,
    },
  };
}
