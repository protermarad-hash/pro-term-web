import type { DbProductGuaranteeRow } from '@/lib/consumer-guarantee';
import type { Product } from '@/lib/products';

// Test-only data. "Producător Test" / "MODEL-X1" are placeholders and do not
// describe any real manufacturer guarantee.

export const eligibleRow: DbProductGuaranteeRow = {
  durability_guarantee_eligible: true,
  durability_guarantee_years: 5,
  manufacturer_name: 'Producător Test',
  manufacturer_model_identifier: 'MODEL-X1',
};

export const normalCommercialWarrantyRow: DbProductGuaranteeRow = {
  durability_guarantee_eligible: false,
  durability_guarantee_years: null,
  manufacturer_name: 'Producător Test',
  manufacturer_model_identifier: 'MODEL-X1',
  commercial_warranty_terms: '5 ani garanție comercială, cu condiția montajului autorizat (exemplu de test).',
  commercial_warranty_conditions_url: 'https://example.ro/conditii-garantie.pdf',
};

export const testProduct: Product = {
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'produs-test',
  name: 'Aer condiționat test 12000 BTU',
  brand: 'Generic',
  category: 'aer-conditionat',
  btu: 12000,
  price: 2500,
  rating: 4.7,
  reviews: 0,
  energyClass: 'A++',
  description: 'Descriere de test.',
  features: [],
  specs: [],
  stockStatus: 'in_stock',
};
