import { Calendar, BadgeCheck, MapPin, Headphones, Lightbulb, UsersRound } from 'lucide-react';

const reasons = [
  {
    icon: Calendar,
    title: 'Experiență din 1999',
    description:
      'Peste 25 de ani de activitate în domeniul HVAC înseamnă soluții alese mai atent, montaj mai bine planificat și recomandări bazate pe experiență practică.',
    color:   'text-accent',
    bgGrad:  'from-accent/5 to-accent/10',
    border:  'border-accent/20',
  },
  {
    icon: UsersRound,
    title: 'Echipă de 6 specialiști',
    description:
      'Lucrezi cu o echipă locală, restrânsă, unde comunicarea este directă și fiecare lucrare este urmărită cu atenție de la ofertă până la service.',
    color:   'text-primary',
    bgGrad:  'from-primary/5 to-primary/10',
    border:  'border-primary/20',
  },
  {
    icon: BadgeCheck,
    title: 'Dealer oficial Gree, Midea și Yamato',
    description:
      'Pentru aceste branduri oferim vânzare, suport, recomandare de produs și service zonal, cu informații tehnice corecte și actualizate.',
    color:   'text-brand',
    bgGrad:  'from-brand/5 to-brand/10',
    border:  'border-brand/20',
  },
  {
    icon: MapPin,
    title: 'Suport local în Arad',
    description:
      'Suntem aproape de client pentru verificări, montaj, intervenții și recomandări. Pentru proiecte speciale, discutăm punctual disponibilitatea.',
    color:   'text-accent',
    bgGrad:  'from-accent/5 to-accent/10',
    border:  'border-accent/20',
  },
  {
    icon: Headphones,
    title: 'Service după vânzare',
    description:
      'După achiziție, poți apela la noi pentru montaj, verificări, mentenanță și suport tehnic pentru echipamentele comercializate.',
    color:   'text-primary',
    bgGrad:  'from-primary/5 to-primary/10',
    border:  'border-primary/20',
  },
  {
    icon: Lightbulb,
    title: 'Consultanță înainte de cumpărare',
    description:
      'Te ajutăm să alegi corect capacitatea aparatului, accesoriile necesare și varianta potrivită pentru spațiul tău, nu doar produsul cel mai ieftin.',
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
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            De ce PRO TERM
          </span>
          <h2 className="section-title mt-2">
            Experiență mare, echipă restrânsă, suport direct.
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Pentru echipamente HVAC contează alegerea corectă, montajul și suportul după vânzare. De aceea combinăm magazinul online cu recomandare tehnică reală.
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

        <div className="mt-16 text-center rounded-3xl border border-slate-100 bg-light-200 p-8">
          <p className="text-dark-300 text-sm uppercase tracking-widest font-medium mb-6">
            Branduri principale pentru care oferim vânzare și suport zonal
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {['GREE', 'MIDEA', 'YAMATO'].map((brand) => (
              <span key={brand} className="font-bold text-primary text-2xl tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
