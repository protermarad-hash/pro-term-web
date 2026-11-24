// Official public Vaillant documents per series (vaillant.com.ro, extracted 24.11.2026
// from the series pages' document metadata). Each entry keeps its source page.

export type VaillantDocumentType = 'brosura' | 'fisa-erp' | 'eticheta-erp' | 'instalare' | 'utilizare-instalare';

export interface VaillantDocument {
  type: VaillantDocumentType;
  title: string;
  models: string;
  url: string;
}

export interface SeriesDocuments {
  sourcePage: string;
  documents: readonly VaillantDocument[];
}

export const DOCUMENT_TYPE_LABEL: Record<VaillantDocumentType, string> = {
  brosura: 'Broșură',
  'fisa-erp': 'Fișă tehnică ErP',
  'eticheta-erp': 'Etichetă energetică ErP',
  instalare: 'Instrucțiuni de instalare',
  'utilizare-instalare': 'Instrucțiuni de utilizare și instalare',
};

const BLOB = 'https://waaminioprodfc9546ee.blob.core.windows.net/b2c-products';

export const VAILLANT_SERIES_DOCUMENTS: Record<string, SeriesDocuments> = {
  'arotherm-pro': {
    sourcePage: 'https://www.vaillant.com.ro/produse/arothermpro/',
    documents: [
      { type: 'brosura', title: 'Broșură aroTHERM pro (RO)', models: 'VWL 55/7.1 A 230V S3, VWL 85/7.1 A 230V S3, VWL 125/7.1 A S3, VWL 155/7.1 A S3', url: `${BLOB}/Vaillant_aroTHERM_PRO_brosura_RO_mar26_1519763.pdf` },
      { type: 'fisa-erp', title: 'Fișă tehnică ErP aroTHERM pro', models: 'VWL 55/7.1 A 230V S3, VWL 85/7.1 A 230V S3, VWL 125/7.1 A 230V S3, VWL 155/7.1 A 230V S3, VWL 125/7.1 A S3, VWL 155/7.1 A S3', url: `${BLOB}/8000044666_01_794695.pdf` },
      { type: 'eticheta-erp', title: 'Etichetă energetică ErP', models: 'VWL 125/7.1 A S3', url: `${BLOB}/8000044559_00_763871.pdf` },
      { type: 'instalare', title: 'Instrucțiuni de instalare aroTHERM pro', models: 'VWL 55/7.1 A 230V S3, VWL 85/7.1 A 230V S3, VWL 125/7.1 A 230V S3, VWL 155/7.1 A 230V S3, VWL 125/7.1 A S3', url: `${BLOB}/8000026891_02_1501551.pdf` },
    ],
  },
  'arotherm-plus': {
    sourcePage: 'https://www.vaillant.com.ro/produse/arothermplus/',
    documents: [
      { type: 'brosura', title: 'Broșură aroTHERM plus (RO)', models: 'VWL 55/8.1 A 230V, VWL 75/8.1 A 230V, VWL 105/8.1 A 400V, VWL 125/8.1 A 400V', url: `${BLOB}/Vaillant_aroTHERM-plus_brosura_RO_mar26_1519764.pdf` },
      { type: 'fisa-erp', title: 'Fișă tehnică ErP aroTHERM plus', models: 'VWL 55/8.1 A 230V, VWL 75/8.1 A 230V, VWL 105/8.1 A 400V, VWL 125/8.1 A 400V', url: `${BLOB}/8000049208_01_782705.pdf` },
      { type: 'eticheta-erp', title: 'Etichetă energetică ErP', models: 'VWL 55/8.1 A 230V', url: `${BLOB}/8000035168_02_786883.pdf` },
      { type: 'eticheta-erp', title: 'Etichetă energetică ErP', models: 'VWL 75/8.1 A 230V', url: `${BLOB}/8000035169_02_786893.pdf` },
      { type: 'eticheta-erp', title: 'Etichetă energetică ErP', models: 'VWL 125/8.1 A 400V', url: `${BLOB}/8000035181_02_786914.pdf` },
      { type: 'instalare', title: 'Instrucțiuni de instalare', models: 'VWL 55/8.1 A 230V, VWL 75/8.1 A 230V', url: `${BLOB}/8000050751_01_1521978.pdf` },
      { type: 'instalare', title: 'Instrucțiuni de instalare', models: 'VWL 105/8.1 A 400V, VWL 125/8.1 A 400V', url: `${BLOB}/8000050744_01_1521900.pdf` },
    ],
  },
  'arotherm-split-plus': {
    sourcePage: 'https://www.vaillant.com.ro/produse/arotherm-split-plus/',
    documents: [
      { type: 'utilizare-instalare', title: 'Instrucțiuni de utilizare și instalare aroTHERM Split plus', models: 'VWL 55/8.2 AS 230V, VWL 75/8.2 AS 230V', url: `${BLOB}/8000015894_03_1411793.pdf` },
    ],
  },
};
