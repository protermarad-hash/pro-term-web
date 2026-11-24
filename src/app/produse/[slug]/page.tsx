import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dbProductToProduct } from '@/lib/supabase';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';
import { CATEGORY_LABEL, getProductAvailability, type Product, type StockStatus } from '@/lib/products';
import { EMPTY_GUARANTEE_INFO } from '@/lib/consumer-guarantee';
import { fetchProductGuaranteeInfo } from '@/lib/consumer-guarantee-server';
import { fetchCommercialDetails } from '@/lib/product-commercial-server';
import { EMPTY_COMMERCIAL_DETAILS, isDraftPreviewEnabled } from '@/lib/product-commercial';
import ProductPageClient from './ProductPageClient';

export const dynamic = 'force-dynamic';

const PRODUCT_COLUMNS =
  'id, slug, name, brand, category, btu, capacity_label, price, price_label, original_price, rating, reviews, is_new, is_bestseller, energy_class, description, features, specs, smartbill_code, manage_stock, stock_status, stock_qty, image_url, gallery_images, active, created_at, updated_at';

const getProductData = cache(async (slug: string) => {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  // Inactive products are drafts: visible only in development / Vercel Preview
  // (fail-closed in production), always noindex and flagged with a banner.
  let productQuery = supabase.from('products').select(PRODUCT_COLUMNS).eq('slug', slug);
  if (!isDraftPreviewEnabled()) productQuery = productQuery.eq('active', true);
  const { data } = await productQuery.maybeSingle();

  if (!data) return null;

  const { data: relatedData } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('active', true)
    .eq('category', data.category)
    .neq('id', data.id)
    .limit(4);

  const relatedRows = relatedData ?? [];
  const [guarantees, commercialDetails] = await Promise.all([
    fetchProductGuaranteeInfo(supabase, [data.id]),
    fetchCommercialDetails(supabase, [data.id, ...relatedRows.map((row) => row.id)]),
  ]);

  // quote_only is read by the tolerant commercial query, so related cards and
  // the cart also know which products must never be added to the cart.
  const withQuoteFlag = (row: typeof data) => {
    const mapped = dbProductToProduct(row);
    return commercialDetails.get(row.id)?.quoteOnly ? { ...mapped, quoteOnly: true } : mapped;
  };

  return {
    product: withQuoteFlag(data),
    isDraft: data.active !== true,
    commercial: commercialDetails.get(data.id) ?? EMPTY_COMMERCIAL_DETAILS,
    guarantee: guarantees.get(data.id) ?? EMPTY_GUARANTEE_INFO,
    related: relatedRows.map(withQuoteFlag),
  };
});

function buildSeoDescription(product: Product): string {
  const cleaned = product.description
    .replace(/\s*Preț calculat[^.]*\./gi, '')
    .replace(/\s*Pret calculat[^.]*\./gi, '')
    .replace(/\s*Lista furnizorului este fără TVA\.?/gi, '')
    .trim();

  if (cleaned.length >= 80) {
    return cleaned.length > 155 ? cleaned.slice(0, 152) + '...' : cleaned;
  }

  const parts: string[] = [`${product.brand} ${CATEGORY_LABEL[product.category]}`];
  if (product.btu) parts.push(`${product.btu.toLocaleString('ro-RO')} BTU`);
  if (product.energyClass) parts.push(`Clasa ${product.energyClass}`);
  parts.push('Dealer autorizat PRO TERM — montaj și service în Arad și Timiș.');
  return parts.join(', ');
}

function schemaAvailability(stockStatus: StockStatus | undefined): string {
  if (stockStatus === 'out_of_stock') return 'https://schema.org/OutOfStock';
  if (stockStatus === 'low_stock') return 'https://schema.org/LimitedAvailability';
  return 'https://schema.org/InStock';
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProductData(params.slug);

  if (!data) {
    return {
      title: 'Produs negăsit',
      description: 'Produsul căutat nu a putut fi găsit în catalogul PRO TERM.',
    };
  }

  const { product, isDraft } = data;
  const description = buildSeoDescription(product);
  const canonical = `https://pro-term.ro/produse/${params.slug}`;
  const ogImage = product.imageUrl ?? product.galleryImages?.[0];

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${product.name} | PRO TERM`,
      description,
      url: canonical,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage, width: 800, height: 800, alt: product.name }] } : {}),
    },
    ...(isDraft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProductData(params.slug);

  if (!data) notFound();

  const { product, guarantee, related, commercial, isDraft } = data;
  const description = buildSeoDescription(product);
  const canonical = `https://pro-term.ro/produse/${params.slug}`;
  const availability = getProductAvailability(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.imageUrl ? { image: product.imageUrl } : {}),
    description,
    brand: { '@type': 'Brand', name: product.brand },
    ...(commercial.manufacturerCode ? { mpn: commercial.manufacturerCode } : {}),
    offers: {
      '@type': 'Offer',
      ...(product.price > 0
        ? { price: product.price.toFixed(2), priceCurrency: 'RON' }
        : {}),
      availability: schemaAvailability(availability.normalizedStatus),
      url: canonical,
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://pro-term.ro' },
      { '@type': 'ListItem', position: 2, name: 'Produse', item: 'https://pro-term.ro/produse' },
      { '@type': 'ListItem', position: 3, name: product.name, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ProductPageClient product={product} guarantee={guarantee} related={related} commercial={commercial} isDraft={isDraft} />
    </>
  );
}
