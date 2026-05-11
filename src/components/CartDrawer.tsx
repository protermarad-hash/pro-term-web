'use client';

import { X, Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { BRAND_GRADIENT } from '@/lib/products';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, setQuantity, totalItems, totalPrice } =
    useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            <span className="font-bold font-heading text-dark">
              Coș de cumpărături
            </span>
            {totalItems > 0 && (
              <span className="bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Închide coș"
          >
            <X size={20} className="text-dark-300" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart size={48} className="text-gray-200 mb-4" />
              <p className="text-dark-300 font-medium">Coșul tău este gol</p>
              <p className="text-sm text-dark-300 mt-1">
                Adaugă produse din catalog
              </p>
              <Link
                href="/produse"
                onClick={closeCart}
                className="btn-primary mt-6 text-sm"
              >
                Vezi produse
              </Link>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 p-3 bg-light-200 rounded-xl">
                {/* Image placeholder */}
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-br ${BRAND_GRADIENT[product.brand]} flex-shrink-0 flex items-center justify-center`}
                >
                  <span className="text-white/80 text-xs font-bold">
                    {product.brand.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-sm leading-tight truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-dark-300 mt-0.5">
                    {product.btu.toLocaleString('ro-RO')} BTU
                  </p>
                  <p className="text-primary font-bold text-sm mt-1">
                    {(product.price * quantity).toLocaleString('ro-RO')} RON
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1 text-gray-400 hover:text-brand transition-colors"
                    aria-label="Șterge"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-primary transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Total</span>
              <span className="text-xl font-bold font-heading text-dark">
                {totalPrice.toLocaleString('ro-RO')} RON
              </span>
            </div>
            <p className="text-xs text-dark-300">
              * Prețul include TVA. Transport calculat la finalizare.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center"
            >
              Finalizează comanda
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-sm text-dark-300 hover:text-dark text-center py-1 transition-colors"
            >
              Continuă cumpărăturile
            </button>
          </div>
        )}
      </div>
    </>
  );
}
