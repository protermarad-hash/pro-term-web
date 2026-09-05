/**
 * Controlled units for technical values, so specs stop living as free-form strings.
 * Every measurement keeps the original published text alongside the parsed number,
 * because the source text (e.g. "8871 BTU/h / 2,6 kW") is often what should be shown.
 */

export type UnitSymbol =
  | 'kW'
  | 'W'
  | 'BTU/h'
  | 'A'
  | 'V'
  | 'Hz'
  | 'dB(A)'
  | 'm³/h'
  | 'l/h'
  | 'mm'
  | 'm'
  | 'kg'
  | 'kg CO₂e'
  | '°C'
  | 'kWh/an';

export const UNIT_SYMBOLS: readonly UnitSymbol[] = [
  'kW',
  'W',
  'BTU/h',
  'A',
  'V',
  'Hz',
  'dB(A)',
  'm³/h',
  'l/h',
  'mm',
  'm',
  'kg',
  'kg CO₂e',
  '°C',
  'kWh/an',
];

export interface Measurement<U extends UnitSymbol = UnitSymbol> {
  value: number;
  unit: U;
  /** Original published text, kept only when it differs from `${value} ${unit}`. */
  rawText?: string;
}

export interface MeasurementRange<U extends UnitSymbol = UnitSymbol> {
  min?: Measurement<U>;
  nominal?: Measurement<U>;
  max?: Measurement<U>;
}

/** Cooling/heating capacity is routinely published in both BTU/h and kW — never only one. */
export interface CapacityMeasurement {
  btu?: Measurement<'BTU/h'>;
  kw?: Measurement<'kW'>;
}

export type DimensionAxis = 'width' | 'height' | 'depth';

export interface OrderedDimension {
  width: Measurement<'mm'>;
  height: Measurement<'mm'>;
  depth: Measurement<'mm'>;
  /** Axis order exactly as published (e.g. manufacturers often list H×W×D, not W×H×D). */
  originalOrder?: readonly [DimensionAxis, DimensionAxis, DimensionAxis];
}
