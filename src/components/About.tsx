import { CheckCircle2 } from 'lucide-react';

const highlights = [
  'Echipă de ingineri cu experiență de peste 15 ani în domeniu',
  'Autorizații ISCIR, F-Gas și certificare ISO 9001',
  'Parteneriate cu Danfoss, Bitzer, Embraco, Daikin',
  'Depozit propriu de piese de schimb pentru intervenții rapide',
  'Soft propriu de monitorizare și diagnoză de la distanță',
  'Garanție extinsă 2 ani pe orice instalație nouă',
];

export default function About() {
  return (
    <section id="despre" className="py-20 bg-light-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-hero-gradient overflow-hidden shadow-primary">
              {/* Decorative pattern inside */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-10">
                <div className="text-7xl font-bold font-heading opacity-30 mb-4">FT</div>
                <p className="text-2xl font-bold font-heading">
                  Experiență de 15+ ani
                </p>
                <p className="text-white/70 mt-2">
                  în soluții frigorifice industriale și comerciale
                </p>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-card-hover p-5 w-44">
              <div className="text-4xl font-bold text-accent font-heading">500+</div>
              <div className="text-dark-300 text-sm mt-1 leading-tight">
                Proiecte finalizate cu succes
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              Despre noi
            </span>
            <h2 className="section-title mt-2 mb-4">
              Partenerul de Încredere în Refrigerare
            </h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              FRIGOTERM a fost fondată în 2008 cu o misiune clară: să aducă pe
              piața românească soluții frigorifice de înaltă calitate, susținute
              de service rapid și profesionist.
            </p>
            <p className="text-dark-300 leading-relaxed mb-8">
              Astăzi, cu o echipă de 30 de specialiști și o flotă auto proprie,
              deservim clienți din industria alimentară, retail, HoReCa,
              farmaceutică și logistică în toată România.
            </p>

            {/* Highlights */}
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-secondary flex-shrink-0 mt-0.5"
                  />
                  <span className="text-dark-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
