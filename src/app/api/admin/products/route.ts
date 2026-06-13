import { NextResponse } from 'next/server';
import { getSupabaseServiceClient, slugify } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

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
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
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

function buildPayload(body: Record<string, unknown>) {
  const name = String(body.name ?? '').trim();
  const galleryImages = splitLines(body.galleryImages ?? body.gallery_images);
  const imageUrl = String(body.imageUrl ?? body.image_url ?? '').trim() || galleryImages[0] || null;

  return {
    slug: String(body.slug ?? '').trim() || slugify(`${name}-${body.brand ?? ''}-${body.btu ?? ''}-${Date.now()}`),
    name,
    brand: String(body.brand ?? 'Generic').trim(),
    category: String(body.category ?? 'aer-conditionat').trim(),
    btu: body.btu ? Number(body.btu) : null,
    capacity_label: String(body.capacityLabel ?? body.capacity_label ?? '').trim() || null,
    price: body.price ? Number(body.price) : 0,
    price_label: String(body.priceLabel ?? body.price_label ?? '').trim() || null,
    original_price: body.originalPrice ?? body.original_price ? Number(body.originalPrice ?? body.original_price) : null,
    rating: body.rating ? Number(body.rating) : 4.7,
    reviews: body.reviews ? Number(body.reviews) : 0,
    is_new: Boolean(body.isNew ?? body.is_new),
    is_bestseller: Boolean(body.isBestseller ?? body.is_bestseller),
    energy_class: String(body.energyClass ?? body.energy_class ?? 'La cerere').trim() || 'La cerere',
    description: String(body.description ?? '').trim(),
    features: splitLines(body.features),
    specs: parseSpecs(body.specs),
    smartbill_code: String(body.smartbillCode ?? body.smartbill_code ?? '').trim() || null,
    manage_stock: body.manageStock !== false && body.manage_stock !== false,
    stock_status: String(body.stockStatus ?? body.stock_status ?? 'on-request'),
    stock_qty: body.stockQty ?? body.stock_qty ? Number(body.stockQty ?? body.stock_qty) : null,
    image_url: imageUrl,
    active: body.active !== false,
    updated_at: new Date().toISOString(),
  };
}

function getSupabaseOrError() {
  const missing = getMissingSupabaseEnv();
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return {
      supabase: null,
      response: NextResponse.json(
        { error: `Supabase nu este configurat. Lipsesc: ${missing.join(', ') || 'cheile server'}.` },
        { status: 500 },
      ),
    };
  }

  return { supabase, response: null };
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { supabase, response } = getSupabaseOrError();
  if (!supabase) return response;

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
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { supabase, response } = getSupabaseOrError();
  if (!supabase) return response;

  const body = await request.json();
  const name = String(body.name ?? '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Numele produsului este obligatoriu.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .insert(buildPayload(body))
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { supabase, response } = getSupabaseOrError();
  if (!supabase) return response;

  const body = await request.json();
  const id = String(body.id ?? '').trim();
  const name = String(body.name ?? '').trim();

  if (!id) {
    return NextResponse.json({ error: 'ID produs lipsă.' }, { status: 400 });
  }

  if (!name) {
    return NextResponse.json({ error: 'Numele produsului este obligatoriu.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .update(buildPayload(body))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { supabase, response } = getSupabaseOrError();
  if (!supabase) return response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID produs lipsă.' }, { status: 400 });
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
