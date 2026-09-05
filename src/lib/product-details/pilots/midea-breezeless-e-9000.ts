import type { SourceReference } from '../provenance';
import type {
  AcousticProfile,
  AirflowSpec,
  DimensionsSpec,
  ElectricalSpec,
  EnergyZoneProfile,
  FeatureClaim,
  InstallationSpec,
  PerformanceSpec,
  PhysicalProductDetails,
  ProductDocument,
  ProductIdentity,
  RefrigerantSpec,
  TemperatureProfile,
} from '../types';

/**
 * Sourced technical dossier for the Midea Breezeless E 9000 BTU pilot
 * (indoor CB1-09HRFN8-I / outdoor MX2-09RD6), verified 2026-09-05 directly
 * against two official Midea România documents:
 *
 *  - "Pliant" (product brochure), PDF, table on page 4 — SRC_PLIANT
 *  - Official EU energy label image for this exact SKU — SRC_LABEL
 *
 * Both were downloaded to a temporary out-of-repo directory, hashed, and
 * deleted after this dossier was written — no binary is stored in the repo.
 * Values not present in either document are left `not-published` rather
 * than guessed; ambiguous source labeling is called out in `internalNote`.
 */

const VERIFIED_AT = '2026-09-05';

const SRC_PLIANT: SourceReference = {
  kind: 'official-pdf',
  label: 'Pliant Midea Breezeless E (2026), tabel specificații tehnice, p.4',
  url: 'https://midea-romania.ro/wp-content/uploads/2026/04/PLIANT-BREEZELESS-E-2026-LB-ROM.pdf',
  pageNumber: 4,
  sha256: 'ad6ad4b050d107451ec4c72669243e5a715ba3691f8017b0753273c0679331f0',
  verifiedAt: VERIFIED_AT,
  confidence: 'high',
};

const SRC_PLIANT_FEATURES: SourceReference = {
  kind: 'official-pdf',
  label: 'Pliant Midea Breezeless E (2026), pagini "Puncte Forte", p.2-3',
  url: 'https://midea-romania.ro/wp-content/uploads/2026/04/PLIANT-BREEZELESS-E-2026-LB-ROM.pdf',
  pageNumber: 3,
  sha256: 'ad6ad4b050d107451ec4c72669243e5a715ba3691f8017b0753273c0679331f0',
  verifiedAt: VERIFIED_AT,
  confidence: 'high',
};

const SRC_LABEL: SourceReference = {
  kind: 'energy-label',
  label: 'Etichetă energetică UE oficială — CB1-09HRFN8-I / MX2-09RD6',
  url: 'https://midea-romania.ro/wp-content/uploads/2026/05/Eticheta-Energetica-9000-btu.png',
  sha256: '5f6fdf4920802c9bdd35d2994e7c0075fdbe136a1369ae279a230727489dc4df',
  verifiedAt: VERIFIED_AT,
  confidence: 'high',
};

const SRC_PRODUCT_PAGE: SourceReference = {
  kind: 'official-website',
  label: 'Pagina oficială Midea România — Breezeless E 9000 BTU',
  url: 'https://midea-romania.ro/breezeless-e/breezeless-e-9000-btu/',
  verifiedAt: VERIFIED_AT,
  confidence: 'medium',
};

const identity: ProductIdentity = {
  brand: 'Midea',
  series: 'Breezeless E',
  displayName: 'Midea Breezeless E 9000 BTU',
  indoorUnitCode: {
    status: 'verified',
    value: 'CB1-09HRFN8-I',
    sources: [SRC_PLIANT, SRC_LABEL],
  },
  outdoorUnitCode: {
    status: 'verified',
    value: 'MX2-09RD6',
    sources: [SRC_PLIANT, SRC_LABEL],
  },
  setCode: { status: 'not-published' },
  mpn: { status: 'not-published' },
  gtin: { status: 'not-published' },
  eprelId: { status: 'not-published' },
  variantLabel: '9000 BTU',
};

