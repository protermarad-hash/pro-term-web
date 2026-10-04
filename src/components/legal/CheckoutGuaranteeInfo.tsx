'use client';

import Link from 'next/link';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import LegalGuaranteeNoticeButton from './LegalGuaranteeNoticeButton';
import { GaranLabelButton, describeDurabilityLabel } from './GaranLabel';
import {
  GUARANTEES_PAGE_PATH,
  GUARANTEES_PAGE_TITLE,
  type DurabilityLabelData,
} from '@/lib/consumer-guarantee';
import {
  GUARANTEE_CHECK_ERROR_MESSAGE,
  GUARANTEE_CHECK_LOADING_MESSAGE,
  type GuaranteeCheckStatus,
} from '@/lib/guarantee-label-check';

interface CheckoutItem {
  id: string;
  name: string;
}

interface Props {
  items: CheckoutItem[];
  /** Result of useGuaranteeLabelCheck — owned by CheckoutClient, which also gates the order. */
  status: GuaranteeCheckStatus;
  labels: Record<string, DurabilityLabelData>;
  onRetry: () => void;
}

/**
 * Pre-contractual guarantee information placed directly above the order
 * button: access to the EU harmonised notice (art. 6 alin. (1) lit. l)) and,
 * for eligible products only, the EU GARAN label (lit. l^1), required by
 * art. 8 alin. (2) immediately before the order is placed).
 */
export default function CheckoutGuaranteeInfo({ items, status, labels, onRetry }: Props) {
  const labelledItems = status === 'ready' ? items.filter((item) => labels[item.id]) : [];

  return (
    <section
      aria-labelledby="checkout-guarantee-title"
      data-testid="checkout-guarantee-info"
      data-guarantee-status={status}
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

      {status === 'loading' && (
        <p
          role="status"
          aria-live="polite"
          data-testid="guarantee-check-loading"
          className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-dark"
        >
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          {GUARANTEE_CHECK_LOADING_MESSAGE}
        </p>
      )}

      {status === 'error' && (
        <div
          role="alert"
          data-testid="guarantee-check-error"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          <p className="flex items-start gap-2 font-semibold">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            {GUARANTEE_CHECK_ERROR_MESSAGE}
          </p>
          <button
            type="button"
            onClick={onRetry}
            data-testid="guarantee-check-retry"
            className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 font-bold text-red-800 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Reîncearcă verificarea
          </button>
        </div>
      )}

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
