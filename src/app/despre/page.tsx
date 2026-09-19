import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  MapPinned,
  Users,
  Wrench,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre PRO TERM | HVAC din 1999',
  description:
    'PRO TERM activează în domeniul HVAC din 1999: echipamente la nivel național, montaj și service local în Arad și proiecte comerciale și industriale complete în toată România.',
  alternates: { canonical: 'https://pro-term.ro/despre' },
  openGraph: {
    title: 'Despre PRO TERM | HVAC din 1999',
    description:
      'Echipamente HVAC la nivel național, servicii locale în Arad și proiecte comerciale și industriale complete în toată România.',
    url: 'https://pro-term.ro/despre',
  },
};

const whatWeDo = [
  {
    icon: Building2,
    title: 'Echipamente HVAC la nivel național',
    description:
      'Livrăm echipamente de climatizare, încălzire și ventilație oriunde în România, pentru clienți rezidențiali și comerciali.',
  },
  {
    icon: Wrench,
    title: 'Montaj, service și igienizare în Arad și zona apropiată',
    description:
      'Pentru intervenții uzuale — montaj, service, igienizare și mentenanță — activăm în principal în Arad și localitățile din apropiere.',
  },
  {
    icon: MapPinned,
    title: 'Proiecte HVAC comerciale și industriale în toată România',
    description:
      'Pentru proiecte de amploare comercială sau industrială, ne deplasăm oriunde în țară, în funcție de complexitate și calendar.',
  },
];

const howWeWork = [
  'Pentru proiecte mai ample, putem gestiona întregul proces: proiectare prin proiectanți colaboratori, furnizare de echipamente și materiale, execuție, punere în funcțiune și predare la cheie.',
  'Lucrăm și după proiectul tehnic pus la dispoziție de beneficiar, atunci când acesta există deja.',
  'Pentru disciplinele care nu sunt acoperite intern, colaborăm transparent cu parteneri specializați — proiectul rămâne coordonat unitar de echipa PRO TERM.',
];

export default function DesprePage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative py-32 bg-dark overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-90" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute top-1/4 -right-32 w-80 h-80 bg-brand/20 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-white mb-6 leading-tight">
              Despre <span className="text-brand">PRO TERM</span>
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
              PRO TERM activează în domeniul HVAC din 1999. Vindem echipamente la nivel național,
              asigurăm montaj, service și igienizare în Arad și zona apropiată și ne deplasăm în
              toată țara pentru proiecte comerciale și industriale de amploare.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-brand font-semibold text-sm uppercase tracking-widest">
                Ce facem
              </span>
              <h2 className="section-title mt-2">Trei tipuri de activitate, o singură echipă</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {whatWeDo.map(({ icon: Icon, title, description }) => (
                <div key={title} className="card">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold font-heading text-dark mb-2">{title}</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-light-200">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="text-brand font-semibold text-sm uppercase tracking-widest">
                  Experiență și coordonare
                </span>
                <h2 className="section-title mt-2 mb-5">Din 1999, cu coordonare directă</h2>
                <p className="text-dark-300 leading-relaxed mb-4">
                  PRO TERM activează în domeniul HVAC din 1999. Conducerea actuală este implicată
                  direct în companie din 2008, atât în coordonarea tehnică, cât și în cea
                  administrativă.
                </p>
                <p className="text-dark-300 leading-relaxed">
                  Această continuitate ne permite să gestionăm atât intervenții curente, cât și
                  proiecte HVAC complexe, cu aceeași atenție la detalii.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl bg-hero-gradient shadow-primary overflow-hidden flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div className="relative text-center px-8">
                    <Users size={40} className="text-white/80 mx-auto mb-4" />
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                      Activitate HVAC din 1999
                    </p>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Conducerea actuală este implicată direct în PRO TERM din 2008.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-brand font-semibold text-sm uppercase tracking-widest">
                Cum lucrăm
              </span>
              <h2 className="section-title mt-2">Proiecte gestionate complet, de la idee la predare</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {howWeWork.map((text) => (
                <div key={text} className="card flex gap-4">
                  <ClipboardCheck size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-dark-300 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-light-200">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl bg-primary p-8 md:p-10 text-white shadow-card md:flex md:items-center md:justify-between md:gap-8">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Ai un proiect HVAC comercial sau industrial?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                  Vezi cum arată un proiect complet la PRO TERM: proiectare, furnizare, execuție,
                  punere în funcțiune și predare la cheie.
                </p>
              </div>
              <Link
                href="/servicii/proiecte-hvac-romania"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary transition hover:bg-light-200 md:mt-0"
              >
                Vezi proiecte HVAC
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              Ai nevoie de echipamente, service sau un proiect HVAC?
            </h2>
            <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
              Spune-ne ce ai nevoie, iar noi îți putem propune pașii potriviți pentru evaluare și
              ofertare.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#contact" className="btn-primary px-8 py-4 text-base">
                Solicită o ofertă
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/produse"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all text-base"
              >
                Vezi produsele
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
