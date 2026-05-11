import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Calendar,
  Building2,
  BadgeCheck,
  Users,
  ArrowRight,
  Award,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre PRO TERM SRL | 25+ ani HVAC',
  description:
    'Aflați povestea PRO TERM SRL, fondată în 1999 în Arad. 25+ ani de experiență în instalații HVAC industriale și civile pe întreg teritoriul României.',
};

const timeline = [
  {
    year: '1999',
    title: 'Fondarea companiei',
    description:
      'PRO TERM SRL este înregistrată în Arad cu capital integral românesc. Primele proiecte vizează instalații de climatizare pentru spații comerciale și rezidențiale din Arad și împrejurimi.',
  },
  {
    year: '2003',
    title: 'Extindere în instalații industriale',
    description:
      'Echipa obține autorizațiile ISCIR necesare și finalizează primele contracte majore cu unități industriale din zona de vest a României — hale de producție și depozite frigorifice.',
  },
  {
    year: '2008',
    title: 'Certificare ISO și expansiune națională',
    description:
      'PRO TERM obține certificarea ISO 9001, deschide un depozit de piese și extinde activitatea la nivel național, cu proiecte în Cluj, Timișoara, București și alte centre regionale.',
  },
  {
    year: '2015',
    title: 'Parteneriate cu producători de top',
    description:
      'Semnăm acorduri de parteneriat direct cu Daikin, Midea și LG, devenind distribuitor și service autorizat. Echipa depășește 20 de angajați specializați.',
  },
  {
    year: '2020',
    title: 'Digitalizare și soluții smart',
    description:
      'Integrăm sisteme de monitorizare și control de la distanță pentru instalațiile clienților. Lansăm contractele de mentenanță preventivă cu raportare digitală lunară.',
  },
  {
    year: '2024',
    title: '25 de ani — un jalon de referință',
    description:
      'Aniversăm 25 de ani de activitate continuă cu 500+ proiecte finalizate, o echipă de 30 de specialiști și clienți fideli din toate sectoarele economiei românești.',
  },
];

const values = [
  {
    icon: CheckCircle2,
    title: 'Calitate fără compromisuri',
    description:
      'Folosim exclusiv echipamente certificate de la producători de top și executăm lucrările conform normativelor tehnice în vigoare.',
  },
  {
    icon: Users,
    title: 'Parteneriat pe termen lung',
    description:
      'Nu ne interesează tranzacții unice. Construim relații de durată bazate pe transparență, respectarea angajamentelor și suport continuu.',
  },
  {
    icon: Building2,
    title: 'Experiență industrială și civilă',
    description:
      'Înțelegem atât cerințele tehnice complexe ale mediului industrial, cât și așteptările de confort și design ale spațiilor civile și rezidențiale.',
  },
  {
    icon: Award,
    title: 'Responsabilitate față de mediu',
    description:
      'Promovăm soluțiile cu eficiență energetică ridicată și refrigeranți cu impact redus asupra mediului (R-32, CO₂), conform directivelor europene.',
  },
];

const authorizations = [
  { label: 'ANRE',       description: 'Autorizație electrică pentru instalații sub tensiune' },
  { label: 'ISCIR',      description: 'Autorizație pentru recipiente sub presiune și instalații frigorifice' },
  { label: 'F-Gas',      description: 'Certificare pentru manipularea agenților frigorifici fluorurați' },
  { label: 'ISO 9001',   description: 'Sistem de management al calității certificat internațional' },
  { label: 'Daikin D1',  description: 'Distribuitor și service autorizat Daikin România' },
  { label: 'Midea Gold', description: 'Partener Gold Midea pentru România' },
];

