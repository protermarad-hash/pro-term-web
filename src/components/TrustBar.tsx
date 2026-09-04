import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

const brands = [
  { name: 'Gree', src: '/images/brands/gree-logo.svg' },
  { name: 'Midea', src: '/images/brands/midea-logo.svg' },
  { name: 'Yamato', src: '/images/brands/yamato-logo.svg' },
];

export default function TrustBar() {
  return (
    <section className="border-y border-slate-100 bg-white py-8">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 lg:flex-row lg:justify-between lg:gap-10">
        <div className="flex items-center gap-2 text-sm font-semibold text-dark-300">
          <ShieldCheck size={18} className="text-primary" />
          Dealer autorizat · ISO 9001 · F-Gas / AGFR
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {brands.map((brand) => (
            <span key={brand.name} className="flex h-11 items-center rounded-lg bg-primary px-5">
              <Image
                src={brand.src}
                alt={`Logo ${brand.name}`}
                width={110}
                height={36}
                className="h-6 w-auto object-contain"
                unoptimized
              />
            </span>
          ))}
        </div>

        <p className="text-sm font-semibold text-dark-300">
          Experiență practică din <span className="text-primary">1999</span>
        </p>
      </div>
    </section>
  );
}
