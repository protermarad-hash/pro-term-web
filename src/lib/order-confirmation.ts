import 'server-only';

import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const ORDER_CONFIRMATION_COOKIE = 'proterm_order_confirmation';
export const ORDER_CONFIRMATION_MAX_AGE_SECONDS = 60 * 60;

export function createOrderConfirmationToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashOrderConfirmationToken(token) };
}

export function hashOrderConfirmationToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function orderConfirmationTokenMatches(token: string, expectedHash: string) {
  const actual = Buffer.from(hashOrderConfirmationToken(token), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
