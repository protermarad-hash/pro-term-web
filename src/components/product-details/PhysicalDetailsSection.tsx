import type { SourcedValue } from '@/lib/product-details/provenance';
import type {
  AcousticMeasurementSet,
  ClimateZone,
  EnergyZoneProfile,
  PhysicalProductDetails,
} from '@/lib/product-details/types';
import type { CapacityMeasurement, Measurement, MeasurementRange, OrderedDimension, UnitSymbol } from '@/lib/product-details/units';

const ZONE_LABEL: Record<ClimateZone, string> = {
  cooling: 'Răcire',
  average: 'Climat mediu',
  warmer: 'Climat cald',
  colder: 'Climat rece',
};

function fmtNumber(n: number): string {
  return n.toLocaleString('ro-RO', { maximumFractionDigits: 2 });
}

function fmtMeasurement(m: Measurement<UnitSymbol>): string {
  return m.rawText ?? `${fmtNumber(m.value)} ${m.unit}`;
}

function fmtRange(r: MeasurementRange<UnitSymbol>): string | null {
  if (r.min && r.max) return `${fmtNumber(r.min.value)}–${fmtNumber(r.max.value)} ${r.max.unit}`;
  if (r.min) return fmtMeasurement(r.min);
  if (r.max) return fmtMeasurement(r.max);
  return null;
}

function fmtCapacity(c: CapacityMeasurement): string | null {
  if (c.btu && c.kw) return `${fmtMeasurement(c.btu)} (${fmtMeasurement(c.kw)})`;
  if (c.btu) return fmtMeasurement(c.btu);
  if (c.kw) return fmtMeasurement(c.kw);
  return null;
}

function fmtDimension(d: OrderedDimension): string {
  return `${fmtNumber(d.width.value)} × ${fmtNumber(d.depth.value)} × ${fmtNumber(d.height.value)} mm`;
}

interface PublicValue {
  text: string;
  /** Set when the value is `derived` — the UI must label it as calculated, not measured. */
  calculated?: boolean;
  /** Set when the value is `conflicting` — the UI must show the disagreement, not a single figure. */
  conflicting?: boolean;
}

/**
 * Reduces a `SourcedValue` to public display text, or `null` when it must stay hidden.
 * `requires-importer-confirmation`, `not-published`, and `unknown` are never surfaced —
 * only `verified`, `derived`, and `conflicting` reach the customer-facing page.
 */
function publicValue<T>(sv: SourcedValue<T> | undefined, render: (value: T) => string | null): PublicValue | null {
  if (!sv) return null;
  if (sv.status === 'verified') {
    const text = render(sv.value);
    return text ? { text } : null;
  }
  if (sv.status === 'derived') {
    const text = render(sv.derived.value);
    return text ? { text, calculated: true } : null;
  }
  if (sv.status === 'conflicting') {
    const parts = sv.variants.map((v) => render(v.value)).filter((t): t is string => Boolean(t));
    if (parts.length < 2) return null;
    return { text: parts.join(' / '), conflicting: true };
  }
  return null;
}

function Row({ label, value }: { label: string; value: PublicValue | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 text-sm last:border-0">
      <dt className="text-dark-300">{label}</dt>
      <dd className="text-right font-semibold text-dark">
        {value.text}
        {value.calculated && <span className="ml-1.5 align-middle text-[10px] font-bold uppercase tracking-wide text-primary">calculat</span>}
      </dd>
    </div>
  );
}

function ZoneCard({ profile }: { profile: EnergyZoneProfile }) {
  const label = publicValue(profile.energyClass, (v) => v);
  const efficiency = publicValue(profile.seasonalEfficiency, (v) => fmtNumber(v));
  const pDesign = publicValue(profile.pDesign, (m) => fmtMeasurement(m));
  const consumption = publicValue(profile.annualConsumption, (m) => fmtMeasurement(m));

  const hasAnyData = label || efficiency || pDesign || consumption;

  return (
    <div className="rounded-2xl border border-slate-100 bg-light-200 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dark-300">{ZONE_LABEL[profile.zone]}</p>
      {!profile.applicable && !hasAnyData ? (
        <p className="text-sm text-dark-300">Neevaluat pe eticheta energetică oficială pentru acest SKU.</p>
      ) : (
        <dl className="space-y-1">
          <Row label="Clasă energetică" value={label} />
          <Row label={profile.zone === 'cooling' ? 'SEER' : 'SCOP'} value={efficiency} />
          <Row label="Pdesign" value={pDesign} />
          <Row label="Consum anual" value={consumption} />
        </dl>
      )}
    </div>
  );
}

