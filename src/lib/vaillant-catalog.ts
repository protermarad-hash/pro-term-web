// Vaillant heat pump series shown on /vaillant pages.
//
// Every technical statement below is taken from the official Vaillant Romania
// product pages (checked 23.11.2026, see docs/vaillant/INVENTAR-SKU-SURSE.md).
// No superlatives, savings or heated-area claims. Promotional wording on these
// pages requires written Vaillant approval before launch.

export const VAILLANT_BRAND = 'Vaillant';
export const HEAT_PUMP_CATEGORY = 'pompe-caldura';

export type VaillantSeriesSlug = 'arotherm-pro' | 'arotherm-plus' | 'arotherm-split-plus';

export interface VaillantSeries {
  slug: VaillantSeriesSlug;
  name: string;
  type: string;
  refrigerant: string;
  facts: string[];
  officialUrl: string;
  /** Article numbers are not yet confirmed for publication. */
  skuPending?: boolean;
}

export const VAILLANT_SERIES: readonly VaillantSeries[] = [
  {
    slug: 'arotherm-pro',
    name: 'aroTHERM pro',
    type: 'Pompă de căldură aer-apă, monobloc',
    refrigerant: 'R290',
    facts: [
      'Agent frigorific R290 (GWP 0,02)',
      'Temperatură pe tur în regim de încălzire: 10–70 °C',
      'Variante cu alimentare 230 V și 400 V',
      'Putere termică declarată, de exemplu 4,67–9,92 kW la A-7/W35, în funcție de model',
    ],
    officialUrl: 'https://www.vaillant.com.ro/produse/arothermpro/',
  },
  {
    slug: 'arotherm-plus',
    name: 'aroTHERM plus',
    type: 'Pompă de căldură aer-apă, monobloc',
    refrigerant: 'R290',
    facts: [
      'Agent frigorific R290 (GWP 0,02)',
      'Temperatură pe tur în regim de încălzire: 20–75 °C',
      'Modelele 55 și 75: 230 V; modelele 105 și 125: 400 V',
      'Putere termică declarată, de exemplu 5,59–12,14 kW la A-7/W35, în funcție de model',
    ],
    officialUrl: 'https://www.vaillant.com.ro/produse/arothermplus/',
  },
  {
    slug: 'arotherm-split-plus',
    name: 'aroTHERM Split plus',
    type: 'Pompă de căldură aer-apă, split',
    refrigerant: 'R32',
    facts: [
      'Agent frigorific R32 (GWP 675)',
      'Unitate exterioară și unitate interioară legate prin circuit frigorific',
      'Temperatură pe tur în regim de încălzire: până la 62 °C',
      'Alimentare 230 V',
    ],
    officialUrl: 'https://www.vaillant.com.ro/produse/arotherm-split-plus/',
    skuPending: true,
  },
];

export function getVaillantSeries(slug: string): VaillantSeries | undefined {
  return VAILLANT_SERIES.find((series) => series.slug === slug);
}

export type OfferOptionId = 'echipament' | 'sistem-complet' | 'la-cheie';

export interface OfferOption {
  id: OfferOptionId;
  title: string;
  description: string;
  pricing: string;
}

export const OFFER_OPTIONS: readonly OfferOption[] = [
  {
    id: 'echipament',
    title: 'Echipament',
    description: 'Produsul publicat, cu componentele incluse menționate pe pagina lui.',
    pricing: 'Prețul publicat, cu TVA, supus confirmării disponibilității.',
  },
  {
    id: 'sistem-complet',
    title: 'Sistem complet',
    description: 'Pompă de căldură, unitate interioară, automatizare și accesorii, alese pentru instalația ta.',
    pricing: 'Preț stabilit după validarea tehnică și comercială a echipei PRO TERM.',
  },
  {
    id: 'la-cheie',
    title: 'Soluție la cheie',
    description: 'Sistem complet, materiale, instalare și coordonarea punerii în funcțiune.',
    pricing: 'Preț stabilit după analiza instalației și validarea tehnică și comercială.',
  },
];

export function isOfferOptionId(value: unknown): value is OfferOptionId {
  return value === 'echipament' || value === 'sistem-complet' || value === 'la-cheie';
}
