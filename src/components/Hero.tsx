import { ArrowRight, MapPin, Truck, Building2 } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '25+',   label: 'Ani de experiență' },
  { value: '500+',  label: 'Proiecte finalizate' },
  { value: '1999',  label: 'Fondată în Arad' },
  { value: '2 ani', label: 'Garanție extinsă' },
];

const coverage = [
  {
    icon: MapPin,
    title: 'Montaj & Service',
    detail: 'Arad și Timiș',
    color: 'bg-brand/20 text-brand',
  },
  {
    icon: Truck,
    title: 'Livrare produse',
    detail: 'Toată România',
    color: 'bg-primary/20 text-primary-200',
  },
  {
    icon: Building2,
    title: 'Proiecte VRV comerciale',
    detail: 'La nivel național',
    color: 'bg-accent/20 text-accent',
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      <div className="absolute inset-0 bg-hero-gradient opacity-95" />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-brand/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-primary/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Dealer autorizat Gree · Midea · Yamato — din 1999
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white font-heading leading-tight mb-6">
            Montaj & Service HVAC{' '}
            <span className="text-brand">în Arad și Timiș</span>
            <br />
            <span className="text-3xl md:text-4xl text-white/80 font-medium">
              Produse cu livrare în toată România
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
            <strong className="text-white">PRO TERM SRL</strong> — instalăm și întreținem sisteme de
            climatizare în județele Arad și Timiș. Vindem echipamente Gree, Midea și Yamato cu livrare
            națională. Proiecte VRV comerciale și industriale în colaborare cu antreprenori din toată România.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/produse" className="btn-primary text-base px-8 py-4">
              Vezi produse
              <ArrowRight size={20} />
            </Link>
            <Link href="/#contact" className="btn-outline text-base px-8 py-4">
              Solicită ofertă gratuită
            </Link>
          </div>

          {/* Coverage badges */}
          <div className="flex flex-wrap gap-3 mb-12">
            {coverage.map(({ icon: Icon, title, detail, color }) => (
              <div
                key={title}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3"
              >
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold leading-none">{title}</div>
                  <div className="text-white/60 text-xs mt-0.5">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl md:max-w-none">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-bold text-white font-heading">{stat.value}</div>
              <div className="text-white/70 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L1440 80L1440 40C1200 0 960 60 720 40C480 20 240 60 0 40L0 80Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
