'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LegalGuaranteeNoticeButton from './LegalGuaranteeNoticeButton';
import { GaranLabelButton, describeDurabilityLabel } from './GaranLabel';
import {
  GUARANTEES_PAGE_PATH,
  GUARANTEES_PAGE_TITLE,
  type DurabilityLabelData,
} from '@/lib/consumer-guarantee';

interface CheckoutItem {
  id: string;
  name: string;
}

interface Props {
  items: CheckoutItem[];
  /** Injected in tests; production fetches fresh data for the cart items. */
  initialLabels?: Record<string, DurabilityLabelData>;
}

/**
 * Pre-contractual guarantee information placed directly above the order
 * button: access to the EU harmonised notice (art. 6 alin. (1) lit. l)) and,
 * for eligible products only, the EU GARAN label (lit. l^1), required by
 * art. 8 alin. (2) immediately before the order is placed).
 */
export default function CheckoutGuaranteeInfo({ items, initialLabels }: Props) {
  const [labels, setLabels] = useState<Record<string, DurabilityLabelData>>(initialLabels ?? {});
  const idsKey = useMemo(() => items.map((item) => item.id).sort().join(','), [items]);

  useEffect(() => {
    if (initialLabels || !idsKey) return;
    let cancelled = false;
    fetch(`/api/products/guarantee-labels?ids=${encodeURIComponent(idsKey)}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : { labels: {} }))
      .then((data: { labels?: Record<string, DurabilityLabelData> }) => {
        if (!cancelled) setLabels(data.labels ?? {});
      })
      .catch(() => {
        if (!cancelled) setLabels({});
      });
    return () => {
      cancelled = true;
    };
  }, [idsKey, initialLabels]);

  const labelledItems = items.filter((item) => labels[item.id]);

  return (
    <section
      aria-labelledby="checkout-guarantee-title"
      data-testid="checkout-guarantee-info"
      className="rounded-xl border border-slate-200 bg-white p-4"
    >
      <h2 id="checkout-guarantee-title" className="font-heading text-base font-bold text-dark">
        Garanție și drepturile consumatorului
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-dark-300">
        Pentru consumatori, produsele beneficiază de garanția legală de conformitate de minimum doi ani, oferită de
        vânzător. Consultă notificarea oficială înainte de a plasa comanda.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <LegalGuaranteeNoticeButton idPrefix="checkout" />
        <Link href={GUARANTEES_PAGE_PATH} className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
          {GUARANTEES_PAGE_TITLE}
        </Link>
      </div>

      {labelledItems.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4" data-testid="checkout-durability-labels">
          <p className="text-sm font-bold text-dark">Garanția comercială de durabilitate a producătorului</p>
          <ul className="mt-2 space-y-3">
            {labelledItems.map((item) => {
              const label = labels[item.id];
              return (
                <li key={item.id}>
                  <p className="text-sm font-semibold text-dark">{item.name}</p>
                  <div className="mt-1">
                    <GaranLabelButton label={label} productName={item.name} />
                  </div>
                  <p className="mt-1 text-xs text-dark-300">{describeDurabilityLabel(label)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
