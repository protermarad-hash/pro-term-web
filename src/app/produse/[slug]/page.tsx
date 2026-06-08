import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductPageClient from './ProductPageClient';
import { getProductBySlug, products } from '@/lib/products';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  const title = `${product.name} ${product.btu.toLocaleString('ro-RO')} BTU — ${product.brand}`;
  const description = `Cumpără ${product.name} (${product.btu.toLocaleString('ro-RO')} BTU, clasa ${product.energyClass}) de la PRO TERM SRL Arad. Preț: ${product.price.toLocaleString('ro-RO')} RON. Garanție 2 ani, instalare profesională.`;
  const url = `https://pro-term.ro/produse/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center">
            <p className="text-2xl font-bold text-dark font-heading mb-4">
              Produs negăsit
            </p>
            <Link href="/produse" className="btn-primary">
              Înapoi la produse
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    sku: product.id,
    mpn: product.slug,
    offers: {
      '@type': 'Offer',
      url: `https://pro-term.ro/produse/${product.slug}`,
      priceCurrency: 'RON',
      price: product.price,
      priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'PRO TERM SRL',
        url: 'https://pro-term.ro',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
