export const VAT_RATE = 0.21;

export function vatAmount(priceWithVat: number): number {
  return Math.round(priceWithVat - priceWithVat / (1 + VAT_RATE));
}
