// Parser for the local, git-ignored public price list
// (private/vaillant-public-prices.csv). Pure module, unit-tested.
//
// Format (semicolon-separated, header required):
//   sku;public_price_with_vat;verified_at;approval_source
//   8000022169;19990;2026-11-23;Lista PRO TERM 23.11.2026
//
// Only PUBLIC prices with VAT. Any column that looks like purchase/cost/margin
// data is rejected so it cannot be imported into the site database by mistake.

export interface PublicPriceRow {
  sku: string;
  priceWithVat: number;
  verifiedAt: string;
  approvalSource: string;
}

const REQUIRED = ['sku', 'public_price_with_vat', 'verified_at', 'approval_source'] as const;
const FORBIDDEN_COLUMN = /(achizi|purchase|cost|marj|margin|adaos|discount|net|negoc|prag|threshold|logist)/i;

export function parsePublicPriceCsv(content: string): { rows: PublicPriceRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = content
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

  if (lines.length === 0) return { rows: [], errors: ['Fișierul de prețuri este gol.'] };

  const header = lines[0].split(';').map((cell) => cell.trim().toLowerCase());
  const forbidden = header.filter((column) => !REQUIRED.includes(column as (typeof REQUIRED)[number]) && FORBIDDEN_COLUMN.test(column));
  if (forbidden.length > 0) {
    return { rows: [], errors: [`Coloane interzise în lista publică: ${forbidden.join(', ')}. Importul este oprit.`] };
  }
  const index = Object.fromEntries(REQUIRED.map((column) => [column, header.indexOf(column)])) as Record<(typeof REQUIRED)[number], number>;
  const missing = REQUIRED.filter((column) => index[column] === -1);
  if (missing.length > 0) return { rows: [], errors: [`Lipsesc coloanele: ${missing.join(', ')}.`] };

  const rows: PublicPriceRow[] = [];
  const seen = new Set<string>();
  lines.slice(1).forEach((line, i) => {
    const cells = line.split(';').map((cell) => cell.trim());
    const lineNo = i + 2;
    const sku = cells[index.sku] ?? '';
    const price = Number((cells[index.public_price_with_vat] ?? '').replace(/\./g, '').replace(',', '.'));
    const verifiedAt = cells[index.verified_at] ?? '';
    const approvalSource = cells[index.approval_source] ?? '';

    if (!/^\d{10}$/.test(sku)) return errors.push(`Linia ${lineNo}: cod SKU invalid „${sku}”.`);
    if (seen.has(sku)) return errors.push(`Linia ${lineNo}: SKU duplicat ${sku}.`);
    if (!Number.isFinite(price) || price <= 0) return errors.push(`Linia ${lineNo}: preț invalid pentru ${sku}.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt) || Number.isNaN(new Date(verifiedAt).getTime())) {
      return errors.push(`Linia ${lineNo}: dată de verificare invalidă pentru ${sku} (format AAAA-LL-ZZ).`);
    }
    if (!approvalSource || approvalSource.length > 300) return errors.push(`Linia ${lineNo}: sursa aprobării lipsește sau e prea lungă.`);

    seen.add(sku);
    rows.push({ sku, priceWithVat: Math.round(price * 100) / 100, verifiedAt, approvalSource });
    return undefined;
  });

  return { rows, errors };
}
