'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, ExternalLink, Save } from 'lucide-react';
import { adminFetch } from '@/lib/client-auth-fetch';
import type { PowerSupply, ProductDocument } from '@/lib/product-commercial';
import type { PriceReview } from '@/lib/product-price-review';

interface CommercialProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  stockStatus: string;
  active: boolean;
  manufacturerCode?: string;
  powerSupply?: PowerSupply;
  includedComponents: string[];
  excludedComponents: string[];
  documents: ProductDocument[];
  quoteOnly: boolean;
  review: PriceReview;
  publishBlockers: string[];
}

interface FormState {
  price: string;
  stockStatus: string;
  manufacturerCode: string;
  powerSupply: string;
  includedComponents: string;
  excludedComponents: string;
  documents: string;
  quoteOnly: boolean;
  active: boolean;
  priceVerifiedAt: string;
  approvalSource: string;
  needsReverification: boolean;
}

const STOCK_OPTIONS = [
  { value: 'in_stock', label: 'În stoc' },
  { value: 'low_stock', label: 'Stoc limitat' },
  { value: 'la_comanda', label: 'La comandă' },
  { value: 'out_of_stock', label: 'Stoc epuizat' },
];

function toForm(product: CommercialProduct): FormState {
  return {
    price: product.price ? String(product.price) : '',
    stockStatus: product.stockStatus || 'la_comanda',
    manufacturerCode: product.manufacturerCode ?? '',
    powerSupply: product.powerSupply ?? '',
    includedComponents: product.includedComponents.join('\n'),
    excludedComponents: product.excludedComponents.join('\n'),
    documents: product.documents.map((doc) => `${doc.label} | ${doc.url}`).join('\n'),
    quoteOnly: product.quoteOnly,
    active: product.active,
    priceVerifiedAt: product.review.priceVerifiedAt ? product.review.priceVerifiedAt.slice(0, 10) : '',
    approvalSource: product.review.approvalSource ?? '',
    needsReverification: product.review.needsReverification,
  };
}

const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary';

