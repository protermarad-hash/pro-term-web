import type { SourceReference, SourcedValue } from './provenance';
import { ENERGY_CLASSES, type EnergyClass } from './types';
import { UNIT_SYMBOLS, type UnitSymbol } from './units';
import { isKnownCategory, type Product } from '../products';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

function ok(): ValidationResult {
  return { valid: true, issues: [] };
}

function fail(issue: Omit<ValidationIssue, 'severity'> & { severity?: ValidationSeverity }): ValidationResult {
  const severity = issue.severity ?? 'error';
  return { valid: severity !== 'error', issues: [{ ...issue, severity }] };
}

/** Merge results, flattening issues; overall validity is false iff any issue is an error. */
export function combineResults(...results: ValidationResult[]): ValidationResult {
  const issues = results.flatMap((r) => r.issues);
  return { valid: !issues.some((i) => i.severity === 'error'), issues };
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function validateFiniteNumber(value: unknown, path: string): ValidationResult {
  if (!isFiniteNumber(value)) {
    return fail({ code: 'not-finite-number', path, message: `Expected a finite number, got ${JSON.stringify(value)}` });
  }
  return ok();
}

export function validateUrl(value: string, path: string): ValidationResult {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return fail({ code: 'url-invalid', path, message: `Invalid URL: ${value}` });
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return fail({ code: 'url-scheme', path, message: `URL must use http or https: ${value}` });
  }
  return ok();
}

const ISO_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

export function validateIsoTimestamp(value: string, path: string): ValidationResult {
  if (!ISO_TIMESTAMP_RE.test(value) || Number.isNaN(Date.parse(value))) {
    return fail({ code: 'timestamp-invalid', path, message: `Not an ISO 8601 timestamp: ${value}` });
  }
  return ok();
}

const SHA256_RE = /^[0-9a-f]{64}$/i;

export function validateSha256(value: string, path: string): ValidationResult {
  if (!SHA256_RE.test(value)) {
    return fail({ code: 'sha256-invalid', path, message: `Not a 64-character hex SHA-256 digest: ${value}` });
  }
  return ok();
}

export function validatePdfPageNumber(page: number, path: string): ValidationResult {
  if (!isFiniteNumber(page) || !Number.isInteger(page) || page <= 0) {
    return fail({ code: 'page-number-invalid', path, message: `Page number must be a positive integer: ${page}` });
  }
  return ok();
}

export function validatePercentage(value: number, path: string): ValidationResult {
  if (!isFiniteNumber(value) || value < 0 || value > 100) {
    return fail({ code: 'percentage-invalid', path, message: `Must be a number between 0 and 100: ${value}` });
  }
  return ok();
}

export function validateEnergyClass(value: string, path: string): ValidationResult {
  if (!ENERGY_CLASSES.includes(value as EnergyClass)) {
    return fail({ code: 'energy-class-invalid', path, message: `Unrecognized energy class: ${value}` });
  }
  return ok();
}

export function validateUnitSymbol(value: string, path: string): ValidationResult {
  if (!UNIT_SYMBOLS.includes(value as UnitSymbol)) {
    return fail({ code: 'unit-invalid', path, message: `Unrecognized unit symbol: ${value}` });
  }
  return ok();
}

/**
 * Validates min <= nominal <= max. Any side may be omitted; only the sides present
 * are compared. Non-finite values are reported and short-circuit the order checks.
 */
export function validateOrderedRange(
  min: number | undefined,
  nominal: number | undefined,
  max: number | undefined,
  path: string,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (min !== undefined && !isFiniteNumber(min)) {
    issues.push({ severity: 'error', code: 'range-min-invalid', path: `${path}.min`, message: `min is not a finite number: ${min}` });
  }
  if (nominal !== undefined && !isFiniteNumber(nominal)) {
    issues.push({ severity: 'error', code: 'range-nominal-invalid', path: `${path}.nominal`, message: `nominal is not a finite number: ${nominal}` });
  }
  if (max !== undefined && !isFiniteNumber(max)) {
    issues.push({ severity: 'error', code: 'range-max-invalid', path: `${path}.max`, message: `max is not a finite number: ${max}` });
  }

  const numericMin = isFiniteNumber(min) ? min : undefined;
  const numericNominal = isFiniteNumber(nominal) ? nominal : undefined;
  const numericMax = isFiniteNumber(max) ? max : undefined;

  if (numericMin !== undefined && numericNominal !== undefined && numericMin > numericNominal) {
    issues.push({ severity: 'error', code: 'range-order', path, message: `min (${numericMin}) must be <= nominal (${numericNominal})` });
  }
  if (numericNominal !== undefined && numericMax !== undefined && numericNominal > numericMax) {
    issues.push({ severity: 'error', code: 'range-order', path, message: `nominal (${numericNominal}) must be <= max (${numericMax})` });
  }
  if (numericMin !== undefined && numericMax !== undefined && numericNominal === undefined && numericMin > numericMax) {
    issues.push({ severity: 'error', code: 'range-order', path, message: `min (${numericMin}) must be <= max (${numericMax})` });
  }

  return { valid: !issues.some((i) => i.severity === 'error'), issues };
}