const performance: PerformanceSpec = {
  coolingNominal: {
    status: 'verified',
    value: {
      btu: { value: 8871, unit: 'BTU/h', rawText: '8871(3412~11942) BTU/h' },
      kw: { value: 2.6, unit: 'kW' },
    },
    sources: [SRC_PLIANT],
  },
  coolingMin: {
    status: 'verified',
    value: { btu: { value: 3412, unit: 'BTU/h' } },
    sources: [SRC_PLIANT],
  },
  coolingMax: {
    status: 'verified',
    value: { btu: { value: 11942, unit: 'BTU/h' } },
    sources: [SRC_PLIANT],
  },
  heatingNominal: {
    status: 'verified',
    value: {
      btu: { value: 10000, unit: 'BTU/h', rawText: '10000(3412~13818) BTU/h' },
      kw: { value: 2.93, unit: 'kW' },
    },
    sources: [
      {
        ...SRC_PLIANT,
        internalNote:
          'Rândul sursă este etichetat "Putere absorbită la răcire/încălzire" dar valoarea în kW ' +
          '(2,6 / 2,93) corespunde exact conversiei capacității din BTU/h (8871/3412≈2,6; ' +
          '10000/3412≈2,93), nu puterii electrice de intrare reale — comparați cu "Consum maxim ' +
          'de putere absorbită" = 2200 W din același tabel. Tratat aici drept capacitate, nu ' +
          'drept putere absorbită.',
      },
    ],
  },
  heatingMin: {
    status: 'verified',
    value: { btu: { value: 3412, unit: 'BTU/h' } },
    sources: [SRC_PLIANT],
  },
  heatingMax: {
    status: 'verified',
    value: { btu: { value: 13818, unit: 'BTU/h' } },
    sources: [SRC_PLIANT],
  },
  eer: { status: 'not-published' },
  cop: { status: 'not-published' },
  seer: { status: 'verified', value: 8.5, sources: [SRC_PLIANT, SRC_LABEL] },
  scop: {
    status: 'requires-importer-confirmation',
    note: 'SCOP diferă pe zonă climatică (4,6 climat mediu / 5,7 climat cald) — vezi energyProfiles; nu există o valoare unică de SCOP pentru întregul model.',
  },
  pDesignCooling: { status: 'verified', value: { value: 2.6, unit: 'kW' }, sources: [SRC_PLIANT, SRC_LABEL] },
  pDesignHeating: {
    status: 'requires-importer-confirmation',
    note: 'Pdesignh diferă pe zonă climatică (2,6 kW climat mediu / 2,5 kW climat cald) — vezi energyProfiles.',
  },
  tBiv: { status: 'not-published' },
  tol: { status: 'not-published' },
  annualConsumptionCooling: { status: 'verified', value: { value: 108, unit: 'kWh/an', rawText: '108 kWh/annum' }, sources: [SRC_LABEL] },
  annualConsumptionHeating: {
    status: 'requires-importer-confirmation',
    note: 'Consumul anual de încălzire diferă pe zonă climatică (791 kWh/an mediu / 615 kWh/an cald) — vezi energyProfiles.',
  },
};