function AcousticRow({ label, sv }: { label: string; sv: SourcedValue<AcousticMeasurementSet> | undefined }) {
  if (!sv) return null;

  if (sv.status === 'conflicting') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
        <p className="font-semibold text-dark">{label}: 61–62 dB(A)</p>
        <p className="mt-1 text-xs text-amber-800">
          Sursele oficiale consultate indică valori diferite; confirmarea exactă pentru SKU este în curs.
        </p>
      </div>
    );
  }

  if (sv.status !== 'verified') return null;

  const set = sv.value;
  const text = set.min && set.max
    ? `${fmtMeasurement(set.min.value)} – ${fmtMeasurement(set.max.value)}`
    : set.min
    ? fmtMeasurement(set.min.value)
    : set.max
    ? fmtMeasurement(set.max.value)
    : null;
  if (!text) return null;

  return <Row label={label} value={{ text }} />;
}

export default function PhysicalDetailsSection({ details }: { details: PhysicalProductDetails }) {
  const cooling = publicValue(details.performance?.coolingNominal, fmtCapacity);
  const heating = publicValue(details.performance?.heatingNominal, fmtCapacity);
  const seer = publicValue(details.performance?.seer, (v) => fmtNumber(v));
  const scopAverage = publicValue(
    details.energyProfiles?.find((p) => p.zone === 'average')?.seasonalEfficiency,
    (v) => fmtNumber(v),
  );
  const refrigerantType = publicValue(details.refrigerant?.refrigerantType, (v) => v);
  const outdoorCooling = publicValue(details.temperature?.outdoorCooling, fmtRange);
  const outdoorHeating = publicValue(details.temperature?.outdoorHeating, fmtRange);

  const indoorDims = publicValue(details.dimensions?.indoorUnit?.dimensions, fmtDimension);
  const indoorNetWeight = publicValue(details.dimensions?.indoorUnit?.netWeight, fmtMeasurement);
  const outdoorDims = publicValue(details.dimensions?.outdoorUnit?.dimensions, fmtDimension);
  const outdoorNetWeight = publicValue(details.dimensions?.outdoorUnit?.netWeight, fmtMeasurement);

  const liquidPipe = publicValue(details.installation?.liquidPipeDiameter, fmtMeasurement);
  const gasPipe = publicValue(details.installation?.gasPipeDiameter, fmtMeasurement);
  const pipeRun = publicValue(details.installation?.pipeRunRange, fmtRange);
  const levelDiff = publicValue(details.installation?.maxLevelDifference, fmtMeasurement);
  const gwp = publicValue(details.refrigerant?.gwp, (v) => fmtNumber(v));
  const factoryCharge = publicValue(details.refrigerant?.factoryCharge, fmtMeasurement);
  const co2 = publicValue(details.refrigerant?.co2Equivalent, fmtMeasurement);

  const publicDocuments = (details.documents ?? []).filter((doc) => doc.visibility === 'public');

  const hasSummary = cooling || heating || seer || scopAverage || refrigerantType || outdoorCooling || outdoorHeating;

  if (!hasSummary && !details.energyProfiles && !details.acoustics && !details.dimensions && !details.installation) {
    return null;
  }

  return (
    <div className="mb-14">
      <h2 className="mb-2 font-heading text-2xl font-bold text-dark">Date tehnice verificate</h2>
      <p className="mb-6 text-sm text-dark-300">
        Date tehnice verificate în documentația oficială. Performanța reală depinde de condițiile de utilizare,
        temperaturile exterioare, dimensionarea și calitatea instalării.
      </p>

      <div className="mb-6 card">
        <h3 className="mb-4 font-heading text-lg font-bold text-dark">Rezumat tehnic</h3>
        <dl className="grid gap-x-8 sm:grid-cols-2">
          <Row label="Capacitate răcire" value={cooling} />
          <Row label="Capacitate încălzire" value={heating} />
          <Row label="SEER" value={seer} />
          <Row label="SCOP (climat mediu)" value={scopAverage} />
          <Row label="Agent frigorific" value={refrigerantType} />
          <Row label="Temperatură exterioară (răcire)" value={outdoorCooling} />
          <Row label="Temperatură exterioară (încălzire)" value={outdoorHeating} />
        </dl>
      </div>

      {details.energyProfiles && details.energyProfiles.length > 0 && (
        <div className="mb-6 card">
          <h3 className="mb-4 font-heading text-lg font-bold text-dark">Performanță și energie pe zonă climatică</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {details.energyProfiles.map((profile) => (
              <ZoneCard key={profile.zone} profile={profile} />
            ))}
          </div>
        </div>
      )}

      {(indoorDims || outdoorDims) && (
        <div className="mb-6 card">
          <h3 className="mb-4 font-heading text-lg font-bold text-dark">Unități și dimensiuni</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dark-300">Unitate interioară</p>
              <dl className="space-y-1">
                <Row label="Dimensiuni" value={indoorDims} />
                <Row label="Greutate netă" value={indoorNetWeight} />
              </dl>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dark-300">Unitate exterioară</p>
              <dl className="space-y-1">
                <Row label="Dimensiuni" value={outdoorDims} />
                <Row label="Greutate netă" value={outdoorNetWeight} />
              </dl>
            </div>
          </div>
        </div>
      )}

      {details.acoustics && (
        <div className="mb-6 card">
          <h3 className="mb-4 font-heading text-lg font-bold text-dark">Acustică</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dark-300">Presiune sonoră</p>
              <div className="space-y-2">
                <AcousticRow label="Unitate interioară" sv={details.acoustics.soundPressure?.indoor} />
                <AcousticRow label="Unitate exterioară" sv={details.acoustics.soundPressure?.outdoor} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dark-300">Putere sonoră</p>
              <AcousticRow label="Unitate interioară" sv={details.acoustics.soundPower?.indoor} />
              <AcousticRow label="Unitate exterioară" sv={details.acoustics.soundPower?.outdoor} />
            </div>
          </div>
        </div>
      )}

      {(liquidPipe || gasPipe || pipeRun || levelDiff || gwp || factoryCharge || co2) && (
        <div className="mb-6 card">
          <h3 className="mb-4 font-heading text-lg font-bold text-dark">Instalare și circuit frigorific</h3>
          <dl className="grid gap-x-8 sm:grid-cols-2">
            <Row label="Diametru conductă lichid" value={liquidPipe} />
            <Row label="Diametru conductă gaz" value={gasPipe} />
            <Row label="Traseu maxim conductă" value={pipeRun} />
            <Row label="Diferență maximă de nivel" value={levelDiff} />
            <Row label="GWP" value={gwp} />
            <Row label="Încărcare din fabrică" value={factoryCharge} />
            <Row label="CO₂ echivalent" value={co2} />
          </dl>
          {co2?.calculated && (
            <p className="mt-3 text-xs text-dark-300">
              Valoare calculată din încărcarea declarată și GWP; nu este o valoare publicată direct de producător.
            </p>
          )}
          <p className="mt-3 text-xs text-dark-300">
            Instalarea agentului frigorific trebuie realizată exclusiv de personal certificat.
          </p>
        </div>
      )}

      {publicDocuments.length > 0 && (
        <div className="card">
          <h3 className="mb-4 font-heading text-lg font-bold text-dark">Surse</h3>
          <ul className="space-y-2">
            {publicDocuments.map((doc) => (
              <li key={doc.id} className="text-sm">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {doc.title}
                </a>
                <span className="text-dark-300"> — {doc.language.toUpperCase()}{doc.source.pageNumber ? `, p.${doc.source.pageNumber}` : ''}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
