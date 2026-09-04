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
    <section className="relative overflow-hidden bg-hero-gradient pb-20 pt-32 text-white lg:pb-28 lg:pt-40">
      {/* Subtle technical grid — no photography available yet, see redesign report */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-light-200 to-transparent" />

      <div className="relative container mx-auto px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/60">
              Climatizare • Încălzire • Ventilație
            </p>

            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Confortul potrivit începe cu o soluție aleasă corect.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Te ajutăm să alegi, să cumperi și să instalezi sistemul HVAC potrivit pentru locuința sau afacerea ta.
              Primești recomandări clare, echipamente de calitate și o lucrare realizată responsabil, de la prima
              discuție până la punerea în funcțiune.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/produse" className="btn-primary justify-center px-7 py-3.5 text-base">
                Găsește soluția potrivită
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
              >
                Solicită o ofertă
              </Link>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {advantages.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-white/80">
                  <Icon size={17} className="flex-shrink-0 text-brand-300" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Abstract technical visual — placeholder until real installation photography exists */}
          <div className="relative hidden lg:block" aria-hidden>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
              <svg viewBox="0 0 320 260" className="h-auto w-full" fill="none">
                <rect x="24" y="24" width="272" height="80" rx="10" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
                <line x1="24" y1="44" x2="296" y2="44" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} x={40 + i * 42} y="56" width="26" height="36" rx="4" stroke="#D62C35" strokeOpacity="0.55" strokeWidth="1.5" />
                ))}
                <circle cx="60" cy="180" r="46" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                <circle cx="60" cy="180" r="26" stroke="#D62C35" strokeOpacity="0.6" strokeWidth="1.5" />
                <path d="M60 154v52M34 180h52" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
                <rect x="150" y="140" width="146" height="90" rx="10" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                <path d="M170 160h106M170 178h106M170 196h70" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute -bottom-5 -right-4 rounded-xl bg-brand p-4 text-white shadow-accent">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/75">Sună acum</p>
              <p className="text-lg font-bold">0749 025 610</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