const energyProfiles: EnergyZoneProfile[] = [
  {
    zone: 'cooling',
    applicable: true,
    pDesign: { status: 'verified', value: { value: 2.6, unit: 'kW' }, sources: [SRC_PLIANT, SRC_LABEL] },
    seasonalEfficiency: { status: 'verified', value: 8.5, sources: [SRC_PLIANT, SRC_LABEL] },
    energyClass: { status: 'verified', value: 'A+++', sources: [SRC_PLIANT, SRC_LABEL] },
    annualConsumption: { status: 'verified', value: { value: 108, unit: 'kWh/an' }, sources: [SRC_LABEL] },
  },
  {
    zone: 'average',
    applicable: true,
    pDesign: { status: 'verified', value: { value: 2.6, unit: 'kW' }, sources: [SRC_PLIANT] },
    seasonalEfficiency: { status: 'verified', value: 4.6, sources: [SRC_PLIANT, SRC_LABEL] },
    energyClass: { status: 'verified', value: 'A++', sources: [SRC_PLIANT, SRC_LABEL] },
    annualConsumption: { status: 'verified', value: { value: 791, unit: 'kWh/an' }, sources: [SRC_LABEL] },
    tBiv: { status: 'verified', value: { value: -7, unit: '°C' }, sources: [SRC_PLIANT] },
  },
  {
    zone: 'warmer',
    applicable: true,
    pDesign: { status: 'verified', value: { value: 2.5, unit: 'kW' }, sources: [SRC_PLIANT] },
    seasonalEfficiency: { status: 'verified', value: 5.7, sources: [SRC_PLIANT, SRC_LABEL] },
    energyClass: { status: 'verified', value: 'A+++', sources: [SRC_PLIANT, SRC_LABEL] },
    annualConsumption: { status: 'verified', value: { value: 615, unit: 'kWh/an' }, sources: [SRC_LABEL] },
    tBiv: { status: 'verified', value: { value: 2, unit: '°C' }, sources: [SRC_PLIANT] },
    tol: { status: 'verified', value: { value: -15, unit: '°C' }, sources: [SRC_PLIANT] },
  },
  {
    // The official energy label marks this zone with an explicit "X" for kW/SCOP/kWh-annum —
    // an affirmative "not evaluated" mark, not mere silence, so `not-applicable` applies here.
    zone: 'colder',
    applicable: false,
    pDesign: { status: 'not-applicable' },
    seasonalEfficiency: { status: 'not-applicable' },
    energyClass: { status: 'not-applicable' },
    annualConsumption: { status: 'not-applicable' },
  },
];

const acoustics: AcousticProfile = {
  soundPressure: {
    indoor: {
      status: 'verified',
      value: {
        min: { value: { value: 17.5, unit: 'dB(A)' }, step: 'silențios' },
        max: { value: { value: 41, unit: 'dB(A)' }, step: 'ridicat' },
        measurementConditions:
          'Valori publicate pe 5 citiri de turație: 41 / 36,5 / 31,5 / 22,5 / 17,5 dB(A); ' +
          'corespondența exactă a fiecărei valori cu treptele "ridicat/mediu/scăzut/silențios" ' +
          'nu este delimitată fără ambiguitate în sursă pentru toate cele 5 citiri.',
      },
      sources: [SRC_PLIANT],
    },
    outdoor: {
      status: 'verified',
      value: { min: { value: { value: 55.0, unit: 'dB(A)' } } },
      sources: [SRC_PLIANT],
    },
  },
  soundPower: {
    indoor: {
      status: 'verified',
      value: { min: { value: { value: 53, unit: 'dB(A)' } } },
      sources: [SRC_PLIANT, SRC_LABEL],
    },
    outdoor: {
      status: 'conflicting',
      variants: [
        {
          value: { min: { value: { value: 62, unit: 'dB(A)' } } },
          sources: [SRC_PLIANT],
          note: 'Valoare din pliantul de prezentare (tabel specificații, p.4).',
        },
        {
          value: { min: { value: { value: 61, unit: 'dB(A)' } } },
          sources: [SRC_LABEL],
          note: 'Valoare de pe eticheta energetică UE oficială pentru acest SKU exact.',
        },
      ],
    },
  },
};

const temperature: TemperatureProfile = {
  indoorCooling: { status: 'verified', value: { min: { value: 16, unit: '°C' }, max: { value: 32, unit: '°C' } }, sources: [SRC_PLIANT] },
  indoorHeating: { status: 'verified', value: { min: { value: 0, unit: '°C' }, max: { value: 30, unit: '°C' } }, sources: [SRC_PLIANT] },
  outdoorCooling: { status: 'verified', value: { min: { value: -15, unit: '°C' }, max: { value: 50, unit: '°C' } }, sources: [SRC_PLIANT] },
  outdoorHeating: { status: 'verified', value: { min: { value: -25, unit: '°C' }, max: { value: 24, unit: '°C' } }, sources: [SRC_PLIANT] },
};

const airflow: AirflowSpec = {
  indoorFlow: {
    status: 'verified' as const,
    value: {
      min: { value: 375, unit: 'm³/h' as const },
      max: { value: 660, unit: 'm³/h' as const, rawText: '660/510/415/375 m³/h (ridicat/mediu/scăzut/silențios)' },
    },
    sources: [SRC_PLIANT],
  },
  outdoorFlow: {
    status: 'verified' as const,
    value: { min: { value: 2200, unit: 'm³/h' as const } },
    sources: [SRC_PLIANT],
  },
  fanSteps: { status: 'verified' as const, value: 4, sources: [SRC_PLIANT] },
  dehumidification: { status: 'verified' as const, value: { value: 1.1, unit: 'l/h' as const }, sources: [SRC_PLIANT] },
};

