'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from './products';
import { isServiceProduct } from './products';
import { isMontajSlug } from './montaj';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  upsellForProduct: Product | null;
  lastError: string | null;
}

type CartAction =
  | { type: 'ADD'; product: Product; quantity?: number }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'DISMISS_UPSELL' }
  | { type: 'CLEAR_ERROR' };

function stockLimit(product: Product): number | null {
  if (isServiceProduct(product)) return null;
  if (product.manageStock && product.stockQty !== undefined) return product.stockQty;
  return null;
}

function pluralBuc(n: number): string {
  return n === 1 ? 'bucată' : 'bucăți';
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const addQty = action.quantity ?? 1;
      const existing = state.items.find((i) => i.product.id === action.product.id);
      const currentQty = existing?.quantity ?? 0;

      const limit = stockLimit(action.product);
      if (limit !== null) {
        if (limit <= 0) {
          return { ...state, lastError: 'Produsul este indisponibil momentan.' };
        }
        if (currentQty + addQty > limit) {
          const remaining = limit - currentQty;
          if (remaining <= 0) {
            return { ...state, lastError: `Stoc disponibil: doar ${limit} ${pluralBuc(limit)}.` };
          }
          return { ...state, lastError: `Poți adăuga maxim ${remaining} ${pluralBuc(remaining)} în plus (stoc total: ${limit}).` };
        }
      }

      const items = existing
        ? state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + addQty }
              : i
          )
        : [...state.items, { product: action.product, quantity: addQty }];

      const isNewItem = !existing;
      const hasMontaj = items.some((i) => isMontajSlug(i.product.slug));
      const shouldShowUpsell =
        isNewItem &&
        ['aer-conditionat', 'aer conditionat'].includes(
          action.product.category?.toLowerCase().trim() ?? ''
        ) &&
        !hasMontaj;

      return {
        items,
        isOpen: !shouldShowUpsell,
        upsellForProduct: shouldShowUpsell ? action.product : state.upsellForProduct,
        lastError: null,
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.id) };
    case 'SET_QTY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.id) };
      }
      const item = state.items.find((i) => i.product.id === action.id);
      if (item) {
        const limit = stockLimit(item.product);
        if (limit !== null && action.quantity > limit) {
          return { ...state, lastError: `Stoc disponibil: doar ${limit} ${pluralBuc(limit)}.` };
        }
      }
      return {
        ...state,
        lastError: null,
        items: state.items.map((i) =>
          i.product.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'CLEAR':
      return { ...state, items: [], isOpen: false, upsellForProduct: null };
    case 'HYDRATE':
      return { ...state, items: action.items };
    case 'DISMISS_UPSELL':
      return { ...state, upsellForProduct: null, isOpen: true };
    case 'CLEAR_ERROR':
      return { ...state, lastError: null };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  upsellForProduct: Product | null;
  lastError: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  dismissUpsell: () => void;
  clearError: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    upsellForProduct: null,
    lastError: null,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('proterm_cart');
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('proterm_cart', JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        upsellForProduct: state.upsellForProduct,
        lastError: state.lastError,
        addToCart:      (product, quantity)  => dispatch({ type: 'ADD', product, quantity }),
        removeFromCart: (id)                 => dispatch({ type: 'REMOVE', id }),
        setQuantity:    (id, quantity)       => dispatch({ type: 'SET_QTY', id, quantity }),
        clearCart:      ()                   => dispatch({ type: 'CLEAR' }),
        openCart:       ()                   => dispatch({ type: 'OPEN' }),
        closeCart:      ()                   => dispatch({ type: 'CLOSE' }),
        dismissUpsell:  ()                   => dispatch({ type: 'DISMISS_UPSELL' }),
        clearError:     ()                   => dispatch({ type: 'CLEAR_ERROR' }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart trebuie folosit în interiorul CartProvider');
  return ctx;
}
