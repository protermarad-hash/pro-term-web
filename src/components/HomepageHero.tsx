import Link from 'next/link';
import { ArrowRight, Wallet, Truck, Wrench, ShieldCheck } from 'lucide-react';

const advantages = [
  { icon: ShieldCheck, label: 'Consultanță înainte de cumpărare' },
  { icon: Truck, label: 'Livrare în 2–5 zile pentru produsele din stoc' },
  { icon: Wrench, label: 'Montaj și service local' },
  { icon: Wallet, label: 'Comandă online simplă' },
];

export default function HomepageHero() {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-32 lg:pb-28 lg:pt-40">
      {/* Very light technical background zone — see redesign report for planned photography */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-300 via-white to-white" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #DCE4EA 1px, transparent 1px), linear-gradient(to bottom, #DCE4EA 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
        aria-hidden
      />

      <div className="relative container mx-auto px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
              Climatizare • Încălzire • Ventilație
            </p>

            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-primary md:text-5xl lg:text-6xl">
              Confortul potrivit începe cu o soluție aleasă corect.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-dark-300 md:text-lg">
              Te ajutăm să alegi, să cumperi și să instalezi sistemul HVAC potrivit pentru locuința sau afacerea ta.
              Primești recomandări clare, echipamente de calitate și o lucrare realizată responsabil, de la prima
              discuție până la punerea în funcțiune.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/produse" className="btn-primary justify-center px-7 py-3 text-base">
                Găsește soluția potrivită
                <ArrowRight size={19} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-300 bg-white px-7 py-3 text-base font-semibold text-primary transition-colors hover:border-primary-400"
              >
                Solicită o ofertă
              </Link>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {advantages.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-dark-300">
                  <Icon size={17} className="flex-shrink-0 text-brand" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Abstract technical visual — placeholder until real installation photography exists */}
          <div className="relative hidden lg:block" aria-hidden>
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card">
              <svg viewBox="0 0 320 260" className="h-auto w-full" fill="none">
                <rect x="24" y="24" width="272" height="80" rx="10" stroke="#173A5E" strokeOpacity="0.3" strokeWidth="1.5" />
                <line x1="24" y1="44" x2="296" y2="44" stroke="#173A5E" strokeOpacity="0.18" strokeWidth="1" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} x={40 + i * 42} y="56" width="26" height="36" rx="4" stroke="#D62C35" strokeOpacity="0.5" strokeWidth="1.5" />
                ))}
                <circle cx="60" cy="180" r="46" stroke="#173A5E" strokeOpacity="0.25" strokeWidth="1.5" />
                <circle cx="60" cy="180" r="26" stroke="#D62C35" strokeOpacity="0.55" strokeWidth="1.5" />
                <path d="M60 154v52M34 180h52" stroke="#173A5E" strokeOpacity="0.2" strokeWidth="1.5" />
                <rect x="150" y="140" width="146" height="90" rx="10" stroke="#173A5E" strokeOpacity="0.25" strokeWidth="1.5" />
                <path d="M170 160h106M170 178h106M170 196h70" stroke="#173A5E" strokeOpacity="0.15" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute -bottom-5 -right-4 rounded-xl bg-primary p-4 text-white shadow-primary">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Sună acum</p>
              <p className="text-lg font-bold">0749 025 610</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
