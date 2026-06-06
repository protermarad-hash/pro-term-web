import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/lib/products';

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  btu: number | null;
  capacity_label: string | null;
  price: number;
  price_label: string | null;
  original_price: number | null;
  rating: number;
  reviews: number;
  is_new: boolean;
  is_bestseller: boolean;
  energy_class: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  smartbill_code: string | null;
  manage_stock: boolean;
  stock_status: string;
  stock_qty: number | null;
  image_url: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export function dbProductToProduct(p: DbProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand as Product['brand'],
    category: p.category as Product['category'],
    btu: p.btu ?? undefined,
    capacityLabel: p.capacity_label ?? undefined,
    price: Number(p.price ?? 0),
    priceLabel: p.price_label ?? undefined,
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    rating: Number(p.rating ?? 4.7),
    reviews: Number(p.reviews ?? 0),
    isNew: p.is_new,
    isBestseller: p.is_bestseller,
    energyClass: p.energy_class,
    description: p.description,
    features: Array.isArray(p.features) ? p.features : [],
    specs: Array.isArray(p.specs) ? p.specs : [],
    smartbillCode: p.smartbill_code ?? undefined,
    manageStock: p.manage_stock,
    stockStatus: p.stock_status as Product['stockStatus'],
    stockQty: p.stock_qty ?? undefined,
    imageUrl: p.image_url ?? undefined,
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}
