'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import LegalGuaranteeNoticeButton from './LegalGuaranteeNoticeButton';
import { GaranLabelButton, describeDurabilityLabel } from './GaranLabel';
import {
  GUARANTEES_PAGE_PATH,
  GUARANTEES_PAGE_TITLE,
  getDurabilityLabel,
  getProductInfoEntries,
  type ProductGuaranteeInfo,
} from '@/lib/consumer-guarantee';

interface Props {
  productName: string;
  guarantee: ProductGuaranteeInfo;
}

/**
 * Shown next to price / stock / "Adaugă în coș" (OUG 34/2014 art. 6 alin. (1)
 * lit. l), l^1) and m)). The EU GARAN label appears only for products that
 * were explicitly marked eligible with complete producer data.
 */
export default function ProductGuaranteeSection({ productName, guarantee }: Props) {
  const label = getDurabilityLabel(guarantee);
  const commercialWarranty = getProductInfoEntries(guarantee).find((entry) => entry.key === 'commercialWarranty');

  return (
    <section
      aria-labelledby="product-guarantee-title"
      data-testid="product-guarantee-section"
      className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-card"
    >
      <h2 id="product-guarantee-title" className="font-heading text-lg font-bold text-dark">
        Garanție și drepturile consumatorului
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-dark-300">
        Pentru bunurile cumpărate de consumatori, PRO TERM, în calitate de vânzător, răspunde pentru orice
        neconformitate existentă la livrare și constatată în termen de doi ani de la livrare (garanția legală
        de conformitate).
      </p>

      <div className="mt-4">
        <LegalGuaranteeNoticeButton idPrefix="product" className="w-full justify-center sm:w-auto" />
      </div>

      {label && (
        <div className="mt-5 border-t border-slate-100 pt-4" data-testid="product-durability-label">
          <p className="text-sm font-bold text-dark">Garanția comercială de durabilitate a producătorului</p>
          <div className="mt-2">
            <GaranLabelButton label={label} productName={productName} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-dark-300">{describeDurabilityLabel(label)}</p>
        </div>
      )}

      {commercialWarranty && (
        <div className="mt-5 border-t border-slate-100 pt-4" data-testid="product-commercial-warranty">
          <p className="text-sm font-bold text-dark">{commercialWarranty.title}</p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-dark-300">{commercialWarranty.text}</p>
          {commercialWarranty.url && (
            <a
              href={commercialWarranty.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-2 hover:underline"
            >
              {commercialWarranty.urlLabel}
              <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only">(se deschide într-o filă nouă)</span>
            </a>
          )}
          <p className="mt-2 text-xs text-dark-300">
            Garanția comercială se acordă în condițiile din certificatul de garanție și nu afectează garanția legală de conformitate.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs leading-relaxed text-dark-300">
        Garanția legală de conformitate prevăzută de OUG nr. 140/2021 se aplică consumatorilor (persoane fizice).
        Pentru achizițiile făcute de persoane juridice se aplică regimul general al Codului civil și condițiile contractuale.
      </p>
      <Link
        href={GUARANTEES_PAGE_PATH}
        className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-primary underline-offset-2 hover:underline"
      >
        {GUARANTEES_PAGE_TITLE}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}
