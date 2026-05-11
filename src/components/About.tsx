import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const highlights = [
  'Echipă de ingineri cu experiență de peste 15 ani în domeniu',
  'Autorizații ISCIR, F-Gas și certificare ISO 9001',
  'Parteneriate cu Daikin, Midea, Gree, LG, Carrier',
  'Depozit propriu de piese de schimb pentru intervenții rapide',
  'Soft propriu de monitorizare și diagnoză de la distanță',
  'Garanție extinsă 2 ani pe orice instalație nouă',
];

export default function About() {
  return (
    <section id="despre" className="py-20 bg-light-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-hero-gradient overflow-hidden shadow-primary">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
                <Image
                  src="/logo-proterm.jpg"
                  alt="PROTERM"
                  width={200}
                  height={60}
                  className="h-14 w-auto object-contain opacity-90 mb-4"
                />
                <p className="text-white/80 text-center text-sm">
                  Soluții HVAC Complete
                </p>
              </div>
            </div>

            {/* Floating stat */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-card-hover p-5 w-44">
              <div className="text-4xl font-bold text-brand font-heading">500+</div>
              <div className="text-dark-300 text-sm mt-1 leading-tight">
                Proiecte finalizate cu succes
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <span className="text-brand font-semibold text-sm uppercase tracking-widest">
              Despre noi
            </span>
            <h2 className="section-title mt-2 mb-4">
              Partenerul de Încredere în HVAC
            </h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              PROTERM a fost fondată în 2008 cu o misiune clară: să aducă pe
              piața românească soluții HVAC de înaltă calitate, susținute de
              service rapid și profesionist.
            </p>
            <p className="text-dark-300 leading-relaxed mb-8">
              Astăzi, cu o echipă de 30 de specialiști și o flotă auto proprie,
              deservim clienți din industria alimentară, retail, HoReCa,
              farmaceutică și logistică în toată România.
            </p>

            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
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
