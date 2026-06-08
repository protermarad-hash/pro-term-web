'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Phone,
  ShoppingCart,
  Thermometer,
  Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/products';

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface FormData {
  length: string;
  width: string;
  height: string;
  roomType: string;
  sunExposure: string;
  windows: string;
  floor: string;
  persons: string;
  hasPC: boolean;
  hasTV: boolean;
  hasServer: boolean;
  hasManyAppliances: boolean;
}

const INITIAL_FORM: FormData = {
  length: '',
  width: '',
  height: '2.6',
  roomType: 'dormitor',
  sunExposure: 'est',
  windows: '1',
  floor: 'etaj',
  persons: '2',
  hasPC: false,
  hasTV: false,
  hasServer: false,
  hasManyAppliances: false,
};

// ─── Calculation ─────────────────────────────────────────────────────────────

const BTU_STANDARDS = [9000, 12000, 18000, 24000];

function calculateBTU(form: FormData): { btu: number; recommended: number } {
  const l = parseFloat(form.length) || 0;
  const w = parseFloat(form.width) || 0;
  const h = parseFloat(form.height) || 2.6;
  const volume = l * w * h;

  let btu = volume * 30;

  // Sun exposure
  if (form.sunExposure === 'sud' || form.sunExposure === 'vest') btu *= 1.1;
  else if (form.sunExposure === 'est') btu *= 1.05;
  else if (form.sunExposure === 'nord') btu *= 0.95;

  // Floor
  if (form.floor === 'ultimul' || form.floor === 'mansarda') btu *= 1.15;
  else if (form.floor === 'parter') btu *= 1.05;

  // Room type
  if (form.roomType === 'bucatarie') btu *= 1.2;

  // Windows
  const windowCount = parseInt(form.windows) || 0;
  btu += windowCount * 300;

  // Persons over 2
  const persons = parseInt(form.persons) || 2;
  if (persons > 2) btu += (persons - 2) * 400;

  // Electronics
  if (form.hasPC) btu += 200;
  if (form.hasTV) btu += 300;
  if (form.hasServer) btu += 1000;
  if (form.hasManyAppliances) btu += 500;

  const recommended = BTU_STANDARDS.find((s) => s >= btu) ?? 24000;
  return { btu: Math.round(btu), recommended };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: 'Dimensiuni' },
    { n: 2, label: 'Caracteristici' },
    { n: 3, label: 'Ocupanți' },
  ];
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${step >= s.n ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            {step > s.n ? <CheckCircle2 size={16} /> : s.n}
          </div>
          <span className={`hidden text-sm font-semibold sm:block ${step === s.n ? 'text-primary' : 'text-dark-300'}`}>{s.label}</span>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-16 transition-all ${step > s.n ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

const SELECT_CLASS = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
const INPUT_CLASS = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

function Step1({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-dark-300">Introdu dimensiunile camerei pentru care vrei să calculezi capacitatea aerului condiționat.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark">Lungime (m) *</label>
          <input type="number" min="1" max="30" step="0.1" value={form.length} onChange={(e) => onChange('length', e.target.value)} className={INPUT_CLASS} placeholder="ex: 5" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark">Lățime (m) *</label>
          <input type="number" min="1" max="30" step="0.1" value={form.width} onChange={(e) => onChange('width', e.target.value)} className={INPUT_CLASS} placeholder="ex: 4" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark">Înălțime tavan</label>
          <select value={form.height} onChange={(e) => onChange('height', e.target.value)} className={SELECT_CLASS}>
            <option value="2.4">2,4 m (standard bloc)</option>
            <option value="2.6">2,6 m (standard casă)</option>
            <option value="2.8">2,8 m (tavan înalt)</option>
            <option value="3.0">3,0 m (spații generoase)</option>
            <option value="3.2">3,2 m+ (loft / mansardă)</option>
          </select>
        </div>
        {form.length && form.width && (
          <div className="flex items-center rounded-xl bg-primary/5 px-4 py-3">
            <div>
              <p className="text-xs text-dark-300">Suprafață calculată</p>
              <p className="text-lg font-bold text-primary">{(parseFloat(form.length) * parseFloat(form.width)).toFixed(1)} m²</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SUN_OPTIONS = [
  { value: 'nord', label: 'Nord', desc: 'Puțin soare', icon: '🧭', color: 'border-blue-200 bg-blue-50' },
  { value: 'est',  label: 'Est',  desc: 'Soare dimineața', icon: '🌅', color: 'border-amber-200 bg-amber-50' },
  { value: 'sud',  label: 'Sud',  desc: 'Soare mult', icon: '☀️', color: 'border-orange-200 bg-orange-50' },
  { value: 'vest', label: 'Vest', desc: 'Soare după-amiaza', icon: '🌇', color: 'border-red-200 bg-red-50' },
];

function Step2({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-dark">Tip cameră</label>
        <select value={form.roomType} onChange={(e) => onChange('roomType', e.target.value)} className={SELECT_CLASS}>
          <option value="dormitor">Dormitor</option>
          <option value="living">Living / Sufragerie</option>
          <option value="bucatarie">Bucătărie</option>
          <option value="birou">Birou</option>
          <option value="alt">Alt spațiu</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-dark">Expunere la soare</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange('sunExposure', opt.value)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${form.sunExposure === opt.value ? 'border-primary bg-primary/5' : `${opt.color} hover:border-gray-300`}`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-bold text-dark">{opt.label}</span>
              <span className="text-[10px] text-dark-300">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark">Număr ferestre mari</label>
          <select value={form.windows} onChange={(e) => onChange('windows', e.target.value)} className={SELECT_CLASS}>
            <option value="0">0 ferestre</option>
            <option value="1">1 fereastră</option>
            <option value="2">2 ferestre</option>
            <option value="3">3+ ferestre</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark">Etaj</label>
          <select value={form.floor} onChange={(e) => onChange('floor', e.target.value)} className={SELECT_CLASS}>
            <option value="parter">Parter</option>
            <option value="etaj">Etaj intermediar</option>
            <option value="ultimul">Ultimul etaj</option>
            <option value="mansarda">Mansardă</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step3({ form, onChange }: { form: FormData; onChange: (k: keyof FormData, v: string | boolean) => void }) {
  const electronics = [
    { key: 'hasPC' as keyof FormData, label: 'PC / Laptop', desc: '+200 BTU', icon: '💻' },
    { key: 'hasTV' as keyof FormData, label: 'TV mare', desc: '+300 BTU', icon: '📺' },
    { key: 'hasServer' as keyof FormData, label: 'Server / echipamente', desc: '+1000 BTU', icon: '🖥️' },
    { key: 'hasManyAppliances' as keyof FormData, label: 'Multe aparate electrice', desc: '+500 BTU', icon: '⚡' },
  ];
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-dark">Număr persoane în cameră (de regulă)</label>
        <select value={form.persons} onChange={(e) => onChange('persons', e.target.value)} className={SELECT_CLASS}>
          <option value="1">1 persoană</option>
          <option value="2">2 persoane</option>
          <option value="3">3 persoane</option>
          <option value="4">4+ persoane</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-dark">Echipamente electronice care generează căldură</label>
        <div className="grid grid-cols-2 gap-2">
          {electronics.map((el) => (
            <button
              key={el.key}
              type="button"
              onClick={() => onChange(el.key, !(form[el.key] as boolean))}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${form[el.key] ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <span className="text-xl">{el.icon}</span>
              <div>
                <p className="text-xs font-bold text-dark">{el.label}</p>
                <p className="text-[11px] text-dark-300">{el.desc}</p>
              </div>
              {form[el.key] && <CheckCircle2 size={14} className="ml-auto text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ResultData {
  rawBTU: number;
  recommended: number;
}

interface ResultCardProps {
  result: ResultData;
  products: Product[];
  loadingProducts: boolean;
  onReset: () => void;
}

function ResultCard({ result, products, loadingProducts, onReset }: ResultCardProps) {
  const { addToCart } = useCart();
  const lower = result.recommended === 9000 ? 9000 : BTU_STANDARDS[BTU_STANDARDS.indexOf(result.recommended) - 1] ?? 9000;

  return (
    <div className="space-y-6">
      {/* Result banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-700 p-6 text-white text-center">
        <Thermometer size={40} className="mx-auto mb-3 opacity-80" />
        <p className="text-sm font-medium text-blue-200 mb-1">Capacitate recomandată</p>
        <p className="font-heading text-5xl font-bold">{result.recommended.toLocaleString('ro-RO')} BTU</p>
        <p className="mt-2 text-blue-200 text-sm">Calcul de bază: {result.rawBTU.toLocaleString('ro-RO')} BTU → rotunjit la standardul {result.recommended.toLocaleString('ro-RO')} BTU</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
          <Zap size={14} />
          Gamă recomandată: {lower.toLocaleString('ro-RO')} – {result.recommended.toLocaleString('ro-RO')} BTU
        </div>
      </div>

      {/* Explanation */}
      <div className="grid gap-3 sm:grid-cols-3 text-center text-sm">
        {[
          { icon: '📐', label: 'Bazat pe volum cameră', desc: 'Standard european 30 BTU/m³' },
          { icon: '🌡️', label: 'Corecții aplicate', desc: 'Expunere, etaj, tip cameră, echipamente' },
          { icon: '✅', label: 'Rotunjit la standard', desc: 'Cel mai apropiat BTU disponibil comercial' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="font-semibold text-dark">{item.label}</p>
            <p className="text-dark-300 text-xs mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Recommended products */}
      <div>
        <h2 className="mb-3 font-heading text-xl font-bold text-dark">Produse recomandate pentru camera ta</h2>
        {loadingProducts ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="card flex flex-col">
                <div className="mb-3 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} width={200} height={144} className="h-full w-full object-contain" />
                  ) : (
                    <div className="text-3xl">❄️</div>
                  )}
                </div>
                <p className="text-xs font-bold text-primary">{product.brand}</p>
                <p className="mt-0.5 font-semibold text-dark leading-snug">{product.name}</p>
                {product.capacityLabel && <p className="text-xs text-dark-300 mt-0.5">{product.capacityLabel}</p>}
                <p className="mt-2 text-lg font-bold text-dark">{product.price.toLocaleString('ro-RO')} RON</p>
                <p className="text-[11px] text-dark-300">TVA 21% inclus</p>
                <div className="mt-auto flex gap-2 pt-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary flex-1 justify-center py-2 text-sm"
                  >
                    <ShoppingCart size={14} />
                    Adaugă în coș
                  </button>
                  <Link href={`/produse/${product.slug}`} className="btn-outline py-2 px-3 text-sm">
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-dark-300">
            Nu am găsit produse pentru {result.recommended.toLocaleString('ro-RO')} BTU în catalog.{' '}
            <Link href="/produse" className="font-semibold text-primary hover:underline">Vezi toate produsele</Link>
          </div>
        )}
      </div>

      {/* Montaj banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">🔧</div>
        <div className="flex-1">
          <p className="font-semibold text-dark text-sm">Montaj disponibil în județul Arad și Timiș</p>
          <p className="text-xs text-dark-300">Preț montaj standard de la 750 RON. Tehnicieni certificați F-Gas, garanție 2 ani.</p>
        </div>
        <Link href="/#contact" className="flex-shrink-0 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700">
          Solicită ofertă
        </Link>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/contact" className="btn-primary gap-2">
          <Phone size={16} />
          Consultanță gratuită
        </Link>
        <button onClick={onReset} className="btn-outline gap-2">
          <Calculator size={16} />
          Recalculează
        </button>
        <Link href="/produse" className="btn-outline gap-2">
          <ShoppingCart size={16} />
          Toate produsele
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CalculatorBTUPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [result, setResult] = useState<ResultData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  function onChange(key: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNext() {
    if (step < 3) setStep((prev) => (prev + 1) as Step);
  }

  function handleBack() {
    if (step > 1) setStep((prev) => (prev - 1) as Step);
    else setResult(null);
  }

  function handleCalculate() {
    const calc = calculateBTU(form);
    setResult({ rawBTU: calc.btu, recommended: calc.recommended });
    fetchProducts(calc.recommended);
  }

  async function fetchProducts(btu: number) {
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/products-by-btu?btu=${btu}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
      }
    } catch {
      // silent — no products shown
    } finally {
      setLoadingProducts(false);
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setStep(1);
    setResult(null);
    setProducts([]);
  }

  const canProceed1 = step === 1 && parseFloat(form.length) > 0 && parseFloat(form.width) > 0;

  return (
    <>
      <Script
        id="schema-calculator-btu"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Calculator BTU Aer Condiționat — PRO TERM',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'RON' },
            description:
              'Calculator gratuit BTU pentru aer condiționat. Introdu dimensiunile camerei și află ce capacitate ai nevoie.',
            url: 'https://pro-term.ro/calculator-btu',
            provider: {
              '@type': 'LocalBusiness',
              name: 'PRO TERM SRL',
              url: 'https://pro-term.ro',
            },
          }),
        }}
      />
      <Header />
      <main className="bg-light-200 pb-20 pt-24">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Hero */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-700 shadow-lg">
              <Calculator size={32} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-4xl">
              Calculator BTU aer condiționat
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-dark-300">
              Află exact câți BTU ai nevoie pentru camera ta. Calculator gratuit bazat pe standardul european, cu recomandări de produse.
            </p>
          </div>

          <div className="card">
            {result ? (
              <ResultCard
                result={result}
                products={products}
                loadingProducts={loadingProducts}
                onReset={handleReset}
              />
            ) : (
              <>
                <ProgressBar step={step} />

                <div className="mb-8 min-h-[280px]">
                  {step === 1 && <Step1 form={form} onChange={onChange} />}
                  {step === 2 && <Step2 form={form} onChange={onChange} />}
                  {step === 3 && <Step3 form={form} onChange={onChange} />}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
                  {step > 1 ? (
                    <button onClick={handleBack} className="btn-outline gap-2">
                      <ArrowLeft size={16} />
                      Înapoi
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      disabled={step === 1 && !canProceed1}
                      className="btn-primary gap-2 disabled:opacity-50"
                    >
                      Continuă
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleCalculate}
                      className="btn-primary gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Calculator size={16} />
                      Calculează BTU-urile
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Info cards */}
          {!result && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm text-center">
              {[
                { icon: '🔬', title: 'Standard european', text: 'Formula 30 BTU/m³ recomandată de producătorii de echipamente HVAC.' },
                { icon: '⚙️', title: 'Corecții multiple', text: 'Calculul ia în cont etajul, expunerea la soare, tipul camerei și echipamentele.' },
                { icon: '🛒', title: 'Recomandare produs', text: 'Afișăm produsele din catalogul nostru care corespund capacității calculate.' },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <p className="font-bold text-dark">{c.title}</p>
                  <p className="text-dark-300 mt-1">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
