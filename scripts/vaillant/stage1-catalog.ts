// Vaillant heat pumps — stage 1 catalogue (technical/public data only).
//
// Source of every technical value: official Vaillant Romania product pages,
// checked 23.11.2026 (see docs/vaillant/INVENTAR-SKU-SURSE.md). Power values
// always carry their measurement condition (EN 14511).
//
// NO PRICES HERE. Public prices with VAT are read by import-stage1.ts from a
// local, git-ignored CSV (private/vaillant-public-prices.csv). Purchase
// prices, margins, contract terms, logistics costs and negotiation thresholds
// must never be added to this repository.

export interface Stage1Product {
  sku: string;
  slug: string;
  name: string;
  model: string;
  productLine: 'arotherm-pro' | 'arotherm-plus';
  /** Official series photo (vaillant.com.ro), served from public/media/vaillant. */
  imageUrl: string;
  powerSupply: '230V' | '400V';
  energyClass: string;
  description: string;
  specs: { label: string; value: string }[];
  includedComponents: string[];
  excludedComponents: string[];
  documents: { label: string; url: string }[];
}

const DOC = 'https://www.vaillant.com.ro/api/download/product/ro';

const COMMON_EXCLUDED = [
  'Unitate interioară / stație hidraulică sau modul cu boiler integrat',
  'Boiler pentru apă caldă menajeră',
  'Accesorii hidraulice (vas de expansiune, puffer, filtre, robinete)',
  'Materiale de instalare (țevi, izolație, cabluri, suporți)',
  'Montaj, punere în funcțiune și calculul necesarului termic',
];

const PRO_DOCUMENTS = [
  { label: 'Fișă tehnică ErP aroTHERM pro (PDF, Vaillant)', url: `${DOC}/_arotherm-pro_794695.pdf` },
  { label: 'Instrucțiuni de instalare aroTHERM pro (PDF, Vaillant)', url: `${DOC}/_arotherm-pro_1501551.pdf` },
];

const PLUS_FICHE = { label: 'Fișă tehnică ErP aroTHERM plus (PDF, Vaillant)', url: `${DOC}/_arotherm-plus_782705.pdf` };
const PLUS_MANUAL_230 = { label: 'Instrucțiuni de instalare 55/75 (PDF, Vaillant)', url: `${DOC}/_arotherm-plus_1521978.pdf` };
const PLUS_MANUAL_400 = { label: 'Instrucțiuni de instalare 105/125 (PDF, Vaillant)', url: `${DOC}/_arotherm-plus_1521900.pdf` };

interface ProValues {
  sku: string;
  model: string;
  supply: '230V' | '400V';
  charge: string;
  am7w35: string;
  a2w35: string;
  scop: string;
  classes: string;
  sound: string;
  dims: string;
  weight: string;
}

