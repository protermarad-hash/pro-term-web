'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Star, CheckCircle2, ArrowLeft, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/lib/cart-context';
import { getProductBySlug, getRelatedProducts, BRAND_GRADIENT, CATEGORY_LABEL } from '@/lib/products';

export default function ProductPage() {
  const { slug }  = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const product = getProductBySlug(slug);

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

  const related = getRelatedProducts(product);

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 bg-light-200">
        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-dark-300 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Acasă</Link>
            <span>/</span>
            <Link href="/produse" className="hover:text-primary transition-colors">Produse</Link>
            <span>/</span>
            <span className="text-dark font-medium truncate">{product.name}</span>
          </div>

          {/* Main product section */}
          <div className="grid lg:grid-cols-2 gap-10 mb-14">

            {/* Image */}
            <div>
              <div
                className={`aspect-square rounded-3xl bg-gradient-to-br ${BRAND_GRADIENT[product.brand]} flex flex-col items-center justify-center relative overflow-hidden`}
              >
                <span className="text-white/10 font-bold text-9xl font-heading select-none absolute">
                  {product.brand}
                </span>

                <div className="relative z-10 text-center text-white">
                  <div className="text-6xl font-bold font-heading opacity-60 mb-2">
                    {product.btu.toLocaleString('ro-RO')}
                  </div>
                  <div className="text-white/80 text-xl">BTU</div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-brand text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                      Nou
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-accent text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                      Bestseller
                    </span>
                  )}
                </div>

                <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white font-bold px-3 py-1 rounded-lg">
                  {product.energyClass}
                </span>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <span className="text-sm text-dark-300">
                  {CATEGORY_LABEL[product.category]}
                </span>
              </div>

              <h1 className="text-3xl font-bold font-heading text-dark mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(product.rating)
                          ? 'text-accent fill-accent'
                          : 'text-gray-300 fill-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-dark">{product.rating}</span>
                <span className="text-sm text-dark-300">({product.reviews} recenzii)</span>
              </div>

              {/* Description */}
              <p className="text-dark-300 leading-relaxed mb-6">{product.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-dark-300">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Price + CTA */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold font-heading text-dark">
                    {product.price.toLocaleString('ro-RO')} RON
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-dark-300 line-through">
                      {product.originalPrice.toLocaleString('ro-RO')} RON
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 btn-primary justify-center py-4"
                  >
                    <ShoppingCart size={20} />
                    Adaugă în coș
                  </button>
                  <Link
                    href="/#contact"
                    className="flex items-center gap-2 px-5 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    <Zap size={18} />
                    Ofertă
                  </Link>
                </div>

                <p className="text-xs text-dark-300 mt-3 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-green-500" />
                  Stoc disponibil · Livrare 24–48h · Garanție 2 ani
                </p>
              </div>
            </div>
          </div>

          {/* Specs table */}
          <div className="card mb-14">
            <h2 className="text-xl font-bold font-heading text-dark mb-5">
              Specificații tehnice
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={i % 2 === 0 ? 'bg-light-200' : 'bg-white'}
                    >
                      <td className="py-3 px-4 text-dark-300 font-medium w-1/2 rounded-l-lg">
                        {spec.label}
                      </td>
                      <td className="py-3 px-4 text-dark font-semibold rounded-r-lg">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold font-heading text-dark mb-6">
                Produse similare
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
