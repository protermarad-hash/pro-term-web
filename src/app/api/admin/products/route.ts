import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { slugify } from '@/lib/supabase';

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
    stock_status: String(body.stockStatus ?? body.stock_status ?? 'la_comanda'),
    stock_qty: body.stockQty ?? body.stock_qty ? Number(body.stockQty ?? body.stock_qty) : null,
    image_url: imageUrl,
    gallery_images: galleryImages,
    active: body.active !== false,
    updated_at: new Date().toISOString(),
  };
}

function hasGalleryKey(body: Record<string, unknown>) {
  return Object.prototype.hasOwnProperty.call(body, 'galleryImages')
    || Object.prototype.hasOwnProperty.call(body, 'gallery_images');
}

function hasValidGalleryImages(body: Record<string, unknown>) {
  const value = body.galleryImages ?? body.gallery_images;
  return value === undefined || typeof value === 'string' || (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Nu am putut încărca produsele.' }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const body = await request.json();
  const name = String(body.name ?? '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Numele produsului este obligatoriu.' }, { status: 400 });
  }
  if (!hasValidGalleryImages(body)) {
    return NextResponse.json({ error: 'Galeria trebuie să conțină numai texte.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .insert(buildPayload(body))
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Produsul nu a putut fi salvat.' }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const body = await request.json();
  const id = String(body.id ?? '').trim();
  const name = String(body.name ?? '').trim();

  if (!id) {
    return NextResponse.json({ error: 'ID produs lipsă.' }, { status: 400 });
  }

  if (!name) {
    return NextResponse.json({ error: 'Numele produsului este obligatoriu.' }, { status: 400 });
  }
  if (!hasValidGalleryImages(body)) {
    return NextResponse.json({ error: 'Galeria trebuie să conțină numai texte.' }, { status: 400 });
  }

  const payload = buildPayload(body);
  if (!hasGalleryKey(body)) {
    // Key entirely absent from the request: leave the existing gallery untouched
    // instead of wiping it with the [] that buildPayload defaults missing values to.
    delete (payload as { gallery_images?: string[] }).gallery_images;
  }

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Produsul nu a putut fi actualizat.' }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID produs lipsă.' }, { status: 400 });
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Produsul nu a putut fi șters.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
