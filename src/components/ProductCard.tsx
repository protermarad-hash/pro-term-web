'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { type Product, BRAND_GRADIENT } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="card group flex flex-col">
      {/* Image placeholder */}
      <Link href={`/produse/${product.slug}`} className="block">
        <div
          className={`relative aspect-[4/3] rounded-xl mb-4 bg-gradient-to-br ${BRAND_GRADIENT[product.brand]} flex items-center justify-center overflow-hidden`}
        >
          {/* Brand name watermark */}
          <span className="text-white/20 font-bold text-5xl font-heading select-none">
            {product.brand}
          </span>

          {/* Badges */}
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

          {/* Energy class */}
          <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded">
            {product.energyClass}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {product.brand}
          </span>
          <span className="text-xs text-dark-300">
            {product.btu.toLocaleString('ro-RO')} BTU
          </span>
        </div>

        <Link href={`/produse/${product.slug}`}>
          <h3 className="font-bold text-dark font-heading text-sm leading-snug hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
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

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-dark font-heading">
              {product.price.toLocaleString('ro-RO')} RON
            </span>
            {product.originalPrice && (
              <span className="text-sm text-dark-300 line-through">
                {product.originalPrice.toLocaleString('ro-RO')} RON
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-600 transition-colors active:scale-95"
          >
            <ShoppingCart size={16} />
            Adaugă în coș
          </button>
        </div>
      </div>
    </div>
  );
}