function proProduct(v: ProValues): Stage1Product {
  const supplyText = v.supply === '230V' ? '230 V' : '400 V';
  const name = `Pompă de căldură Vaillant aroTHERM pro ${v.model}${v.supply === '400V' ? ' (400 V)' : ''}`;
  return {
    sku: v.sku,
    slug: `vaillant-arotherm-pro-${v.model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    name,
    model: v.model,
    productLine: 'arotherm-pro',
    imageUrl: '/media/vaillant/arotherm-pro.png',
    powerSupply: v.supply,
    energyClass: 'A+++',
    description:
      `Pompă de căldură aer-apă monobloc Vaillant aroTHERM pro ${v.model}, cu agent frigorific R290 și alimentare ${supplyText}. ` +
      'Prețul include doar unitatea exterioară; sistemul complet se ofertează după analiza instalației.',
    specs: [
      { label: 'Cod SKU', value: v.sku },
      { label: 'Alimentare electrică', value: `${supplyText}, 50 Hz` },
      { label: 'Agent frigorific', value: `R290 (GWP 0,02), încărcătură ${v.charge}` },
      { label: 'Putere termică / COP la A-7/W35 (EN 14511)', value: v.am7w35 },
      { label: 'Putere termică / COP la A2/W35 (EN 14511)', value: v.a2w35 },
      { label: 'SCOP aplicații temperatură joasă / medie', value: v.scop },
      { label: 'Clasă eficiență încălzire 35 °C / 55 °C', value: v.classes },
      { label: 'Temperatură pe tur încălzire', value: '10–70 °C' },
      { label: 'Nivel putere acustică exterior, maxim', value: v.sound },
      { label: 'Dimensiuni Î × L × A', value: v.dims },
      { label: 'Greutate fără ambalaj', value: v.weight },
    ],
    includedComponents: [`Unitate exterioară aroTHERM pro ${v.model}`],
    excludedComponents: ['Automatizare / regulator de sistem', ...COMMON_EXCLUDED],
    documents: [
      ...PRO_DOCUMENTS,
      ...(v.sku === '8000022212'
        ? [{ label: 'Etichetă energetică ErP VWL 125/7.1 A S3 (PDF, Vaillant)', url: `${DOC}/_arotherm-pro_763871.pdf` }]
        : []),
    ],
  };
}

interface PlusValues {
  sku: string;
  model: string;
  supply: '230V' | '400V';
  charge: string;
  a7w35: string;
  am7w35: string;
  am7w55: string;
  scop: string;
  classes: string;
  sound: string;
  dims: string;
  weight: string;
  label?: string;
}

function plusProduct(v: PlusValues): Stage1Product {
  const supplyText = v.supply === '230V' ? '230 V' : '400 V';
  return {
    sku: v.sku,
    slug: `vaillant-arotherm-plus-${v.model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-vwz-ai`,
    name: `Pompă de căldură Vaillant aroTHERM plus ${v.model} + automatizare VWZ AI /7`,
    model: v.model,
    productLine: 'arotherm-plus',
    imageUrl: '/media/vaillant/arotherm-plus.png',
    powerSupply: v.supply,
    energyClass: 'A+++',
    description:
      `Pompă de căldură aer-apă monobloc Vaillant aroTHERM plus ${v.model}, cu agent frigorific R290 și alimentare ${supplyText}, ` +
      'publicată ca unitate exterioară + automatizare VWZ AI /7. Sistemul complet se ofertează după analiza instalației.',
    specs: [
      { label: 'Cod SKU', value: v.sku },
      { label: 'Alimentare electrică', value: `${supplyText}, 50 Hz` },
      { label: 'Agent frigorific', value: `R290 (GWP 0,02), încărcătură ${v.charge}` },
      { label: 'Putere termică / COP la A7/W35 (EN 14511)', value: v.a7w35 },
      { label: 'Putere termică / COP la A-7/W35 (EN 14511)', value: v.am7w35 },
      { label: 'Putere termică / COP la A-7/W55, putere maximă (EN 14511)', value: v.am7w55 },
      { label: 'SCOP aplicații temperatură joasă / medie', value: v.scop },
      { label: 'Clasă eficiență încălzire 35 °C / 55 °C', value: v.classes },
      { label: 'Temperatură pe tur încălzire', value: '20–75 °C' },
      { label: 'Nivel putere acustică exterior, maxim', value: v.sound },
      { label: 'Dimensiuni Î × L × A', value: v.dims },
      { label: 'Greutate fără ambalaj', value: v.weight },
    ],
    includedComponents: [`Unitate exterioară aroTHERM plus ${v.model}`, 'Automatizare VWZ AI /7'],
    excludedComponents: COMMON_EXCLUDED,
    documents: [
      PLUS_FICHE,
      ...(v.label ? [{ label: `Etichetă energetică ErP ${v.model} (PDF, Vaillant)`, url: `${DOC}/${v.label}` }] : []),
      v.supply === '230V' ? PLUS_MANUAL_230 : PLUS_MANUAL_400,
    ],
  };
}

export const STAGE1_PRODUCTS: readonly Stage1Product[] = [
  proProduct({ sku: '8000022169', model: 'VWL 55/7.1 A 230V S3', supply: '230V', charge: '0,5 kg', am7w35: '4,67 kW / COP 2,81', a2w35: '2,33 kW / COP 4,19', scop: '5,01 / 3,70', classes: 'A+++ / A++', sound: '57,7 dB(A)', dims: '750 × 1104 × 454 mm', weight: '84 kg' }),
  proProduct({ sku: '8000022192', model: 'VWL 85/7.1 A 230V S3', supply: '230V', charge: '0,6 kg', am7w35: '6,21 kW / COP 2,56', a2w35: '3,46 kW / COP 4,06', scop: '4,87 / 3,62', classes: 'A+++ / A++', sound: '60,9 dB(A)', dims: '750 × 1104 × 454 mm', weight: '90,3 kg' }),
  proProduct({ sku: '8000022201', model: 'VWL 125/7.1 A 230V S3', supply: '230V', charge: '1,05 kg', am7w35: '9,83 kW / COP 2,60', a2w35: '6,38 kW / COP 4,21', scop: '5,09 / 3,81', classes: 'A+++ / A++', sound: '65,7 dB(A)', dims: '1103 × 1169 × 454 mm', weight: '132,2 kg' }),
  proProduct({ sku: '8000022212', model: 'VWL 125/7.1 A S3', supply: '400V', charge: '1,05 kg', am7w35: '10,06 kW / COP 2,60', a2w35: '6,77 kW / COP 4,10', scop: '4,89 / 3,67', classes: 'A+++ / A++', sound: '65,7 dB(A)', dims: '1103 × 1169 × 454 mm', weight: '136,6 kg' }),
  proProduct({ sku: '8000022204', model: 'VWL 155/7.1 A 230V S3', supply: '230V', charge: '1,05 kg', am7w35: '9,74 kW / COP 2,52', a2w35: '6,37 kW / COP 4,23', scop: '5,09 / 3,84', classes: 'A+++ / A+++', sound: '65,6 dB(A)', dims: '1103 × 1169 × 454 mm', weight: '132,2 kg' }),
  proProduct({ sku: '8000022215', model: 'VWL 155/7.1 A S3', supply: '400V', charge: '1,05 kg', am7w35: '9,92 kW / COP 2,56', a2w35: '6,47 kW / COP 4,08', scop: '4,93 / 3,66', classes: 'A+++ / A++', sound: '65,6 dB(A)', dims: '1103 × 1169 × 454 mm', weight: '136,6 kg' }),
  plusProduct({ sku: '8000049535', model: 'VWL 55/8.1 A 230V', supply: '230V', charge: '0,6 kg', a7w35: '2,00 kW / COP 4,92', am7w35: '5,59 kW / COP 2,67', am7w55: '5,67 kW / COP 2,14', scop: '4,83 / 3,64', classes: 'A+++ / A++', sound: '55,6 dB(A)', dims: '765 × 1100 × 450 mm', weight: '113 kg', label: '_arotherm-plus_786883.pdf' }),
  plusProduct({ sku: '8000049536', model: 'VWL 75/8.1 A 230V', supply: '230V', charge: '0,9 kg', a7w35: '2,67 kW / COP 4,94', am7w35: '6,94 kW / COP 2,94', am7w55: '7,09 kW / COP 2,14', scop: '4,98 / 3,62', classes: 'A+++ / A++', sound: '57,4 dB(A)', dims: '965 × 1100 × 450 mm', weight: '130 kg', label: '_arotherm-plus_786893.pdf' }),
  plusProduct({ sku: '8000049543', model: 'VWL 105/8.1 A 400V', supply: '400V', charge: '1,3 kg', a7w35: '5,69 kW / COP 5,29', am7w35: '10,58 kW / COP 3,01', am7w55: '10,96 kW / COP 2,03', scop: '5,13 / 3,86', classes: 'A+++ / A+++', sound: '58,2 dB(A)', dims: '1480 × 1100 × 450 mm', weight: '206 kg' }),
  plusProduct({ sku: '8000049544', model: 'VWL 125/8.1 A 400V', supply: '400V', charge: '1,3 kg', a7w35: '5,74 kW / COP 5,39', am7w35: '12,14 kW / COP 2,72', am7w55: '11,99 kW / COP 1,98', scop: '5,12 / 3,85', classes: 'A+++ / A+++', sound: '59,9 dB(A)', dims: '1480 × 1100 × 450 mm', weight: '206 kg', label: '_arotherm-plus_786914.pdf' }),
];
