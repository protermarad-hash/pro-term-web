'use client';

import { useEffect, useState } from 'react';
import { X, Wrench, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { getMontajForBtu, type MontajOption } from '@/lib/montaj';
import type { Product } from '@/lib/products';

export default function MontajUpsellModal() {
  const { upsellForProduct, dismissUpsell, addToCart } = useCart();
  const [montajProduct, setMontajProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const acProduct = upsellForProduct;
  const montajInfo: MontajOption | null =
    acProduct?.btu ? getMontajForBtu(acProduct.btu) : null;

  useEffect(() => {
    if (!montajInfo) {
      setMontajProduct(null);
      setAdded(false);
      return;
    }

    let active = true;
    setLoading(true);
    setAdded(false);

    fetch(`/api/products/${montajInfo.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (active && data.product) setMontajProduct(data.product as Product);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [montajInfo?.slug]);

  if (!acProduct || !montajInfo) return null;

  function handleAddMontaj() {
    if (!montajProduct) return;
    addToCart(montajProduct);
    setAdded(true);
    setTimeout(dismissUpsell, 800);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={dismissUpsell}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-md rounded-3xl bg-white shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
        {/* Header */}
        <div className="flex items-start justify-between rounded-t-3xl bg-gradient-to-r from-primary to-blue-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Wrench size={20} className="text-white" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold text-white">Adaugă montajul profesional</p>
              <p className="text-xs text-blue-200">Disponibil în Arad și Timiș</p>
            </div>
          </div>
          <button
            onClick={dismissUpsell}
            className="ml-3 flex-shrink-0 rounded-lg p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Închide"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Product context */}
          <p className="mb-4 text-sm text-dark-300">
            Ai adăugat{' '}
            <span className="font-semibold text-dark">{acProduct.name}</span>
            . Dorești să incluzi și montajul standard?
          </p>

          {/* Montaj card */}
          <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-heading text-base font-bold text-dark">{montajInfo.name}</p>
                <p className="text-xs text-dark-300">{montajInfo.btuLabel}</p>
              </div>
              <div className="text-right">
                <p className="font-heading text-2xl font-bold text-primary">
                  {montajInfo.price.toLocaleString('ro-RO')} RON
                </p>
                <p className="text-[10px] text-dark-300">cu TVA inclus</p>
              </div>
            </div>

            <ul className="space-y-1.5">
              {[
                'Traseu frigorific 3 m inclus',
                'Echipă certificată F-Gas/AGFR',
                'Garanție instalare 12 luni',
                'Disponibil în Arad și județ',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-dark-300">
                  <CheckCircle2 size={13} className="flex-shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-3 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <Clock size={12} className="flex-shrink-0" />
            Montajul se programează la livrare, în funcție de disponibilitate.
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleAddMontaj}
              disabled={loading || added || !montajProduct}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
            >
              {added ? (
                <>
                  <CheckCircle2 size={18} />
                  Montaj adăugat!
                </>
              ) : loading ? (
                'Se încarcă...'
              ) : (
                <>
                  <Wrench size={18} />
                  Da, adaugă montajul (+{montajInfo.price.toLocaleString('ro-RO')} RON)
                </>
              )}
            </button>

            <button
              onClick={dismissUpsell}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-dark-300 transition-colors hover:border-slate-300 hover:text-dark"
            >
              Nu, mulțumesc
            </button>
          </div>

          <p className="mt-3 flex items-center gap-1 text-center text-[10px] text-dark-300">
            <ShieldCheck size={11} className="text-green-500" />
            Preț montaj valabil pentru instalare standard în raza Arad și județ Timiș.
          </p>
        </div>
      </div>
    </>
  );
}
