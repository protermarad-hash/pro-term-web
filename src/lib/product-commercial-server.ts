import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { dbProductToProduct, type DbProduct } from '@/lib/supabase';
import type { Product } from '@/lib/products';
import {
  PRODUCT_COMMERCIAL_COLUMNS,
  parseCommercialDetails,
  type DbProductCommercialRow,
  type ProductCommercialDetails,
} from '@/lib/product-commercial';
import { isMissingColumnError, sanitizeProductIds } from '@/lib/consumer-guarantee-server';
import { EMPTY_PRICE_REVIEW, getPublishBlockers } from '@/lib/product-price-review';

/** Public product columns (same list as the product page). */
export const PUBLIC_PRODUCT_COLUMNS =
  'id, slug, name, brand, category, btu, capacity_label, price, price_label, original_price, rating, reviews, is_new, is_bestseller, energy_class, description, features, specs, smartbill_code, manage_stock, stock_status, stock_qty, image_url, gallery_images, active, created_at, updated_at';

export interface CatalogItem {
  product: Product;
  commercial: ProductCommercialDetails;
}

/**
 * Commercial details for the given products. Kept separate from the main
 * product query and failure-tolerant on purpose: if the commercial-details
 * migration is not applied yet, every existing product page keeps working.
 */
export async function fetchCommercialDetails(
  supabase: SupabaseClient,
  ids: readonly string[],
): Promise<Map<string, ProductCommercialDetails>> {
  const result = new Map<string, ProductCommercialDetails>();
  const validIds = sanitizeProductIds(ids);
  if (validIds.length === 0) return result;

  const { data, error } = await supabase
    .from('products')
    .select(`id, ${PRODUCT_COMMERCIAL_COLUMNS}`)
    .in('id', validIds);

  if (error || !Array.isArray(data)) return result;

  for (const row of data as unknown as (DbProductCommercialRow & { id: string })[]) {
    result.set(row.id, parseCommercialDetails(row));
  }
  return result;
}

export type QuoteOnlyCheck = { ok: true; quoteOnlyIds: string[] } | { ok: false };

/**
 * Order gate: quote-only products are never sold through the online checkout,
 * whatever the client sends. Read from the database server-side. A missing
 * column means the migration is not applied, so no product can be quote-only;
 * any other read error fails closed.
 */
export async function findQuoteOnlyProductIds(supabase: SupabaseClient, ids: readonly string[]): Promise<QuoteOnlyCheck> {
  const validIds = sanitizeProductIds(ids);
  if (validIds.length === 0) return { ok: true, quoteOnlyIds: [] };

  const { data, error } = await supabase.from('products').select('id, quote_only').in('id', validIds);
  if (error) return isMissingColumnError(error) ? { ok: true, quoteOnlyIds: [] } : { ok: false };
  if (!Array.isArray(data)) return { ok: false };

  const quoteOnlyIds = (data as { id: string; quote_only?: boolean | null }[])
    .filter((row) => row.quote_only === true)
    .map((row) => row.id);
  return { ok: true, quoteOnlyIds };
}

/**
 * Publication gate shared by every admin write path. Returns the reasons a
 * quote-only product may not be activated (empty array = allowed). If the
 * migration is not applied, no product can be quote-only, so nothing blocks.
 */
export async function getQuoteOnlyPublishBlockers(
  supabase: SupabaseClient,
  productId: string,
  price: number,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COMMERCIAL_COLUMNS)
    .eq('id', productId)
    .maybeSingle();

  if (error || !data) return [];
  const commercial = parseCommercialDetails(data as DbProductCommercialRow);
  if (!commercial.quoteOnly) return [];

  const { data: reviewData, error: reviewError } = await supabase
    .from('product_price_reviews')
    .select('price_verified_at, approval_source, needs_reverification')
    .eq('product_id', productId)
    .maybeSingle();

  if (reviewError) return ['Datele de verificare a prețului nu au putut fi citite.'];
  const review = reviewData as {
    price_verified_at: string | null;
    approval_source: string | null;
    needs_reverification: boolean;
  } | null;

  return getPublishBlockers({
    ...commercial,
    price,
    review: review
      ? {
          priceVerifiedAt: review.price_verified_at,
          approvalSource: review.approval_source,
          needsReverification: review.needs_reverification,
        }
      : EMPTY_PRICE_REVIEW,
  });
}

export interface BrandCatalog {
  items: CatalogItem[];
  /** TRUE when at least one product of the brand line is active (published). */
  isLive: boolean;
}

/**
 * Products of a brand/category for the brand landing pages. Drafts (inactive
 * rows) are included only when `includeDrafts` is set — callers pass
 * isDraftPreviewEnabled(), which is false in production.
 */
export async function fetchBrandCatalog(
  supabase: SupabaseClient | null,
  options: { brand: string; category: string; includeDrafts: boolean },
): Promise<BrandCatalog> {
  if (!supabase) return { items: [], isLive: false };

  let query = supabase
    .from('products')
    .select(`${PUBLIC_PRODUCT_COLUMNS}, ${PRODUCT_COMMERCIAL_COLUMNS}`)
    .eq('brand', options.brand)
    .eq('category', options.category)
    .order('price', { ascending: true });

  if (!options.includeDrafts) query = query.eq('active', true);

  const { data, error } = await query;

  // Migration not applied (missing column) or any other read failure: the
  // brand pages behave as "not launched" instead of crashing.
  if (error) return { items: [], isLive: false };

  const rows = (data ?? []) as unknown as (DbProduct & DbProductCommercialRow)[];
  const items = rows.map((row) => ({
    product: dbProductToProduct(row),
    commercial: parseCommercialDetails(row),
  }));

  return { items, isLive: rows.some((row) => row.active === true) };
}
