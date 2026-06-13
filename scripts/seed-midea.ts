/**
 * One-time script: insert 12 Midea products into Supabase products table
 * Run: npx tsx scripts/seed-midea.ts
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually (no dotenv dependency needed)
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = value;
  }
} catch {
  console.error('❌  Nu am găsit .env.local. Creează fișierul cu NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Lipsesc variabilele NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY în .env.local');
  process.exit(1);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

type ProductInsert = {
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
  updated_at: string;
};

const NOW = new Date().toISOString();

// BTU → kW cooling capacity
const btuToKw: Record<number, string> = {
  9000: '2.6 kW',
  12000: '3.5 kW',
  18000: '5.0 kW',
  21000: '6.1 kW',
  24000: '7.0 kW',
};

// ─── MIDEA SOLSTICE ──────────────────────────────────────────────────────────
const solsticeModels = [
  { btu: 9000,  code: 'MSAGBU-09HRFN8', seer: '8.8', area: '12–18 mp' },
  { btu: 12000, code: 'MSAGBU-12HRFN8', seer: '8.5', area: '18–28 mp' },
  { btu: 18000, code: 'MSAGBU-18HRFN8', seer: '8.5', area: '28–42 mp' },
  { btu: 21000, code: 'MSAGBU-21HRFN8', seer: '7.6', area: '42–52 mp' },
];

const solsticeFeatures = [
  'Inverter DC cu compresor inteligent — consum redus cu până la 60%',
  'Clasa energetică A+++, SEER și SCOP de top din gamă',
  'Funcție de auto-curățare — evaporator igienizat automat',
  'Filtru I-Feel cu senzor de temperatură pe telecomandă',
  'Nivel sonor redus unitate interioară: 19 dB(A)',
  'Conectivitate WiFi integrată — control prin aplicație MideaAir',
  'Funcție Turbo Cooling / Turbo Heating — atingi rapid temperatura dorită',
  'Agent frigorific R32 — impact redus asupra mediului',
  'Operare la temperaturi exterioare de până la –20°C',
  'Design ultra-slim 190 mm grosime unitate interioară',
];

const solsticeProducts: ProductInsert[] = solsticeModels.map((m) => ({
  slug: slugify(`Midea Solstice ${m.btu} BTU`),
  name: `Midea Solstice ${m.btu} BTU`,
  brand: 'Midea',
  category: 'Aparate aer condiționat',
  btu: m.btu,
  capacity_label: btuToKw[m.btu] ?? null,
  price: 0,
  price_label: 'Cere ofertă',
  original_price: null,
  rating: 4.8,
  reviews: 0,
  is_new: true,
  is_bestseller: false,
  energy_class: 'A+++',
  description: `Midea Solstice ${m.btu} BTU — aparat de aer condiționat clasa A+++ cu inverter DC de ultimă generație. Combină eficiența energetică maximă cu un nivel de zgomot extrem de redus și conectivitate WiFi integrată. Ideal pentru locuințe și birouri care pun accent pe confort și economie de energie.`,
  features: solsticeFeatures,
  specs: [
    { label: 'Model', value: m.code },
    { label: 'Agent frigorific', value: 'R32' },
    { label: 'Capacitate răcire', value: btuToKw[m.btu] ?? `${m.btu} BTU` },
    { label: 'BTU', value: `${m.btu} BTU` },
    { label: 'SEER', value: m.seer },
    { label: 'SCOP', value: '4.6' },
    { label: 'Clasă energetică', value: 'A+++' },
    { label: 'Suprafață recomandată', value: m.area },
    { label: 'WiFi', value: 'Da — integrat' },
    { label: 'Nivel sonor (interior)', value: '19 dB(A)' },
  ],
  smartbill_code: m.code,
  manage_stock: false,
  stock_status: 'on-request',
  stock_qty: null,
  image_url: null,
  active: true,
  updated_at: NOW,
}));

// ─── MIDEA SOLUNAR LITE ──────────────────────────────────────────────────────
const solunarModels = [
  { btu: 9000,  code: 'MSF1-09HRDN1', seer: '7.0', area: '12–18 mp' },
  { btu: 12000, code: 'MSF1-12HRDN1', seer: '6.5', area: '18–28 mp' },
  { btu: 18000, code: 'MSF1-18HRDN1', seer: '7.4', area: '28–42 mp' },
  { btu: 24000, code: 'MSF1-24HRDN1', seer: '6.5', area: '42–60 mp' },
];

const solunarFeatures = [
  'Inverter DC — adaptare continuă a puterii la necesarul real',
  'Clasa energetică A++ — eficiență ridicată la cost accesibil',
  'Funcție Turbo cu răcire rapidă a spațiului în 10 minute',
  'Filtru antibacterian și anti-mucegai integrat',
  'Operare silenţioasă — 22 dB(A) interior',
  'Agent frigorific R32 ecologic',
  'Control WiFi prin aplicație (opțional — dongle separat)',
  'Ventilație în 4 direcții cu deflectoare auto-swing',
  'Mod Sleep cu reducere automată a temperaturii noaptea',
  'Timer săptămânal programabil',
];

const solunarProducts: ProductInsert[] = solunarModels.map((m) => ({
  slug: slugify(`Midea Solunar Lite ${m.btu} BTU`),
  name: `Midea Solunar Lite ${m.btu} BTU`,
  brand: 'Midea',
  category: 'Aparate aer condiționat',
  btu: m.btu,
  capacity_label: btuToKw[m.btu] ?? null,
  price: 0,
  price_label: 'Cere ofertă',
  original_price: null,
  rating: 4.6,
  reviews: 0,
  is_new: false,
  is_bestseller: false,
  energy_class: 'A++',
  description: `Midea Solunar Lite ${m.btu} BTU — soluție eficientă clasa A++ pentru locuințe și spații comerciale mici. Raport calitate-preț excelent, inverter DC fiabil și filtrare antibacteriană. Gama ideală pentru cei care caută performanță solidă fără compromisuri.`,
  features: solunarFeatures,
  specs: [
    { label: 'Model', value: m.code },
    { label: 'Agent frigorific', value: 'R32' },
    { label: 'Capacitate răcire', value: btuToKw[m.btu] ?? `${m.btu} BTU` },
    { label: 'BTU', value: `${m.btu} BTU` },
    { label: 'SEER', value: m.seer },
    { label: 'SCOP', value: '4.1' },
    { label: 'Clasă energetică', value: 'A++' },
    { label: 'Suprafață recomandată', value: m.area },
    { label: 'WiFi', value: 'Opțional (dongle separat)' },
    { label: 'Nivel sonor (interior)', value: '22 dB(A)' },
  ],
  smartbill_code: m.code,
  manage_stock: false,
  stock_status: 'on-request',
  stock_qty: null,
  image_url: null,
  active: true,
  updated_at: NOW,
}));

// ─── MIDEA BREEZELESS E ───────────────────────────────────────────────────────
const breezelessModels = [
  { btu: 9000,  code: 'MA-09NXD0R', seer: '8.5', scop: '4.6', energyClass: 'A+++', area: '12–18 mp' },
  { btu: 12000, code: 'MA-12NXD0R', seer: '8.0', scop: '4.4', energyClass: 'A+++', area: '18–28 mp' },
  { btu: 18000, code: 'MA-18NXD0R', seer: '7.0', scop: '4.2', energyClass: 'A++',  area: '28–42 mp' },
  { btu: 24000, code: 'MA-24NXD0R', seer: '6.5', scop: '4.0', energyClass: 'A++',  area: '42–60 mp' },
];

const breezelessFeatures = [
  'Tehnologie Breezeless — distribuție aer fără curent de aer direct pe corp',
  'Jet de aer ascendent și descendent cu reglaj automat',
  'Confort maxim: elimină disconfortul curenților de aer',
  'Inverter DC cu compresor de înaltă eficiență',
  'Filtru cu carbon activ și ionizare — aer curat în permanență',
  'WiFi integrat — control prin aplicație MideaAir',
  'Display LED discret ascuns în panoul frontal',
  'Agent frigorific R32 cu impact redus',
  'Funcție Self-Cleaning — auto-igienizare evaporator',
  'Operare la –15°C exterior în mod încălzire',
];

const breezelessProducts: ProductInsert[] = breezelessModels.map((m) => ({
  slug: slugify(`Midea Breezeless E ${m.btu} BTU`),
  name: `Midea Breezeless E ${m.btu} BTU`,
  brand: 'Midea',
  category: 'Aparate aer condiționat',
  btu: m.btu,
  capacity_label: btuToKw[m.btu] ?? null,
  price: 0,
  price_label: 'Cere ofertă',
  original_price: null,
  rating: 4.7,
  reviews: 0,
  is_new: true,
  is_bestseller: false,
  energy_class: m.energyClass,
  description: `Midea Breezeless E ${m.btu} BTU — primul aparat de aer condiționat care elimină complet curentul de aer direct. Tehnologia Breezeless direcționează aerul în sus și în jos simultan, asigurând o distribuție uniformă a temperaturii fără disconfort. Clasa ${m.energyClass} cu WiFi integrat.`,
  features: breezelessFeatures,
  specs: [
    { label: 'Model', value: m.code },
    { label: 'Agent frigorific', value: 'R32' },
    { label: 'Capacitate răcire', value: btuToKw[m.btu] ?? `${m.btu} BTU` },
    { label: 'BTU', value: `${m.btu} BTU` },
    { label: 'SEER', value: m.seer },
    { label: 'SCOP', value: m.scop },
    { label: 'Clasă energetică', value: m.energyClass },
    { label: 'Suprafață recomandată', value: m.area },
    { label: 'WiFi', value: 'Da — integrat' },
    { label: 'Tehnologie specială', value: 'Breezeless — fără curent direct' },
  ],
  smartbill_code: m.code,
  manage_stock: false,
  stock_status: 'on-request',
  stock_qty: null,
  image_url: null,
  active: true,
  updated_at: NOW,
}));

// ─── INSERT ───────────────────────────────────────────────────────────────────
async function main() {
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

  const allProducts = [...solsticeProducts, ...solunarProducts, ...breezelessProducts];
  console.log(`\n📦  Se inserează ${allProducts.length} produse Midea în Supabase...\n`);

  let ok = 0;
  let fail = 0;

  for (const product of allProducts) {
    const { error } = await supabase.from('products').insert(product);
    if (error) {
      console.error(`❌  ${product.name}: ${error.message}`);
      fail++;
    } else {
      console.log(`✅  ${product.name} (${product.slug})`);
      ok++;
    }
  }

  console.log(`\n─────────────────────────────`);
  console.log(`✅  Inserate cu succes: ${ok}`);
  if (fail > 0) console.log(`❌  Eșuate: ${fail}`);
  console.log(`─────────────────────────────\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
