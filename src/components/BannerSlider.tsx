'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  {
    src: '/images/banners/midea/confort-actualizare.jpg',
    alt: 'Midea Breezeless E — Confort în permanentă actualizare. Tehnologie Over-The-Air pentru funcții mereu la zi.',
  },
  {
    src: '/images/banners/midea/aer-proaspat.jpg',
    alt: 'Midea Breezeless E — O adiere de aer proaspăt și sănătos. Air Magic+, I-Clean, UV Pro.',
  },
  {
    src: '/images/banners/midea/economie-energie.jpg',
    alt: 'Midea Breezeless E — Economie inteligentă de energie. Algoritm AI EcoMaster, până la 20% economii.',
  },
];

const HREF = '/produse?brand=Midea&model=breezeless-e';
const INTERVAL = 6000;

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % BANNERS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-md"
      style={{ height: 'clamp(220px, 28vw, 400px)' }}
    >
      {BANNERS.map((banner, i) => (
        <Link
          key={banner.src}
          href={HREF}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 800ms ease-in-out',
            pointerEvents: i === current ? 'auto' : 'none',
            visibility: errors.has(i) ? 'hidden' : 'visible',
          }}
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority={i === 0}
            onError={() => setErrors((prev) => new Set(prev).add(i))}
          />
        </Link>
      ))}

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60"
        aria-label="Banner anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60"
        aria-label="Banner următor"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/60'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
