'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  WITHDRAWAL_CONFIRM_LABEL,
  WITHDRAWAL_ENTRY_LABEL,
  buildWithdrawalStatement,
} from '@/lib/withdrawal';

type FormState = {
  name: string;
  orderNumber: string;
  confirmationEmail: string;
  details: string;
};

const EMPTY: FormState = {
  name: '',
  orderNumber: '',
  confirmationEmail: '',
  details: '',
};

const INPUT =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-dark outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30';

export default function FormularRetragereClient() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submissionId] = useState(() => crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState<{ reference: string; submittedAt: string } | null>(null);

  const statement = useMemo(
    () => buildWithdrawalStatement({ name: form.name.trim(), orderNumber: form.orderNumber.trim() }),
    [form.name, form.orderNumber],
  );

  function validateStepOne() {
    if (!form.name.trim()) return 'Completează numele.';
    if (!form.orderNumber.trim()) return 'Completează numărul comenzii sau identificarea contractului.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.confirmationEmail.trim())) {
      return 'Introdu o adresă de email validă pentru confirmare.';
    }
    if (form.details.length > 2000) return 'Detaliile suplimentare sunt prea lungi.';
    return '';
  }

  function continueToConfirmation(e: React.FormEvent) {
    e.preventDefault();
    const error = validateStepOne();
    setServerError(error);
    if (!error) setStep(2);
  }

  async function confirmWithdrawal() {
    setSubmitting(true);
    setServerError('');
    try {
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          name: form.name.trim(),
          orderNumber: form.orderNumber.trim(),
          confirmationEmail: form.confirmationEmail.trim(),
          details: form.details.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.error || 'Retragerea nu a putut fi transmisă.');
        if (data.recorded && data.reference) {
          setResult({ reference: data.reference, submittedAt: data.submittedAt });
        }
        return;
      }
      setResult({ reference: data.reference, submittedAt: data.submittedAt });
      setStep(3);
    } catch {
      setServerError('Eroare de rețea. Retragerea nu a putut fi confirmată. Încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 3 && result) {
    const submitted = new Date(result.submittedAt).toLocaleString('ro-RO', {
      timeZone: 'Europe/Bucharest',
      dateStyle: 'long',
      timeStyle: 'medium',
    });
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
        <h1 className="font-heading text-2xl font-bold text-dark">Retragerea a fost transmisă</h1>
        <p className="mt-3 text-dark-300">
          Referință: <strong>{result.reference}</strong><br />
          Data și ora: <strong>{submitted}</strong>
        </p>
        <p className="mt-4 text-sm text-dark-300">
          Am trimis la <strong>{form.confirmationEmail}</strong> confirmarea pe email cu conținutul declarației,
          data și ora transmiterii. Păstrează acel email.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white">
          Înapoi la site
        </Link>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-card md:p-10">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Pasul 2 din 2</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-dark">Verifică declarația</h1>
        <p className="mt-3 text-sm text-dark-300">
          Retragerea este transmisă numai după apăsarea butonului „{WITHDRAWAL_CONFIRM_LABEL}”.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-light-200 p-5 text-sm text-dark-300">
          <p className="font-semibold text-dark">Declarația ta</p>
          <p className="mt-2">{statement}</p>
          <dl className="mt-5 grid gap-3">
            <div><dt className="font-semibold text-dark">Nume</dt><dd>{form.name}</dd></div>
            <div><dt className="font-semibold text-dark">Comandă / contract</dt><dd>{form.orderNumber}</dd></div>
            <div><dt className="font-semibold text-dark">Confirmarea se trimite la</dt><dd>{form.confirmationEmail}</dd></div>
            {form.details && <div><dt className="font-semibold text-dark">Detalii suplimentare</dt><dd>{form.details}</dd></div>}
          </dl>
        </div>

        {serverError && (
          <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-dark">
            Modifică datele
          </button>
          <button
            type="button"
            data-testid="withdrawal-confirm"
            onClick={confirmWithdrawal}
            disabled={submitting}
            className="flex-1 rounded-xl bg-accent px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Se transmite…' : WITHDRAWAL_CONFIRM_LABEL}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={continueToConfirmation} className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-card md:p-10">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">Funcție online de retragere</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-dark">Retragere din contract</h1>
      <p className="mt-3 text-sm leading-6 text-dark-300">
        Pentru contractele la distanță încheiate online, poți transmite declarația de retragere prin această funcție.
        Nu trebuie să justifici decizia. Dreptul și eventualele excepții sunt explicate în{' '}
        <Link href="/politica-retur" className="font-semibold text-primary hover:underline">Politica de retur</Link>.
      </p>

      <div className="mt-7 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-dark">Nume și prenume *</span>
          <input className={INPUT} required autoComplete="name" value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-dark">Număr comandă / identificarea contractului *</span>
          <input className={INPUT} required value={form.orderNumber}
            onChange={(e) => setForm((p) => ({ ...p, orderNumber: e.target.value }))} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-dark">Email pentru confirmarea retragerii *</span>
          <input className={INPUT} type="email" required autoComplete="email" value={form.confirmationEmail}
            onChange={(e) => setForm((p) => ({ ...p, confirmationEmail: e.target.value }))} />
          <span className="mt-1 block text-xs text-dark-300">Confirmarea retragerii va fi trimisă pe această adresă.</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-dark">Detalii suplimentare (opțional)</span>
          <textarea className={`${INPUT} resize-none`} rows={3} maxLength={2000} value={form.details}
            onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))} />
        </label>
      </div>

      {serverError && (
        <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        data-testid="withdrawal-entry"
        className="mt-7 w-full rounded-xl bg-accent px-5 py-3.5 text-base font-semibold text-white"
      >
        {WITHDRAWAL_ENTRY_LABEL}
      </button>
    </form>
  );
}
