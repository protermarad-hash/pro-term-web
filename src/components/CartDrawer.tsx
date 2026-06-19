'use client';

import { X, Minus, Plus, Trash2, ShoppingCart, ArrowRight, Truck } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { BRAND_GRADIENT, CATEGORY_LABEL, isServiceProduct } from '@/lib/products';
import { calculateShipping, getShippingMessage, SHIPPING_FREE_THRESHOLD, SHIPPING_COST } from '@/lib/shipping';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, setQuantity, totalItems, totalPrice } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
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
            items.map(({ product, quantity }) => {
              const capacity = product.capacityLabel ?? (product.btu ? `${product.btu.toLocaleString('ro-RO')} BTU` : CATEGORY_LABEL[product.category]);
              const maxQty = !isServiceProduct(product) && product.manageStock && product.stockQty !== undefined
                ? product.stockQty
                : 99;
              const atMax = quantity >= maxQty;
              return (
                <div key={product.id} className="flex gap-3 p-3 bg-light-200 rounded-xl">
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${BRAND_GRADIENT[product.brand]} flex-shrink-0 flex items-center justify-center`}
                  >
                    <span className="text-white/80 text-xs font-bold">
                      {product.brand.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark text-sm leading-tight truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-dark-300 mt-0.5">
                      {capacity}
                    </p>
                    <p className="text-primary font-bold text-sm mt-1">
                      {(product.price * quantity).toLocaleString('ro-RO')} RON
                    </p>
                  </div>

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
                        disabled={atMax}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={atMax ? `Stoc maxim: ${maxQty} buc.` : undefined}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            {/* Shipping info banner */}
            {totalPrice < SHIPPING_FREE_THRESHOLD ? (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
                <Truck size={14} className="flex-shrink-0" />
                {getShippingMessage(totalPrice)}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-xs font-medium text-green-700">
                <Truck size={14} className="flex-shrink-0" />
                Transport gratuit inclus în comandă!
              </div>
            )}

            <div className="flex justify-between text-sm text-dark-300">
              <span>Subtotal produse</span>
              <span>{totalPrice.toLocaleString('ro-RO')} RON</span>
            </div>
            <div className="flex justify-between text-sm text-dark-300">
              <span>Transport</span>
              <span>
                {calculateShipping(totalPrice) === 0
                  ? <span className="font-semibold text-green-600">GRATUIT</span>
                  : <span>{SHIPPING_COST} RON</span>
                }
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="font-semibold text-dark">Total (TVA inclus)</span>
              <span className="text-xl font-bold font-heading text-dark">
                {(totalPrice + calculateShipping(totalPrice)).toLocaleString('ro-RO')} RON
              </span>
            </div>
            <p className="text-xs text-dark-300">
              Prețurile includ TVA 21%. Stocul se validează înainte de expediere.
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
