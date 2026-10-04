'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import LegalDialog from './LegalDialog';
import LegalNoticeFigure from './LegalNoticeFigure';
import { GUARANTEES_PAGE_PATH, GUARANTEES_PAGE_TITLE } from '@/lib/consumer-guarantee';

interface Props {
  /** Distinguishes several instances on one page. */
  idPrefix: string;
  className?: string;
}

/**
 * "Drepturile tale privind garanția legală" — opens the full official notice
 * on the first click (Commission guidelines, April 2026, section 2.3).
 */
export default function LegalGuaranteeNoticeButton({ idPrefix, className = '' }: Props) {
  return (
    <LegalDialog
      title="Notificare armonizată UE: garanția legală de conformitate"
      trigger={(open, dialogId) => (
        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          aria-controls={dialogId}
          data-testid="legal-guarantee-notice-trigger"
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-primary bg-white px-4 py-2.5 text-left text-sm font-bold text-primary transition hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
        >
          <ShieldCheck size={18} aria-hidden="true" className="flex-shrink-0" />
          Drepturile tale privind garanția legală
        </button>
      )}
    >
      <LegalNoticeFigure id={`${idPrefix}-notice`} />
      <p className="mt-4 text-sm text-dark-300">
        Detalii despre garanția legală, garanțiile comerciale și procedura de sesizare:{' '}
        <Link href={GUARANTEES_PAGE_PATH} className="font-semibold text-primary underline-offset-2 hover:underline">
          {GUARANTEES_PAGE_TITLE}
        </Link>
        .
      </p>
    </LegalDialog>
  );
}
