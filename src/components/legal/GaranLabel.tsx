'use client';

import { useEffect, useId, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import LegalDialog from './LegalDialog';
import {
  GARAN_LABEL_SVG_PATH,
  GARAN_NESTED_LABEL_SVG_PATH,
  YOUR_EUROPE_DURABILITY_GUARANTEE_URL,
  type DurabilityLabelData,
} from '@/lib/consumer-guarantee';
import { buildGaranLabelSvg, type GaranLabelVariant } from '@/lib/garan-label-svg';

const templateCache = new Map<string, Promise<string>>();

function loadTemplate(path: string): Promise<string> {
  let pending = templateCache.get(path);
  if (!pending) {
    pending = fetch(path).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    });
    pending.catch(() => templateCache.delete(path));
    templateCache.set(path, pending);
  }
  return pending;
}

function useGaranSvg(variant: GaranLabelVariant, label: DurabilityLabelData, prefix: string): string | null {
  const [svg, setSvg] = useState<string | null>(null);
  const { yearsLabel, manufacturerName, modelIdentifier } = label;

  useEffect(() => {
    let cancelled = false;
    loadTemplate(variant === 'full' ? GARAN_LABEL_SVG_PATH : GARAN_NESTED_LABEL_SVG_PATH)
      .then((template) => {
        if (!cancelled) {
          setSvg(buildGaranLabelSvg(template, variant, { yearsLabel, manufacturerName, modelIdentifier }, prefix));
        }
      })
      .catch(() => {
        if (!cancelled) setSvg(null);
      });
    return () => {
      cancelled = true;
    };
  }, [variant, yearsLabel, manufacturerName, modelIdentifier, prefix]);

  return svg;
}

export function describeDurabilityLabel(label: DurabilityLabelData): string {
  return `Garanție comercială de durabilitate oferită de producător: ${label.yearsLabel} ani · Producător: ${label.manufacturerName} · Model: ${label.modelIdentifier}`;
}

function useSvgPrefix(kind: string): string {
  return `garan-${kind}-${useId().replace(/[^a-z0-9]/gi, '')}`;
}

/** The complete EU GARAN label (Annex II), colour version. */
export function GaranLabelFull({ label }: { label: DurabilityLabelData }) {
  const svg = useGaranSvg('full', label, useSvgPrefix('full'));

  return (
    <div data-testid="garan-label-full">
      {/* QR code must stay ≥ 2 × 2 cm: the label is never narrower than 344 px. */}
      <div className="overflow-x-auto">
        <div className="mx-auto w-full min-w-[344px] max-w-[400px]">
          {svg ? (
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div className="aspect-[269/284] w-full animate-pulse rounded bg-slate-100" aria-hidden="true" />
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-dark">{describeDurabilityLabel(label)}</p>
      <p className="mt-2 text-xs leading-relaxed text-dark-300">
        Garanția comercială de durabilitate este oferită de producător, fără costuri suplimentare, pentru întregul bun.
        Ea se aplică independent de garanția legală de conformitate, care rămâne valabilă.
      </p>
      <a
        href={YOUR_EUROPE_DURABILITY_GUARANTEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-2 hover:underline"
      >
        Ce înseamnă eticheta GARAN (Europa ta)
        <ExternalLink size={14} aria-hidden="true" />
        <span className="sr-only">(se deschide într-o filă nouă)</span>
      </a>
    </div>
  );
}

function NestedLabelGraphic({ label }: { label: DurabilityLabelData }) {
  const svg = useGaranSvg('nested', label, useSvgPrefix('nested'));
  if (!svg) {
    return (
      <span className="inline-flex min-h-[38px] items-center text-sm font-semibold text-primary underline underline-offset-2">
        Vezi eticheta GARAN ({label.yearsLabel} ani)
      </span>
    );
  }
  return <span className="block w-[240px] max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}

interface ButtonProps {
  label: DurabilityLabelData;
  productName: string;
}

/**
 * Nested display (Annex II): compact label next to the product; the complete
 * label opens on the first click/tap.
 */
export function GaranLabelButton({ label, productName }: ButtonProps) {
  return (
    <LegalDialog
      size="narrow"
      title={`Eticheta GARAN – ${productName}`}
      trigger={(open, dialogId) => (
        <button
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          aria-controls={dialogId}
          aria-label={`Eticheta GARAN: ${describeDurabilityLabel(label)}. Deschide eticheta completă.`}
          data-testid="garan-label-trigger"
          className="inline-block max-w-full rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <NestedLabelGraphic label={label} />
        </button>
      )}
    >
      <GaranLabelFull label={label} />
    </LegalDialog>
  );
}
