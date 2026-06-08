'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import { getSupabaseAnonClient } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export type FavoriteItem = {
  slug: string;
  name: string;
  price: number;
  priceLabel?: string;
  imageUrl?: string;
};

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  removeFavorite: (slug: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = 'proterm_favorites_v2';

function toItem(product: Product): FavoriteItem {
  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    priceLabel: product.priceLabel,
    imageUrl: product.imageUrl,
  };
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      setReady(false);

      if (!user) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setFavorites(parsed);
            else setFavorites([]);
          } else {
            setFavorites([]);
          }
        } catch {
          setFavorites([]);
        }
        setReady(true);
        return;
      }

      const supabase = getSupabaseAnonClient();
      if (!supabase) {
        setReady(true);
        return;
      }

      // Sync localStorage → Supabase on first login
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const local: FavoriteItem[] = JSON.parse(raw);
          if (local.length > 0) {
            await supabase.from('favorites').upsert(
              local.map((f) => ({
                user_id: user.id,
                product_id: f.slug,
                product_name: f.name,
                product_price: f.price,
                product_image: f.imageUrl ?? null,
              })),
              { onConflict: 'user_id,product_id', ignoreDuplicates: true },
            );
          }
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // ignore sync errors
      }

      // Load from Supabase
      const { data } = await supabase
        .from('favorites')
        .select('product_id, product_name, product_price, product_image')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setFavorites(
        (data ?? []).map((row) => ({
          slug: row.product_id as string,
          name: (row.product_name as string) ?? '',
          price: Number(row.product_price ?? 0),
          imageUrl: (row.product_image as string) ?? undefined,
        })),
      );
      setReady(true);
    }

    load();
  }, [user]);

  // Persist to localStorage when not logged in
  useEffect(() => {
    if (!user && ready) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch {}
    }
  }, [favorites, user, ready]);

  const value = useMemo<FavoritesContextValue>(() => {
    const slugSet = new Set(favorites.map((f) => f.slug));

    return {
      favorites,
      isFavorite: (slug) => slugSet.has(slug),

      toggleFavorite: async (product) => {
        const slug = product.slug;
        if (slugSet.has(slug)) {
          setFavorites((curr) => curr.filter((f) => f.slug !== slug));
          if (user) {
            const supabase = getSupabaseAnonClient();
            await supabase
              ?.from('favorites')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', slug);
          }
        } else {
          setFavorites((curr) => [toItem(product), ...curr]);
          if (user) {
            const supabase = getSupabaseAnonClient();
            await supabase?.from('favorites').insert({
              user_id: user.id,
              product_id: slug,
              product_name: product.name,
              product_price: product.price,
              product_image: product.imageUrl ?? null,
            });
          }
        }
      },

      removeFavorite: async (slug) => {
        setFavorites((curr) => curr.filter((f) => f.slug !== slug));
        if (user) {
          const supabase = getSupabaseAnonClient();
          await supabase
            ?.from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', slug);
        }
      },
    };
  }, [favorites, user]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites trebuie folosit în interiorul FavoritesProvider');
  return ctx;
}
