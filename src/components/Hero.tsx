import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Flame,
  Home,
  Snowflake,
  ThermometerSun,
  Wind,
  Wrench,
} from 'lucide-react';

const trustSignals = [
  'Consultanță tehnică',
  'Montaj și service în Arad',
  'Soluții rezidențiale și business',
];

const hvacSolutions = [
  { icon: Snowflake, label: 'Climatizare', detail: 'Soluții de climatizare' },
  { icon: ThermometerSun, label: 'Pompe de căldură', detail: 'Confort în orice sezon' },
  { icon: Flame, label: 'Centrale termice', detail: 'Încălzire controlată' },
  { icon: Wind, label: 'Ventilație', detail: 'Aer proaspăt, proiectat corect' },
];

export default function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#061a2e] pt-[108px] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,168,0.16),transparent_32%),radial-gradient(circle_at_88%_20%,rgba(249,115,22,0.18),transparent_28%),linear-gradient(135deg,#061a2e_0%,#0b2a4a_58%,#102f50_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute -right-36 top-28 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -right-20 top-44 h-64 w-64 rounded-full border border-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-light-200 to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(100vh-108px)] max-w-7xl items-center gap-12 px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm sm:text-sm">
            <Wind size={16} className="shrink-0 text-secondary-300" aria-hidden="true" />
            Climatizare · Încălzire · Ventilație
          </div>

          <h1 className="text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            Soluții HVAC complete pentru{' '}
            <span className="relative inline-block text-accent-300">
              locuințe și afaceri
              <span className="absolute -bottom-2 left-0 h-1 w-24 rounded-full bg-accent sm:w-36" aria-hidden="true" />
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            Echipamente, montaj, service și proiecte de climatizare, încălzire și ventilație,
            realizate de echipe specializate.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/produse"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-bold text-white shadow-accent transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Vezi produsele
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/[0.06] px-7 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Solicită o ofertă
            </Link>
          </div>

          <ul className="mt-9 grid gap-3 text-sm text-slate-200 sm:grid-cols-3" aria-label="Avantaje PRO TERM">
            {trustSignals.map((signal) => (
              <li key={signal} className="flex items-start gap-2">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-secondary-300" aria-hidden="true" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-label="Soluții HVAC integrate PRO TERM">
          <div className="absolute -inset-5 rounded-[2.25rem] bg-gradient-to-br from-secondary/20 via-transparent to-accent/20 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.09] p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-5 text-dark shadow-card sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Sistem integrat</p>
                  <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">Confort tehnic, cap-coadă</h2>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-primary">
                  <Home size={24} aria-hidden="true" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {hvacSolutions.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-dark">{label}</h3>
                    <p className="mt-1 text-sm leading-5 text-dark-300">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-primary p-4 text-white sm:p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <Wrench size={21} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold">De la alegere la punere în funcțiune</p>
                  <p className="mt-0.5 text-sm text-white/70">Consultanță, proiectare, montaj și service.</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/servicii/proiecte-hvac-romania"
            className="relative -mt-4 ml-auto mr-5 flex max-w-[19rem] items-center gap-3 rounded-2xl border border-white/20 bg-secondary-700 p-4 text-white shadow-xl transition-colors hover:bg-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:-mt-6 sm:mr-8"
          >
            <Building2 size={24} className="shrink-0" aria-hidden="true" />
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-white/65">Pentru companii</span>
              <span className="mt-0.5 block font-bold">Proiecte comerciale și industriale</span>
            </span>
            <ArrowRight size={17} className="ml-auto shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
