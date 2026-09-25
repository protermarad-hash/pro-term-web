import { Building2, Home, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const proiecte = [
  {
    icon: Building2,
    tag: 'Proiect HVAC complet',
    title: 'Sediu de presă',
    location: 'Arad',
    specs: [
      'Ventilație cu tubulatură',
      'Răcire cu apă răcită de la chiller',
      'Două centrale pe gaz de 50 kW, punct termic, pompe și distribuții',
      'Furnizare materiale/echipamente, proiectare prin colaboratori, execuție completă',
    ],
    color: 'from-blue-600/20 to-cyan-500/10 border-blue-500/20',
    iconColor: 'bg-blue-600/10 text-blue-600',
  },
  {
    icon: Home,
    tag: 'Proiect HVAC + sanitar',
    title: 'Casa Tineretului',
    location: 'Vladimirescu',
    specs: [
      'Ventilație (CTA) și răcire cu chiller',
      'Centrale pe gaz și încălzire cu radiatoare',
      'Instalații sanitare pentru băi și bucătării',
      'Furnizare materiale/echipamente, proiectare prin colaboratori, execuție completă',
    ],
    color: 'from-emerald-600/20 to-green-500/10 border-emerald-500/20',
    iconColor: 'bg-emerald-600/10 text-emerald-600',
  },
];

export default function ProiecteRealizate() {
  return (
    <section id="proiecte" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-brand font-semibold text-sm uppercase tracking-widest">
            Proiecte reale
          </span>
          <h2 className="section-title mt-2">Proiecte HVAC executate de PRO TERM</h2>
          <p className="section-subtitle mx-auto text-center">
            Proiecte complete: proiectare prin colaboratori, furnizare echipamente și materiale,
            execuție și punere în funcțiune.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {proiecte.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`card bg-gradient-to-br ${p.color} border`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${p.iconColor} flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-dark-300 bg-white/60 px-2 py-1 rounded-full">
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-dark mb-1">{p.title}</h3>
                <p className="text-xs text-dark-300 mb-4 font-medium">{p.location}</p>

                <ul className="space-y-2">
                  {p.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-dark-300 leading-relaxed">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-dark rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
              Proiecte HVAC comerciale și industriale
            </p>
            <h3 className="text-xl font-bold font-heading text-white">
              Ai un proiect HVAC comercial sau industrial?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Coordonăm proiectarea, furnizarea și execuția, la nivel național.
            </p>
          </div>
          <Link
            href="/servicii/proiecte-hvac-romania"
            className="flex items-center gap-2 bg-white text-dark font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Vezi Proiecte HVAC
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
