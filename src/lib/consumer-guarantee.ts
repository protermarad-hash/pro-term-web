// Consumer guarantee information (OUG 34/2014 as amended by OUG 18/2026,
// Implementing Regulation (EU) 2025/1960). Legal analysis and sources:
// docs/legal/CONSUMER_GUARANTEE_COMPLIANCE_2026.md
//
// This module is framework-free so it can be shared by server code, client
// components, the admin API and the tests.

/** Official Commission files, copied byte-for-byte (hashes in the docs). */
export const LEGAL_NOTICE_SVG_PATH = '/legal/eu-notificare-garantie-legala-ro.svg';
export const LEGAL_NOTICE_PNG_PATH = '/legal/eu-notificare-garantie-legala-ro.png';
export const GARAN_LABEL_SVG_PATH = '/legal/eu-eticheta-garan-color.svg';
export const GARAN_NESTED_LABEL_SVG_PATH = '/legal/eu-eticheta-garan-imbricata.svg';

/** Intrinsic size of the official notice (A4 viewBox 595.28 x 841.89). */
export const LEGAL_NOTICE_WIDTH = 595;
export const LEGAL_NOTICE_HEIGHT = 842;

/** Same destination as the QR code on the Romanian notice. */
export const YOUR_EUROPE_LEGAL_GUARANTEE_URL = 'https://europa.eu/youreurope/garan%C8%9Bii';
export const YOUR_EUROPE_LEGAL_GUARANTEE_LABEL = 'europa.eu/youreurope/garanții';
/** Same destination as the QR code on the EU GARAN label (Annex II, element III). */
export const YOUR_EUROPE_DURABILITY_GUARANTEE_URL =
  'https://europa.eu/youreurope/commercial-guarantee-durability/index.htm';

export const GUARANTEES_PAGE_PATH = '/garantii';
export const GUARANTEES_PAGE_TITLE = 'Garanții și drepturile consumatorului';

/**
 * Text alternative of the official Romanian notice, transcribed verbatim from
 * the Commission file "Legal guarantee_notice RON.pdf". Used only for
 * assistive technologies; the visible notice is always the official image.
 */
export const LEGAL_NOTICE_TEXT_RO: readonly string[] = [
  'GARANȚIA LEGALĂ',
  'Protecția oferită de garanția legală minimă de doi ani pentru bunurile vândute în Uniunea Europeană',
  'Consumatorii își pot exercita drepturile în baza garanției legale de conformitate, de exemplu în cazul în care bunurile: nu corespund descrierii; nu funcționează astfel cum a fost prevăzut.',
  'Vânzătorii sunt răspunzători pentru orice neconformitate care exista în momentul livrării bunurilor și care este constatată în timpul perioadei de garanție legală. Vânzătorii care se află într-o astfel de situație au obligația să ofere: repararea gratuită sau înlocuirea gratuită a bunului în cauză; în unele cazuri, o reducere de preț sau rambursarea integrală.',
  'În unele țări, perioada de garanție legală este mai lungă. Pentru bunurile de ocazie, se poate aplica o perioadă mai scurtă, însă aceasta nu poate fi mai mică de un an.',
  'Pentru mai multe informații cu privire la drepturile pe care le aveți într-o anumită țară, scanați codul QR de mai jos sau adresați-vă vânzătorului. europa.eu/youreurope/garanții',
  'Ce puteți face dacă bunurile primite sunt neconforme: 1. contactați-l cât mai curând posibil pe vânzător pentru a-i semnala problema; 2. furnizați o dovadă care să ateste achiziționarea bunului, de exemplu o chitanță, o factură sau un extras de cont.',
  'Vânzătorii și producătorii pot oferi și garanții comerciale, care se aplică independent de garanția legală. De exemplu, puteți vedea această etichetă GARAN, care reprezintă o garanție comercială de durabilitate oferită fără costuri suplimentare de către producător și care acoperă întregul bun.',
];

