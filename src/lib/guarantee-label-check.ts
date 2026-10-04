// Fail-closed verification of EU GARAN labels for the checkout
// (OUG 34/2014 art. 8 alin. (2): the label must be shown immediately before
// the order is placed). Any failure is an error — never "no labels".
import {
  MAX_LABEL_TEXT_COMBINED_LENGTH,
  formatGuaranteeYears,
  isValidDurabilityYears,
  type DurabilityLabelData,
} from '@/lib/consumer-guarantee';

export type GuaranteeCheckStatus = 'loading' | 'ready' | 'error';

export const GUARANTEE_CHECK_LOADING_MESSAGE = 'Se verifică informațiile de garanție…';
export const GUARANTEE_CHECK_ERROR_MESSAGE =
  'Nu am putut verifica informațiile de garanție. Reîncearcă înainte de plasarea comenzii.';

export class GuaranteeCheckError extends Error {}

export function guaranteeLabelsUrl(ids: readonly string[]): string {
  return `/api/products/guarantee-labels?ids=${encodeURIComponent([...ids].sort().join(','))}`;
}

function isLabel(value: unknown): value is DurabilityLabelData {
  if (!value || typeof value !== 'object') return false;
  const label = value as Record<string, unknown>;
  return (
    typeof label.years === 'number' &&
    isValidDurabilityYears(label.years) &&
    label.yearsLabel === formatGuaranteeYears(label.years) &&
    typeof label.manufacturerName === 'string' &&
    label.manufacturerName.trim() !== '' &&
    typeof label.modelIdentifier === 'string' &&
    label.modelIdentifier.trim() !== '' &&
    label.manufacturerName.length + label.modelIdentifier.length <= MAX_LABEL_TEXT_COMBINED_LENGTH
  );
}

/** Validates the API payload; anything unexpected is an error, not "no labels". */
export function parseGuaranteeLabelsResponse(data: unknown): Record<string, DurabilityLabelData> {
  if (!data || typeof data !== 'object') throw new GuaranteeCheckError('Invalid response.');
  const labels = (data as { labels?: unknown }).labels;
  if (!labels || typeof labels !== 'object' || Array.isArray(labels)) throw new GuaranteeCheckError('Missing labels.');
  const result: Record<string, DurabilityLabelData> = {};
  for (const [id, label] of Object.entries(labels as Record<string, unknown>)) {
    if (!isLabel(label)) throw new GuaranteeCheckError(`Invalid label for ${id}.`);
    result[id] = label;
  }
  return result;
}

/** Throws on network errors, non-2xx responses and malformed payloads. */
export async function fetchGuaranteeLabels(
  ids: readonly string[],
  fetchImpl: typeof fetch = fetch,
): Promise<Record<string, DurabilityLabelData>> {
  const response = await fetchImpl(guaranteeLabelsUrl(ids), { cache: 'no-store' });
  if (!response.ok) throw new GuaranteeCheckError(`HTTP ${response.status}`);
  return parseGuaranteeLabelsResponse(await response.json());
}
