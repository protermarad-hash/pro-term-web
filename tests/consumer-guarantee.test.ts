import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY_GUARANTEE_INFO,
  buildGuaranteePayload,
  formatGuaranteeYears,
  getDurabilityLabel,
  getProductInfoEntries,
  isValidDurabilityYears,
  parseProductGuaranteeInfo,
} from '@/lib/consumer-guarantee';
import { eligibleRow, normalCommercialWarrantyRow } from './support/fixtures';

describe('EU GARAN label eligibility', () => {
  it('is never shown by default (no row, empty row, legacy row without the new columns)', () => {
    assert.equal(getDurabilityLabel(EMPTY_GUARANTEE_INFO), null);
    assert.equal(getDurabilityLabel(parseProductGuaranteeInfo(null)), null);
    assert.equal(getDurabilityLabel(parseProductGuaranteeInfo({})), null);
  });

  it('is shown only for an explicitly eligible product with complete producer data', () => {
    const label = getDurabilityLabel(parseProductGuaranteeInfo(eligibleRow));
    assert.deepEqual(label, {
      years: 5,
      yearsLabel: '5',
      manufacturerName: 'Producător Test',
      modelIdentifier: 'MODEL-X1',
    });
  });

  it('a normal commercial warranty (e.g. 5 years with conditions) does not get the label automatically', () => {
    const info = parseProductGuaranteeInfo(normalCommercialWarrantyRow);
    assert.equal(info.durabilityGuaranteeEligible, false);
    assert.equal(getDurabilityLabel(info), null);
  });

  it('requires eligible === true, not a truthy value', () => {
    const info = parseProductGuaranteeInfo({ ...eligibleRow, durability_guarantee_eligible: 'true' as unknown as boolean });
    assert.equal(getDurabilityLabel(info), null);
  });

  it('is refused when producer, model or a valid duration is missing', () => {
    for (const override of [
      { manufacturer_name: null },
      { manufacturer_name: '   ' },
      { manufacturer_model_identifier: null },
      { durability_guarantee_years: null },
      { durability_guarantee_years: 2 },
      { durability_guarantee_years: 1.5 },
      { durability_guarantee_years: 4.2 },
      { durability_guarantee_years: 12.5 }, // "12,5" does not fit before the calendar symbol
    ]) {
      assert.equal(getDurabilityLabel(parseProductGuaranteeInfo({ ...eligibleRow, ...override })), null, JSON.stringify(override));
    }
  });

  it('accepts half years and formats them with a comma', () => {
    assert.equal(isValidDurabilityYears(2.5), true);
    assert.equal(formatGuaranteeYears(2.5), '2,5');
    assert.equal(formatGuaranteeYears(10), '10');
    assert.equal(getDurabilityLabel(parseProductGuaranteeInfo({ ...eligibleRow, durability_guarantee_years: '2.5' }))?.yearsLabel, '2,5');
  });
});

describe('product information entries', () => {
  it('skips empty and whitespace-only fields', () => {
    const entries = getProductInfoEntries(
      parseProductGuaranteeInfo({ after_sales_service_info: '  ', spare_parts_info: '', repair_info: null }),
    );
    assert.deepEqual(entries, []);
  });

  it('lists only the filled fields, in a stable order', () => {
    const entries = getProductInfoEntries(
      parseProductGuaranteeInfo({ repair_info: 'Manual de service la cerere', after_sales_service_info: 'Service PRO TERM' }),
    );
    assert.deepEqual(entries.map((entry) => entry.key), ['afterSales', 'repair']);
  });

  it('drops non-https condition links instead of rendering them', () => {
    const info = parseProductGuaranteeInfo({ commercial_warranty_terms: 'Conform certificatului', commercial_warranty_conditions_url: 'javascript:alert(1)' });
    assert.equal(info.commercialWarrantyConditionsUrl, undefined);
    assert.equal(getProductInfoEntries(info)[0].url, undefined);
  });
});

describe('admin input validation', () => {
  const complete = {
    durabilityGuaranteeEligible: true,
    durabilityGuaranteeYears: '5',
    manufacturerName: 'Producător Test',
    manufacturerModelIdentifier: 'MODEL-X1',
    durabilityGuaranteeSource: 'Declarația producătorului din 01.10.2026',
  };

  it('defaults to not eligible and stores empty fields as null', () => {
    const result = buildGuaranteePayload({});
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.payload.durability_guarantee_eligible, false);
      assert.equal(result.payload.manufacturer_name, null);
      assert.equal(result.payload.after_sales_service_info, null);
    }
  });

  it('accepts a complete eligible product', () => {
    const result = buildGuaranteePayload(complete);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.payload.durability_guarantee_years, 5);
  });

  it('rejects enabling the label without producer data or producer source', () => {
    for (const missing of ['manufacturerName', 'manufacturerModelIdentifier', 'durabilityGuaranteeSource', 'durabilityGuaranteeYears']) {
      const result = buildGuaranteePayload({ ...complete, [missing]: '' });
      assert.equal(result.ok, false, missing);
    }
  });

  it('rejects a duration of 2 years or less and non half-year values', () => {
    for (const years of ['2', '1', '3,3', 'abc']) {
      assert.equal(buildGuaranteePayload({ ...complete, durabilityGuaranteeYears: years }).ok, false, years);
    }
    assert.equal(buildGuaranteePayload({ ...complete, durabilityGuaranteeYears: '2,5' }).ok, true);
  });

  it('rejects producer + model texts that would overlap on the label', () => {
    const result = buildGuaranteePayload({
      ...complete,
      manufacturerName: 'Producător Cu Nume Foarte Lung',
      manufacturerModelIdentifier: 'MODEL-1234567890',
    });
    assert.equal(result.ok, false);
  });

  it('rejects non-https condition links', () => {
    assert.equal(buildGuaranteePayload({ commercialWarrantyConditionsUrl: 'http://example.ro/garantie' }).ok, false);
  });
});
