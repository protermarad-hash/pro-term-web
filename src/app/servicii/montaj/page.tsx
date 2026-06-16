import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TrackedPhoneLink, TrackedWhatsAppLink } from '@/components/analytics/TrackedLinks';

export const metadata: Metadata = {
  title: 'Montaj Aer Condiționat Arad și Timișoara | PRO TERM SRL',
  description:
    'Montaj standard aer condiționat în Arad și Timișoara de la 750 RON cu TVA. Echipă F-Gas autorizată, garanție 12 luni. Tarife pentru 9000, 18000 și 24000 BTU.',
  alternates: { canonical: 'https://pro-term.ro/servicii/montaj' },
  openGraph: {
    title: 'Montaj Aer Condiționat Arad și Timișoara | PRO TERM SRL',
    description:
      'Montaj profesional aer condiționat în Arad și Timișoara. De la 750 RON, garanție 12 luni, tehnicieni F-Gas autorizați.',
    url: 'https://pro-term.ro/servicii/montaj',
  },
  robots: { index: true, follow: true },
};

const TARIFE = [
  {
    btu: '9.000 – 12.000 BTU',
    suprafata: '12 – 23 m²',
    pret: '750',
    slug: 'montaj-standard-9000-12000-btu',
    popular: true,
  },
  {
    btu: '18.000 BTU',
    suprafata: '23 – 35 m²',
    pret: '850',
    slug: 'montaj-standard-18000-btu',
    popular: false,
  },
  {
    btu: '24.000 BTU',
    suprafata: '35 – 50 m²',
    pret: '1.150',
    slug: 'montaj-standard-24000-btu',
    popular: false,
  },
];

const INCLUS = [
  'Traseu frigorific 3 m (țeavă cupru + izolație termică)',
  'Cablu electric 5×1,5 sau 5×2 – 3,5 m',
  'Tub evacuare condens Ø16/18 – 2 m',
  'Console montaj – 2 buc',
  'O singură străpungere în peretele exterior',
  'Amplasare unitate exterioară + interioară (în limita 3 m traseu)',
  'Bandajare traseu frigorific',
  'Probă de funcționare și explicarea facilităților',
  'Garanție instalare: 12 luni',
];

const NEINCLUS = [
  'Transport aparat la domiciliu (excepție: aparate vândute de PRO TERM)',
  'Două sau mai multe străpungeri',
  'Mascarea traseului cu zidărie, canal PVC sau mască PVC',
  'Copertine sau elemente de protecție',
  'Repoziționare / mutare instalație existentă',
  'Modificări la instalația electrică',
  'Mutare mobilier sau demontare geamuri termopane',
  'Traseu frigorific peste 3 m',
];

const TARIFE_SUPLIMENTARE = [
  { lucrare: 'Trecere suplimentară prin beton', pret: '120 RON/buc' },
  { lucrare: 'Trecere suplimentară prin zidărie', pret: '80 RON/buc' },
  { lucrare: 'Traseu frigorific suplimentar', pret: '140–230 RON/m' },
  { lucrare: 'Mască PVC traseu', pret: '35 RON/m' },
  { lucrare: 'Accesorii canal PVC (cot, flanșă, mufă etc.)', pret: '35 RON/buc' },
  { lucrare: 'Prelungire furtun condens', pret: '14 RON/m' },
  { lucrare: 'Schimbare / prelungire cablu alimentare', pret: '14 RON/m' },
  { lucrare: 'Șurub + diblu 8×200mm pentru polistiren (set 5 buc)', pret: '50 RON/set' },
  { lucrare: 'Deplasare în afara localității', pret: '2,4 RON/km tur-retur' },
];

const schemaJson = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Montaj Standard Aer Condiționat',
  description: 'Montaj profesional aer condiționat în Arad și județul Arad. Echipă certificată F-Gas.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'PRO TERM SRL',
    telephone: '+40749025610',
    url: 'https://pro-term.ro',
    address: { '@type': 'PostalAddress', addressLocality: 'Arad', addressCountry: 'RO' },
  },
  areaServed: [
    { '@type': 'City', name: 'Arad' },
    { '@type': 'AdministrativeArea', name: 'Județul Arad' },
  ],
  offers: [
    { '@type': 'Offer', name: 'Montaj 9000-12000 BTU', price: '750', priceCurrency: 'RON' },
    { '@type': 'Offer', name: 'Montaj 18000 BTU', price: '850', priceCurrency: 'RON' },
    { '@type': 'Offer', name: 'Montaj 24000 BTU', price: '1150', priceCurrency: 'RON' },
  ],
};

