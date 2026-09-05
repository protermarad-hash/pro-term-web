import type { AiStatus } from '@/lib/ai-media-registry';
import type { SourcedValue, SourceReference, VerificationStatus } from './provenance';
import type { CapacityMeasurement, Measurement, MeasurementRange, OrderedDimension } from './units';

/**
 * Standard EU energy label classes. Kept as a closed union so a validator can catch
 * a typo'd class instead of it silently becoming an unrecognized string in the UI.
 */
export type EnergyClass = 'A+++' | 'A++' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export const ENERGY_CLASSES: readonly EnergyClass[] = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

/** The four EU seasonal-efficiency climate zones (Regulation (EU) No 626/2011 and successors). */
export type ClimateZone = 'cooling' | 'warmer' | 'average' | 'colder';

// 1. Identity
export interface ProductIdentity {
  brand: string;
  series?: string;
  displayName: string;
  indoorUnitCode?: SourcedValue<string>;
  outdoorUnitCode?: SourcedValue<string>;
  setCode?: SourcedValue<string>;
  mpn?: SourcedValue<string>;
  gtin?: SourcedValue<string>;
  eprelId?: SourcedValue<string>;
  /** Free-text variant/capacity descriptor as published, e.g. "9000 BTU". */
  variantLabel?: string;
}

// 2. Performance
export interface PerformanceSpec {
  coolingNominal?: SourcedValue<CapacityMeasurement>;
  coolingMin?: SourcedValue<CapacityMeasurement>;
  coolingMax?: SourcedValue<CapacityMeasurement>;
  heatingNominal?: SourcedValue<CapacityMeasurement>;
  heatingMin?: SourcedValue<CapacityMeasurement>;
  heatingMax?: SourcedValue<CapacityMeasurement>;
  eer?: SourcedValue<number>;
  cop?: SourcedValue<number>;
  seer?: SourcedValue<number>;
  scop?: SourcedValue<number>;
  pDesignCooling?: SourcedValue<Measurement<'kW'>>;
  pDesignHeating?: SourcedValue<Measurement<'kW'>>;
  /** Bivalent temperature: outdoor temp below which the heat pump alone can't cover the load. */
  tBiv?: SourcedValue<Measurement<'°C'>>;
  /** Operating limit temperature. */
  tol?: SourcedValue<Measurement<'°C'>>;
  annualConsumptionCooling?: SourcedValue<Measurement<'kWh/an'>>;
  annualConsumptionHeating?: SourcedValue<Measurement<'kWh/an'>>;
}

// 3. Energy per climate zone
export interface EnergyZoneProfile {
  zone: ClimateZone;
  /** False when the label explicitly marks this zone as not evaluated/not applicable. */
  applicable: boolean;
  pDesign?: SourcedValue<Measurement<'kW'>>;
  /** SEER for the cooling zone read, SCOP for heating zones — the field name stays generic. */
  seasonalEfficiency?: SourcedValue<number>;
  energyClass?: SourcedValue<EnergyClass>;
  annualConsumption?: SourcedValue<Measurement<'kWh/an'>>;
  /**
   * Bivalent/operating-limit temperature for THIS zone specifically. Heat pumps commonly
   * publish different Tbiv/Tol per climate zone (e.g. average vs warmer) — distinct from
   * the single overall figures on `PerformanceSpec`, which some simpler products still use.
   */
  tBiv?: SourcedValue<Measurement<'°C'>>;
  tol?: SourcedValue<Measurement<'°C'>>;
}

// 4. Acoustics
export type AcousticUnitScope = 'indoor' | 'outdoor';

export interface AcousticStepReading {
  value: Measurement<'dB(A)'>;
  /** Fan-speed step this reading was taken at, e.g. "turbo", "silent". */
  step?: string;
}

export interface AcousticMeasurementSet {
  min?: AcousticStepReading;
  max?: AcousticStepReading;
  steps?: AcousticStepReading[];
  measurementConditions?: string;
}

export interface AcousticProfile {
  soundPressure?: Partial<Record<AcousticUnitScope, SourcedValue<AcousticMeasurementSet>>>;
  soundPower?: Partial<Record<AcousticUnitScope, SourcedValue<AcousticMeasurementSet>>>;
}

