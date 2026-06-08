import { Building2, Factory, Store, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const proiecte = [
  {
    icon: Building2,
    tag: 'Sistem VRV',
    title: 'Centru comercial — 2.400 mp',
    location: 'Craiova, 2023',
    specs: [
      'Sistem VRV 48 kW — 4 unități exterioare',
      '32 unități interioare tip casetă 4 căi',
      'Control centralizat BMS cu programare pe zone',
      'Recuperare căldură între zone simultan',
    ],
    color: 'from-blue-600/20 to-cyan-500/10 border-blue-500/20',
    iconColor: 'bg-blue-600/10 text-blue-600',
  },
  {
    icon: Factory,
    tag: 'Climatizare industrială',
    title: 'Hală de producție — 6.000 mp',
    location: 'Zona Vest, 2022',
    specs: [
      'Chiller industrial 120 kW apă glacială',
      'Sistem ventiloconvectoare 48 unități',
      'Distribuție aer cald/rece pe circuite separate',
      'Automatizare cu senzori de temperatură/umiditate',
    ],
    color: 'from-emerald-600/20 to-green-500/10 border-emerald-500/20',
    iconColor: 'bg-emerald-600/10 text-emerald-600',
  },
  {
    icon: Store,
    tag: 'Rețea retail',
    title: '14 puncte de vânzare — Arad & Timiș',
    location: 'Arad și Timiș, 2021–prezent',
    specs: [
      '14 sisteme split/multi-split 9.000–18.000 BTU',
      'Montaj și punere în funcțiune uniformizată',
      'Contract mentenanță preventivă anual activ',
      'Intervenție service garantată în 4 ore',
    ],
    color: 'from-violet-600/20 to-purple-500/10 border-violet-500/20',
    iconColor: 'bg-violet-600/10 text-violet-600',
  },
];

export default function ProiecteRealizate() {
  return (
    <section id="proiecte" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-brand font-semibold text-sm uppercase tracking-widest">
            Referințe comerciale
          </span>
          <h2 className="section-title mt-2">Proiecte Reprezentative</h2>
          <p className="section-subtitle mx-auto text-center">
            Executăm proiecte HVAC complexe pentru retail, industrie și spații comerciale —
            în colaborare cu antreprenori generali din toată România.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
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
              Proiecte mari & colaborări cu antreprenori
            </p>
            <h3 className="text-xl font-bold font-heading text-white">
              Lucrezi pe proiecte VRV sau climatizare comercială?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Colaborăm cu antreprenori generali și instalatori pentru proiecte la nivel național.
            </p>
          </div>
          <Link
            href="/#contact"
            className="flex items-center gap-2 bg-white text-dark font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Discutăm proiectul
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
