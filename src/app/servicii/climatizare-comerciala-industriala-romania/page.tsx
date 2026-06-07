import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, CheckCircle2, Factory, MessageCircle, Store, Wrench } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Climatizare comercială și industrială România | PRO TERM',
  description: 'Soluții de climatizare comercială și industrială în România: spații comerciale, birouri, hale, sisteme HVAC, VRV/VRF, montaj, service și mentenanță.',
};

const phone = '40749025610';

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const solutions = [
  'Climatizare pentru spații comerciale, magazine, showroom-uri și birouri',
  'Soluții HVAC pentru hale, spații tehnice și zone cu cerințe speciale de temperatură',
  'Sisteme multi-split, VRV/VRF și echipamente dimensionate în funcție de spațiu',
  'Montaj, punere în funcțiune, revizie, service și mentenanță preventivă',
  'Consultanță pentru eficiență energetică și alegerea echipamentelor potrivite',
  'Intervenții locale în vestul țării și proiecte mari analizate la nivel național',
];

const faqs = [
  {
    question: 'Ce tip de climatizare este potrivit pentru un spațiu comercial?',
    answer: 'Depinde de suprafață, compartimentare, numărul de persoane, expunere solară, program de funcționare și destinația spațiului. Pentru spații mici pot fi suficiente soluții split sau multi-split, iar pentru proiecte mai mari se pot analiza sisteme centralizate sau VRV/VRF.',
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
    question: 'Ce trebuie să trimit pentru o ofertă?',
    answer: 'Trimite localitatea, tipul spațiului, suprafața, înălțimea, poze sau planuri, numărul estimat de persoane, programul de funcționare, cerințele de temperatură și dacă există deja echipamente instalate.',
  },
  {
    question: 'Se poate lucra etapizat?',
    answer: 'Da. Pentru proiecte comerciale sau industriale, lucrarea se poate împărți pe etape, în funcție de acces, programul beneficiarului, livrarea echipamentelor și condițiile tehnice din locație.',
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
                Soluții HVAC pentru spații comerciale și industriale în România
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
                PRO TERM oferă soluții de climatizare pentru spații comerciale, birouri, hale, showroom-uri și proiecte tehnice care necesită echipamente fiabile, dimensionare corectă și suport după instalare.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-4 font-bold text-white transition hover:bg-green-600">
                  <MessageCircle size={20} /> Cere ofertă pe WhatsApp
                </a>
                <Link href="/servicii/proiecte-hvac-romania" className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-4 font-bold text-white transition hover:bg-white hover:text-primary">
                  Vezi proiecte HVAC
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="card lg:col-span-2">
                <span className="text-sm font-bold uppercase tracking-widest text-accent">Soluții</span>
                <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Ce putem include într-o soluție HVAC comercială</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {solutions.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl bg-light-200 p-4">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                      <p className="text-sm leading-relaxed text-dark-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="card">
                  <Store className="mb-3 text-primary" size={30} />
                  <h3 className="font-heading text-xl font-bold text-dark">Spații comerciale</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">Soluții pentru confort, eficiență și funcționare constantă în spații cu trafic și program extins.</p>
                </div>
                <div className="card">
                  <Building2 className="mb-3 text-primary" size={30} />
                  <h3 className="font-heading text-xl font-bold text-dark">Birouri și clădiri</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">Climatizare pentru zone de lucru, spații comune și încăperi cu cerințe diferite de temperatură.</p>
                </div>
                <div className="card">
                  <Wrench className="mb-3 text-primary" size={30} />
                  <h3 className="font-heading text-xl font-bold text-dark">Service și mentenanță</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">Revizii și intervenții pentru menținerea performanței echipamentelor HVAC.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-accent">Întrebări frecvente</span>
                <h2 className="mt-2 font-heading text-3xl font-bold text-dark">FAQ climatizare comercială și industrială</h2>
                <p className="mt-3 text-sm leading-relaxed text-dark-300">Întrebări utile pentru magazine, birouri, hale și alte spații comerciale sau industriale.</p>
              </div>
              <div className="space-y-4 lg:col-span-2">
                {faqs.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-slate-100 bg-light-200 p-5 shadow-sm">
                    <h3 className="font-heading text-lg font-bold text-dark">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
