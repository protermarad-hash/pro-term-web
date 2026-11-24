import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { PRODUCT_COMMERCIAL_COLUMNS, parseCommercialDetails, type DbProductCommercialRow } from '@/lib/product-commercial';
import { EMPTY_PRICE_REVIEW, getPublishBlockers, parseCommercialUpdate, type PriceReview } from '@/lib/product-price-review';

export const dynamic = 'force-dynamic';

const MIGRATION_MISSING =
  'Câmpurile comerciale nu există încă în baza de date. Aplică migrația 20261123120000_product_commercial_details.sql.';

function isMissingSchemaError(error: { code?: string } | null) {
  // 42703 / PGRST204: unknown column; 42P01 / PGRST205: unknown table.
  return ['42703', 'PGRST204', '42P01', 'PGRST205'].includes(error?.code ?? '');
}

interface ReviewRow {
  product_id: string;
  price_verified_at: string | null;
  approval_source: string | null;
  needs_reverification: boolean;
}

function toReview(row: ReviewRow | undefined): PriceReview {
  if (!row) return EMPTY_PRICE_REVIEW;
  return {
    priceVerifiedAt: row.price_verified_at,
    approvalSource: row.approval_source,
    needsReverification: row.needs_reverification,
  };
}

/** Admin-only: products of a brand with public commercial fields + internal review data. */
export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const brand = new URL(request.url).searchParams.get('brand') || 'Vaillant';

  const { data, error } = await supabase
    .from('products')
    .select(`id, slug, name, brand, category, price, stock_status, active, ${PRODUCT_COMMERCIAL_COLUMNS}`)
    .eq('brand', brand)
    .order('name', { ascending: true });

  if (error) {
    if (isMissingSchemaError(error)) return NextResponse.json({ error: MIGRATION_MISSING }, { status: 409 });
    return NextResponse.json({ error: 'Nu am putut încărca produsele.' }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as (DbProductCommercialRow & {
    id: string; slug: string; name: string; brand: string; category: string; price: number; stock_status: string; active: boolean;
  })[];

  const { data: reviewData, error: reviewError } = await supabase
    .from('product_price_reviews')
    .select('product_id, price_verified_at, approval_source, needs_reverification')
    .in('product_id', rows.map((row) => row.id));

  if (reviewError) {
    if (isMissingSchemaError(reviewError)) return NextResponse.json({ error: MIGRATION_MISSING }, { status: 409 });
    return NextResponse.json({ error: 'Nu am putut încărca datele de verificare.' }, { status: 500 });
  }

  const reviews = new Map(((reviewData ?? []) as ReviewRow[]).map((row) => [row.product_id, row]));

  return NextResponse.json({
    products: rows.map((row) => {
      const commercial = parseCommercialDetails(row);
      const review = toReview(reviews.get(row.id));
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        category: row.category,
        price: Number(row.price ?? 0),
        stockStatus: row.stock_status,
        active: row.active,
        ...commercial,
        review,
        publishBlockers: getPublishBlockers({ ...commercial, price: Number(row.price ?? 0), review }),
      };
    }),
  });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  }

  const parsed = parseCommercialUpdate(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { update } = parsed;

  if (update.active) {
    const blockers = getPublishBlockers(update);
    if (blockers.length > 0) {
      return NextResponse.json({ error: `Produsul nu poate fi publicat: ${blockers.join(' ')}`, blockers }, { status: 422 });
    }
  }

  // Review metadata first: if it cannot be stored, the public data is not changed either.
  const { error: reviewError } = await supabase.from('product_price_reviews').upsert({
    product_id: update.id,
    price_verified_at: update.review.priceVerifiedAt,
    approval_source: update.review.approvalSource,
    needs_reverification: update.review.needsReverification,
    updated_at: new Date().toISOString(),
  });

  if (reviewError) {
    if (isMissingSchemaError(reviewError)) return NextResponse.json({ error: MIGRATION_MISSING }, { status: 409 });
    return NextResponse.json({ error: 'Datele de verificare nu au putut fi salvate.' }, { status: 500 });
  }

  const { error } = await supabase
    .from('products')
    .update({
      price: update.price,
      stock_status: update.stockStatus,
      manufacturer_code: update.manufacturerCode,
      power_supply: update.powerSupply,
      included_components: update.includedComponents,
      excluded_components: update.excludedComponents,
      documents: update.documents,
      quote_only: update.quoteOnly,
      active: update.active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', update.id);

  if (error) {
    if (isMissingSchemaError(error)) return NextResponse.json({ error: MIGRATION_MISSING }, { status: 409 });
    if (error.code === '23505') return NextResponse.json({ error: 'Codul SKU este deja folosit de alt produs al aceluiași brand.' }, { status: 409 });
    return NextResponse.json({ error: 'Produsul nu a putut fi actualizat.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
