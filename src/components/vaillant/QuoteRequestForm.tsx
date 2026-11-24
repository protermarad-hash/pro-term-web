'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  ELECTRICAL_SUPPLY_OPTIONS,
  EMITTER_OPTIONS,
  EXISTING_SYSTEM_OPTIONS,
  HOT_WATER_OPTIONS,
  INSULATION_OPTIONS,
  QUOTE_LIMITS,
  type ChoiceOption,
} from '@/lib/quote-request';
import { OFFER_OPTIONS, isOfferOptionId, type OfferOptionId } from '@/lib/vaillant-catalog';
import { POWER_SELECTION_NOTICE } from '@/lib/product-commercial';

export interface QuoteProductOption {
  value: string;
  label: string;
}

interface Props {
  products: QuoteProductOption[];
  initialProduct?: string;
  initialOption?: string;
}

type FormState = {
  offerOption: OfferOptionId;
  product: string;
  locality: string;
  areaSqm: string;
  constructionYear: string;
  insulation: string;
  existingSystem: string;
  emitters: string;
  hotWater: string;
  occupants: string;
  electricalSupply: string;
  name: string;
  phone: string;
  email: string;
  details: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function Select({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  id: keyof FormState;
  label: string;
  value: string;
  options: readonly ChoiceOption<string>[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label htmlFor={`quote-${id}`} className="mb-1 block text-sm font-medium text-dark-300">
        {label} *
      </label>
      <select id={`quote-${id}`} name={id} required value={value} onChange={onChange} disabled={disabled} className="input-field">
        <option value="">Selectează...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function QuoteRequestForm({ products, initialProduct = '', initialOption }: Props) {
  const knownProduct = products.some((product) => product.value === initialProduct) ? initialProduct : '';
  const [form, setForm] = useState<FormState>({
    offerOption: isOfferOptionId(initialOption) ? initialOption : 'sistem-complet',
    product: knownProduct,
    locality: '',
    areaSqm: '',
    constructionYear: '',
    insulation: '',
    existingSystem: '',
    emitters: '',
    hotWater: '',
    occupants: '',
    electricalSupply: '',
    name: '',
    phone: '',
    email: '',
    details: '',
  });
  const [gdprConsent, setGdprConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const isSubmitting = status === 'submitting';

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gdprConsent) {
      setStatus('error');
      setErrorMessage('Pentru a trimite cererea este necesar acordul privind prelucrarea datelor.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          product: products.find((product) => product.value === form.product)?.label ?? '',
          areaSqm: Number(form.areaSqm),
          constructionYear: form.constructionYear ? Number(form.constructionYear) : undefined,
          occupants: Number(form.occupants),
          gdprConsent,
          honeypot,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Cererea nu a putut fi trimisă.');
      }

      // GA4 is loaded only after cookie consent; without consent gtag is absent.
      // No price or personal data is sent to analytics.
      window.gtag?.('event', 'generate_lead', { form_name: 'heat_pump_quote', offer_option: form.offerOption });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Cererea nu a putut fi trimisă.');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800">
        <CheckCircle2 className="mb-3" size={28} />
        <p className="font-heading text-lg font-bold">Cererea a fost trimisă.</p>
        <p className="mt-2 text-sm">
          Echipa PRO TERM analizează datele tehnice și te contactează pentru validarea configurației și a ofertei.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-1 flex items-center gap-3 font-heading text-lg font-bold text-dark"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00917e] text-sm text-white">1</span>Ce tip de ofertă dorești?</legend>
        <p className="mb-4 ml-11 text-sm text-dark-300">Alege nivelul ofertei. Poți schimba oricând opțiunea în discuția cu specialistul.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {OFFER_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition-colors ${
                form.offerOption === option.id ? 'border-primary bg-primary-50' : 'border-slate-200 bg-white hover:border-primary/40'
              }`}
            >
              <span className="flex items-center gap-2 font-semibold text-dark">
                <input
                  type="radio"
                  name="offerOption"
                  value={option.id}
                  checked={form.offerOption === option.id}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="accent-primary"
                />
                {option.title}
              </span>
              <span className="mt-2 text-xs leading-relaxed text-dark-300">{option.description}</span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label htmlFor="quote-product" className="mb-1 block text-sm font-medium text-dark-300">
            Produs de interes
          </label>
          <select id="quote-product" name="product" value={form.product} onChange={handleChange} disabled={isSubmitting} className="input-field">
            <option value="">Nu știu încă — vreau recomandare</option>
            {products.map((product) => (
              <option key={product.value} value={product.value}>
                {product.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 flex items-center gap-3 font-heading text-lg font-bold text-dark"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00917e] text-sm text-white">2</span>Despre casă și instalație</legend>
        <p className="mb-4 ml-11 text-sm text-dark-300">Datele ne ajută să estimăm necesarul termic și configurația potrivită. Dacă nu știi un răspuns, alege „Nu știu”.</p>
        <p className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-dark-300">{POWER_SELECTION_NOTICE}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="quote-locality" className="mb-1 block text-sm font-medium text-dark-300">Localitate *</label>
            <input id="quote-locality" name="locality" required maxLength={QUOTE_LIMITS.locality} value={form.locality} onChange={handleChange} disabled={isSubmitting} className="input-field" placeholder="Ex: Arad" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="quote-areaSqm" className="mb-1 block text-sm font-medium text-dark-300">Suprafață (m²) *</label>
              <input id="quote-areaSqm" name="areaSqm" type="number" inputMode="numeric" required min={QUOTE_LIMITS.areaMin} max={QUOTE_LIMITS.areaMax} value={form.areaSqm} onChange={handleChange} disabled={isSubmitting} className="input-field" />
            </div>
            <div>
              <label htmlFor="quote-constructionYear" className="mb-1 block text-sm font-medium text-dark-300">An construcție</label>
              <input id="quote-constructionYear" name="constructionYear" type="number" inputMode="numeric" min={QUOTE_LIMITS.yearMin} value={form.constructionYear} onChange={handleChange} disabled={isSubmitting} className="input-field" placeholder="Ex: 1985" />
            </div>
          </div>
          <Select id="insulation" label="Nivel de izolație" value={form.insulation} options={INSULATION_OPTIONS} onChange={handleChange} disabled={isSubmitting} />
          <Select id="existingSystem" label="Sistem de încălzire existent" value={form.existingSystem} options={EXISTING_SYSTEM_OPTIONS} onChange={handleChange} disabled={isSubmitting} />
          <Select id="emitters" label="Radiatoare sau încălzire în pardoseală" value={form.emitters} options={EMITTER_OPTIONS} onChange={handleChange} disabled={isSubmitting} />
          <Select id="hotWater" label="Necesar apă caldă menajeră" value={form.hotWater} options={HOT_WATER_OPTIONS} onChange={handleChange} disabled={isSubmitting} />
          <div>
            <label htmlFor="quote-occupants" className="mb-1 block text-sm font-medium text-dark-300">Număr de persoane *</label>
            <input id="quote-occupants" name="occupants" type="number" inputMode="numeric" required min={QUOTE_LIMITS.occupantsMin} max={QUOTE_LIMITS.occupantsMax} value={form.occupants} onChange={handleChange} disabled={isSubmitting} className="input-field" />
          </div>
          <Select id="electricalSupply" label="Alimentare electrică disponibilă" value={form.electricalSupply} options={ELECTRICAL_SUPPLY_OPTIONS} onChange={handleChange} disabled={isSubmitting} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 flex items-center gap-3 font-heading text-lg font-bold text-dark"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00917e] text-sm text-white">3</span>Cum te contactăm</legend>
        <p className="mb-4 ml-11 text-sm text-dark-300">Un specialist PRO TERM revine cu întrebări sau cu oferta.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="quote-name" className="mb-1 block text-sm font-medium text-dark-300">Nume complet *</label>
            <input id="quote-name" name="name" required maxLength={QUOTE_LIMITS.name} autoComplete="name" value={form.name} onChange={handleChange} disabled={isSubmitting} className="input-field" />
          </div>
          <div>
            <label htmlFor="quote-phone" className="mb-1 block text-sm font-medium text-dark-300">Telefon *</label>
            <input id="quote-phone" name="phone" type="tel" required maxLength={QUOTE_LIMITS.phone} autoComplete="tel" value={form.phone} onChange={handleChange} disabled={isSubmitting} className="input-field" placeholder="07XX XXX XXX" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="quote-email" className="mb-1 block text-sm font-medium text-dark-300">Email</label>
            <input id="quote-email" name="email" type="email" maxLength={QUOTE_LIMITS.email} autoComplete="email" value={form.email} onChange={handleChange} disabled={isSubmitting} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="quote-details" className="mb-1 block text-sm font-medium text-dark-300">Alte detalii</label>
            <textarea id="quote-details" name="details" rows={4} maxLength={QUOTE_LIMITS.details} value={form.details} onChange={handleChange} disabled={isSubmitting} className="input-field resize-none" placeholder="Ex: casă P+1, radiatoare din oțel, centrală pe gaz din 2010." />
          </div>
        </div>
      </fieldset>

      {/* Honeypot — invisible to real users */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="quote-website">Nu completa acest câmp</label>
        <input type="text" id="quote-website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <label className="flex items-start gap-3 text-sm text-dark-300">
        <input type="checkbox" required checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} disabled={isSubmitting} className="mt-1 h-4 w-4 flex-shrink-0 accent-primary" />
        <span>
          Sunt de acord ca PRO TERM să prelucreze datele din acest formular pentru a analiza cererea și a mă contacta cu oferta, conform{' '}
          <Link href="/politica-confidentialitate" className="font-semibold text-primary underline">
            Politicii de confidențialitate
          </Link>
          . *
        </span>
      </label>

      {status === 'error' && (
        <div role="alert" aria-live="assertive" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70">
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Se trimite...
          </>
        ) : (
          <>
            <Send size={18} />
            Trimite cererea pentru validare
          </>
        )}
      </button>
      <p className="text-center text-xs text-dark-300">
        Pentru „Sistem complet” și „Soluție la cheie” nu există preț final automat: oferta se stabilește după validarea tehnică și comercială.
      </p>
    </form>
  );
}
