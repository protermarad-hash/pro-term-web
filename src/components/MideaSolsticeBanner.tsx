'use client';

import Link from 'next/link';
import { Calendar, Snowflake, Truck, Sparkles, Smartphone, RefreshCw, Wind } from 'lucide-react';
import {
  MIDEA_SOLSTICE_MODELS,
  MIDEA_SOLSTICE_CAMPAIGN_END_LABEL,
  isMideaSolsticeCampaignActive,
} from '@/lib/campaigns/midea-solstice';

/**
 * Caracteristici confirmate în documentul oficial „PLIANT SOLSTICE 2026 - LB
 * ROM.pdf” (Midea), pentru modelele EZ-09RD6-I / EZ-12RD6-I. Nu afișăm nimic
 * ce nu apare în acel document (fără beneficii/garanții/economii inventate).
 */
const CONFIRMED_FEATURES = [
  { icon: Sparkles, text: 'AI EcoMaster' },
  { icon: Wind, text: 'Flux de aer la 180°' },
  { icon: Smartphone, text: 'Control SmartHome' },
  { icon: RefreshCw, text: 'Autocurățare' },
] as const;

/**
 * Campanie Midea Solstice, octombrie 2026. Se ascunde automat după data de
 * expirare (verificare la fiecare randare client — nu necesită redeploy
 * pentru a dispărea). Prețurile sunt cele confirmate comercial, afișate ca
 * atare; nu arătăm reducere procentuală sau preț barat (vezi
 * src/lib/campaigns/midea-solstice.ts pentru motiv).
 */
export default function MideaSolsticeBanner() {
  if (!isMideaSolsticeCampaignActive()) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 py-16 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-white/5" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur-sm">
            <Calendar size={15} className="text-green-300" />
            Campanie valabilă până la {MIDEA_SOLSTICE_CAMPAIGN_END_LABEL}
          </div>
          <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
            Midea Solstice — preț de campanie
          </h2>
          <p className="mx-auto max-w-xl text-blue-200 leading-relaxed">
            Aparate de aer condiționat Midea Solstice, clasă energetică A+++ la răcire, cu preț special pentru perioada campaniei.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {CONFIRMED_FEATURES.map((feature) => (
            <div key={feature.text} className="flex items-center gap-1.5 text-sm font-semibold text-blue-100">
              <span className="text-green-300">
                <feature.icon size={14} />
              </span>
              {feature.text}
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {MIDEA_SOLSTICE_MODELS.map((model) => (
            <div
              key={model.slug}
              className="flex flex-col rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm ring-1 ring-white/15"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Snowflake size={22} className="text-white" />
              </div>
              <h3 className="mb-1 font-heading text-lg font-bold">{model.name}</h3>
              <p className="mb-4 text-sm text-blue-200">Clasă energetică A+++ la răcire</p>
              <div className="mb-1 font-heading text-3xl font-bold">
                {model.campaignPrice.toLocaleString('ro-RO')} lei
              </div>
              <p className="mb-5 text-xs text-blue-200">TVA inclus · transport calculat separat</p>
              <Link
                href={`/produse/${model.slug}`}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-800 transition-all hover:bg-blue-50 hover:shadow-lg"
              >
                Vezi produsul
                <span className="text-lg">→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 text-sm text-blue-200">
          <Truck size={15} />
          Costul de transport se calculează separat, la finalizarea comenzii.
        </div>
      </div>
    </section>
  );
}
