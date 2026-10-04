import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import {
  PRODUCT_GUARANTEE_COLUMNS,
  parseProductGuaranteeInfo,
  type DbProductGuaranteeRow,
  type ProductGuaranteeInfo,
} from '@/lib/consumer-guarantee';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_IDS = 50;

export function sanitizeProductIds(ids: readonly string[]): string[] {
  return Array.from(new Set(ids.map((id) => id.trim()).filter((id) => UUID_PATTERN.test(id)))).slice(0, MAX_IDS);
}

/**
 * Reads guarantee data for active products. Kept separate from the main
 * product query and failure-tolerant on purpose: if the guarantee migration is
 * not applied yet, product pages and checkout keep working (without the
 * optional producer data) instead of failing on an unknown column.
 */
export async function fetchProductGuaranteeInfo(
  supabase: SupabaseClient,
  ids: readonly string[],
): Promise<Map<string, ProductGuaranteeInfo>> {
  const result = new Map<string, ProductGuaranteeInfo>();
  const validIds = sanitizeProductIds(ids);
  if (validIds.length === 0) return result;

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_GUARANTEE_COLUMNS)
    .in('id', validIds)
    .eq('active', true);

  if (error || !Array.isArray(data)) return result;

  for (const row of data as unknown as (DbProductGuaranteeRow & { id: string })[]) {
    result.set(row.id, parseProductGuaranteeInfo(row));
  }
  return result;
}