export default function CommercialDetailsSection() {
  const [products, setProducts] = useState<CommercialProduct[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load(keepSelection?: string) {
    try {
      const response = await adminFetch('/api/admin/product-commercial?brand=Vaillant', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Nu am putut încărca datele comerciale.');
      const loaded: CommercialProduct[] = data.products ?? [];
      setProducts(loaded);
      const selected = loaded.find((product) => product.id === keepSelection);
      if (selected) setForm(toForm(selected));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută.');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function select(product: CommercialProduct) {
    setSelectedId(product.id);
    setForm(toForm(product));
    setMessage('');
    setError('');
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !selectedId) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await adminFetch('/api/admin/product-commercial', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, ...form, price: Number(form.price || 0) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Salvarea a eșuat.');
      setMessage('Datele comerciale au fost salvate.');
      await load(selectedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută.');
    } finally {
      setSaving(false);
    }
  }

  const selected = products.find((product) => product.id === selectedId);

  return (
    <section className="mt-12" aria-labelledby="commercial-admin-title">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span id="commercial-admin-title" className="text-sm font-bold uppercase tracking-widest text-dark-300">
          Date comerciale — Vaillant
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <p className="mb-4 max-w-3xl text-sm text-dark-300">
        Doar preț public cu TVA și date publicabile. Prețurile de achiziție, marjele, costurile logistice și pragurile de
        negociere NU se introduc aici — rămân în registrul intern separat. Data verificării, sursa aprobării și statusul de
        reverificare sunt interne și nu apar pe site.
      </p>

      {message && <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{message}</div>}
      {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
        <div className="space-y-2 rounded-3xl bg-white p-5 shadow-card">
          {products.length === 0 && <p className="text-sm text-dark-300">Niciun produs Vaillant în baza de date.</p>}
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => select(product)}
              className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                product.id === selectedId ? 'border-primary bg-primary-50' : 'border-slate-100 hover:border-primary/40'
              }`}
            >
              <span className="block text-sm font-bold text-dark">{product.name}</span>
              <span className="mt-1 flex flex-wrap gap-2 text-xs">
                <span className={product.active ? 'font-bold text-green-700' : 'font-bold text-amber-700'}>
                  {product.active ? 'Publicat' : 'Draft'}
                </span>
                {product.review.needsReverification && <span className="font-bold text-red-600">Necesită reverificare</span>}
                <span className="text-dark-300">{product.manufacturerCode ?? 'fără SKU'}</span>
                <span className="text-dark-300">{product.price ? `${product.price.toLocaleString('ro-RO')} lei` : 'fără preț'}</span>
              </span>
            </button>
          ))}
        </div>

        {form && selected ? (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-5 shadow-card md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-lg font-bold text-dark">{selected.name}</h3>
              <Link href={`/produse/${selected.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Vezi pagina <ExternalLink size={14} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Preț public cu TVA (lei)</span>
                <input type="number" min={0} step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} />
              </label>
              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Status stoc</span>
                <select value={form.stockStatus} onChange={(e) => update('stockStatus', e.target.value)} className={inputClass}>
                  {STOCK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Cod SKU producător</span>
                <input value={form.manufacturerCode} onChange={(e) => update('manufacturerCode', e.target.value)} className={inputClass} />
              </label>
              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Alimentare</span>
                <select value={form.powerSupply} onChange={(e) => update('powerSupply', e.target.value)} className={inputClass}>
                  <option value="">—</option>
                  <option value="230V">230 V</option>
                  <option value="400V">400 V</option>
                </select>
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-bold text-dark">Componente incluse (una pe linie)</span>
                <textarea rows={3} value={form.includedComponents} onChange={(e) => update('includedComponents', e.target.value)} className={inputClass} />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-bold text-dark">Componente neincluse (una pe linie)</span>
                <textarea rows={4} value={form.excludedComponents} onChange={(e) => update('excludedComponents', e.target.value)} className={inputClass} />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-bold text-dark">Documente oficiale („Etichetă | https://...” pe linie)</span>
                <textarea rows={3} value={form.documents} onChange={(e) => update('documents', e.target.value)} className={inputClass} />
              </label>
            </div>

            <fieldset className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <legend className="px-1 text-sm font-bold text-amber-900">Intern — nu apare pe site</legend>
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-1 block text-sm font-bold text-dark">Data verificării prețului</span>
                  <input type="date" value={form.priceVerifiedAt} onChange={(e) => update('priceVerifiedAt', e.target.value)} className={inputClass} />
                </label>
                <label>
                  <span className="mb-1 block text-sm font-bold text-dark">Sursa aprobării</span>
                  <input value={form.approvalSource} maxLength={300} onChange={(e) => update('approvalSource', e.target.value)} className={inputClass} placeholder="Ex: Lista prețuri PRO TERM 23.11.2026" />
                </label>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-dark">
                <input type="checkbox" checked={form.needsReverification} onChange={(e) => update('needsReverification', e.target.checked)} className="h-4 w-4 accent-primary" />
                Necesită reverificare
              </label>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                <input type="checkbox" checked={form.quoteOnly} onChange={(e) => update('quoteOnly', e.target.checked)} className="h-4 w-4 accent-primary" />
                Doar ofertă (fără coș)
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} className="h-4 w-4 accent-primary" />
                Publicat (activ pe site)
              </label>
            </div>

            {selected.publishBlockers.length > 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="mb-1 flex items-center gap-1.5 font-bold"><AlertTriangle size={15} /> Nu poate fi publicat încă:</p>
                <ul className="list-disc pl-5">
                  {selected.publishBlockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
                </ul>
              </div>
            ) : (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-green-700"><CheckCircle2 size={15} /> Datele obligatorii sunt complete.</p>
            )}

            <button type="submit" disabled={saving} className="btn-primary justify-center disabled:opacity-70">
              <Save size={18} />
              {saving ? 'Se salvează...' : 'Salvează datele comerciale'}
            </button>
          </form>
        ) : (
          <p className="rounded-3xl bg-white p-8 text-sm text-dark-300 shadow-card">Selectează un produs din listă.</p>
        )}
      </div>
    </section>
  );
}