/** Columns read for public display. durability_guarantee_source stays internal. */
export const PRODUCT_GUARANTEE_COLUMNS =
  'id, durability_guarantee_eligible, durability_guarantee_years, manufacturer_name, manufacturer_model_identifier, commercial_warranty_terms, commercial_warranty_conditions_url, after_sales_service_info, spare_parts_info, repair_info, software_updates_info';

/**
 * Space on the label: "Brand/Trademark" is left aligned and "Model identifier"
 * right aligned on the same 9 pt line (~257 units, ~5.8 units per upper-case
 * Inter glyph). "XX" may not grow past ~118 units before reaching the
 * calendar symbol, i.e. three characters ("10", "2,5"). These limits keep the
 * editable texts from overlapping fixed elements without resizing anything,
 * which the Regulation does not allow.
 */
export const MAX_MANUFACTURER_NAME_LENGTH = 30;
export const MAX_MODEL_IDENTIFIER_LENGTH = 30;
export const MAX_LABEL_TEXT_COMBINED_LENGTH = 40;
export const MAX_YEARS_LABEL_LENGTH = 3;
export const MIN_DURABILITY_YEARS_EXCLUSIVE = 2;
export const MAX_DURABILITY_YEARS = 99;

export interface ProductGuaranteeInfo {
  durabilityGuaranteeEligible: boolean;
  durabilityGuaranteeYears?: number;
  manufacturerName?: string;
  manufacturerModelIdentifier?: string;
  commercialWarrantyTerms?: string;
  commercialWarrantyConditionsUrl?: string;
  afterSalesServiceInfo?: string;
  sparePartsInfo?: string;
  repairInfo?: string;
  softwareUpdatesInfo?: string;
}

export interface DbProductGuaranteeRow {
  durability_guarantee_eligible?: boolean | null;
  durability_guarantee_years?: number | string | null;
  manufacturer_name?: string | null;
  manufacturer_model_identifier?: string | null;
  commercial_warranty_terms?: string | null;
  commercial_warranty_conditions_url?: string | null;
  after_sales_service_info?: string | null;
  spare_parts_info?: string | null;
  repair_info?: string | null;
  software_updates_info?: string | null;
}

/** Data printed in the editable fields of the EU GARAN label. */
export interface DurabilityLabelData {
  years: number;
  yearsLabel: string;
  manufacturerName: string;
  modelIdentifier: string;
}

export const EMPTY_GUARANTEE_INFO: ProductGuaranteeInfo = Object.freeze({
  durabilityGuaranteeEligible: false,
});