const electrical: ElectricalSpec = {
  voltageRange: {
    status: 'verified',
    value: { min: { value: 220, unit: 'V' }, max: { value: 240, unit: 'V' } },
    sources: [SRC_PLIANT],
  },
  phases: { status: 'verified', value: 1, sources: [SRC_PLIANT] },
  frequency: { status: 'verified', value: { value: 50, unit: 'Hz' }, sources: [SRC_PLIANT] },
  ratedCurrent: {
    status: 'verified',
    value: { value: 4.8, unit: 'A', rawText: '4.80(0.70~5.80) A — curent nominal la răcire' },
    sources: [SRC_PLIANT],
  },
  currentRange: {
    status: 'verified',
    value: { min: { value: 0.7, unit: 'A' }, nominal: { value: 4.8, unit: 'A' }, max: { value: 5.8, unit: 'A' } },
    sources: [SRC_PLIANT],
  },
  maxCurrent: { status: 'verified', value: { value: 10.0, unit: 'A' }, sources: [SRC_PLIANT] },
  inputPower: { status: 'not-published' },
  maxPower: { status: 'verified', value: { value: 2200, unit: 'W' }, sources: [SRC_PLIANT] },
  recommendedBreaker: { status: 'not-published' },
  recommendedCable: { status: 'not-published' },
  powerSupplyPoint: { status: 'not-published' },
};

const refrigerant: RefrigerantSpec = {
  refrigerantType: { status: 'verified', value: 'R32', sources: [SRC_PLIANT] },
  gwp: { status: 'verified', value: 675, sources: [SRC_PLIANT] },
  factoryCharge: { status: 'verified', value: { value: 0.55, unit: 'kg' }, sources: [SRC_PLIANT] },
  co2Equivalent: {
    status: 'derived',
    derived: {
      value: { value: 0.37125, unit: 'kg CO₂e', rawText: '371,25 kg CO₂e (0,37125 t CO₂e)' },
      formula: 'Încărcare din fabrică (kg) × GWP = CO₂ echivalent (kg CO₂e): 0,55 kg × 675 = 371,25 kg CO₂e',
      sources: [SRC_PLIANT],
    },
  },
  additionalChargePerMeter: { status: 'not-published' },
  prechargedPipeLength: { status: 'not-published' },
  pipeRunRange: { status: 'verified', value: { max: { value: 25, unit: 'm' } }, sources: [SRC_PLIANT] },
  maxLevelDifference: { status: 'verified', value: { value: 10, unit: 'm' }, sources: [SRC_PLIANT] },
  liquidPipeDiameter: { status: 'verified', value: { value: 6.35, unit: 'mm', rawText: '6,35 mm (1/4")' }, sources: [SRC_PLIANT] },
  gasPipeDiameter: { status: 'verified', value: { value: 9.52, unit: 'mm', rawText: '9,52 mm (3/8")' }, sources: [SRC_PLIANT] },
  requiresCertifiedInstaller: true,
};

