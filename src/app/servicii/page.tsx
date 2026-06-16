import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  Wind,
  Thermometer,
  Settings,
  Droplets,
  Search,
  Building2,
  ArrowRight,
  Phone,
  MessageCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TrackedPhoneLink, TrackedWhatsAppLink } from '@/components/analytics/TrackedLinks';

export const metadata: Metadata = {
  title: 'Servicii Aer Condiționat Arad și Timiș | PRO TERM SRL',
  description:
    'Montaj, service, revizie, igienizare aer condiționat în Arad și Timiș. Echipă F-Gas autorizată, 25 ani experiență. PRO TERM SRL — 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro/servicii' },
  openGraph: {
    title: 'Servicii Aer Condiționat Arad | PRO TERM SRL',
    description: 'Montaj, service, revizie și igienizare AC în Arad și Timiș. Echipă certificată F-Gas.',
    url: 'https://pro-term.ro/servicii',
  },
  robots: { index: true, follow: true },
};

const ACTIVE_SERVICES = [
  {
    icon: Wrench,
    title: 'Montaj aer condiționat',
    description: 'Instalare profesională în Arad. Traseu frigorific, console, probă de funcționare. Tarife fixe de la 750 RON.',
    href: '/servicii/montaj-aer-conditionat-arad',
    tarifHref: '/servicii/montaj',
    badge: null,
    color: 'text-primary',
    bg: 'bg-primary/10',
    cities: 'Arad · Timiș',
  },
  {
    icon: Settings,
    title: 'Service aer condiționat',
    description: 'Diagnosticare, reparații și intervenții tehnice pentru aparate care nu funcționează corect.',
    href: '/servicii/service-aer-conditionat-arad',
    tarifHref: null,
    badge: null,
    color: 'text-accent',
    bg: 'bg-accent/10',
    cities: 'Arad · Timiș',
  },
  {
    icon: ShieldCheck,
    title: 'Revizie periodică',
    description: 'Verificare sezonieră înainte de vară sau iarnă: funcționare generală, condens, filtre și randament.',
    href: '/servicii/revizie-ac-arad',
    tarifHref: null,
    badge: null,
    color: 'text-green-600',
    bg: 'bg-green-50',
    cities: 'Arad · Timiș',
  },
  {
    icon: Wind,
    title: 'Igienizare / curățare',
    description: 'Curățare filtre, igienizare unitate interioară, verificare evacuare condens. Aer mai curat, funcționare eficientă.',
    href: '/servicii/curatare-ac-arad',
    tarifHref: null,
    badge: null,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    cities: 'Arad · Timiș',
  },
  {
    icon: Building2,
    title: 'Proiecte HVAC comerciale',
    description: 'Sisteme VRV/VRF pentru retail, birouri și spații industriale. Proiectare, furnizare și implementare la nivel național.',
    href: '/servicii/proiecte-hvac-romania',
    tarifHref: null,
    badge: null,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    cities: 'Toată România',
  },
  {
    icon: Thermometer,
    title: 'Climatizare comercială',
    description: 'Soluții complete de climatizare pentru spații comerciale și industriale mari, în colaborare cu antreprenori.',
    href: '/servicii/climatizare-comerciala-industriala-romania',
    tarifHref: null,
    badge: null,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    cities: 'Toată România',
  },
];

const COMING_SOON_SERVICES = [
  {
    icon: Droplets,
    title: 'Încărcare freon',
    description: 'Verificare presiune și reîncărcare agent frigorific R32/R410A pentru aparate cu randament scăzut.',
  },
  {
    icon: Search,
    title: 'Diagnosticare și reparații',
    description: 'Identificare defecte, înlocuire componente și reparații pentru aparate de aer condiționat de orice brand.',
  },
];

export default function ServiciiPage() {
  return (
    <>
      <Header />
      <main className="bg-light-200 pb-20 pt-24">
        {/* Hero */}
        <section className="border-b border-slate-100 bg-white py-12">
          <div className="container mx-auto px-4">
            <span className="text-sm font-bold uppercase tracking-widest text-accent">
              PRO TERM SRL — Arad
            </span>
            <h1 className="mt-2 font-heading text-4xl font-bold text-dark md:text-5xl">
              Servicii HVAC
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-dark-300">
              Montaj, service, revizie și igienizare pentru aparate de aer condiționat în Arad și Timiș.
              Echipă certificată F-Gas/AGFR cu 25 de ani experiență.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['ISO 9001', 'F-Gas Autorizat', 'Garanție 12 luni', '25 ani experiență'].map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 pt-12">
          {/* Active services */}
          <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Servicii disponibile</h2>
          <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVE_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${s.bg}`}>
                    <Icon size={22} className={s.color} />
                  </div>
                  <Link href={s.href} className="group mb-1">
                    <p className="font-heading text-base font-bold text-dark group-hover:text-primary transition-colors">
                      {s.title}
                    </p>
                  </Link>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-dark-300">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-dark-300">
                      {s.cities}
                    </span>
                    <Link href={s.href} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                      Detalii <ArrowRight size={13} />
                    </Link>
                  </div>
                  {s.tarifHref && (
                    <Link
                      href={s.tarifHref}
                      className="mt-3 text-center text-xs font-semibold text-dark-300 hover:text-primary hover:underline"
                    >
                      Vezi tarife complete →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Coming soon */}
          <h2 className="mb-2 font-heading text-2xl font-bold text-dark">În curând</h2>
          <p className="mb-6 text-sm text-dark-300">
            Servicii în curs de configurare. Contactează-ne direct pentru disponibilitate.
          </p>
          <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMING_SOON_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 opacity-60"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Icon size={22} className="text-slate-400" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                      În curând
                    </span>
                  </div>
                  <p className="mb-2 font-heading text-base font-bold text-slate-500">{s.title}</p>
                  <p className="flex-1 text-sm leading-relaxed text-slate-400">{s.description}</p>
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-400">Disponibil în curând</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-8 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-bold">Ai nevoie de un serviciu care nu apare în listă?</h2>
                <p className="mt-2 text-blue-200">
                  Contactează-ne direct — echipa PRO TERM oferă soluții HVAC complete și răspunde în aceeași zi lucrătoare.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <TrackedPhoneLink
                  href="tel:+40749025610"
                  ctaLocation="servicii-cta"
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-primary hover:bg-blue-50"
                >
                  <Phone size={16} />
                  0749 025 610
                </TrackedPhoneLink>
                <TrackedWhatsAppLink
                  href={`https://wa.me/40749025610?text=${encodeURIComponent('Bună ziua, am nevoie de informații despre serviciile HVAC.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  ctaLocation="servicii-cta"
                  className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-bold text-white hover:bg-white/25"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </TrackedWhatsAppLink>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
