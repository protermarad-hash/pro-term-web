import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  Layers,
  MessageCircle,
  Snowflake,
  Store,
  ThermometerSun,
  Wind,
  Wrench,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Climatizare Comercială și Industrială România | Sisteme HVAC | PRO TERM',
  description:
    'Alegerea soluției potrivite de climatizare pentru spații comerciale și industriale: split comercial, multisplit, VRV/VRF, rooftop și chiller. Montaj, service și mentenanță pentru sistemele instalate.',
  alternates: { canonical: 'https://pro-term.ro/servicii/climatizare-comerciala-industriala-romania' },
  openGraph: {
    title: 'Climatizare Comercială și Industrială România | PRO TERM',
    description:
      'Sisteme de climatizare pentru magazine, birouri, showroom-uri și hale: split comercial, multisplit, VRV/VRF, rooftop și chiller.',
    url: 'https://pro-term.ro/servicii/climatizare-comerciala-industriala-romania',
  },
};

const phone = '40749025610';

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const systems = [
  {
    icon: Snowflake,
    title: 'Split și multisplit comercial',
    description: 'Potrivite pentru spații mai mici sau zone separate, cu una sau mai multe unități interioare.',
  },
  {
    icon: Layers,
    title: 'VRV/VRF',
    description: 'Relevante pentru spații mai mari sau clădiri cu mai multe zone, unde e nevoie de control pe fiecare încăpere.',
  },
  {
    icon: Building2,
    title: 'Rooftop',
    description: 'O opțiune pentru hale sau spații comerciale mari, montată pe acoperiș, care poate combina climatizarea cu ventilația.',
  },
  {
    icon: ThermometerSun,
    title: 'Chiller',
    description: 'Pentru clădiri sau spații cu necesar mare de răcire, care alimentează mai multe zone sau echipamente.',
  },
  {
    icon: Wind,
    title: 'CTA / ventilație',
    description: 'Acolo unde soluția o cere, alături de climatizare, pentru aer proaspăt tratat corect.',
  },
];

const spaceTypes = [
  'magazine',
  'showroom-uri',
  'birouri',
  'hale',
  'spații tehnice',
  'alte spații comerciale sau industriale',
];

const selectionFactors = [
  'Suprafața și înălțimea spațiului',
  'Destinația și modul de utilizare',
  'Compartimentarea spațiului',
  'Programul de funcționare',
  'Expunerea la soare și izolația',
  'Necesarul de climatizare al spațiului',
  'Cerințele de temperatură',
  'Modul de exploatare (continuu, sezonier etc.)',
];

const faqs = [
  {
    question: 'Ce tip de climatizare este potrivit pentru un spațiu comercial?',
    answer: 'Depinde de suprafață, compartimentare, numărul de persoane, expunere solară, program de funcționare și destinația spațiului. Pentru spații mici pot fi suficiente soluții split sau multisplit, iar pentru spații mai mari se pot analiza sisteme VRV/VRF, rooftop sau chiller.',
  },
  {
    question: 'Ce diferență este între o lucrare rezidențială și una comercială?',
    answer: 'O lucrare comercială are de obicei cerințe mai stricte privind fiabilitatea, programul de funcționare, accesul pentru mentenanță, consumul energetic și continuitatea activității. De aceea, dimensionarea și planificarea sunt mai importante.',
  },
  {
    question: 'Puteți face și mentenanță periodică pentru spații comerciale?',
    answer: 'Da. Pentru spații comerciale și industriale se pot stabili revizii periodice, curățări, verificări de funcționare și intervenții preventive pentru reducerea riscului de defectare în sezon.',
  },
  {
    question: 'Ce informații ajută la alegerea sistemului potrivit?',
    answer: 'Sunt utile localitatea, suprafața, destinația spațiului, compartimentarea, programul de funcționare, cerințele de temperatură și, dacă sunt disponibile, fotografii sau schițe ale spațiului.',
  },
];

