import { Calendar, CheckCircle2, Layers, UsersRound, Network } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const cards = [
  {
    icon: Calendar,
    title: 'Din 1999 în HVAC',
    text: 'Activitate continuă în climatizare, încălzire și ventilație.',
  },
  {
    icon: UsersRound,
    title: 'Implicare directă',
    text: 'Conducerea actuală coordonează direct activitatea din 2008.',
  },
  {
    icon: Layers,
    title: 'Rezidențial, comercial, industrial',
    text: 'Soluții adaptate tipului de spațiu și complexității proiectului.',
  },
  {
    icon: Network,
    title: 'Colaboratori specializați',
    text: 'Pentru disciplinele neacoperite intern, lucrăm coordonat cu parteneri de execuție.',
  },
];

const highlights = [
  'Activitate HVAC din 1999, cu implicare directă a conducerii actuale din 2008',
  'Echipamente, montaj/service și proiecte HVAC complexe, sub aceeași coordonare',
  'Soluții pentru spații rezidențiale, comerciale și industriale',
  'Colaboratori specializați, folosiți transparent acolo unde proiectul o cere',
];

export default function About() {
  return (
    <section id="despre" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative">
            <div className="rounded-[2rem] border border-slate-100 bg-light-200 p-4 shadow-card">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_75%_80%,rgba(249,115,22,0.22),transparent_35%)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                  <span className="mb-5 rounded-2xl bg-white p-3 shadow-card">
                    <Image
                      src="/logo-proterm.jpg"
                      alt="PRO TERM"
                      width={210}
                      height={64}
                      className="h-14 w-auto object-contain"
                    />
                  </span>
                  <p className="max-w-sm text-sm font-medium leading-relaxed text-white/78">
                    Soluții HVAC, climatizare și instalații tehnice pentru clienți care vor lucru corect, nu doar un preț rapid.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-accent">
              De ce PRO TERM
            </span>
            <h2 className="section-title mt-3 mb-5">
              Activitate HVAC din 1999, abordare coordonată pentru fiecare proiect.
            </h2>
            <p className="mb-4 leading-relaxed text-dark-300">
              PRO TERM activează în domeniul HVAC din 1999. Conducerea actuală este implicată
              direct în activitatea firmei din 2008, atât pe partea tehnică, cât și administrativă.
            </p>
            <p className="mb-8 leading-relaxed text-dark-300">
              Oferim soluții pentru spații rezidențiale, comerciale și industriale: de la
              recomandarea și vânzarea echipamentului potrivit, până la montaj, service și
              proiecte HVAC complexe. Pentru specializările pe care nu le acoperim intern,
              lucrăm transparent cu colaboratori specializați.
            </p>

            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-slate-100 bg-light-200 p-4">
                  <Icon size={22} className="mb-3 text-primary" />
                  <h3 className="font-heading font-bold text-dark">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-dark-300">{text}</p>
                </div>
              ))}
            </div>

            <ul className="mb-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-secondary" />
                  <span className="text-sm text-dark-300">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/despre" className="inline-flex items-center gap-2 font-bold text-primary transition-colors hover:text-accent">
              Află mai multe despre noi →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
