import Link from 'next/link';
import { Building2, CheckCircle2, ClipboardCheck, MapPinned, MessageCircle, Wrench, Zap } from 'lucide-react';

const phone = '40749025610';

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const capabilities = [
  'Analiză tehnică pentru spații comerciale, industriale, birouri, retail sau HoReCa',
  'Soluții de climatizare cu mai multe echipamente, inclusiv sisteme VRV/VRF, unde proiectul o cere',
  'Montaj, punere în funcțiune, service și mentenanță pentru echipamente HVAC',
  'Planificare pe etape pentru proiecte cu cerințe tehnice și operaționale clare',
  'Deplasare la nivel național pentru proiecte mari, în funcție de complexitate și calendar',
  'Recomandări pentru eficiență energetică, fiabilitate și costuri de exploatare',
];

const sectors = [
  'spații comerciale',
  'magazine și showroom-uri',
  'birouri',
  'hale și spații tehnice',
  'unități HoReCa',
  'spații rezidențiale complexe',
];

export default function NationalProjectPage() {
  const whatsappUrl = buildWhatsAppUrl('Bună ziua, doresc să discut un proiect HVAC mai mare la nivel național.');

  return (
    <main className="bg-light-200 pt-24">
      <section className="relative overflow-hidden bg-hero-gradient py-24 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/20">
              <MapPinned size={16} /> Proiecte HVAC la nivel național
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">
              Proiecte HVAC comerciale și industriale în România
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
              PRO TERM preia proiecte mari de climatizare, montaj, service și mentenanță HVAC pentru clienți comerciali și industriali. Pentru lucrări complexe, echipa se poate deplasa în România, în funcție de dimensiunea proiectului, cerințele tehnice și programare.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-4 font-bold text-white transition hover:bg-green-600">
                <MessageCircle size={20} /> Discută proiectul pe WhatsApp
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
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <span className="text-sm font-bold uppercase tracking-widest text-accent">Capabilități</span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Ce putem gestiona într-un proiect HVAC mare</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {capabilities.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-light-200 p-4">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-dark-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="card">
                <Building2 className="mb-3 text-primary" size={30} />
                <h3 className="font-heading text-xl font-bold text-dark">B2B și proiecte speciale</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-300">Lucrăm cu beneficiari care au nevoie de soluții tehnice clare, planificare și execuție serioasă.</p>
              </div>
              <div className="card">
                <ClipboardCheck className="mb-3 text-primary" size={30} />
                <h3 className="font-heading text-xl font-bold text-dark">Evaluare înainte de ofertare</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-300">Pentru lucrări mari, oferta se stabilește după analiza locației, cerințelor și condițiilor tehnice.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-accent">Aplicații</span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Pentru ce tipuri de spații este potrivit</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
              {sectors.map((sector) => (
                <div key={sector} className="rounded-2xl border border-slate-100 bg-light-200 p-5 font-bold text-dark">
                  {sector}
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
              <h2 className="font-heading text-2xl font-bold">Ai un proiect HVAC comercial sau industrial?</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80">
                Trimite informații despre locație, suprafață, destinația spațiului, cerințe de temperatură, număr de echipamente și termenul dorit. Revenim cu pașii necesari pentru evaluare.
              </p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600 md:mt-0">
              <Zap size={18} /> Contact rapid
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
