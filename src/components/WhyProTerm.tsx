import { FileCheck2, HandCoins, Headphones, MessageSquareText, PackageCheck, Wrench } from 'lucide-react';

const reasons = [
  { icon: MessageSquareText, text: 'Recomandări tehnice explicate clar' },
  { icon: PackageCheck, text: 'Echipamente originale și documentație completă' },
  { icon: FileCheck2, text: 'Soluții pentru locuințe, afaceri și industrie' },
  { icon: Wrench, text: 'Montaj, service și suport după achiziție' },
  { icon: HandCoins, text: 'Prețuri comunicate transparent' },
  { icon: Headphones, text: 'Experiență practică dobândită în lucrări reale' },
];

export default function WhyProTerm() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h2 className="section-title">De ce să alegi PRO TERM?</h2>
          <p className="mt-4 leading-relaxed text-dark-300">
            Nu vindem doar un aparat. Ne asigurăm că soluția aleasă este potrivită și poate funcționa corect în
            condițiile reale ale spațiului tău.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, text }, i) => (
            <li key={text} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-light-200 p-5">
              <Icon size={20} className={`mt-0.5 flex-shrink-0 ${i % 3 === 0 ? 'text-brand' : 'text-primary'}`} />
              <span className="text-sm font-medium leading-relaxed text-dark">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
