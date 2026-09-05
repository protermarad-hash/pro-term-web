/**
 * Provenance model for product-content fields whose truth is not guaranteed by
 * having a value at all — a spec sheet, a manual, and an energy label can disagree,
 * and "we don't have this yet" must stay distinguishable from "confirmed empty".
 */

export type SourceKind =
  | 'official-website'
  | 'official-pdf'
  | 'manual'
  | 'energy-label'
  | 'eprel'
  | 'pro-term-admin'
  | 'importer'
  | 'other';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type VerificationStatus =
  | 'verified'
  | 'derived'
  | 'conflicting'
  | 'requires-importer-confirmation'
  | 'not-published'
  | 'not-applicable'
  | 'unknown';

/** ISO 8601 date or date-time string. Runtime-validated by validation.ts, not by the type. */
export type IsoTimestamp = string;

export type NonEmptyArray<T> = [T, ...T[]];

export interface SourceReference {
  kind: SourceKind;
  /** Short human-readable label, e.g. "Fișă tehnică Midea CB1-09HRFN8 (RO), p.2". */
  label: string;
  /** Public URL, when the source is web-reachable. Validated as http(s) at runtime. */
  url?: string;
  /** Stable id of a ProductDocument entry, when the source is a stored document. */
  documentId?: string;
  /** 1-based page number, required for citing a specific page of a PDF/manual. */
  pageNumber?: number;
  /** SHA-256 hex digest of the exact file version cited, when available. */
  sha256?: string;
  verifiedAt?: IsoTimestamp;
  confidence: ConfidenceLevel;
  /** Internal-only note — never rendered publicly, unlike everything else on this type. */
  internalNote?: string;
}

export interface ConflictingValue<T> {
  value: T;
  sources: NonEmptyArray<SourceReference>;
  note?: string;
}

export interface DerivedValue<T> {
  value: T;
  /** Human-readable formula/method, e.g. "SCOP mediu ponderat din Pdesignh pe cele 3 zone climatice". */
  formula: string;
  sources: NonEmptyArray<SourceReference>;
}

/**
 * A field-level value with mandatory provenance. The discriminant is `status`, never
 * "is value present" — a `conflicting` or `requires-importer-confirmation` state must
 * never be read as if it were a plain confirmed value.
 */
export type SourcedValue<T> =
  | { status: 'verified'; value: T; sources: NonEmptyArray<SourceReference> }
  | { status: 'derived'; derived: DerivedValue<T> }
  | { status: 'conflicting'; variants: [ConflictingValue<T>, ConflictingValue<T>, ...ConflictingValue<T>[]] }
  | { status: 'requires-importer-confirmation'; note?: string }
  | { status: 'not-published' }
  | { status: 'not-applicable' }
  | { status: 'unknown' };
