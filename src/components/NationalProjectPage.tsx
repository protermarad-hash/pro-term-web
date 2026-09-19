import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Handshake,
  Layers,
  MapPinned,
  MessageCircle,
  PackageCheck,
  Wrench,
  Zap,
} from 'lucide-react';

const phone = '40749025610';

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const projectSteps = [
  {
    icon: ClipboardCheck,
    title: 'Analiză și cerințe tehnice',
    description: 'Stabilim destinația spațiului, cerințele de temperatură și condițiile tehnice ale proiectului.',
  },
  {
    icon: FileText,
    title: 'Proiectare',
    description: 'Prin proiectanți colaboratori, atunci când proiectul o cere.',
  },
  {
    icon: PackageCheck,
    title: 'Furnizare',
    description: 'Echipamente și materiale pentru execuția lucrării.',
  },
  {
    icon: Wrench,
    title: 'Execuție',
    description: 'Montaj și instalare, coordonate unitar de echipa PRO TERM.',
  },
  {
    icon: Zap,
    title: 'Punere în funcțiune',
    description: 'Verificarea și pornirea instalației la parametrii tehnici stabiliți.',
  },
  {
    icon: Handshake,
    title: 'Predare la cheie',
    description: 'Lucrarea este predată gata de utilizare.',
  },
];

const capabilities = [
  'Analiză tehnică pentru spații comerciale, industriale, birouri, retail sau HoReCa',
  'Sisteme de climatizare, inclusiv soluții VRV/VRF, unde proiectul o cere',
  'Ventilație și centrale de tratare a aerului (CTA)',
  'Răcire cu chiller și instalații de încălzire cu cazane, pompe, distribuitoare și colectoare',
  'Furnizare echipamente și materiale, execuție și punere în funcțiune',
  'Deplasare la nivel național pentru proiecte mari, în funcție de complexitate și calendar',
];

const sectors = [
  'spații comerciale',
  'magazine și showroom-uri',
  'birouri',
  'hale și spații tehnice',
  'unități HoReCa',
  'proiecte complexe',
];

const caseStudies = [
  {
    title: 'Sediu de presă, Arad',
    icon: Building2,
    context:
      'PRO TERM a coordonat și realizat integral instalațiile HVAC pentru un sediu de presă din Arad, de la proiectare prin colaboratori și furnizarea echipamentelor până la execuție și predare.',
    items: [
      'Sistem de ventilație cu ducturi',
      'Răcire cu apă rece din chiller',
      'Încălzire cu 2 cazane pe gaz de 50 kW fiecare',
      'Punct termic, pompe, distribuitoare și colectoare',
      'Furnizare materiale și echipamente',
      'Proiectare prin colaboratori',
      'Execuție completă și predare finală',
    ],
  },
  {
    title: 'Casa Tineretului, Vladimirescu',
    icon: Layers,
    context:
      'La Casa Tineretului din Vladimirescu, PRO TERM a coordonat și executat un proiect complet de instalații HVAC și sanitare, incluzând proiectarea prin colaboratori, furnizarea și execuția.',
    items: [
      'Centrală de tratare a aerului (CTA)',
      'Instalație de apă caldă și rece',
      'Răcire cu chiller',
      'Încălzire cu cazane pe gaz și radiatoare',
      'Instalații sanitare pentru băi și bucătării',
      'Furnizare materiale și echipamente',
      'Proiectare prin colaboratori',
      'Execuție completă și predare finală',
    ],
  },
];

const faqs = [
  {
    question: 'Puteți gestiona proiectul complet, de la proiectare la punere în funcțiune?',
    answer: 'Da. Pentru proiecte care o cer, putem coordona proiectarea (prin proiectanți colaboratori), furnizarea echipamentelor și materialelor, execuția și punerea în funcțiune, până la predarea finală.',
  },
  {
    question: 'Puteți executa lucrări după proiectul tehnic al beneficiarului?',
    answer: 'Da. Dacă beneficiarul are deja un proiect tehnic, PRO TERM poate executa lucrarea pe baza acestuia.',
  },
  {
    question: 'Ce informații trebuie trimise pentru o ofertă de proiect HVAC?',
    answer: 'Sunt utile localitatea, destinația spațiului, suprafața, înălțimea, compartimentarea, planuri sau poze, cerințele de temperatură, programul de funcționare, termenul dorit și dacă există deja echipamente montate.',
  },
  {
    question: 'Vă deplasați în România pentru proiecte mari?',
    answer: 'Da. Pentru proiecte comerciale sau industriale suficient de complexe, PRO TERM poate analiza deplasarea la nivel național, în funcție de dimensiunea lucrării, calendar, acces și cerințele tehnice.',
  },
  {
    question: 'Lucrați cu sisteme VRV/VRF?',
    answer: 'Pentru proiectele care necesită astfel de soluții, putem analiza sisteme cu mai multe unități, inclusiv soluții de tip VRV/VRF, în funcție de spațiu, buget și cerințele tehnice.',
  },
  {
    question: 'Oferta se poate face doar din poze?',
    answer: 'Pentru o estimare inițială, pozele și detaliile tehnice pot ajuta. Pentru ofertă finală, proiectele mari pot necesita analiză suplimentară, discuție tehnică sau verificare la locație.',
  },
  {
    question: 'Oferiți și mentenanță după montaj?',
    answer: 'Da. Pentru proiecte comerciale și industriale, se pot discuta revizii periodice, mentenanță preventivă și service pentru menținerea funcționării corecte a echipamentelor.',
  },
];

export default function NationalProjectPage() {
  const whatsappUrl = buildWhatsAppUrl('Bună ziua, doresc să discut un proiect HVAC complet la nivel național.');

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
              PRO TERM gestionează proiecte HVAC complete pentru clienți comerciali și industriali: proiectare prin proiectanți colaboratori, furnizare echipamente și materiale, execuție, punere în funcțiune și predare la cheie. Pentru lucrări complexe, echipa se deplasează oriunde în România.
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

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-accent">Proces</span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Ce înseamnă un proiect complet la PRO TERM</h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-dark-300">
              Executăm și după proiectul tehnic furnizat de beneficiar, atunci când acesta există deja.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {projectSteps.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary">{index + 1}.</span>
                </div>
                <h3 className="font-heading text-base font-bold text-dark">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-dark-300">{description}</p>
              </div>
            ))}
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
          <div className="grid gap-8 lg:grid-cols-3 items-start">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-accent">Colaboratori</span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Colaboratori specializați</h2>
            </div>
            <div className="card lg:col-span-2">
              <div className="flex gap-4">
                <Handshake size={28} className="text-primary flex-shrink-0" />
                <p className="text-sm leading-relaxed text-dark-300">
                  Pentru disciplinele care nu sunt acoperite intern, PRO TERM lucrează transparent cu
                  colaboratori specializați — de exemplu pentru proiectare tehnică. Indiferent de câți
                  parteneri sunt implicați într-un proiect, coordonarea rămâne unitară, la nivelul echipei
                  PRO TERM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
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

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-accent">Proiecte reprezentative</span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark">Exemple de proiecte complete</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {caseStudies.map(({ title, icon: Icon, context, items }) => (
              <div key={title} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-dark">{title}</h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-dark-300">{context}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-dark-300">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-accent">Întrebări frecvente</span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-dark">FAQ proiecte HVAC mari</h2>
              <p className="mt-3 text-sm leading-relaxed text-dark-300">Răspunsuri utile pentru beneficiari comerciali sau industriali care doresc o ofertă tehnică.</p>
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
