import Link from 'next/link';
import { AlertTriangle, Info, Wrench } from 'lucide-react';
import { OFFER_OPTIONS } from '@/lib/vaillant-catalog';
import { POWER_SELECTION_NOTICE, VAILLANT_REPAIR_NOTICE } from '@/lib/product-commercial';

/** Shown on every draft page (preview/dev only — drafts 404 in production). */
export function DraftBanner() {
  return (
    <div className="container mx-auto px-4 pt-6 md:pt-8">
      <div role="note" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-center text-sm font-semibold text-amber-900" data-testid="draft-banner">
        <AlertTriangle size={15} className="mr-1.5 inline-block align-[-2px]" />
        DRAFT — pagină nepublicată, în așteptarea aprobărilor (imagini, texte, configurații, prețuri, garanție/service).
      </div>
    </div>
  );
}

export function PowerSelectionNotice() {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary" data-testid="power-selection-notice">
      <Info size={17} className="mt-0.5 flex-shrink-0" />
      {POWER_SELECTION_NOTICE}
    </p>
  );
}

export function RepairNotice() {
  return (
    <p className="flex items-start gap-2 text-sm text-dark-300">
      <Wrench size={16} className="mt-0.5 flex-shrink-0 text-primary" />
      {VAILLANT_REPAIR_NOTICE}
    </p>
  );
}

export function OfferOptionsSection({ productSlug }: { productSlug?: string }) {
  const query = productSlug ? `produs=${encodeURIComponent(productSlug)}&` : '';
  return (
    <section aria-labelledby="offer-options-title">
      <h2 id="offer-options-title" className="section-title">Cum poți cere oferta</h2>
      <p className="section-subtitle">
        Unitatea exterioară nu este, singură, un sistem complet de încălzire. Alege nivelul ofertei de care ai nevoie.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {OFFER_OPTIONS.map((option, index) => (
          <div key={option.id} className="card flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Opțiunea {index + 1}</span>
            <h3 className="mt-2 font-heading text-xl font-bold text-dark">{option.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-dark-300">{option.description}</p>
            <p className="mt-3 text-xs font-semibold text-dark">{option.pricing}</p>
            <Link href={`/vaillant/cerere-oferta?${query}optiune=${option.id}`} className="mt-auto pt-5 text-sm font-semibold text-primary hover:underline">
              Cere oferta „{option.title}” →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export const VAILLANT_FAQ = [
  {
    question: 'Prețul publicat include un sistem complet de încălzire?',
    answer:
      'Nu. Prețul publicat include doar componentele menționate pe pagina fiecărui produs. Pentru sistem complet sau soluție la cheie, oferta se face după analiza instalației.',
  },
  {
    question: 'Ce putere de pompă de căldură îmi trebuie?',
    answer: `${POWER_SELECTION_NOTICE} Formularul de ofertă cere datele de care avem nevoie pentru o primă analiză.`,
  },
  {
    question: 'Care este diferența dintre o pompă monobloc și una split?',
    answer:
      'La monobloc (aroTHERM pro, aroTHERM plus), circuitul frigorific rămâne în unitatea exterioară, iar spre casă merg conducte de apă. La split (aroTHERM Split plus), unitatea exterioară și cea interioară sunt legate printr-un circuit frigorific. Varianta potrivită se alege după locuință și instalație.',
  },
  {
    question: 'Am nevoie de boiler pentru apă caldă?',
    answer:
      'Pentru prepararea apei calde menajere este nevoie de un boiler sau de un modul cu boiler integrat, compatibil cu pompa. Componenta potrivită se stabilește în oferta de sistem complet.',
  },
  {
    question: 'Pot controla pompa de căldură de pe telefon?',
    answer:
      'Controlul și monitorizarea din aplicația myVAILLANT depind de automatizarea și accesoriile compatibile din configurație. Îți spunem în ofertă ce este inclus.',
  },
  {
    question: 'Unde faceți montajul și punerea în funcțiune?',
    answer:
      'Echipa PRO TERM face montajul în județele Arad și Timiș; pentru alte zone, la cerere. Produsele se livrează în toată România. Punerea în funcțiune se coordonează conform cerințelor producătorului.',
  },
  {
    question: 'Pot păstra radiatoarele existente?',
    answer:
      'Depinde de temperatura pe tur necesară, de dimensiunea radiatoarelor și de pierderile de căldură ale clădirii. Verificarea se face pentru fiecare instalație în parte.',
  },
  {
    question: 'Am nevoie de alimentare trifazată?',
    answer:
      'Unele modele funcționează la 230 V, altele la 400 V. Alimentarea fiecărui produs este afișată pe pagina lui; disponibilitatea alimentării în locație se verifică înainte de ofertă.',
  },
  {
    question: 'Cine se ocupă de reparații?',
    answer: VAILLANT_REPAIR_NOTICE,
  },
  {
    question: 'Prețurile sunt garantate?',
    answer:
      'Prețurile publicate sunt prețuri finale cu TVA, supuse confirmării disponibilității. Disponibilitatea și termenul de livrare se confirmă înainte de comandă.',
  },
] as const;

export function VaillantFaq() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: VAILLANT_FAQ.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section aria-labelledby="vaillant-faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <h2 id="vaillant-faq-title" className="section-title">Întrebări frecvente</h2>
      <div className="mt-6 space-y-3">
        {VAILLANT_FAQ.map((faq) => (
          <details key={faq.question} className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
            <summary className="cursor-pointer list-none font-semibold text-dark">
              {faq.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-dark-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
