import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '@/lib/products';

// Browser singleton — ensures onAuthStateChange fires correctly across all callers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _anonClient: SupabaseClient<any> | null = null;

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
  gallery_images?: string[] | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseAnonClient() {
  // Server-side rendering: never create a browser client
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  // Return the existing singleton so all callers share the same session state
  // and onAuthStateChange fires correctly across the app
  if (!_anonClient) {
    // persistSession defaults to true — session stored in localStorage
    // required for router.push redirects to work correctly after login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _anonClient = createClient(url, anonKey) as SupabaseClient<any>;
  }

  return _anonClient;
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
  const galleryImages = Array.isArray(p.gallery_images) ? p.gallery_images.filter(Boolean) : [];
  const imageUrl = p.image_url ?? galleryImages[0] ?? undefined;

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
    imageUrl,
    galleryImages,
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
