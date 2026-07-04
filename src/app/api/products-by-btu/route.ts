import { NextResponse } from 'next/server';
import { normalizeStockStatus } from '@/lib/products';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const btu = parseInt(searchParams.get('btu') ?? '0');

  if (!btu) return NextResponse.json({ products: [] });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ products: [] });

  const { data } = await supabase
    .from('products')
    .select('id, slug, name, brand, category, btu, capacity_label, price, image_url, energy_class, stock_status')
    .eq('btu', btu)
    .eq('active', true)
    .order('price', { ascending: true })
    .limit(12);

  const products = (data ?? [])
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      btu: p.btu,
      capacityLabel: p.capacity_label,
      price: p.price,
      imageUrl: p.image_url,
      energyClass: p.energy_class,
      stockStatus: normalizeStockStatus(p.stock_status),
    }))
    .filter((p) => p.stockStatus !== 'out_of_stock')
    .slice(0, 4);

  return NextResponse.json({ products });
}
