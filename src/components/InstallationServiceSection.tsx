import Link from 'next/link';
import { CheckCircle2, Wrench } from 'lucide-react';

const services = [
  'Montaj pentru aparate de aer condiționat',
  'Instalarea pompelor de căldură',
  'Service și diagnosticare',
  'Întreținere și igienizare',
  'Punere în funcțiune',
  'Intervenții pentru clienții din zona Arad',
];

export default function InstallationServiceSection() {
  return (
    <section className="bg-light-200 py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Wrench size={22} />
            </span>
            <h2 className="section-title mt-5">Un echipament bun are nevoie de un montaj corect.</h2>
            <p className="mt-4 leading-relaxed text-dark-300">
              Modul în care este instalat influențează consumul, randamentul și durata de viață a sistemului. Echipele
              PRO TERM se ocupă de instalare, verificări și punere în funcțiune, astfel încât echipamentul să
              funcționeze așa cum trebuie.
            </p>
            <Link href="/servicii/montaj" className="btn-primary mt-7 w-fit">
              Solicită montaj sau service
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-card">
                <CheckCircle2 size={19} className="mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-sm leading-relaxed text-dark-300">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
