import { ArrowRight, Shield, Zap, Award } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { value: '15+',  label: 'Ani experiență' },
  { value: '500+', label: 'Proiecte finalizate' },
  { value: '24/7', label: 'Servicii urgență' },
  { value: '100%', label: 'Clienți satisfăcuți' },
];

const badges = [
  { icon: Shield, text: 'Garanție 2 ani' },
  { icon: Zap,    text: 'Intervenție rapidă' },
  { icon: Award,  text: 'Autorizat ISCIR' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient opacity-95" />

      {/* Grid pattern */}
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

      {/* Glow blobs */}
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-brand/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-primary/30 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              Lider în soluții HVAC din 2008
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white font-heading leading-tight mb-6">
            Soluții HVAC{' '}
            <span className="text-brand">Complete</span>
            <br />
            pentru Afacerea Ta
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
            Proiectare, instalare și service autorizat pentru sisteme de climatizare,
            ventilație și refrigerare. Răspundem în{' '}
            <strong className="text-accent">4 ore</strong> la urgențe, 24/7.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link href="/produse" className="btn-primary text-base px-8 py-4">
              Vezi produse
              <ArrowRight size={20} />
            </Link>
            <a href="tel:+40700000000" className="btn-outline text-base px-8 py-4">
              Urgență: 0700 000 000
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mb-14">
            {badges.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2"
              >
                <Icon size={16} className="text-brand" />
                <span className="text-white/90 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
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

      {/* Wave */}
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
