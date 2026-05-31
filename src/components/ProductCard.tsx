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
    <div className="card group flex flex-col">
      <Link href={`/produse/${product.slug}`} className="block">
        <div
          className={`relative aspect-[4/3] rounded-xl mb-4 bg-gradient-to-br ${BRAND_GRADIENT[product.brand]} flex items-center justify-center overflow-hidden`}
        >
          <span className="text-white/20 font-bold text-4xl font-heading select-none text-center px-4">
            {product.brand}
          </span>

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-brand text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                Nou
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-accent text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                Bestseller
              </span>
            )}
          </div>

          <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded">
            {product.energyClass}
          </span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {product.brand}
          </span>
          <span className="text-xs text-dark-300">
            {capacity}
          </span>
        </div>

        <Link href={`/produse/${product.slug}`}>
          <h3 className="font-bold text-dark font-heading text-sm leading-snug hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="text-xs text-dark-300 mb-2">
          {CATEGORY_LABEL[product.category]} · {stockLabel}
        </div>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={
                  star <= Math.round(product.rating)
                    ? 'text-accent fill-accent'
                    : 'text-gray-300 fill-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-dark-300">({product.reviews})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-dark font-heading">
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
              className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-600 transition-colors active:scale-95"
            >
              <ShoppingCart size={16} />
              Adaugă în coș
            </button>
          ) : (
            <Link
              href="/#contact"
              className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Cere ofertă
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
