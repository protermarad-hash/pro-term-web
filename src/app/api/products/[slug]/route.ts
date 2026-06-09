import { NextResponse } from 'next/server';
import { dbProductToProduct, getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PUBLIC_PRODUCT_COLUMNS = 'id, slug, name, brand, category, btu, capacity_label, price, price_label, original_price, rating, reviews, is_new, is_bestseller, energy_class, description, features, specs, smartbill_code, manage_stock, stock_status, stock_qty, image_url, gallery_images, active, created_at, updated_at';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase nu este configurat.' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('products')
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Produs negăsit.' }, { status: 404 });
  }

  const product = dbProductToProduct(data);

  const { data: relatedData } = await supabase
    .from('products')
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq('active', true)
    .eq('category', data.category)
    .neq('id', data.id)
    .limit(4);

  return NextResponse.json({
    product,
    related: (relatedData ?? []).map(dbProductToProduct),
  });
}