export default function MontajPage() {
  const whatsappUrl = `https://wa.me/40749025610?text=${encodeURIComponent(
    'Bună ziua, vreau să verific dacă montajul meu este standard.',
  )}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <Header />
      <main className="bg-light-200 pb-20 pt-24">
        <section className="border-b border-slate-100 bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex-1">
                <span className="text-sm font-bold uppercase tracking-widest text-accent">
                  Servicii PRO TERM Arad
                </span>
                <h1 className="mt-2 font-heading text-4xl font-bold text-dark md:text-5xl">
                  Montaj Standard
                  <br className="hidden md:block" /> Aer Condiționat
                </h1>
                <p className="mt-4 max-w-xl text-dark-300 leading-relaxed">
                  Echipă certificată F-Gas/AGFR cu 25 ani experiență. Instalare profesională cu garanție 12 luni. Disponibil în Arad și județul Arad.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { icon: <Award size={13} />, label: 'ISO 9001' },
                    { icon: <ShieldCheck size={13} />, label: 'F-Gas Autorizat' },
                    { icon: <CheckCircle2 size={13} />, label: 'Garanție 12 luni' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary">
                      {b.icon}
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-blue-700 shadow-lg">
                  <Wrench size={40} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 pt-12">
          <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Tarife montaj standard</h2>
          <div className="mb-6 rounded-3xl border border-primary/15 bg-primary/5 p-5">
            <p className="text-sm leading-relaxed text-dark-300">
              Prețurile sunt valabile pentru montaj standard. Lucrările suplimentare, traseele mai lungi,
              străpungerile suplimentare sau deplasările în afara localității se confirmă separat înainte de execuție.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedWhatsAppLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                ctaLocation="pricing-banner"
                serviceType="montaj"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-600"
              >
                <MessageCircle size={18} />
                Cere ofertă pe WhatsApp
              </TrackedWhatsAppLink>
              <TrackedWhatsAppLink
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                ctaLocation="pricing-banner"
                serviceType="montaj"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-5 py-3 font-bold text-primary transition hover:bg-primary hover:text-white"
              >
                Verifică dacă montajul tău este standard
              </TrackedWhatsAppLink>
              <TrackedPhoneLink
                href="tel:+40749025610"
                ctaLocation="pricing-banner"
                serviceType="montaj"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-primary shadow-sm transition hover:bg-slate-50"
              >
                <Phone size={18} />
                Sună pentru detalii
              </TrackedPhoneLink>
            </div>
          </div>

          <div className="mb-12 grid gap-5 sm:grid-cols-3">
            {TARIFE.map((t) => (
              <div
                key={t.slug}
                className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-card ${
                  t.popular ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100'
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow">
                    Cel mai popular
                  </span>
                )}
                <p className="mb-1 font-heading text-lg font-bold text-dark">{t.btu}</p>
                <p className="mb-4 text-sm text-dark-300">Suprafață recomandată: {t.suprafata}</p>
                <p className="mb-1 font-heading text-4xl font-bold text-primary">{t.pret} RON</p>
                <p className="mb-6 text-xs text-dark-300">cu TVA 21% inclus</p>
                <Link href={`/produse/${t.slug}`} className="btn-primary mt-auto justify-center py-3">
                  Adaugă în coș
                </Link>
                <TrackedWhatsAppLink
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  ctaLocation="pricing-card"
                  serviceType="montaj"
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
                >
                  <MessageCircle size={16} />
                  Cere ofertă pe WhatsApp
                </TrackedWhatsAppLink>
                <TrackedPhoneLink
                  href="tel:+40749025610"
                  ctaLocation="pricing-card"
                  serviceType="montaj"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/25 px-4 py-2.5 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary/5"
                >
                  <Phone size={16} />
                  Sună pentru detalii
                </TrackedPhoneLink>
                <TrackedWhatsAppLink
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  ctaLocation="pricing-card"
                  serviceType="montaj"
                  className="mt-2 text-center text-sm font-semibold text-dark-300 transition hover:text-primary hover:underline"
                >
                  Verifică dacă montajul tău este standard
                </TrackedWhatsAppLink>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card">
              <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-bold text-dark">
                <CheckCircle2 size={20} className="text-green-600" />
                Ce include montajul standard
              </h2>
              <ul className="space-y-3">
                {INCLUS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-dark-300">
                    <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-bold text-dark">
                <AlertTriangle size={20} className="text-amber-500" />
                Nu este inclus în montajul standard
              </h2>
              <ul className="space-y-3">
                {NEINCLUS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-dark-300">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 card overflow-hidden p-0">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="font-heading text-xl font-bold text-dark">Tarife suplimentare</h2>
              <p className="text-sm text-dark-300 mt-1">Prețuri cu TVA 21% inclus. Aplicabile când lucrarea depășește montajul standard.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left font-semibold text-dark-300">Lucrare suplimentară</th>
                    <th className="px-6 py-3 text-right font-semibold text-dark-300">Preț</th>
                  </tr>
                </thead>
                <tbody>
                  {TARIFE_SUPLIMENTARE.map((row, i) => (
                    <tr key={row.lucrare} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-6 py-3 text-dark-300">{row.lucrare}</td>
                      <td className="px-6 py-3 text-right font-semibold text-dark">{row.pret}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-gradient-to-r from-primary to-blue-700 p-8 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-bold">Ai nevoie de o ofertă personalizată?</h2>
                <p className="mt-2 text-blue-200">
                  Contactează-ne pentru lucrări cu traseu mai lung, mai multe unități sau montaj comercial. Răspundem în aceeași zi lucrătoare.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <TrackedPhoneLink
                  href="tel:+40749025610"
                  ctaLocation="final-cta-banner"
                  serviceType="montaj"
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-primary hover:bg-blue-50"
                >
                  <Phone size={16} />
                  0749 025 610
                </TrackedPhoneLink>
                <a
                  href="mailto:proterm.arad@gmail.com"
                  className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-bold text-white hover:bg-white/25"
                >
                  <Mail size={16} />
                  Trimite email
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
