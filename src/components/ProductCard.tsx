'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useFavorites } from '@/lib/favorites-context';
import { type Product, BRAND_GRADIENT, CATEGORY_LABEL, STOCK_LABEL } from '@/lib/products';

function getDiscountPercent(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price || product.price <= 0) return null;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const hasPrice = product.price > 0;
  const capacity = product.capacityLabel ?? (product.btu ? `${product.btu.toLocaleString('ro-RO')} BTU` : CATEGORY_LABEL[product.category]);
  const stockLabel = product.stockStatus ? STOCK_LABEL[product.stockStatus] : 'La cerere';
  const discountPercent = getDiscountPercent(product);
  const hasImage = Boolean(product.imageUrl);
  const favActive = isFavorite(product.slug);

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/produse/${product.slug}`} className="block">
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className={`absolute inset-x-0 top-0 z-20 h-1.5 bg-gradient-to-r ${BRAND_GRADIENT[product.brand]}`} />

          {hasImage ? (
            <Image
              src={product.imageUrl!}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(11,42,74,0.10),transparent_40%)]" />
              <div className="relative z-10 px-4 text-center">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-dark-300">
                  {product.brand}
                </span>
                <span className="block font-heading text-2xl font-bold text-primary">
                  {CATEGORY_LABEL[product.category]}
                </span>
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 z-30 flex flex-col gap-1.5">
            {discountPercent && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold uppercase text-white shadow-sm">
                -{discountPercent}% reducere
              </span>
            )}
            {product.isNew && (
              <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                Nou
              </span>
            )}
            {product.isBestseller && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
            className="absolute right-3 bottom-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110"
            aria-label={favActive ? 'Elimină din favorite' : 'Adaugă la favorite'}
          >
            <Heart
              size={15}
              className={favActive ? 'fill-red-500 text-red-500' : 'text-dark-300'}
            />
          </button>

          <span className="absolute right-3 top-3 z-30 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {product.energyClass}
          </span>

          <span className="absolute bottom-3 left-3 z-30 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm ring-1 ring-slate-100 backdrop-blur">
            {capacity}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            {product.brand}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-dark-300">
            {CATEGORY_LABEL[product.category]}
          </span>
        </div>

        <Link href={`/produse/${product.slug}`}>
          <h3 className="mb-2 font-heading text-base font-bold leading-snug text-dark transition-colors hover:text-accent">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3 text-xs font-medium text-dark-300">
          Disponibilitate: {stockLabel}
        </div>

        <div className="mb-4 flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={
                  star <= Math.round(product.rating)
                    ? 'fill-accent text-accent'
                    : 'fill-slate-200 text-slate-200'
                }
              />
            ))}
          </div>
          <span className="text-xs text-dark-300">({product.reviews})</span>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-4">
          {discountPercent && (
            <div className="mb-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-extrabold text-red-700">
              Economisești {(product.originalPrice! - product.price).toLocaleString('ro-RO')} RON
            </div>
          )}
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-dark">
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600 active:scale-95"
            >
              <ShoppingCart size={16} />
              Adaugă în coș
            </button>
          ) : (
            <Link
              href="/#contact"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-600"
            >
              Cere ofertă
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
