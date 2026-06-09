import { NextResponse } from 'next/server';
import { dbProductToProduct, getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLS = 'id, slug, name, brand, category, btu, capacity_label, price, price_label, original_price, rating, reviews, is_new, is_bestseller, energy_class, description, features, specs, smartbill_code, manage_stock, stock_status, stock_qty, image_url, active';

export async function GET() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ packages: [], units: [] });

  const [pkgRes, unitRes] = await Promise.all([
    supabase
      .from('products')
      .select(COLS)
      .eq('category', 'multisplit-pachet')
      .eq('active', true)
      .order('price', { ascending: true }),
    supabase
      .from('products')
      .select(COLS)
      .eq('category', 'multisplit')
      .eq('active', true)
      .order('btu', { ascending: true }),
  ]);

  return NextResponse.json({
    packages: (pkgRes.data ?? []).map(dbProductToProduct),
    units: (unitRes.data ?? []).map(dbProductToProduct),
  });
}
