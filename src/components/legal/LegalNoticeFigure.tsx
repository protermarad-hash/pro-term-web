import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import {
  LEGAL_NOTICE_HEIGHT,
  LEGAL_NOTICE_SVG_PATH,
  LEGAL_NOTICE_TEXT_RO,
  LEGAL_NOTICE_WIDTH,
  YOUR_EUROPE_LEGAL_GUARANTEE_LABEL,
  YOUR_EUROPE_LEGAL_GUARANTEE_URL,
} from '@/lib/consumer-guarantee';

interface Props {
  /** Unique per page, links the image to its text alternative. */
  id: string;
}

/**
 * The official EU harmonised notice (Reg. (UE) 2025/1960, Annex I), colour RGB
 * version, rendered from the unmodified Commission file. Only the container
 * around it is styled. Below ~600 px the notice keeps a legible size and the
 * container scrolls horizontally instead of shrinking the text.
 */
export default function LegalNoticeFigure({ id }: Props) {
  const descriptionId = `${id}-text`;

  return (
    <figure className="m-0" data-testid="eu-legal-guarantee-notice">
      <div
        className="overflow-x-auto rounded-xl border border-slate-200 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        tabIndex={0}
        role="region"
        aria-label="Notificarea armonizată privind garanția legală (derulabilă pe ecrane înguste)"
      >
        <Image
          src={LEGAL_NOTICE_SVG_PATH}
          alt="Notificarea armonizată UE privind garanția legală de conformitate (GARANȚIA LEGALĂ)"
          aria-describedby={descriptionId}
          width={LEGAL_NOTICE_WIDTH}
          height={LEGAL_NOTICE_HEIGHT}
          unoptimized
          className="block h-auto w-full min-w-[600px]"
        />
      </div>
      <div id={descriptionId} className="sr-only">
        {LEGAL_NOTICE_TEXT_RO.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dark-300">
        <a
          href={YOUR_EUROPE_LEGAL_GUARANTEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline"
        >
          {YOUR_EUROPE_LEGAL_GUARANTEE_LABEL}
          <ExternalLink size={14} aria-hidden="true" />
          <span className="sr-only">(se deschide într-o filă nouă)</span>
        </a>
        <a
          href={LEGAL_NOTICE_SVG_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline-offset-2 hover:text-primary hover:underline"
        >
          Deschide notificarea la dimensiune completă
          <span className="sr-only">(se deschide într-o filă nouă)</span>
        </a>
      </figcaption>
    </figure>
  );
}