export default function DesprePage() {
  return (
    <>
      <Header />
      <main>

        {/* Hero */}
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
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-sm mb-6">
              <Calendar size={14} />
              Fondată în 1999 · 25+ ani de experiență
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-white mb-6 leading-tight">
              Despre{' '}
              <span className="text-brand">PRO TERM</span>
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
              O companie românească fondată în Arad, cu 25 de ani de expertiză în proiectarea
              și instalarea sistemelor HVAC pentru sectorul industrial și civil.
            </p>
          </div>
        </section>

        {/* Cine suntem */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="text-brand font-semibold text-sm uppercase tracking-widest">
                  Cine suntem
                </span>
                <h2 className="section-title mt-2 mb-5">
                  25 de ani în slujba confortului tău
                </h2>
                <p className="text-dark-300 leading-relaxed mb-4">
                  PRO TERM SRL a luat naștere în 1999 în Arad, pornind de la o echipă
                  restrânsă de ingineri cu pasiune pentru tehnologie și calitate. De la
                  primele proiecte de climatizare rezidențiale, am crescut constant,
                  extinzând domeniul de activitate spre instalații industriale complexe.
                </p>
                <p className="text-dark-300 leading-relaxed mb-4">
                  Astăzi, PRO TERM înseamnă 30 de specialiști, o flotă proprie de
                  intervenție, un depozit logistic complet echipat și relații solide cu
                  cei mai importanți producători de echipamente HVAC din lume.
                </p>
                <p className="text-dark-300 leading-relaxed mb-8">
                  Deservim clienți din industria alimentară, farmaceutică, retail, HoReCa,
                  instituții publice și proprietari privați din toată România. Fiecare
                  proiect, indiferent de dimensiune, beneficiază de aceeași atenție la
                  detaliu și standarde ridicate de execuție.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { val: '1999', lbl: 'Fondată în Arad' },
                    { val: '500+', lbl: 'Proiecte finalizate' },
                    { val: '30',   lbl: 'Specialiști în echipă' },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} className="text-center">
                      <div className="text-3xl font-bold font-heading text-primary">{val}</div>
                      <div className="text-xs text-dark-300 mt-1">{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl bg-hero-gradient shadow-primary overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
                    <Image
                      src="/logo-proterm.jpg"
                      alt="PRO TERM SRL"
                      width={220}
                      height={66}
                      className="h-16 w-auto object-contain opacity-90 mb-4"
                    />
                    <p className="text-white/70 text-sm text-center">
                      Soluții HVAC Complete · 1999–prezent
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card-hover p-4 w-40">
                  <div className="text-3xl font-bold text-brand font-heading">25+</div>
                  <div className="text-dark-300 text-xs mt-0.5 leading-tight">
                    Ani de experiență continuă
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-light-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-brand font-semibold text-sm uppercase tracking-widest">
                Istoria noastră
              </span>
              <h2 className="section-title mt-2">De la 1999 până azi</h2>
              <p className="section-subtitle mx-auto text-center">
                25 de ani de creștere continuă, proiecte remarcabile și echipă dedicată.
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={item.year} className="flex gap-6">
                    {/* Year bubble */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center shadow-primary z-10 relative">
                      <span className="text-white text-[10px] font-bold leading-none text-center">
                        {item.year}
                      </span>
                    </div>

                    <div className={`card flex-1 mb-0 ${i % 2 === 1 ? 'border-l-4 border-brand/30' : 'border-l-4 border-primary/30'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="font-bold font-heading text-dark mb-1">
                        {item.title}
                      </h3>
                      <p className="text-dark-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Misiune și valori */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-brand font-semibold text-sm uppercase tracking-widest">
                Misiune & valori
              </span>
              <h2 className="section-title mt-2">
                Ce ne ghidează în fiecare proiect
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map(({ icon: Icon, title, description }) => (
                <div key={title} className="card flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold font-heading text-dark mb-1">{title}</h3>
                    <p className="text-dark-300 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Autorizații */}
        <section className="py-20 bg-light-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-brand font-semibold text-sm uppercase tracking-widest">
                Autorizații & certificări
              </span>
              <h2 className="section-title mt-2">
                Lucrăm autorizat și certificat
              </h2>
              <p className="section-subtitle mx-auto text-center">
                Toate lucrările sunt executate de personal autorizat, cu documentație
                completă și conformitate cu normativele în vigoare.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {authorizations.map(({ label, description }) => (
                <div key={label} className="card flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center flex-shrink-0">
                    <BadgeCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold font-heading text-dark">{label}</div>
                    <div className="text-dark-300 text-xs mt-1 leading-relaxed">
                      {description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              Hai să construim ceva împreună
            </h2>
            <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
              25 de ani de experiență sunt la dispoziția ta. Contactează-ne pentru
              o consultanță tehnică gratuită, fără niciun angajament.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#contact" className="btn-primary px-8 py-4 text-base">
                Solicită consultanță gratuită
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/produse"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all text-base"
              >
                Vezi produsele noastre
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