function cleanText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function cleanHttpsUrl(value: unknown): string | undefined {
  const text = cleanText(value);
  if (!text || !/^https:\/\/\S+$/.test(text)) return undefined;
  try {
    return new URL(text).protocol === 'https:' ? text : undefined;
  } catch {
    return undefined;
  }
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

/** Whole or half years, strictly more than two (Commission guidelines, 3.1). */
export function isValidDurabilityYears(years: number | undefined): years is number {
  return (
    typeof years === 'number' &&
    Number.isFinite(years) &&
    years > MIN_DURABILITY_YEARS_EXCLUSIVE &&
    years <= MAX_DURABILITY_YEARS &&
    Number.isInteger(years * 2)
  );
}

/** "5" or "2,5" — the guidelines require a comma before the half year. */
export function formatGuaranteeYears(years: number): string {
  return Number.isInteger(years) ? String(years) : `${Math.trunc(years)},5`;
}

export function parseProductGuaranteeInfo(row: DbProductGuaranteeRow | null | undefined): ProductGuaranteeInfo {
  if (!row) return EMPTY_GUARANTEE_INFO;
  return {
    // Only an explicit TRUE enables the label; null/undefined/strings never do.
    durabilityGuaranteeEligible: row.durability_guarantee_eligible === true,
    durabilityGuaranteeYears: toNumber(row.durability_guarantee_years),
    manufacturerName: cleanText(row.manufacturer_name),
    manufacturerModelIdentifier: cleanText(row.manufacturer_model_identifier),
    commercialWarrantyTerms: cleanText(row.commercial_warranty_terms),
    commercialWarrantyConditionsUrl: cleanHttpsUrl(row.commercial_warranty_conditions_url),
    afterSalesServiceInfo: cleanText(row.after_sales_service_info),
    sparePartsInfo: cleanText(row.spare_parts_info),
    repairInfo: cleanText(row.repair_info),
    softwareUpdatesInfo: cleanText(row.software_updates_info),
  };
}

function yearsFitLabel(years: number): boolean {
  return formatGuaranteeYears(years).length <= MAX_YEARS_LABEL_LENGTH;
}

function labelTextFits(manufacturerName: string, modelIdentifier: string): boolean {
  return (
    manufacturerName.length <= MAX_MANUFACTURER_NAME_LENGTH &&
    modelIdentifier.length <= MAX_MODEL_IDENTIFIER_LENGTH &&
    manufacturerName.length + modelIdentifier.length <= MAX_LABEL_TEXT_COMBINED_LENGTH
  );
}

/**
 * Returns the label data only when the product was explicitly marked eligible
 * AND every element the label needs is valid. Anything else → no label.
 */
export function getDurabilityLabel(info: ProductGuaranteeInfo | null | undefined): DurabilityLabelData | null {
  if (!info || info.durabilityGuaranteeEligible !== true) return null;
  const { durabilityGuaranteeYears: years, manufacturerName, manufacturerModelIdentifier } = info;
  if (!isValidDurabilityYears(years) || !manufacturerName || !manufacturerModelIdentifier) return null;
  if (!yearsFitLabel(years) || !labelTextFits(manufacturerName, manufacturerModelIdentifier)) return null;
  return {
    years,
    yearsLabel: formatGuaranteeYears(years),
    manufacturerName,
    modelIdentifier: manufacturerModelIdentifier,
  };
}

export interface ProductInfoEntry {
  key: 'commercialWarranty' | 'afterSales' | 'spareParts' | 'repair' | 'softwareUpdates';
  title: string;
  text: string;
  url?: string;
  urlLabel?: string;
}

/** Producer/seller information to show on the product page; empty fields are skipped. */
export function getProductInfoEntries(info: ProductGuaranteeInfo | null | undefined): ProductInfoEntry[] {
  if (!info) return [];
  const entries: ProductInfoEntry[] = [];

  if (info.commercialWarrantyTerms) {
    entries.push({
      key: 'commercialWarranty',
      title: 'Garanție comercială',
      text: info.commercialWarrantyTerms,
      url: info.commercialWarrantyConditionsUrl,
      urlLabel: info.commercialWarrantyConditionsUrl ? 'Condițiile garanției comerciale' : undefined,
    });
  }
  if (info.afterSalesServiceInfo) {
    entries.push({ key: 'afterSales', title: 'Servicii post-vânzare', text: info.afterSalesServiceInfo });
  }
  if (info.sparePartsInfo) {
    entries.push({ key: 'spareParts', title: 'Piese de schimb', text: info.sparePartsInfo });
  }
  if (info.repairInfo) {
    entries.push({ key: 'repair', title: 'Reparare și întreținere', text: info.repairInfo });
  }
  if (info.softwareUpdatesInfo) {
    entries.push({ key: 'softwareUpdates', title: 'Actualizări software', text: info.softwareUpdatesInfo });
  }
  return entries;
}

// ── Admin input ───────────────────────────────────────────────────────────

export const DURABILITY_LABEL_ADMIN_WARNING =
  'Activează numai dacă garanția producătorului este fără cost suplimentar, acoperă întregul produs și are o durată mai mare de 2 ani.';

export interface GuaranteeDbPayload {
  durability_guarantee_eligible: boolean;
  durability_guarantee_years: number | null;
  durability_guarantee_source: string | null;
  manufacturer_name: string | null;
  manufacturer_model_identifier: string | null;
  commercial_warranty_terms: string | null;
  commercial_warranty_conditions_url: string | null;
  after_sales_service_info: string | null;
  spare_parts_info: string | null;
  repair_info: string | null;
  software_updates_info: string | null;
}

/** Admin form/API keys (camelCase) mapped to DB columns. */
export const GUARANTEE_INPUT_KEYS = [
  'durabilityGuaranteeEligible',
  'durabilityGuaranteeYears',
  'durabilityGuaranteeSource',
  'manufacturerName',
  'manufacturerModelIdentifier',
  'commercialWarrantyTerms',
  'commercialWarrantyConditionsUrl',
  'afterSalesServiceInfo',
  'sparePartsInfo',
  'repairInfo',
  'softwareUpdatesInfo',
] as const;

export function hasGuaranteeInput(body: Record<string, unknown>): boolean {
  return GUARANTEE_INPUT_KEYS.some((key) => Object.prototype.hasOwnProperty.call(body, key));
}

function nullableText(value: unknown): string | null {
  return cleanText(value) ?? null;
}

export type GuaranteeInputResult =
  | { ok: true; payload: GuaranteeDbPayload }
  | { ok: false; error: string };

/** Validates admin input; mirrors the DB check constraints with readable errors. */
export function buildGuaranteePayload(body: Record<string, unknown>): GuaranteeInputResult {
  const eligible = body.durabilityGuaranteeEligible === true;
  const rawYears = body.durabilityGuaranteeYears;
  const years = toNumber(rawYears);
  const hasYears = !(rawYears === null || rawYears === undefined || String(rawYears).trim() === '');
  const manufacturerName = nullableText(body.manufacturerName);
  const modelIdentifier = nullableText(body.manufacturerModelIdentifier);
  const source = nullableText(body.durabilityGuaranteeSource);
  const rawUrl = nullableText(body.commercialWarrantyConditionsUrl);
  const conditionsUrl = rawUrl ? cleanHttpsUrl(rawUrl) ?? null : null;

  if (hasYears && !isValidDurabilityYears(years)) {
    return { ok: false, error: 'Durata garanției de durabilitate trebuie să fie mai mare de 2 ani, în ani întregi sau jumătăți de an (ex. 3, 5 sau 2,5).' };
  }
  if (rawUrl && !conditionsUrl) {
    return { ok: false, error: 'Linkul către condițiile garanției comerciale trebuie să înceapă cu https://.' };
  }
  if (manufacturerName && manufacturerName.length > MAX_MANUFACTURER_NAME_LENGTH) {
    return { ok: false, error: `Numele producătorului poate avea cel mult ${MAX_MANUFACTURER_NAME_LENGTH} de caractere pe etichetă.` };
  }
  if (modelIdentifier && modelIdentifier.length > MAX_MODEL_IDENTIFIER_LENGTH) {
    return { ok: false, error: `Identificatorul de model poate avea cel mult ${MAX_MODEL_IDENTIFIER_LENGTH} de caractere pe etichetă.` };
  }
  if (eligible) {
    if (!hasYears || !manufacturerName || !modelIdentifier || !source) {
      return { ok: false, error: 'Eticheta GARAN necesită: durata (> 2 ani), numele producătorului, identificatorul de model și documentul producătorului care confirmă garanția.' };
    }
    if (!yearsFitLabel(years as number)) {
      return { ok: false, error: 'Peste 10 ani, durata se poate afișa pe etichetă doar în ani întregi (ex. 10, 12).' };
    }
    if (!labelTextFits(manufacturerName, modelIdentifier)) {
      return { ok: false, error: `Numele producătorului și identificatorul de model au împreună peste ${MAX_LABEL_TEXT_COMBINED_LENGTH} de caractere și nu încap pe etichetă fără redimensionare.` };
    }
  }

  return {
    ok: true,
    payload: {
      durability_guarantee_eligible: eligible,
      durability_guarantee_years: hasYears && isValidDurabilityYears(years) ? years : null,
      durability_guarantee_source: source,
      manufacturer_name: manufacturerName,
      manufacturer_model_identifier: modelIdentifier,
      commercial_warranty_terms: nullableText(body.commercialWarrantyTerms),
      commercial_warranty_conditions_url: conditionsUrl,
      after_sales_service_info: nullableText(body.afterSalesServiceInfo),
      spare_parts_info: nullableText(body.sparePartsInfo),
      repair_info: nullableText(body.repairInfo),
      software_updates_info: nullableText(body.softwareUpdatesInfo),
    },
  };
}
