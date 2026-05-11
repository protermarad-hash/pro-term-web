import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const highlights = [
  'Fondată în 1999 în Arad — 25+ ani de experiență continuă',
  'Instalații HVAC industriale și civile pe întreg teritoriul României',
  'Echipă autorizată ANRE și ISCIR',
  'Parteneriate cu Daikin, Midea, Gree, LG, Carrier, Trane',
  'Proiecte de la 50 m² până la hale industriale de zeci de mii m²',
  'Service post-vânzare cu garanție extinsă 2 ani',
];

export default function About() {
  return (
    <section id="despre" className="py-20 bg-light-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                  alt="PRO TERM"
                  width={200}
                  height={60}
                  className="h-14 w-auto object-contain opacity-90 mb-5"
                />
                <p className="text-white/80 text-center text-sm">
                  Soluții HVAC Complete din 1999
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-card-hover p-5 w-48">
              <div className="text-4xl font-bold text-brand font-heading">25+</div>
              <div className="text-dark-300 text-sm mt-1 leading-tight">
                Ani de experiență în HVAC
              </div>
            </div>
          </div>

          <div>
            <span className="text-brand font-semibold text-sm uppercase tracking-widest">
              Despre noi
            </span>
            <h2 className="section-title mt-2 mb-4">
              Partenerul de Încredere în HVAC din 1999
            </h2>
            <p className="text-dark-300 leading-relaxed mb-4">
              PRO TERM SRL a fost fondată în 1999 în Arad cu o misiune clară: să ofere
              soluții HVAC complete, fiabile și eficiente energetic atât pentru sectorul
              industrial, cât și pentru cel civil și rezidențial.
            </p>
            <p className="text-dark-300 leading-relaxed mb-8">
              Cu peste 25 de ani de activitate neîntreruptă, am devenit un nume de referință
              în domeniu. Deservim clienți din industria alimentară, farmaceutică, retail,
              HoReCa și instituții publice din toată România.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-dark-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/despre"
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-600 transition-colors"
            >
              Citește povestea noastră completă →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
