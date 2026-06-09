'use client';

import { useRef, useState } from 'react';
import MultisplitPackageCard from '@/components/MultisplitPackageCard';
import MultisplitConfigurator from '@/components/MultisplitConfigurator';
import type { Product } from '@/lib/products';

interface Props {
  packages: Product[];
  units: Product[];
}

function groupByRooms(packages: Product[]): Map<number, Product[]> {
  const map = new Map<number, Product[]>();
  for (const pkg of packages) {
    const spec = pkg.specs.find((s) => s.label === 'camere')?.value;
    const n = spec ? Number(spec) : 0;
    if (!map.has(n)) map.set(n, []);
    map.get(n)!.push(pkg);
  }
  return map;
}

const ROOM_BADGE: Record<number, string> = {
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-emerald-100 text-emerald-700',
  4: 'bg-purple-100 text-purple-700',
  5: 'bg-orange-100 text-orange-700',
};

export default function MultisplitClientSection({ packages, units }: Props) {
  const configuratorRef = useRef<HTMLDivElement>(null);
  const [preloadNumRooms, setPreloadNumRooms] = useState<number | undefined>(undefined);

  function handlePersonalize(pkg: Product) {
    const spec = pkg.specs.find((s) => s.label === 'camere')?.value;
    const n = spec ? Number(spec) : 2;
    setPreloadNumRooms(n);
    setTimeout(() => {
      configuratorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  const groups = groupByRooms(packages);
  const sortedKeys = Array.from(groups.keys()).sort((a, b) => a - b);

  const uiProducts = units.filter((u) => !u.slug.includes('-ue-'));
  const ueProducts = units.filter((u) => u.slug.includes('-ue-'));

  return (
    <>
      {/* ═══ SECȚIUNEA 1 — Pachete preconfigurate ═══ */}
      <section className="mb-16">
        <h2 className="mb-2 font-heading text-2xl font-bold text-dark">
          Pachete preconfigurate
        </h2>
        <p className="mb-8 text-dark-300">
          Soluții gata configurate, optimizate pentru confort și eficiență energetică.
        </p>

        {sortedKeys.map((n) => (
          <div key={n} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${ROOM_BADGE[n] ?? 'bg-slate-100 text-slate-700'}`}>
                {n} camere
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(groups.get(n) ?? []).map((pkg) => (
                <MultisplitPackageCard
                  key={pkg.id}
                  product={pkg}
                  onPersonalize={handlePersonalize}
                />
              ))}
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <p className="rounded-xl bg-white p-6 text-center text-dark-300">
            Nu există pachete disponibile momentan.
          </p>
        )}
      </section>

      {/* ═══ SECȚIUNEA 2 — Configurator ═══ */}
      <section ref={configuratorRef} id="configurator" className="mb-12 scroll-mt-28">
        <h2 className="mb-2 font-heading text-2xl font-bold text-dark">
          Configurator personalizat
        </h2>
        <p className="mb-8 text-dark-300">
          Configurează sistemul exact pe nevoile tale — alege suprafețele și tipul de unități pentru fiecare cameră.
        </p>
        <MultisplitConfigurator
          key={preloadNumRooms}
          preloadedNumRooms={preloadNumRooms}
          uiProducts={uiProducts}
          ueProducts={ueProducts}
        />
      </section>
    </>
  );
}
