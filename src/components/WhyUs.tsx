import { Clock, HeadphonesIcon, BadgeCheck, TrendingUp } from 'lucide-react';

const reasons = [
  {
    icon: Clock,
    title: 'Intervenție în 4 ore',
    description:
      'Răspundem la urgențe frigorifice în maximum 4 ore, 24/7, 365 de zile pe an. Știm că fiecare oră contează pentru afacerea ta.',
    color: 'text-accent',
    bgGrad: 'from-accent/5 to-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: HeadphonesIcon,
    title: 'Suport tehnic dedicat',
    description:
      'Fiecare client are un inginer de cont dedicat și acces direct la echipa de suport tehnic, fără call-center sau cozi de așteptare.',
    color: 'text-primary',
    bgGrad: 'from-primary/5 to-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: BadgeCheck,
    title: 'Calitate garantată',
    description:
      'Lucrăm exclusiv cu echipamente din top 5 producători mondiali. Garanție 2 ani pe instalații noi, piesele originale verificabile.',
    color: 'text-secondary',
    bgGrad: 'from-secondary/5 to-secondary/10',
    border: 'border-secondary/20',
  },
  {
    icon: TrendingUp,
    title: 'Eficiență energetică',
    description:
      'Proiectăm sisteme optimizate pentru consum minim de energie. Clienții noștri economisesc în medie 25% din costurile energetice.',
    color: 'text-accent',
    bgGrad: 'from-accent/5 to-accent/10',
    border: 'border-accent/20',
  },
];

export default function WhyUs() {
  return (
    <section id="avantaje" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            De ce FRIGOTERM
          </span>
          <h2 className="section-title mt-2">
            Avantajele care fac diferența
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Nu suntem doar furnizori — suntem parteneri pe termen lung, cu angajament față de performanța instalațiilor tale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className={`rounded-2xl border ${r.border} bg-gradient-to-br ${r.bgGrad} p-7 flex gap-5`}
              >
                <div
                  className={`w-12 h-12 flex-shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center`}
                >
                  <Icon size={24} className={r.color} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark font-heading mb-2">
                    {r.title}
                  </h3>
                  <p className="text-dark-300 text-sm leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clients band */}
        <div className="mt-16 text-center">
          <p className="text-dark-300 text-sm uppercase tracking-widest font-medium mb-6">
            Parteneri de echipamente
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['DANFOSS', 'BITZER', 'DAIKIN', 'EMBRACO', 'COPELAND', 'CARRIER'].map(
              (brand) => (
                <span key={brand} className="font-bold text-dark-300 text-lg tracking-tight">
                  {brand}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