const dimensions: DimensionsSpec = {
  indoorUnit: {
    dimensions: {
      status: 'verified',
      value: {
        width: { value: 812, unit: 'mm' },
        depth: { value: 199, unit: 'mm' },
        height: { value: 299, unit: 'mm' },
        originalOrder: ['width', 'depth', 'height'],
      },
      sources: [SRC_PLIANT],
    },
    netWeight: { status: 'verified', value: { value: 9.1, unit: 'kg' }, sources: [SRC_PLIANT] },
    grossWeight: { status: 'verified', value: { value: 11.6, unit: 'kg' }, sources: [SRC_PLIANT] },
    packageDimensions: {
      status: 'verified',
      value: {
        width: { value: 870, unit: 'mm' },
        depth: { value: 277, unit: 'mm' },
        height: { value: 385, unit: 'mm' },
        originalOrder: ['width', 'depth', 'height'],
      },
      sources: [SRC_PLIANT],
    },
  },
  outdoorUnit: {
    dimensions: {
      status: 'verified',
      value: {
        width: { value: 765, unit: 'mm' },
        depth: { value: 303, unit: 'mm' },
        height: { value: 555, unit: 'mm' },
        originalOrder: ['width', 'depth', 'height'],
      },
      sources: [SRC_PLIANT],
    },
    netWeight: { status: 'verified', value: { value: 23.1, unit: 'kg' }, sources: [SRC_PLIANT] },
    grossWeight: { status: 'verified', value: { value: 25.4, unit: 'kg' }, sources: [SRC_PLIANT] },
    packageDimensions: {
      status: 'verified',
      value: {
        width: { value: 887, unit: 'mm' },
        depth: { value: 337, unit: 'mm' },
        height: { value: 610, unit: 'mm' },
        originalOrder: ['width', 'depth', 'height'],
      },
      sources: [SRC_PLIANT],
    },
  },
};

const features: FeatureClaim[] = [
  {
    id: 'breezeless-twinflap',
    technicalClaim: 'Structură TwinFlap™ cu 5013 mini-orificii pe deflectorul de aer',
    publicExplanation: 'Fluxul de aer este împărțit în mii de fascicule fine în locul unui jet direct.',
    customerBenefit: 'Reduce senzația de curent rece resimțit direct pe piele.',
    applicability: 'series',
    standardOrOptional: 'standard',
    source: SRC_PLIANT_FEATURES,
    displayPosition: 1,
  },
  {
    id: 'cool-flash-plus',
    technicalClaim: 'Cool Flash Plus — reducere a temperaturii camerei cu 6,3°C în 10 minute',
    publicExplanation: 'Mod de răcire rapidă cu debit de aer extins la pornire.',
    customerBenefit: 'Confort termic rapid la pornirea aparatului.',
    limitation: 'Valoare obținută în condiții de laborator, în condiții specifice — performanța reală variază.',
    applicability: 'series',
    standardOrOptional: 'standard',
    source: SRC_PLIANT_FEATURES,
    displayPosition: 2,
  },
  {
    id: 'heat-flash',
    technicalClaim: 'Heat Flash — creștere a temperaturii camerei cu 10,4°C în 10 minute',
    publicExplanation: 'Mod de încălzire rapidă la pornirea aparatului.',
    customerBenefit: 'Încălzire percepută rapid a spațiului.',
    limitation: 'Valoare testată la o temperatură exterioară de 2°C — performanța reală variază cu clima locală.',
    applicability: 'series',
    standardOrOptional: 'standard',
    source: SRC_PLIANT_FEATURES,
    displayPosition: 3,
  },
  {
    id: 'air-magic-plus',
    technicalClaim: 'Air Magic+ — sterilizare cu ioni negativi',
    publicExplanation: 'Generează ioni negativi care inhibă activitatea unor bacterii (conform testelor producătorului: E. Coli, Staphylococcus Aureus, H1N1).',
    customerBenefit: 'Aer distribuit mai curat.',
    limitation: 'Rezultatele citate provin din testele producătorului, fără certificare independentă menționată în documentul consultat.',
    applicability: 'series',
    standardOrOptional: 'standard',
    source: SRC_PLIANT_FEATURES,
    displayPosition: 4,
  },
  {
    id: 'self-clean-56c',
    technicalClaim: 'Auto-curățare în 4 pași, la temperatură de până la 56°C',
    publicExplanation: 'Ciclu automat de curățare a evaporatorului.',
    customerBenefit: 'Menține evaporatorul curat și aerul livrat proaspăt, cu mentenanță redusă.',
    applicability: 'series',
    standardOrOptional: 'standard',
    source: SRC_PLIANT_FEATURES,
    displayPosition: 5,
  },
];

