import Link from 'next/link';
import { CheckCircle2, Building2 } from 'lucide-react';

const capabilities = [
  'Sisteme VRV și VRF',
  'Centrale de tratare a aerului',
  'Chillere și rooftop-uri',
  'Ventilație și recuperare de căldură',
  'Automatizări HVAC',
  'Mentenanță și intervenții tehnice',
];

export default function CommercialIndustrialSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Building2 size={14} />
              Comercial & industrial
            </span>
            <h2 className="section-title mt-4">Soluții HVAC pentru afaceri și proiecte complexe</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-dark-300">
              Pentru spațiile comerciale și industriale, fiecare oprire, alegere greșită sau întârziere poate genera
              costuri. PRO TERM oferă soluții adaptate cerințelor reale ale proiectului și urmărește lucrarea până la
              funcționarea completă a instalației.
            </p>
            <Link href="/contact" className="btn-primary mt-7 w-fit">
              Discută proiectul cu un specialist
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {capabilities.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-light-200 p-4">
                <CheckCircle2 size={19} className="mt-0.5 flex-shrink-0 text-brand" />
                <span className="text-sm leading-relaxed text-dark-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
