import Link from 'next/link';
import { Snowflake, Wind, Wrench, Factory, Thermometer, RefreshCw } from 'lucide-react';

const services = [
  {
    icon: Snowflake,
    title: 'Aparate de aer condiționat',
    description:
      'Vânzare, recomandare, montaj și punere în funcțiune pentru echipamente split, multi-split și soluții comerciale.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Factory,
    title: 'Refrigerare comercială și industrială',
    description:
      'Camere frigorifice, vitrine, depozite frigorifice și sisteme de răcire pentru magazine, restaurante și spații industriale.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Wind,
    title: 'Climatizare & HVAC',
    description:
      'Soluții HVAC pentru locuințe, birouri, spații comerciale și clădiri industriale: proiectare, instalare și optimizare.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Thermometer,
    title: 'Dimensionare și consultanță',
    description:
      'Te ajutăm să alegi capacitatea potrivită în funcție de suprafață, izolație, destinația spațiului și buget.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Wrench,
    title: 'Montaj, service & mentenanță',
    description:
      'Instalare, revizii, intervenții și mentenanță preventivă pentru echipamente HVAC și sisteme frigorifice.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: RefreshCw,
    title: 'Recuperare și încărcare freon',
    description:
      'Lucrări conforme pentru recuperare, verificare și reîncărcare agent frigorific, cu personal calificat.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
];

const localSeoLinks = [
  { label: 'Montaj aer condiționat Arad', href: '/servicii/montaj-aer-conditionat-arad' },
  { label: 'Montaj aer condiționat Timișoara', href: '/servicii/montaj-aer-conditionat-timisoara' },
  { label: 'Service aer condiționat Arad', href: '/servicii/service-aer-conditionat-arad' },
  { label: 'Service aer condiționat Timișoara', href: '/servicii/service-aer-conditionat-timisoara' },
];

export default function Services() {
  return (
    <section id="servicii" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Servicii și suport
          </span>
          <h2 className="section-title mt-2">Nu vindem doar produse. Oferim soluția completă.</h2>
          <p className="section-subtitle mx-auto text-center">
            Alegi produsul din magazin, iar noi te putem ajuta cu recomandarea tehnică,
            montajul, punerea în funcțiune și service-ul post-vânzare.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="card group hover:border-primary/20 border border-transparent cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={24} className={service.color} />
                </div>
                <h3 className="text-lg font-bold text-dark font-heading mb-2">
                  {service.title}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-light-200 p-6 shadow-card">
          <h3 className="font-heading text-xl font-bold text-dark">
            Servicii locale în Arad și Timișoara
          </h3>
          <p className="mt-2 text-sm text-dark-300">
            Pagini dedicate pentru montaj și service aer condiționat, optimizate local pentru clienții din vestul țării.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {localSeoLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:text-accent">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 bg-card-gradient border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-dark font-heading">
              Vrei să cumperi produsul potrivit, nu doar cel mai ieftin?
            </h3>
            <p className="text-dark-300 mt-1">
              Trimite-ne detaliile spațiului și îți recomandăm varianta potrivită.
            </p>
          </div>
          <a href="#contact" className="btn-primary whitespace-nowrap">
            Cere recomandare gratuită
          </a>
        </div>
      </div>
    </section>
  );
}
