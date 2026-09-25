import Link from 'next/link';
import { Snowflake, Wrench, Building2, HardHat, ArrowRight } from 'lucide-react';

const directions = [
  {
    icon: Snowflake,
    title: 'Echipamente HVAC',
    description:
      'Aparate de climatizare, încălzire și ventilație, cu livrare la nivel național.',
    cta: 'Vezi produsele',
    href: '/produse',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Wrench,
    title: 'Montaj și service',
    description:
      'Montaj, service, mentenanță și igienizare — în principal în Arad și zona apropiată.',
    cta: 'Vezi serviciile',
    href: '/servicii',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Building2,
    title: 'Climatizare comercială și industrială',
    description:
      'Alegerea și dimensionarea soluției potrivite: split/multisplit comercial, VRV/VRF, rooftop, chiller, CTA/ventilație.',
    cta: 'Climatizare comercială',
    href: '/servicii/climatizare-comerciala-industriala-romania',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: HardHat,
    title: 'Proiecte HVAC complete',
    description:
      'Proiecte comerciale și industriale mari, la nivel național: proiectare prin colaboratori, furnizare, execuție și punere în funcțiune.',
    cta: 'Proiecte HVAC',
    href: '/servicii/proiecte-hvac-romania',
    color: 'text-brand',
    bg: 'bg-brand/10',
  },
];

export default function Services() {
  return (
    <section id="servicii" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Ce oferim
          </span>
          <h2 className="section-title mt-2">Patru direcții clare, o singură echipă PRO TERM.</h2>
          <p className="section-subtitle mx-auto text-center">
            De la echipamente și montaj local, până la proiecte HVAC comerciale și industriale
            la nivel național.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {directions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="card group hover:border-primary/20 border border-transparent flex flex-col"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={24} className={item.color} />
                </div>
                <h3 className="text-lg font-bold text-dark font-heading mb-2">
                  {item.title}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed mb-5 flex-1">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 font-bold text-primary text-sm transition-colors hover:text-accent"
                >
                  {item.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
