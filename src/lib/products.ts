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
  | 'service-montaj'
  | 'multisplit'
  | 'multisplit-pachet';

export type StockStatus = 'in_stock' | 'la_comanda' | 'out_of_stock' | 'low_stock';

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
  galleryImages?: string[];
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
  multisplit: 'Sistem multisplit',
  'multisplit-pachet': 'Pachet multisplit',
};

export function normalizeStockStatus(status?: string | null): StockStatus {
  switch (status) {
    case 'in-stock':
    case 'in_stock':
      return 'in_stock';
    case 'low-stock':
    case 'low_stock':
      return 'low_stock';
    case 'out-of-stock':
    case 'out_of_stock':
      return 'out_of_stock';
    case 'on-request':
    case 'la_comanda':
      return 'la_comanda';
    default:
      return 'la_comanda';
  }
}

export function isServiceProduct(product: Pick<Product, 'brand' | 'name' | 'category'>): boolean {
  if (product.brand === 'PRO TERM') return true;
  return product.name.toLowerCase().includes('montaj') || product.category === 'service-montaj';
}

export interface ProductAvailability {
  title: string;
  detail?: string;
  normalizedStatus: StockStatus;
  isService: boolean;
}

export function getProductAvailability(product: Pick<Product, 'brand' | 'name' | 'category' | 'stockStatus' | 'stockQty'>): ProductAvailability {
  if (isServiceProduct(product)) {
    return {
      title: 'Serviciu disponibil cu programare',
      normalizedStatus: 'in_stock',
      isService: true,
    };
  }

  const normalizedStatus = normalizeStockStatus(product.stockStatus);

  switch (normalizedStatus) {
    case 'in_stock':
      return {
        title: 'Disponibilitate: În stoc',
        detail: product.stockQty && product.stockQty > 0 ? `În stoc: ${product.stockQty} buc.` : undefined,
        normalizedStatus,
        isService: false,
      };
    case 'low_stock':
      return {
        title: 'Disponibilitate: În stoc',
        detail: product.stockQty && product.stockQty > 0 ? `În stoc: ${product.stockQty} buc.` : 'Stoc limitat.',
        normalizedStatus,
        isService: false,
      };
    case 'out_of_stock':
      return {
        title: 'Disponibilitate: Stoc epuizat',
        detail: 'Contactează-ne pentru termen estimat sau alternativă disponibilă.',
        normalizedStatus,
        isService: false,
      };
    case 'la_comanda':
    default:
      return {
        title: 'Disponibilitate: La comandă',
        detail: 'Livrare în 3–5 zile lucrătoare. Disponibilitatea se confirmă telefonic sau pe email.',
        normalizedStatus,
        isService: false,
      };
  }
}

export const products: Product[] = [];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3) {
  return products
    .filter((candidate) => candidate.id !== product.id && candidate.category === product.category)
    .slice(0, limit);
}
