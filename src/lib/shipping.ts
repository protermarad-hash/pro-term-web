export const SHIPPING_FREE_THRESHOLD = 2500;
export const SHIPPING_COST = 50;

export function calculateShipping(orderTotal: number): number {
  return orderTotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
}

export function getShippingMessage(orderTotal: number): string {
  if (orderTotal >= SHIPPING_FREE_THRESHOLD) return '';
  const remaining = SHIPPING_FREE_THRESHOLD - orderTotal;
  return `Mai adaugă ${remaining.toLocaleString('ro-RO')} RON pentru transport gratuit!`;
}
