'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/products';

type FavoriteSnapshot = Pick<Product, 'id' | 'slug' | 'name' | 'brand' | 'category' | 'price' | 'priceLabel' | 'imageUrl' | 'capacityLabel'>;

type FavoritesContextValue = {
  favorites: FavoriteSnapshot[];
  favoriteIds: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = 'proterm_favorites_v1';

function toSnapshot(product: Product): FavoriteSnapshot {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    priceLabel: product.priceLabel,
    imageUrl: product.imageUrl,
    capacityLabel: product.capacityLabel,
  };
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteSnapshot[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // localStorage may be unavailable in private mode
    }
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(() => {
    const favoriteIds = favorites.map((item) => item.id);

    return {
      favorites,
      favoriteIds,
      isFavorite: (productId: string) => favoriteIds.includes(productId),
      toggleFavorite: (product: Product) => {
        setFavorites((current) => {
          if (current.some((item) => item.id === product.id)) {
            return current.filter((item) => item.id !== product.id);
          }
          return [toSnapshot(product), ...current];
        });
      },
      removeFavorite: (productId: string) => {
        setFavorites((current) => current.filter((item) => item.id !== productId));
      },
    };
  }, [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider');
  return context;
}
