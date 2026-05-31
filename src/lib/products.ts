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

export const products: Product[] = [
  {
    id: 'ac-midea-xtreme-12000',
    slug: 'midea-xtreme-save-12000-btu',
    name: 'Midea Xtreme Save 12000 BTU',
    brand: 'Midea',
    category: 'aer-conditionat',
    btu: 12000,
    capacityLabel: '12.000 BTU',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.8,
    reviews: 24,
    isBestseller: true,
    energyClass: 'A++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Aparat de aer condiționat Midea pentru locuințe și birouri, potrivit pentru camere medii. Prețul final se confirmă în funcție de model, stoc și montaj.',
    features: ['Tehnologie Inverter', 'Funcție răcire și încălzire', 'Montaj disponibil în Arad', 'Consultanță pentru dimensionare'],
    specs: [
      { label: 'Capacitate', value: '12.000 BTU' },
      { label: 'Refrigerant', value: 'R32 / în funcție de model' },
      { label: 'Montaj', value: 'Disponibil la cerere' },
    ],
  },
  {
    id: 'ac-gree-bora-12000',
    slug: 'gree-bora-12000-btu',
    name: 'Gree Bora 12000 BTU',
    brand: 'Gree',
    category: 'aer-conditionat',
    btu: 12000,
    capacityLabel: '12.000 BTU',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.7,
    reviews: 19,
    isBestseller: true,
    energyClass: 'A++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Model popular Gree pentru climatizare rezidențială, cu opțiune de livrare și montaj.',
    features: ['Raport bun calitate-preț', 'Service și montaj disponibile', 'Recomandat pentru apartamente și birouri'],
    specs: [
      { label: 'Capacitate', value: '12.000 BTU' },
      { label: 'Tip', value: 'Split perete' },
      { label: 'Montaj', value: 'La cerere' },
    ],
  },
  {
    id: 'ac-yamato-12000',
    slug: 'yamato-12000-btu',
    name: 'Yamato 12000 BTU',
    brand: 'Yamato',
    category: 'aer-conditionat',
    btu: 12000,
    capacityLabel: '12.000 BTU',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.5,
    reviews: 11,
    energyClass: 'A++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Aparat de aer condiționat Yamato pentru camere medii, cu ofertă personalizată în funcție de disponibilitate.',
    features: ['Inverter', 'Răcire și încălzire', 'Potrivit pentru locuințe'],
    specs: [{ label: 'Capacitate', value: '12.000 BTU' }],
  },
  {
    id: 'ac-fujitsu-12000',
    slug: 'fujitsu-12000-btu',
    name: 'Fujitsu 12000 BTU',
    brand: 'Fujitsu',
    category: 'aer-conditionat',
    btu: 12000,
    capacityLabel: '12.000 BTU',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.8,
    reviews: 9,
    isNew: true,
    energyClass: 'A++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Gamă Fujitsu pentru clienți care caută fiabilitate și eficiență în climatizare.',
    features: ['Brand premium', 'Soluții rezidențiale și comerciale', 'Montaj profesional disponibil'],
    specs: [{ label: 'Capacitate', value: '12.000 BTU' }],
  },
  {
    id: 'ac-yukon-12000',
    slug: 'yukon-12000-btu',
    name: 'Yukon 12000 BTU',
    brand: 'Yukon',
    category: 'aer-conditionat',
    btu: 12000,
    capacityLabel: '12.000 BTU',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.4,
    reviews: 7,
    energyClass: 'A++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Aparat de aer condiționat Yukon pentru proiecte rezidențiale și mici spații comerciale.',
    features: ['Inverter', 'Ofertă cu montaj', 'Disponibilitate confirmată telefonic'],
    specs: [{ label: 'Capacitate', value: '12.000 BTU' }],
  },
  {
    id: 'ac-habitat-12000',
    slug: 'habitat-12000-btu',
    name: 'Habitat 12000 BTU',
    brand: 'Habitat',
    category: 'aer-conditionat',
    btu: 12000,
    capacityLabel: '12.000 BTU',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.4,
    reviews: 6,
    energyClass: 'A++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Aparat de aer condiționat Habitat, disponibil cu ofertă personalizată pentru produs și montaj.',
    features: ['Climatizare rezidențială', 'Consultanță la alegere', 'Montaj disponibil'],
    specs: [{ label: 'Capacitate', value: '12.000 BTU' }],
  },
  {
    id: 'ct-bosch-condens',
    slug: 'bosch-centrala-termica-condensare',
    name: 'Bosch centrală termică în condensare',
    brand: 'Bosch',
    category: 'centrale-termice',
    capacityLabel: '24–30 kW',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.8,
    reviews: 14,
    energyClass: 'A',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Centrală termică Bosch în condensare, disponibilă cu ofertă pentru echipament, accesorii și montaj.',
    features: ['Randament ridicat', 'Potrivită pentru apartamente și case', 'Ofertă cu montaj și accesorii'],
    specs: [
      { label: 'Putere', value: '24–30 kW, în funcție de model' },
      { label: 'Tip', value: 'Centrală în condensare' },
      { label: 'Montaj', value: 'La cerere' },
    ],
  },
  {
    id: 'ct-vaillant-ecotec',
    slug: 'vaillant-ecotec-centrala-termica',
    name: 'Vaillant ecoTEC centrală termică',
    brand: 'Vaillant',
    category: 'centrale-termice',
    capacityLabel: '24–30 kW',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.9,
    reviews: 13,
    energyClass: 'A',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Centrală Vaillant pentru încălzire și apă caldă, cu ofertă personalizată pentru locuința ta.',
    features: ['Brand premium', 'Compatibilă cu termostate și automatizări', 'Pachet complet la cerere'],
    specs: [{ label: 'Putere', value: 'În funcție de model' }],
  },
  {
    id: 'ct-immergas-victrix',
    slug: 'immergas-victrix-centrala-termica',
    name: 'Immergas Victrix centrală termică',
    brand: 'Immergas',
    category: 'centrale-termice',
    capacityLabel: '24–32 kW',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.7,
    reviews: 10,
    energyClass: 'A',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Centrală termică Immergas din gama Victrix, disponibilă cu ofertă de montaj și accesorii.',
    features: ['Condensare', 'Soluție pentru apartamente și case', 'Accesorii disponibile'],
    specs: [{ label: 'Tip', value: 'Centrală termică în condensare' }],
  },
  {
    id: 'ct-viessmann-vitodens',
    slug: 'viessmann-vitodens-centrala-termica',
    name: 'Viessmann Vitodens centrală termică',
    brand: 'Viessmann',
    category: 'centrale-termice',
    capacityLabel: '24–35 kW',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.9,
    reviews: 12,
    energyClass: 'A',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Centrală Viessmann Vitodens pentru eficiență ridicată și fiabilitate pe termen lung.',
    features: ['Eficiență ridicată', 'Soluții pentru case și apartamente', 'Configurare la cerere'],
    specs: [{ label: 'Gamă', value: 'Vitodens' }],
  },
  {
    id: 'pc-gree-aer-apa',
    slug: 'gree-pompa-de-caldura-aer-apa',
    name: 'Gree pompă de căldură aer-apă',
    brand: 'Gree',
    category: 'pompe-caldura',
    capacityLabel: 'Monobloc / split',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.7,
    reviews: 8,
    energyClass: 'A+++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Pompă de căldură Gree pentru încălzire, răcire și apă caldă menajeră, dimensionată pe proiect.',
    features: ['Dimensionare după necesarul termic', 'Compatibilă cu puffer și boiler', 'Ofertă tehnică personalizată'],
    specs: [{ label: 'Tip', value: 'Aer-apă' }],
  },
  {
    id: 'pc-midea-aer-apa',
    slug: 'midea-pompa-de-caldura-aer-apa',
    name: 'Midea pompă de căldură aer-apă',
    brand: 'Midea',
    category: 'pompe-caldura',
    capacityLabel: 'Monobloc / split',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.7,
    reviews: 7,
    energyClass: 'A+++',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Soluție Midea pentru încălzire eficientă cu pompă de căldură, proiectată în funcție de locuință.',
    features: ['Soluție pentru case', 'Poate include puffer și boiler', 'Consultanță tehnică'],
    specs: [{ label: 'Tip', value: 'Aer-apă' }],
  },
  {
    id: 'kit-montaj-ac-3m',
    slug: 'kit-montaj-aer-conditionat-3m',
    name: 'Kit montaj aer condiționat 3 m',
    brand: 'Generic',
    category: 'accesorii-montaj-ac',
    capacityLabel: 'Kit 3 m',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.6,
    reviews: 18,
    energyClass: 'Accesoriu',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Kit de montaj pentru aparat de aer condiționat: traseu frigorific, izolație, furtun condens și accesorii de prindere, în funcție de configurație.',
    features: ['Pentru montaj AC', 'Configurabil după lungimea traseului', 'Disponibil cu montaj'],
    specs: [
      { label: 'Conținut', value: 'Țeavă frigorifică, izolație, furtun condens, cablu și accesorii' },
      { label: 'Lungime', value: '3 m, adaptabil la cerere' },
    ],
  },
  {
    id: 'console-ac-perete',
    slug: 'console-montaj-aer-conditionat',
    name: 'Console montaj aer condiționat',
    brand: 'Generic',
    category: 'accesorii-montaj-ac',
    capacityLabel: 'Set console',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.5,
    reviews: 16,
    energyClass: 'Accesoriu',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Console metalice pentru montajul unității exterioare de aer condiționat.',
    features: ['Pentru unitate exterioară', 'Diverse dimensiuni', 'Compatibile cu majoritatea aparatelor split'],
    specs: [{ label: 'Utilizare', value: 'Montaj unitate exterioară AC' }],
  },
  {
    id: 'pompa-condens-ac',
    slug: 'pompa-condens-aer-conditionat',
    name: 'Pompă condens aer condiționat',
    brand: 'Generic',
    category: 'condens-drenaj',
    capacityLabel: 'Condens AC',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.6,
    reviews: 9,
    energyClass: 'Accesoriu',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Pompă pentru evacuarea condensului atunci când scurgerea gravitațională nu este posibilă.',
    features: ['Utilă la montaj fără pantă de scurgere', 'Pentru AC rezidențial și comercial', 'Se alege după traseu și debit'],
    specs: [{ label: 'Utilizare', value: 'Evacuare condens' }],
  },
  {
    id: 'teava-frigorifica-cu-izolatie',
    slug: 'teava-frigorifica-cupru-izolata',
    name: 'Țeavă frigorifică cupru izolată',
    brand: 'Generic',
    category: 'accesorii-montaj-ac',
    capacityLabel: 'Cupru izolat',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.7,
    reviews: 15,
    energyClass: 'Accesoriu',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Țeavă frigorifică de cupru izolată pentru montaj aparate de aer condiționat și sisteme frigorifice.',
    features: ['Pentru trasee frigorifice', 'Dimensiuni în funcție de aparat', 'Disponibilă la metru sau în kit'],
    specs: [{ label: 'Material', value: 'Cupru cu izolație' }],
  },
  {
    id: 'dibluri-suruburi-ac',
    slug: 'suruburi-dibluri-montaj-aer-conditionat',
    name: 'Șuruburi și dibluri montaj AC',
    brand: 'Generic',
    category: 'accesorii-montaj-ac',
    capacityLabel: 'Set prindere',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.4,
    reviews: 8,
    energyClass: 'Accesoriu',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Elemente de prindere pentru console, trasee și accesorii de montaj aer condiționat.',
    features: ['Dibluri', 'Șuruburi', 'Prinderi pentru montaj'],
    specs: [{ label: 'Utilizare', value: 'Fixare accesorii montaj AC' }],
  },
  {
    id: 'teava-ppr-fitinguri-centrale',
    slug: 'teava-fitinguri-centrale-termice',
    name: 'Țeavă și fitinguri pentru centrale termice',
    brand: 'Generic',
    category: 'teava-fitinguri',
    capacityLabel: 'PPR / multistrat / cupru',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.6,
    reviews: 12,
    energyClass: 'Instalații',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Țeavă, fitinguri, robineți și accesorii pentru instalații de încălzire, centrale termice și pompe de căldură.',
    features: ['Pentru încălzire și apă caldă', 'PPR, multistrat sau cupru', 'Disponibile în funcție de proiect'],
    specs: [{ label: 'Utilizare', value: 'Instalații termice' }],
  },
  {
    id: 'termostat-smart-wifi',
    slug: 'termostat-smart-wifi-centrala',
    name: 'Termostat smart WiFi pentru centrală',
    brand: 'Generic',
    category: 'termostate-automatizari',
    capacityLabel: 'WiFi',
    price: 0,
    priceLabel: 'Cere ofertă',
    rating: 4.7,
    reviews: 20,
    energyClass: 'Accesoriu',
    smartbillCode: 'DE_COMPLETAT_SMARTBILL',
    manageStock: true,
    stockStatus: 'on-request',
    description: 'Termostat programabil smart pentru controlul centralei termice și optimizarea consumului.',
    features: ['Control din aplicație', 'Programare săptămânală', 'Compatibilitate verificată la cerere'],
    specs: [{ label: 'Tip', value: 'Termostat smart WiFi' }],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category || Boolean(product.btu && p.btu === product.btu)))
    .slice(0, count);
}
