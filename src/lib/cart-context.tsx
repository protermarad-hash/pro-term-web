'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      const items = existing
        ? state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product: action.product, quantity: 1 }];
      return { items, isOpen: true };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.id) };
    case 'SET_QTY':
      return {
        ...state,
        items:
          action.quantity <= 0
            ? state.items.filter((i) => i.product.id !== action.id)
            : state.items.map((i) =>
                i.product.id === action.id ? { ...i, quantity: action.quantity } : i
              ),
      };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'CLEAR':
      return { ...state, items: [], isOpen: false };
    case 'HYDRATE':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

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
        addToCart:      (product)           => dispatch({ type: 'ADD', product }),
        removeFromCart: (id)                => dispatch({ type: 'REMOVE', id }),
        setQuantity:    (id, quantity)      => dispatch({ type: 'SET_QTY', id, quantity }),
        clearCart:      ()                  => dispatch({ type: 'CLEAR' }),
        openCart:       ()                  => dispatch({ type: 'OPEN' }),
        closeCart:      ()                  => dispatch({ type: 'CLOSE' }),
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
