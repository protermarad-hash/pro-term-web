import { Calendar, Building2, BadgeCheck, MapPin, Headphones, Lightbulb } from 'lucide-react';

const reasons = [
  {
    icon: Calendar,
    title: 'Fondată în 1999 — 25+ ani',
    description:
      'Peste 25 de ani de activitate continuă înseamnă experiență acumulată în mii de proiecte, de la instalații rezidențiale la obiective industriale de mari dimensiuni.',
    color:   'text-accent',
    bgGrad:  'from-accent/5 to-accent/10',
    border:  'border-accent/20',
  },
  {
    icon: Building2,
    title: 'Industrial și Civil',
    description:
      'Proiectăm și instalăm sisteme HVAC atât pentru hale și spații industriale complexe, cât și pentru clădiri de birouri, locuințe și spații comerciale.',
    color:   'text-primary',
    bgGrad:  'from-primary/5 to-primary/10',
    border:  'border-primary/20',
  },
  {
    icon: BadgeCheck,
    title: 'Autorizat ANRE & ISCIR',
    description:
      'Echipa noastră deține autorizațiile ANRE și ISCIR necesare pentru lucrări la instalații sub presiune, frigorifice și electrice. Toate lucrările sunt documentate și certificate.',
    color:   'text-brand',
    bgGrad:  'from-brand/5 to-brand/10',
    border:  'border-brand/20',
  },
  {
    icon: MapPin,
    title: 'Proiecte în toată România',
    description:
      'Operăm pe întreg teritoriul României, cu echipe mobile rapid deployabile. De la Arad — baza noastră — până la orice localitate din țară.',
    color:   'text-accent',
    bgGrad:  'from-accent/5 to-accent/10',
    border:  'border-accent/20',
  },
  {
    icon: Headphones,
    title: 'Service post-vânzare garantat',
    description:
      'Fiecare instalație beneficiază de garanție de 2 ani și acces la service preventiv și corectiv. Intervenim rapid la orice defecțiune, cu piese originale din stoc propriu.',
    color:   'text-primary',
    bgGrad:  'from-primary/5 to-primary/10',
    border:  'border-primary/20',
  },
  {
    icon: Lightbulb,
    title: 'Consultanță tehnică gratuită',
    description:
      'Înainte de orice contract, oferim o evaluare tehnică gratuită la sediul tău. Inginerii noștri dimensionează corect sistemul și îți prezintă mai multe variante de soluții.',
    color:   'text-brand',
    bgGrad:  'from-brand/5 to-brand/10',
    border:  'border-brand/20',
  },
];

export default function WhyUs() {
  return (
    <section id="avantaje" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-brand font-semibold text-sm uppercase tracking-widest">
            De ce PRO TERM
          </span>
          <h2 className="section-title mt-2">
            25 de ani în serviciul tău
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Nu suntem doar furnizori — suntem parteneri pe termen lung, cu angajament față de
            calitate și performanță dovedită din 1999.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className={`rounded-2xl border ${r.border} bg-gradient-to-br ${r.bgGrad} p-7 flex gap-5`}
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Icon size={22} className={r.color} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-dark font-heading mb-2">
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

        <div className="mt-16 text-center">
          <p className="text-dark-300 text-sm uppercase tracking-widest font-medium mb-6">
            Parteneri principali de echipamente
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40">
            {['DAIKIN', 'MIDEA', 'GREE', 'LG', 'CARRIER', 'TRANE', 'MITSUBISHI'].map(
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
