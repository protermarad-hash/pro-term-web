import { CheckCircle2, FileCheck2, ShieldCheck, UsersRound, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const highlights = [
  'Firmă din Arad cu activitate în HVAC din 1999',
  'Echipă de 6 specialiști, cu comunicare directă și responsabilitate clară',
  'Dealer oficial și service zonal pentru Gree, Midea și Yamato',
  'Certificare ISO 9001 pentru managementul calității',
  'Certificat F-Gas / AGFR pentru lucrări cu agenți frigorifici',
  'Vânzare echipamente, consultanță, montaj, service și mentenanță',
];

const cards = [
  { icon: UsersRound, title: '6 specialiști', text: 'Echipă locală, implicată direct în recomandare, montaj și suport.' },
  { icon: ShieldCheck, title: 'Dealer oficial', text: 'Partener Gree, Midea și Yamato pentru vânzare și service zonal.' },
  { icon: FileCheck2, title: 'ISO 9001 & F-Gas', text: 'Certificări pentru calitate și lucrări cu agenți frigorifici.' },
  { icon: Wrench, title: 'Montaj & service', text: 'Nu vindem doar produsul: putem asigura și instalarea corectă.' },
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

            <div className="absolute -bottom-6 -right-3 rounded-2xl bg-accent p-5 text-white shadow-accent sm:-right-6">
              <div className="font-heading text-4xl font-bold">25+</div>
              <div className="mt-1 max-w-32 text-sm leading-tight text-white/85">ani experiență în domeniu</div>
            </div>
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-accent">
              Despre PRO TERM
            </span>
            <h2 className="section-title mt-3 mb-5">
              Dealer oficial și service zonal pentru Gree, Midea și Yamato.
            </h2>
            <p className="mb-4 leading-relaxed text-dark-300">
              PRO TERM este o firmă din Arad care lucrează în domeniul HVAC din 1999. Ne concentrăm pe soluții practice: alegerea echipamentului potrivit, montaj corect, service și suport după instalare.
            </p>
            <p className="mb-8 leading-relaxed text-dark-300">
              Suntem o echipă de 6 specialiști, cu certificare ISO 9001 și certificat F-Gas / AGFR. Pentru magazinul online păstrăm aceeași abordare: poți vedea produse și prețuri, dar poți cere și verificare tehnică înainte să cumperi.
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
