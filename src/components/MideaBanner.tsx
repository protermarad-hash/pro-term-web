'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Award, ShieldCheck, Zap } from 'lucide-react';

export default function MideaBanner() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 py-16 text-white">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-white/5" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center gap-10 lg:flex-row">
          {/* Logo + badge */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="flex h-20 w-48 items-center justify-center rounded-2xl bg-blue-900/50 px-6 ring-1 ring-white/20">
              {!imgError ? (
                <Image
                  src="/images/brands/midea-logo.svg"
                  alt="Midea Logo"
                  width={160}
                  height={60}
                  className="h-12 w-auto object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="font-bold text-3xl text-white tracking-wider">midea</span>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
              <ShieldCheck size={15} className="text-green-300" />
              Partener Oficial Midea
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-300">
              Dealer Autorizat în România
            </p>
            <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
              Aparate de aer condiționat Midea
            </h2>
            <p className="mb-6 max-w-xl text-blue-200 leading-relaxed">
              Cel mai mare producător mondial de climatizare. Tehnologie AI EcoMaster, eficiență energetică A+++ și garanție completă prin PRO TERM SRL.
            </p>

            <div className="mb-6 flex flex-wrap justify-center gap-4 lg:justify-start">
              {[
                { icon: <Zap size={14} />, text: 'Eficiență A+++' },
                { icon: <ShieldCheck size={14} />, text: 'Garanție oficială' },
                { icon: <Award size={14} />, text: 'Produse originale' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-sm font-semibold text-blue-100">
                  <span className="text-green-300">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <Link
              href="/produse?brand=Midea"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-800 transition-all hover:bg-blue-50 hover:shadow-lg"
            >
              Vezi produsele Midea
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
