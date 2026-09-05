import type { Product } from '../products';
import type { ProductDetails } from './types';
import { MIDEA_BREEZELESS_E_9000_DETAILS } from './pilots/midea-breezeless-e-9000';

/**
 * Local, slug-indexed registry of `ProductDetails` enrichment payloads. There is no
 * Supabase column for this yet (see 3B/3C reports) — this is the interim source of
 * truth for the single pilot product. It carries no commercial data (price, stock,
 * rating, reviews) and no Supabase access; those stay authoritative on `Product`.
 */
const PRODUCT_DETAILS_REGISTRY: Readonly<Record<string, ProductDetails>> = Object.freeze({
  'midea-breezeless-e-9000-btu': Object.freeze({ kind: 'physical', physical: MIDEA_BREEZELESS_E_9000_DETAILS }),
});

/** Looks up enrichment data by slug. Returns `undefined` for every product not yet in the registry. */
export function getProductDetailsBySlug(slug: string): ProductDetails | undefined {
  return PRODUCT_DETAILS_REGISTRY[slug];
}

/**
 * Attaches registry enrichment (if any) to a `Product`, without touching any commercial
 * field. A product not in the registry is returned unchanged (`details` stays `undefined`).
 */
export function withProductDetails<T extends Pick<Product, 'slug'>>(product: T): T & { details?: ProductDetails } {
  const details = getProductDetailsBySlug(product.slug);
  if (!details) return product;
  return { ...product, details };
}
