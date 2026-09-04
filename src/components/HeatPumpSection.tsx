import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function HeatPumpSection() {
  return (
    <section className="bg-gradient-to-b from-light-300 to-white py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-brand">
              <Flame size={22} />
            </span>
            <h2 className="mt-5 font-heading text-3xl font-bold text-primary md:text-4xl">
              O pompă de căldură bună începe cu un calcul corect.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-dark-300">
              Nu recomandăm echipamente doar după suprafața casei. Analizăm clădirea, izolația, sistemul de încălzire
              și necesarul real, pentru a propune o soluție care oferă confort fără costuri inutile.
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-dark-300">
              Te putem ajuta cu alegerea echipamentului, dimensionarea instalației, materialele necesare, montajul și
              punerea în funcțiune.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary justify-center px-6 py-3">
                Solicită evaluarea locuinței
              </Link>
              <Link
                href="/produse"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-300 bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary-400"
              >
                Vezi pompele de căldură
              </Link>
            </div>
          </div>

          {/* Abstract technical diagram — placeholder until real heat-pump installation photography exists */}
          <div className="hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-card lg:block" aria-hidden>
            <svg viewBox="0 0 300 220" className="h-auto w-full" fill="none">
              <rect x="30" y="30" width="90" height="120" rx="8" stroke="#173A5E" strokeOpacity="0.28" strokeWidth="1.5" />
              <path d="M45 55h60M45 75h60M45 95h60M45 115h40" stroke="#173A5E" strokeOpacity="0.18" strokeWidth="1.5" />
              <path d="M120 90h60" stroke="#D62C35" strokeOpacity="0.6" strokeWidth="1.5" />
              <rect x="180" y="50" width="90" height="90" rx="8" stroke="#D62C35" strokeOpacity="0.55" strokeWidth="1.5" />
              <circle cx="225" cy="95" r="26" stroke="#173A5E" strokeOpacity="0.28" strokeWidth="1.5" />
              <path d="M225 69v52M199 95h52" stroke="#173A5E" strokeOpacity="0.18" strokeWidth="1.5" />
              <path d="M60 150v20M100 150v20" stroke="#173A5E" strokeOpacity="0.18" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
