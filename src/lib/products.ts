export type Brand =
  | 'Midea'
  | 'Gree'
  | 'Yamato'
  | 'Fujitsu'
  | 'Yukon'
  | 'Habitat'
  | 'Bosch'
  | 'Vaillant'
  | 'Immergas'
  | 'Viessmann'
  | 'Generic'
  | 'PRO TERM';

export type Category =
  | 'aer-conditionat'
  | 'centrale-termice'
  | 'pompe-caldura'
  | 'accesorii-montaj-ac'
  | 'teava-fitinguri'
  | 'condens-drenaj'
  | 'termostate-automatizari'
  | 'service-montaj';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'on-request';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  category: Category;
  btu?: number;
  capacityLabel?: string;
  price: number;
  priceLabel?: string;
  originalPrice?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  energyClass: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  smartbillCode?: string;
  manageStock?: boolean;
  stockStatus?: StockStatus;
  stockQty?: number;
  imageUrl?: string;
}

export const BRAND_GRADIENT: Record<Brand, string> = {
  Midea: 'from-red-600 to-rose-500',
  Gree: 'from-emerald-600 to-green-500',
  Yamato: 'from-orange-600 to-amber-500',
  Fujitsu: 'from-slate-700 to-slate-500',
  Yukon: 'from-sky-700 to-cyan-500',
  Habitat: 'from-lime-700 to-green-500',
  Bosch: 'from-red-700 to-neutral-700',
  Vaillant: 'from-green-700 to-emerald-500',
  Immergas: 'from-rose-700 to-red-500',
  Viessmann: 'from-neutral-800 to-red-600',
  Generic: 'from-gray-600 to-gray-400',
  'PRO TERM': 'from-primary to-accent',
};

export const CATEGORY_LABEL: Record<Category, string> = {
  'aer-conditionat': 'Aer condiționat',
  'centrale-termice': 'Centrale termice',
  'pompe-caldura': 'Pompe de căldură',
  'accesorii-montaj-ac': 'Accesorii montaj AC',
  'teava-fitinguri': 'Țeavă și fitinguri',
  'condens-drenaj': 'Condens și drenaj',
  'termostate-automatizari': 'Termostate & automatizări',
  'service-montaj': 'Service & montaj',
};

export const STOCK_LABEL: Record<StockStatus, string> = {
  'in-stock': 'În stoc',
  'low-stock': 'Stoc limitat',
  'out-of-stock': 'Indisponibil',
  'on-request': 'La cerere',
};

export const products: Product[] = [];
