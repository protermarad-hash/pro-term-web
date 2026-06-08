import { ArrowRight, BadgeCheck, Phone, ShieldCheck, ShoppingCart, Snowflake, Wrench } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '25+', label: 'ani experiență' },
  { value: '6', label: 'specialiști în echipă' },
  { value: 'Arad', label: 'montaj & service local' },
];

const quickActions = [
  { icon: Snowflake, label: 'Aer condiționat', href: '/produse' },
  { icon: Wrench, label: 'Montaj & service', href: '/#servicii' },
  { icon: ShoppingCart, label: 'Magazin online', href: '/produse' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-primary pt-28 text-white">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.26),transparent_30%),radial-gradient(circle_at_75%_85%,rgba(14,165,168,0.20),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-light-200 to-transparent" />

      <div className="relative container mx-auto px-4 pb-20 pt-10 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
              <BadgeCheck size={16} className="text-accent-200" />
              Dealer HVAC · Echipă de 6 specialiști · Arad
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Magazin HVAC pentru climatizare, centrale și soluții tehnice complete.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78 md:text-xl">
              Alege echipamente Gree, Yamato, Midea și alte branduri, cere ofertă cu montaj sau comandă direct. PRO TERM îți oferă consultanță tehnică și suport direct de la o echipă locală cu experiență.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/produse" className="btn-primary justify-center px-8 py-4 text-base">
                Vezi produsele
                <ArrowRight size={20} />
              </Link>
              <a href="tel:+40749025610" className="btn-outline justify-center px-8 py-4 text-base">
                <Phone size={20} />
                Sună pentru ofertă
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="font-heading text-3xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-white p-5 text-dark shadow-card">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Recomandare rapidă</p>
                    <h2 className="mt-1 text-2xl font-bold font-heading text-primary">Ce cauți astăzi?</h2>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <ShieldCheck size={26} />
                  </div>
                </div>

                <div className="space-y-3">
                  {quickActions.map(({ icon: Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-accent/40 hover:bg-white hover:shadow-card"
                    >
                      <span className="flex items-center gap-3 font-bold text-dark">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white transition-colors group-hover:bg-accent">
                          <Icon size={21} />
                        </span>
                        {label}
                      </span>
                      <ArrowRight size={18} className="text-dark-300 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                    </Link>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-br from-primary to-primary-700 p-5 text-white">
                  <p className="text-sm font-semibold text-white/75">Oferta completă poate include</p>
                  <p className="mt-2 text-lg font-bold font-heading">produs + accesorii + montaj + punere în funcțiune</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl bg-accent p-4 text-white shadow-accent md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/75">Contact rapid</p>
              <p className="text-xl font-bold">0749 025 610</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