export function validateSourceReference(source: SourceReference, path: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!source.label || !source.label.trim()) {
    issues.push({ severity: 'error', code: 'source-label-missing', path, message: 'Source label is required' });
  }
  if (source.url !== undefined) issues.push(...validateUrl(source.url, `${path}.url`).issues);
  if (source.sha256 !== undefined) issues.push(...validateSha256(source.sha256, `${path}.sha256`).issues);
  if (source.pageNumber !== undefined) issues.push(...validatePdfPageNumber(source.pageNumber, `${path}.pageNumber`).issues);
  if (source.verifiedAt !== undefined) issues.push(...validateIsoTimestamp(source.verifiedAt, `${path}.verifiedAt`).issues);
  return { valid: !issues.some((i) => i.severity === 'error'), issues };
}

/**
 * Signals an unrecognized category as a warning, not an error — historical or
 * newly-added DB categories must never fail validation, only be flagged for review.
 */
export function validateCategory(category: string, path: string): ValidationResult {
  if (!isKnownCategory(category)) {
    return fail({ severity: 'warning', code: 'category-unknown', path, message: `Unrecognized category: ${category}` });
  }
  return ok();
}

/**
 * Flags structurally invalid or inconsistent rating/reviews pairs. This checks data
 * integrity, not display policy — whether to render a rating block is decided by
 * `hasVerifiedReviewSummary` in products.ts, which is intentionally stricter.
 */
export function validateReviewSummary(product: Pick<Product, 'rating' | 'reviews'>, path: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  const { rating, reviews } = product;

  if (!isFiniteNumber(reviews) || reviews < 0) {
    issues.push({ severity: 'error', code: 'reviews-invalid', path: `${path}.reviews`, message: `reviews must be a non-negative finite number: ${reviews}` });
  }
  if (!isFiniteNumber(rating) || rating < 0 || rating > 5) {
    issues.push({ severity: 'error', code: 'rating-invalid', path: `${path}.rating`, message: `rating must be a finite number between 0 and 5: ${rating}` });
  }
  if (isFiniteNumber(reviews) && reviews > 0 && isFiniteNumber(rating) && (rating < 1 || rating > 5)) {
    issues.push({ severity: 'warning', code: 'rating-reviews-inconsistent', path, message: 'Product has reviews but rating is outside the plausible 1-5 range' });
  }

  return { valid: !issues.some((i) => i.severity === 'error'), issues };
}

/**
 * Validates the internal consistency of a SourcedValue: a `verified` or `derived`
 * value must cite at least one source, and a `conflicting` value must carry at least
 * two variants, each with its own source. States that legitimately carry no value
 * (`not-published`, `not-applicable`, `unknown`, `requires-importer-confirmation`)
 * are valid as-is and never raise an error for "missing" data.
 */
export function validateSourcedValue<T>(sv: SourcedValue<T>, path: string): ValidationResult {
  const issues: ValidationIssue[] = [];

  switch (sv.status) {
    case 'verified': {
      if (!sv.sources || sv.sources.length === 0) {
        issues.push({ severity: 'error', code: 'verified-without-source', path, message: 'A verified value must cite at least one source' });
      } else {
        sv.sources.forEach((s, i) => issues.push(...validateSourceReference(s, `${path}.sources[${i}]`).issues));
      }
      break;
    }
    case 'derived': {
      if (!sv.derived.formula || !sv.derived.formula.trim()) {
        issues.push({ severity: 'error', code: 'derived-without-formula', path: `${path}.derived`, message: 'A derived value must include a formula' });
      }
      if (!sv.derived.sources || sv.derived.sources.length === 0) {
        issues.push({ severity: 'error', code: 'derived-without-source', path: `${path}.derived`, message: 'A derived value must cite at least one source' });
      } else {
        sv.derived.sources.forEach((s, i) => issues.push(...validateSourceReference(s, `${path}.derived.sources[${i}]`).issues));
      }
      break;
    }
    case 'conflicting': {
      if (!sv.variants || sv.variants.length < 2) {
        issues.push({ severity: 'error', code: 'conflicting-too-few-variants', path, message: 'A conflicting value must include at least two variants' });
      } else {
        sv.variants.forEach((variant, i) => {
          if (!variant.sources || variant.sources.length === 0) {
            issues.push({ severity: 'error', code: 'conflicting-variant-without-source', path: `${path}.variants[${i}]`, message: 'Each conflicting variant must cite a source' });
          } else {
            variant.sources.forEach((s, j) => issues.push(...validateSourceReference(s, `${path}.variants[${i}].sources[${j}]`).issues));
          }
        });
      }
      break;
    }
    case 'requires-importer-confirmation':
    case 'not-published':
    case 'not-applicable':
    case 'unknown':
      break;
    default: {
      const exhaustiveCheck: never = sv;
      issues.push({ severity: 'error', code: 'sourced-value-unknown-status', path, message: `Unrecognized SourcedValue status: ${JSON.stringify(exhaustiveCheck)}` });
    }
  }

  return { valid: !issues.some((i) => i.severity === 'error'), issues };
}
