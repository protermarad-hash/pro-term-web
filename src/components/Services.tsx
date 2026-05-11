import { Snowflake, Wind, Wrench, Factory, Thermometer, RefreshCw } from 'lucide-react';

const services = [
  {
    icon: Snowflake,
    title: 'Refrigerare Comercială',
    description:
      'Vitrine frigorifice, camere frigorifice și sisteme de răcire pentru supermarketuri, restaurante și depozite alimentare.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Factory,
    title: 'Refrigerare Industrială',
    description:
      'Soluții la scară largă pentru industria alimentară, farmaceutică și logistică. Sisteme cu amoniac, CO₂ și agenți frigorifici HFO.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Wind,
    title: 'Climatizare & HVAC',
    description:
      'Proiectare și instalare sisteme de climatizare pentru birouri, spații comerciale și clădiri industriale. VRF, chiller, unități centrale.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Thermometer,
    title: 'Camere Frigorifice',
    description:
      'Construcție și izolare camere frigorifice și congelatoare la comandă. Panouri sandwich premium, uși glisante și batante.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Wrench,
    title: 'Service & Mentenanță',
    description:
      'Service autorizat 24/7 pentru toate tipurile de echipamente frigorifice. Contracte de mentenanță preventivă și corectivă.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: RefreshCw,
    title: 'Recuperare Freon',
    description:
      'Recuperare și reîncărcare agent frigorific conform normelor europene. Personal certificat F-Gas. Documentație completă.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
];

export default function Services() {
  return (
    <section id="servicii" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest">
            Ce oferim
          </span>
          <h2 className="section-title mt-2">Servicii Complete de Refrigerare</h2>
          <p className="section-subtitle mx-auto text-center">
            De la proiectare la service post-vânzare — acoperim toate nevoile
            tale frigorifice cu echipă proprie calificată.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="card group hover:border-primary/20 border border-transparent cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={24} className={service.color} />
                </div>
                <h3 className="text-lg font-bold text-dark font-heading mb-2">
                  {service.title}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA bar */}
        <div className="mt-14 bg-card-gradient border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-dark font-heading">
              Ai nevoie de un proiect personalizat?
            </h3>
            <p className="text-dark-300 mt-1">
              Contactează-ne și primești o evaluare tehnică gratuită.
            </p>
          </div>
          <a href="#contact" className="btn-primary whitespace-nowrap">
            Cere ofertă gratuită
          </a>
        </div>
      </div>
    </section>
  );
}
