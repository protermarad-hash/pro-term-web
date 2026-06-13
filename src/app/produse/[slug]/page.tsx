import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabaseServiceClient, dbProductToProduct } from '@/lib/supabase';
import { CATEGORY_LABEL, type Product, type StockStatus } from '@/lib/products';
import ProductPageClient from './ProductPageClient';

export const dynamic = 'force-dynamic';

const PRODUCT_COLUMNS =
  'id, slug, name, brand, category, btu, capacity_label, price, price_label, original_price, rating, reviews, is_new, is_bestseller, energy_class, description, features, specs, smartbill_code, manage_stock, stock_status, stock_qty, image_url, gallery_images, active, created_at, updated_at';

const getProductData = cache(async (slug: string) => {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (!data) return null;

  const product = dbProductToProduct(data);

  const { data: relatedData } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('active', true)
    .eq('category', data.category)
    .neq('id', data.id)
    .limit(4);

  return {
    product,
    related: (relatedData ?? []).map(dbProductToProduct),
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
  if (stockStatus === 'out-of-stock') return 'https://schema.org/OutOfStock';
  if (stockStatus === 'low-stock') return 'https://schema.org/LimitedAvailability';
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

  const { product } = data;
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
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProductData(params.slug);

  if (!data) notFound();

  const { product, related } = data;
  const description = buildSeoDescription(product);
  const canonical = `https://pro-term.ro/produse/${params.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.imageUrl ? { image: product.imageUrl } : {}),
    description,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      ...(product.price > 0
        ? { price: product.price.toFixed(2), priceCurrency: 'RON' }
        : {}),
      availability: schemaAvailability(product.stockStatus),
      url: canonical,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} related={related} />
    </>
  );
}