const installation: InstallationSpec = {
  liquidPipeDiameter: { status: 'verified', value: { value: 6.35, unit: 'mm', rawText: '6,35 mm (1/4")' }, sources: [SRC_PLIANT] },
  gasPipeDiameter: { status: 'verified', value: { value: 9.52, unit: 'mm', rawText: '9,52 mm (3/8")' }, sources: [SRC_PLIANT] },
  pipeRunRange: { status: 'verified', value: { max: { value: 25, unit: 'm' } }, sources: [SRC_PLIANT] },
  maxLevelDifference: { status: 'verified', value: { value: 10, unit: 'm' }, sources: [SRC_PLIANT] },
  condensateHandling: { status: 'not-published' },
  serviceClearance: { status: 'not-published' },
  requiredAccessories: [],
  optionalAccessories: [],
  includedItems: [],
  excludedItems: [],
  notes: 'Instalarea și manipularea agentului frigorific R32 trebuie realizate exclusiv de personal certificat F-Gas.',
};

const documents: ProductDocument[] = [
  {
    id: 'midea-breezeless-e-pliant-2026',
    title: 'Pliant Midea Breezeless E (2026)',
    type: 'product-sheet',
    url: 'https://midea-romania.ro/wp-content/uploads/2026/04/PLIANT-BREEZELESS-E-2026-LB-ROM.pdf',
    language: 'ro',
    filename: 'PLIANT-BREEZELESS-E-2026-LB-ROM.pdf',
    sha256: SRC_PLIANT.sha256,
    pageCount: 5,
    coveredModels: ['CB1-09HRFN8-I/MX2-09RD6', 'CB1-12HRFN8-I/MX2-12RD6', 'CB1-18HRFN8-I/MX3-18RD1-CB', 'CB1-24HRFN8-I/MX4-24RD1-CB'],
    visibility: 'public',
    source: SRC_PLIANT,
  },
  {
    id: 'midea-breezeless-e-9000-energy-label',
    title: 'Etichetă energetică UE — Breezeless E 9000 BTU',
    type: 'energy-label',
    url: 'https://midea-romania.ro/wp-content/uploads/2026/05/Eticheta-Energetica-9000-btu.png',
    language: 'multi',
    filename: 'Eticheta-Energetica-9000-btu.png',
    sha256: SRC_LABEL.sha256,
    coveredModels: ['CB1-09HRFN8-I/MX2-09RD6'],
    visibility: 'public',
    source: SRC_LABEL,
  },
  {
    id: 'midea-breezeless-e-manual-ro',
    title: 'Manual utilizare și instalare — Midea Breezeless E (RO)',
    type: 'installation-manual',
    url: 'https://midea-romania.ro/wp-content/uploads/2026/05/Manual-Utilizare-Breezeless-E-Romana.pdf',
    language: 'ro',
    filename: 'Manual-Utilizare-Breezeless-E-Romana.pdf',
    sha256: '088f8c97c3bec5fc0735133c96edc8f5a04dca1cbc85548ffa6ecd2a484560b4',
    coveredModels: ['Midea Breezeless E (seria: 9000/12000/18000/24000 BTU)'],
    visibility: 'public',
    source: {
      kind: 'manual',
      label: 'Manual utilizare și instalare Breezeless E (RO)',
      url: 'https://midea-romania.ro/wp-content/uploads/2026/05/Manual-Utilizare-Breezeless-E-Romana.pdf',
      verifiedAt: VERIFIED_AT,
      confidence: 'low',
      internalNote:
        'Fișierul a fost descărcat și hash-uit, dar conținutul nu a putut fi extras/citit cu ' +
        'uneltele disponibile în această sesiune (PDF cu conținut needitabil, lipsă randare ' +
        'pagină). Nu a fost folosit ca sursă pentru nicio valoare tehnică publicată — inclusiv ' +
        'Wi-Fi/MSmartHome la nivel de model, care rămâne nepublicat/neconfirmat.',
    },
  },
];

export const MIDEA_BREEZELESS_E_9000_DETAILS: PhysicalProductDetails = {
  identity,
  performance,
  energyProfiles,
  acoustics,
  temperature,
  airflow,
  electrical,
  refrigerant,
  dimensions,
  features,
  installation,
  documents,
  // GPSR intentionally omitted: no coherent operator/importer/EU-responsible-person data
  // could be confirmed from the documents read this session (see report, section 10 rules).
};
