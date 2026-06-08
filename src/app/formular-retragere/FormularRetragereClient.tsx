'use client';

import { useState } from 'react';
import Link from 'next/link';

type FormState = {
  name: string;
  address: string;
  phone: string;
  email: string;
  orderNumber: string;
  products: string;
  quantity: string;
  pricePaid: string;
  orderDate: string;
  deliveryDate: string;
  reason: string;
  details: string;
  refundMethod: string;
  iban: string;
  confirmed: boolean;
};

const REASONS = [
  'M-am răzgândit',
  'Produsul nu corespunde descrierii',
  'Produs deteriorat / defect la livrare',
  'Am comandat din greșeală',
  'Altul',
];

const EMPTY: FormState = {
  name: '',
  address: '',
  phone: '',
  email: '',
  orderNumber: '',
  products: '',
  quantity: '',
  pricePaid: '',
  orderDate: '',
  deliveryDate: '',
  reason: '',
  details: '',
  refundMethod: 'Transfer bancar',
  iban: '',
  confirmed: false,
};

export default function FormularRetragereClient() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [serverError, setServerError] = useState('');

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Câmp obligatoriu';
    if (!form.address.trim()) e.address = 'Câmp obligatoriu';
    if (!form.phone.trim()) e.phone = 'Câmp obligatoriu';
    if (!form.email.trim()) e.email = 'Câmp obligatoriu';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalid';
    if (!form.orderNumber.trim()) e.orderNumber = 'Câmp obligatoriu';
    if (!form.products.trim()) e.products = 'Câmp obligatoriu';
    if (!form.quantity.trim()) e.quantity = 'Câmp obligatoriu';
    if (!form.pricePaid.trim()) e.pricePaid = 'Câmp obligatoriu';
    else if (isNaN(Number(form.pricePaid.replace(',', '.')))) e.pricePaid = 'Valoare numerică';
    if (!form.orderDate) e.orderDate = 'Câmp obligatoriu';
    if (!form.deliveryDate) e.deliveryDate = 'Câmp obligatoriu';
    if (!form.reason) e.reason = 'Selectați un motiv';
    if (form.refundMethod === 'Transfer bancar' && !form.iban.trim()) e.iban = 'IBAN obligatoriu pentru transfer';
    if (!form.confirmed) e.confirmed = 'Trebuie să confirmați';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/retragere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Eroare necunoscută');
      setRef(json.ref);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Eroare la trimitere');
    } finally {
      setSubmitting(false);
    }
  }

  if (ref) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-card text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-bold text-dark mb-2">Cerere înregistrată</h2>
        <p className="text-dark-300 mb-6">Numărul dvs. de referință:</p>
        <div className="rounded-2xl border-2 border-dashed border-accent px-6 py-4 mb-6">
          <span className="font-heading text-3xl font-bold text-accent tracking-wider">{ref}</span>
        </div>
        <p className="text-sm text-dark-300 mb-2">
          Am trimis o confirmare la adresa dvs. de email. Vom analiza cererea în cel mult <strong>14 zile lucrătoare</strong>.
        </p>
        <p className="text-sm text-dark-300">
          Întrebări?{' '}
          <a href="tel:+40749025610" className="text-accent hover:underline">0749 025 610</a>{' '}
          sau{' '}
          <a href="mailto:proterm.arad@gmail.com" className="text-accent hover:underline">proterm.arad@gmail.com</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-card md:p-10">
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">Formular electronic</p>
      <h1 className="font-heading text-3xl font-bold text-dark md:text-4xl">Retragere din contract</h1>
      <p className="mt-3 text-sm text-dark-300">
        Conform OUG 34/2014, aveți dreptul de retragere în 14 zile calendaristice de la primirea produsului.
        Completați formularul de mai jos; veți primi confirmare pe email.
      </p>

      {/* Separator */}
      <div className="my-8 border-t border-slate-100" />

      {/* Date consumator */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-dark/50">1. Date consumator</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nume și prenume *" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className={inputCls(errors.name)}
              placeholder="Ion Popescu"
              autoComplete="name"
            />
          </Field>
          <Field label="Adresă completă *" error={errors.address}>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className={inputCls(errors.address)}
              placeholder="Str. Exemplu nr. 1, Cluj-Napoca"
              autoComplete="street-address"
            />
          </Field>
          <Field label="Telefon *" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className={inputCls(errors.phone)}
              placeholder="07xx xxx xxx"
              autoComplete="tel"
            />
          </Field>
          <Field label="Email *" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={inputCls(errors.email)}
              placeholder="ion.popescu@email.ro"
              autoComplete="email"
            />
          </Field>
        </div>
      </section>

      {/* Date comandă */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-dark/50">2. Date comandă</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Număr comandă / factură *" error={errors.orderNumber}>
            <input
              type="text"
              value={form.orderNumber}
              onChange={(e) => set('orderNumber', e.target.value)}
              className={inputCls(errors.orderNumber)}
              placeholder="CMD-2024-001"
            />
          </Field>
          <Field label="Preț plătit (RON) *" error={errors.pricePaid}>
            <input
              type="text"
              inputMode="decimal"
              value={form.pricePaid}
              onChange={(e) => set('pricePaid', e.target.value)}
              className={inputCls(errors.pricePaid)}
              placeholder="1200.00"
            />
          </Field>
          <Field label="Data comenzii *" error={errors.orderDate}>
            <input
              type="date"
              value={form.orderDate}
              onChange={(e) => set('orderDate', e.target.value)}
              className={inputCls(errors.orderDate)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </Field>
          <Field label="Data primirii produsului *" error={errors.deliveryDate}>
            <input
              type="date"
              value={form.deliveryDate}
              onChange={(e) => set('deliveryDate', e.target.value)}
              className={inputCls(errors.deliveryDate)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </Field>
          <Field label="Produse returnate *" error={errors.products} className="sm:col-span-2">
            <input
              type="text"
              value={form.products}
              onChange={(e) => set('products', e.target.value)}
              className={inputCls(errors.products)}
              placeholder="Aer condiționat Gree 9000 BTU, model ABC-12"
            />
          </Field>
          <Field label="Cantitate *" error={errors.quantity}>
            <input
              type="text"
              inputMode="numeric"
              value={form.quantity}
              onChange={(e) => set('quantity', e.target.value)}
              className={inputCls(errors.quantity)}
              placeholder="1"
            />
          </Field>
          <Field label="Motiv retragere *" error={errors.reason}>
            <select
              value={form.reason}
              onChange={(e) => set('reason', e.target.value)}
              className={inputCls(errors.reason)}
            >
              <option value="">— Selectați —</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Detalii suplimentare (opțional)" error="">
            <textarea
              value={form.details}
              onChange={(e) => set('details', e.target.value)}
              className={`${inputCls('')} resize-none`}
              rows={3}
              placeholder="Orice informație relevantă pentru procesarea cererii..."
            />
          </Field>
        </div>
      </section>

      {/* Rambursare */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-dark/50">3. Metodă rambursare</h2>
        <div className="flex flex-col gap-3">
          {['Transfer bancar', 'Ramburs la ridicare'].map((method) => (
            <label key={method} className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="refundMethod"
                value={method}
                checked={form.refundMethod === method}
                onChange={() => set('refundMethod', method)}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm text-dark">{method}</span>
            </label>
          ))}
        </div>

        {form.refundMethod === 'Transfer bancar' && (
          <div className="mt-4">
            <Field label="IBAN *" error={errors.iban}>
              <input
                type="text"
                value={form.iban}
                onChange={(e) => set('iban', e.target.value.toUpperCase())}
                className={inputCls(errors.iban)}
                placeholder="RO49AAAA1B31007593840000"
                maxLength={34}
              />
            </Field>
          </div>
        )}
      </section>

      {/* Confirmare */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-light-200 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.confirmed}
            onChange={(e) => set('confirmed', e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-accent"
          />
          <span className="text-sm text-dark-300">
            Confirm că informațiile furnizate sunt corecte și că doresc să exercit dreptul de retragere din contractul de vânzare-cumpărare.
            Am citit{' '}
            <Link href="/politica-retur" className="text-accent hover:underline">Politica de retur</Link>{' '}
            și{' '}
            <Link href="/termeni-si-conditii" className="text-accent hover:underline">Termenii și condițiile</Link>.
          </span>
        </label>
        {errors.confirmed && <p className="mt-2 text-xs text-red-500">{errors.confirmed}</p>}
      </div>

      {serverError && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-accent py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {submitting ? 'Se trimite...' : 'Trimite cererea de retragere'}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error: string | undefined;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-dark">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(error: string | undefined): string {
  return [
    'w-full rounded-xl border px-3.5 py-2.5 text-sm text-dark outline-none transition-colors',
    'placeholder:text-dark-300/50',
    'focus:ring-2 focus:ring-accent/30 focus:border-accent',
    error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300',
  ].join(' ');
}
