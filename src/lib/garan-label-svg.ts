// Fills the editable fields of the official EU GARAN label files
// (Implementing Regulation (EU) 2025/1960, Annex II) and makes the markup safe
// to inline in a page. Everything else in the official file stays as-is.
//
// Allowed edits (Annex II, note 1, elements VI–VIII):
//   "XX"               → duration in years
//   "Brand/Trademark"  → producer name
//   "Model identifier" → model identifier
// The nested display has a single editable element: "XX".
//
// Technical (non-visual) adjustments needed to inline the SVG in HTML:
//   * class names and ids get a per-instance prefix — inline <style> rules are
//     document-global and both official files use the same "cls-N" names;
//   * the font family resolves to the site's Inter (next/font), which is the
//     font the Regulation prescribes (Annex II, note 6).

import type { DurabilityLabelData } from '@/lib/consumer-guarantee';

export type GaranLabelVariant = 'full' | 'nested';

/** Right edge of "Model identifier" in the official file (196.75 + 66.52, measured in Inter 9 px). */
const MODEL_IDENTIFIER_RIGHT_EDGE = 263.27;

const BRAND_TEXT_PATTERN =
  /<text class="(cls-\d+)" transform="translate\(6\.32 74\.52\)">\s*<tspan[^>]*>Brand\/<\/tspan>\s*<tspan[^>]*>T<\/tspan>\s*<tspan[^>]*>rademark<\/tspan>\s*<\/text>/;
const MODEL_TEXT_PATTERN =
  /<text class="(cls-\d+)" transform="translate\(196\.75 74\.52\)">\s*<tspan x="0" y="0">Model identifier<\/tspan>\s*<\/text>/;
const YEARS_TSPAN_PATTERN = /(<text class="cls-\d+" transform="translate\([\d.]+ [\d.]+\)">\s*<tspan x="0" y="0">)XX(<\/tspan>)/;

export class GaranLabelTemplateError extends Error {}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function requireMatch(svg: string, pattern: RegExp, element: string): void {
  if (!pattern.test(svg)) {
    throw new GaranLabelTemplateError(`Official GARAN label template changed: "${element}" not found.`);
  }
}

function scopeIdsAndClasses(svg: string, prefix: string): string {
  return svg
    .replace(/\bcls-(\d+)\b/g, `${prefix}-cls-$1`)
    .replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/(xlink:href|href)="#([^"]+)"/g, `$1="#${prefix}-$2"`);
}

function applySiteInterFont(svg: string): string {
  return svg.replace(/font-family:\s*Inter-[A-Za-z]+,\s*Inter;/g, 'font-family: var(--font-inter), Inter;');
}

/**
 * @param template raw content of the official SVG file
 * @param prefix   unique per rendered instance, e.g. "garan-full-<productId>"
 */
export function buildGaranLabelSvg(
  template: string,
  variant: GaranLabelVariant,
  data: Pick<DurabilityLabelData, 'yearsLabel'> & Partial<Pick<DurabilityLabelData, 'manufacturerName' | 'modelIdentifier'>>,
  prefix: string,
): string {
  if (!/^[a-z][a-z0-9-]*$/i.test(prefix)) {
    throw new GaranLabelTemplateError('Invalid SVG id prefix.');
  }

  let svg = template
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/<!--[\s\S]*?-->\s*/g, '');

  requireMatch(svg, YEARS_TSPAN_PATTERN, 'XX');
  svg = svg.replace(YEARS_TSPAN_PATTERN, `$1${escapeXml(data.yearsLabel)}$2`);

  if (variant === 'full') {
    if (!data.manufacturerName || !data.modelIdentifier) {
      throw new GaranLabelTemplateError('The full label needs the producer name and the model identifier.');
    }
    requireMatch(svg, BRAND_TEXT_PATTERN, 'Brand/Trademark');
    requireMatch(svg, MODEL_TEXT_PATTERN, 'Model identifier');
    svg = svg
      .replace(
        BRAND_TEXT_PATTERN,
        (_match, cls: string) =>
          `<text class="${cls}" transform="translate(6.32 74.52)">${escapeXml(data.manufacturerName as string)}</text>`,
      )
      .replace(
        MODEL_TEXT_PATTERN,
        (_match, cls: string) =>
          `<text class="${cls}" transform="translate(${MODEL_IDENTIFIER_RIGHT_EDGE} 74.52)" text-anchor="end">${escapeXml(data.modelIdentifier as string)}</text>`,
      );
  }

  svg = applySiteInterFont(scopeIdsAndClasses(svg, prefix));

  // Decorative for assistive technologies: the surrounding component provides
  // the equivalent text (duration, producer, model, link).
  return svg.replace(/<svg\b/, '<svg aria-hidden="true" focusable="false" class="block h-auto w-full"');
}