// 5. Temperature operating range
export interface TemperatureProfile {
  indoorCooling?: SourcedValue<MeasurementRange<'°C'>>;
  indoorHeating?: SourcedValue<MeasurementRange<'°C'>>;
  outdoorCooling?: SourcedValue<MeasurementRange<'°C'>>;
  outdoorHeating?: SourcedValue<MeasurementRange<'°C'>>;
}

// 6. Air
export interface AirflowSpec {
  indoorFlow?: SourcedValue<MeasurementRange<'m³/h'>>;
  outdoorFlow?: SourcedValue<MeasurementRange<'m³/h'>>;
  fanSteps?: SourcedValue<number>;
  dehumidification?: SourcedValue<Measurement<'l/h'>>;
}

// 7. Electric
export interface ElectricalSpec {
  voltageRange?: SourcedValue<MeasurementRange<'V'>>;
  phases?: SourcedValue<1 | 3>;
  frequency?: SourcedValue<Measurement<'Hz'>>;
  ratedCurrent?: SourcedValue<Measurement<'A'>>;
  currentRange?: SourcedValue<MeasurementRange<'A'>>;
  maxCurrent?: SourcedValue<Measurement<'A'>>;
  inputPower?: SourcedValue<Measurement<'W'> | Measurement<'kW'>>;
  maxPower?: SourcedValue<Measurement<'W'> | Measurement<'kW'>>;
  recommendedBreaker?: SourcedValue<string>;
  recommendedCable?: SourcedValue<string>;
  powerSupplyPoint?: SourcedValue<'indoor' | 'outdoor'>;
}

// 8. Refrigerant / F-Gas
export interface RefrigerantSpec {
  refrigerantType?: SourcedValue<string>;
  gwp?: SourcedValue<number>;
  factoryCharge?: SourcedValue<Measurement<'kg'>>;
  co2Equivalent?: SourcedValue<Measurement<'kg CO₂e'>>;
  additionalChargePerMeter?: SourcedValue<Measurement<'kg'>>;
  prechargedPipeLength?: SourcedValue<Measurement<'m'>>;
  pipeRunRange?: SourcedValue<MeasurementRange<'m'>>;
  maxLevelDifference?: SourcedValue<Measurement<'m'>>;
  liquidPipeDiameter?: SourcedValue<Measurement<'mm'>>;
  gasPipeDiameter?: SourcedValue<Measurement<'mm'>>;
  /** Always true for F-Gas refrigerants — kept explicit rather than assumed by the UI. */
  requiresCertifiedInstaller: boolean;
}

// 9. Dimensions
export interface UnitDimensions {
  dimensions?: SourcedValue<OrderedDimension>;
  netWeight?: SourcedValue<Measurement<'kg'>>;
  grossWeight?: SourcedValue<Measurement<'kg'>>;
  packageDimensions?: SourcedValue<OrderedDimension>;
}

export interface DimensionsSpec {
  indoorUnit?: UnitDimensions;
  outdoorUnit?: UnitDimensions;
}

// 10. Functions & benefits
export interface FeatureClaim {
  id: string;
  /** What the manufacturer technically claims, as published. */
  technicalClaim: string;
  /** Plain-language explanation of what that claim means. */
  publicExplanation: string;
  /** Why it matters to the customer — kept distinct so it can be rewritten independently. */
  customerBenefit: string;
  limitation?: string;
  applicability: 'model' | 'series' | 'brand-wide';
  standardOrOptional: 'standard' | 'optional';
  source: SourceReference;
  /** Lower renders first; omit to let the UI decide. */
  displayPosition?: number;
}

// 11. Installation
export interface InstallationSpec {
  liquidPipeDiameter?: SourcedValue<Measurement<'mm'>>;
  gasPipeDiameter?: SourcedValue<Measurement<'mm'>>;
  pipeRunRange?: SourcedValue<MeasurementRange<'m'>>;
  maxLevelDifference?: SourcedValue<Measurement<'m'>>;
  condensateHandling?: SourcedValue<string>;
  serviceClearance?: SourcedValue<string>;
  requiredAccessories: string[];
  optionalAccessories: string[];
  includedItems: string[];
  excludedItems: string[];
  notes?: string;
}