export default function CommercialIndustrialPage() {
  const whatsappUrl = buildWhatsAppUrl('Bună ziua, doresc detalii pentru climatizare comercială sau industrială.');

  return (
    <>
      <Header />
      <main className="bg-light-200 pt-24">
        <section className="bg-hero-gradient py-24 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/20">
                <Factory size={16} /> Climatizare comercială și industrială
              </span>
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">
                Soluții de climatizare pentru spații comerciale și industriale în România
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
                Ajutăm la alegerea și dimensionarea sistemului de climatizare potrivit pentru
                magazine, showroom-uri, birouri, hale și spații tehnice, în funcție de tipul
                spațiului și modul de utilizare. Asigurăm montaj și suport după instalare pentru
                sistemele alese.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-4 font-bold text-white transition hover:bg-green-600">
                  <MessageCircle size={20} /> Cere ofertă pe WhatsApp
                </a>
                <Link href="/#contact" className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-4 font-bold text-white transition hover:bg-white hover:text-primary">
                  Trimite cerere ofertă
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-bold uppercase tracking-widest text-accent">Sisteme</span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Tipuri de sisteme de climatizare</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {systems.map(({ icon: Icon, title, description }) => (
                <div key={title} className="card">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-dark">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-dark-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-accent">Aplicații</span>
                <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Pentru ce tipuri de spații</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
                {spaceTypes.map((space) => (
                  <div key={space} className="rounded-2xl border border-slate-100 bg-light-200 p-5 font-bold text-dark">
                    {space}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-accent">Alegerea soluției</span>
                <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Cum alegem soluția potrivită</h2>
                <p className="mt-3 text-sm leading-relaxed text-dark-300">
                  Sistemul potrivit depinde de particularitățile spațiului. Analizăm împreună
                  factorii de mai jos înainte de a recomanda o soluție.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
                {selectionFactors.map((factor) => (
                  <div key={factor} className="flex gap-3 rounded-2xl bg-light-200 p-4">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-dark-300">{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="card max-w-4xl mx-auto flex gap-4">
              <Wind size={28} className="text-primary flex-shrink-0" />
              <p className="text-sm leading-relaxed text-dark-300">
                În funcție de aplicație, sistemul de climatizare poate fi integrat cu ventilația,
                cu o centrală de tratare a aerului (CTA) sau cu instalația de încălzire existentă,
                pentru un confort unitar în spațiu.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="card lg:col-span-2">
                <span className="text-sm font-bold uppercase tracking-widest text-accent">Servicii</span>
                <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Montaj, service și mentenanță</h2>
                <p className="mt-4 text-sm leading-relaxed text-dark-300">
                  Asigurăm montaj, service și mentenanță pentru sistemele de climatizare instalate.
                  Intervențiile uzuale — montaj, verificări periodice și service — se fac în
                  principal în Arad și zona apropiată.
                </p>
              </div>
              <div className="space-y-4">
                <div className="card">
                  <Store className="mb-3 text-primary" size={30} />
                  <h3 className="font-heading text-xl font-bold text-dark">Spații comerciale</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">Soluții pentru confort și funcționare constantă în spații cu trafic și program extins.</p>
                </div>
                <div className="card">
                  <Wrench className="mb-3 text-primary" size={30} />
                  <h3 className="font-heading text-xl font-bold text-dark">Verificări periodice</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">Revizii și intervenții pentru menținerea performanței sistemelor instalate.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl border border-slate-100 bg-light-200 p-8 md:p-10 md:flex md:items-center md:justify-between md:gap-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-dark">
                  Ai un proiect HVAC complex sau o lucrare de amploare?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-dark-300">
                  Pentru proiecte care necesită proiectare, coordonare, furnizare și execuție
                  completă, avem o pagină dedicată acestui tip de lucrare.
                </p>
              </div>
              <Link
                href="/servicii/proiecte-hvac-romania"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-600 md:mt-0"
              >
                Vezi Proiecte HVAC
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-accent">Întrebări frecvente</span>
                <h2 className="mt-2 font-heading text-3xl font-bold text-dark">FAQ climatizare comercială și industrială</h2>
                <p className="mt-3 text-sm leading-relaxed text-dark-300">Întrebări utile pentru magazine, birouri, hale și alte spații comerciale sau industriale.</p>
              </div>
              <div className="space-y-4 lg:col-span-2">
                {faqs.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h3 className="font-heading text-lg font-bold text-dark">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl bg-primary p-8 text-white shadow-card md:flex md:items-center md:justify-between md:gap-8">
              <div>
                <h2 className="font-heading text-2xl font-bold">Ai nevoie de un sistem de climatizare pentru spațiul tău?</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80">
                  Trimite informații despre spațiu — localitate, suprafață, destinație și program
                  de funcționare — și revenim cu recomandarea potrivită.
                </p>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600 md:mt-0">
                <MessageCircle size={18} /> Cere ofertă
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
