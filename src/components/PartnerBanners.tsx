import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const AUTHORIZED_BRANDS = [
  {
    name: 'Midea',
    logoUrl: '/images/brands/midea-logo.svg',
    color: 'from-blue-600 to-blue-800',
    text: 'Cel mai mare producător de aparate de aer condiționat din lume. Tehnologie AI EcoMaster, eficiență energetică A+++.',
    href: '/produse?brand=Midea',
    featured: true,
  },
  {
    name: 'Gree',
    logoUrl: '/images/brands/gree-logo.svg',
    color: 'from-green-600 to-green-800',
    text: 'Lider mondial în climatizare. Sisteme split, VRF și pompe de căldură cu tehnologie Cold Plasma și Wi-Fi integrat.',
    href: '/produse?brand=Gree',
    featured: false,
  },
  {
    name: 'Yamato',
    logoUrl: '/images/brands/yamato-logo.svg',
    color: 'from-red-600 to-red-800',
    text: 'Brand japonez cu tradiție. Aparate de aer condiționat cu tratament Golden Fin, R32 și filtre antibacteriene.',
    href: '/produse?brand=Yamato',
    featured: false,
  },
];

const EXTRA_BRANDS = [
  { name: 'Fujitsu', text: 'Service autorizat' },
];

export default function PartnerBanners() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-accent">
            Parteneri oficiali
          </span>
          <h2 className="section-title mt-2">Branduri reprezentate</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-dark-300">
            PRO TERM SRL este dealer autorizat pentru cele mai performante branduri de climatizare. Produse originale, garanție oficială producător și service specializat.
          </p>
        </div>

        {/* Main authorized brands */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          {AUTHORIZED_BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover ${brand.featured ? 'ring-2 ring-primary/20' : ''}`}
            >
              {brand.featured && (
                <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                  Partener principal
                </span>
              )}

              <div className="mb-4 flex h-16 items-center justify-center rounded-2xl bg-gray-50 px-4">
                <Image
                  src={brand.logoUrl}
                  alt={`Logo ${brand.name}`}
                  width={160}
                  height={56}
                  className="h-10 w-auto object-contain"
                  unoptimized
                />
              </div>

              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-xs font-bold text-green-700">Dealer Autorizat</span>
              </div>

              <p className="text-sm text-dark-300 leading-relaxed">{brand.text}</p>

              <div className="mt-4 text-xs font-semibold text-primary group-hover:underline">
                Vezi produse {brand.name} →
              </div>
            </Link>
          ))}
        </div>

        {/* Extra service brands */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-4">
          <span className="text-sm font-semibold text-dark-300">Service autorizat și pentru:</span>
          {EXTRA_BRANDS.map((b) => (
            <div key={b.name} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-dark shadow-sm ring-1 ring-gray-200">
              <ShieldCheck size={12} className="text-green-600" />
              {b.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