// 12. Images
export type ImageRole = 'primary' | 'gallery' | 'lifestyle' | 'diagram' | 'promotional';
export type ModelDepictionAccuracy = 'exact-model' | 'exact-series' | 'generic-illustration';

export interface ProductImageAsset {
  id: string;
  internalUrl: string;
  sourceUrl?: string;
  filename: string;
  role: ImageRole;
  altText: string;
  width?: number;
  height?: number;
  format?: string;
  sha256?: string;
  depictsExactModel: ModelDepictionAccuracy;
  provenance: SourceReference;
  usageRights: string;
  /** Mirrors `AiStatus` from the AI media registry — this type only references it, never redefines it. */
  aiStatus: AiStatus;
  /** Id into AI_MEDIA_REGISTRY, when a registry entry documents this exact asset. */
  aiMediaRegistryId?: string;
  galleryOrder?: number;
  isPrimary: boolean;
  promotionalCopy?: string;
  verificationStatus: VerificationStatus;
}

// 13. Documents
export type DocumentType =
  | 'energy-label'
  | 'user-manual'
  | 'installation-manual'
  | 'product-sheet'
  | 'declaration-of-conformity'
  | 'eprel-record'
  | 'other';

export interface ProductDocument {
  id: string;
  title: string;
  type: DocumentType;
  url: string;
  language: string;
  filename?: string;
  sha256?: string;
  version?: string;
  publishedAt?: string;
  pageCount?: number;
  coveredModels: string[];
  visibility: 'public' | 'internal';
  source: SourceReference;
}

// 14. GPSR & safety
export type GpsrRole = 'manufacturer' | 'economic-operator' | 'eu-responsible-person';

export interface GpsrContact {
  role: GpsrRole;
  name?: SourcedValue<string>;
  postalAddress?: SourcedValue<string>;
  email?: SourcedValue<string>;
}

export interface GpsrInfo {
  manufacturer?: GpsrContact;
  economicOperator?: GpsrContact;
  /**
   * Never auto-populate this from `economicOperator` or `importer` data — the EU
   * responsible person is a distinct legal role and must be independently sourced.
   */
  euResponsiblePerson?: GpsrContact;
  warnings: SourcedValue<string>[];
  warningLanguage?: string;
  safetyManual?: SourcedValue<string>;
  modelBatchSerial?: SourcedValue<string>;
  source?: SourceReference;
}

// Commercial data (section 15) is intentionally NOT modeled here. It already lives on
// `Product` (price, stockStatus, stockQty, smartbillCode, ...) and must stay separate
// from manufacturer-sourced technical content — see products.ts.

// 16. Services — a distinct schema; never coerce a service into PhysicalProductDetails.
export interface ServiceDetails {
  serviceType: string;
  domain: string;
  baseRate?: SourcedValue<number>;
  rateUnit?: string;
  conditions: string[];
  includes: string[];
  excludes: string[];
  limitations: string[];
  geographicArea: string[];
  schedulingNote?: string;
  requiresOnSiteAssessment: boolean;
  commercialSource: SourceReference;
}

export interface PhysicalProductDetails {
  identity?: ProductIdentity;
  performance?: PerformanceSpec;
  energyProfiles?: EnergyZoneProfile[];
  acoustics?: AcousticProfile;
  temperature?: TemperatureProfile;
  airflow?: AirflowSpec;
  electrical?: ElectricalSpec;
  refrigerant?: RefrigerantSpec;
  dimensions?: DimensionsSpec;
  features?: FeatureClaim[];
  installation?: InstallationSpec;
  images?: ProductImageAsset[];
  documents?: ProductDocument[];
  gpsr?: GpsrInfo;
}

/**
 * Additive, optional extension point on `Product` (see `Product.details`). Never
 * required, never auto-populated from legacy `specs`/`features`/`description`.
 */
export type ProductDetails =
  | { kind: 'physical'; physical: PhysicalProductDetails }
  | { kind: 'service'; service: ServiceDetails };
