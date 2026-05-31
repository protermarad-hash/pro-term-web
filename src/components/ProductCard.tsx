'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { type Product, BRAND_GRADIENT, CATEGORY_LABEL, STOCK_LABEL } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const hasPrice = product.price > 0;
  const capacity = product.capacityLabel ?? (product.btu ? `${product.btu.toLocaleString('ro-RO')} BTU` : CATEGORY_LABEL[product.category]);
  const stockLabel = product.stockStatus ? STOCK_LABEL[product.stockStatus] : 'La cerere';

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/produse/${product.slug}`} className="block">
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 flex items-center justify-center">
          <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${BRAND_GRADIENT[product.brand]}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(11,42,74,0.10),transparent_40%)]" />
          <div className="relative z-10 text-center px-4">
            <span className="block text-xs font-bold uppercase tracking-[0.24em] text-dark-300 mb-2">
              {product.brand}
            </span>
            <span className="block text-3xl font-bold font-heading text-primary">
              {capacity}
            </span>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-brand text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
                Nou
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-accent text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.energyClass}
          </span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {product.brand}
          </span>
          <span className="text-xs font-medium text-dark-300 bg-slate-100 px-2.5 py-1 rounded-full">
            {CATEGORY_LABEL[product.category]}
          </span>
        </div>

        <Link href={`/produse/${product.slug}`}>
          <h3 className="font-bold text-dark font-heading text-base leading-snug hover:text-accent transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="text-xs font-medium text-dark-300 mb-3">
          Disponibilitate: {stockLabel}
        </div>

        <div className="flex items-center gap-1 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={
                  star <= Math.round(product.rating)
                    ? 'text-accent fill-accent'
                    : 'text-slate-200 fill-slate-200'
                }
              />
            ))}
          </div>
          <span className="text-xs text-dark-300">({product.reviews})</span>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-dark font-heading">
              {hasPrice ? `${product.price.toLocaleString('ro-RO')} RON` : product.priceLabel ?? 'Cere ofertă'}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-dark-300 line-through">
                {product.originalPrice.toLocaleString('ro-RO')} RON
              </span>
            )}
          </div>

          {hasPrice ? (
            <button
              onClick={() => addToCart(product)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold py-3 rounded-xl hover:bg-primary-600 transition-colors active:scale-95"
            >
              <ShoppingCart size={16} />
              Adaugă în coș
            </button>
          ) : (
            <Link
              href="/#contact"
              className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold py-3 rounded-xl hover:bg-primary-600 transition-colors"
            >
              Cere ofertă
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
