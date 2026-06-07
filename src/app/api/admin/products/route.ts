import { NextResponse } from 'next/server';
import { getSupabaseServiceClient, slugify } from '@/lib/supabase';

function getMissingSupabaseEnv() {
  return [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

function splitLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSpecs(value: unknown): { label: string; value: string }[] {
  if (Array.isArray(value)) return value as { label: string; value: string }[];
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':');
      return {
        label: label?.trim() || 'Specificație',
        value: rest.join(':').trim() || '-',
      };
    });
}

export async function GET() {
  const missing = getMissingSupabaseEnv();
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      { error: `Supabase nu este configurat. Lipsesc: ${missing.join(', ') || 'cheile server'}.` },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  const missing = getMissingSupabaseEnv();
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      { error: `Supabase nu este configurat. Lipsesc: ${missing.join(', ') || 'cheile server'}.` },
      { status: 500 },
    );
  }

  const body = await request.json();
  const name = String(body.name ?? '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Numele produsului este obligatoriu.' }, { status: 400 });
  }

  const slug = String(body.slug ?? '').trim() || slugify(`${name}-${body.brand ?? ''}-${body.btu ?? ''}`);

  const payload = {
    slug,
    name,
    brand: String(body.brand ?? 'Generic').trim(),
    category: String(body.category ?? 'aer-conditionat').trim(),
    btu: body.btu ? Number(body.btu) : null,
    capacity_label: String(body.capacityLabel ?? '').trim() || null,
    price: body.price ? Number(body.price) : 0,
    price_label: String(body.priceLabel ?? '').trim() || null,
    original_price: body.originalPrice ? Number(body.originalPrice) : null,
    rating: body.rating ? Number(body.rating) : 4.7,
    reviews: body.reviews ? Number(body.reviews) : 0,
    is_new: Boolean(body.isNew),
    is_bestseller: Boolean(body.isBestseller),
    energy_class: String(body.energyClass ?? 'La cerere').trim() || 'La cerere',
    description: String(body.description ?? '').trim(),
    features: splitLines(body.features),
    specs: parseSpecs(body.specs),
    smartbill_code: String(body.smartbillCode ?? '').trim() || null,
    manage_stock: body.manageStock !== false,
    stock_status: String(body.stockStatus ?? 'on-request'),
    stock_qty: body.stockQty ? Number(body.stockQty) : null,
    image_url: String(body.imageUrl ?? '').trim() || null,
    active: body.active !== false,
  };

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}
