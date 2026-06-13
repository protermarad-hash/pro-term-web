'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { BRAND_GRADIENT } from '@/lib/products';
import { calculateShipping, getShippingMessage, SHIPPING_FREE_THRESHOLD } from '@/lib/shipping';
import { getSupabaseAnonClient } from '@/lib/supabase';

const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea',
];

type PaymentMethod = 'ramburs' | 'transfer';

const INPUT_CLASS =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white';

export default function CheckoutClient() {
  const router = useRouter();
  const { items, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    county: '',
    postalCode: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ramburs');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form from profile if authenticated
  useEffect(() => {
    if (authLoading || !user) return;
    const supabase = getSupabaseAnonClient();
    if (!supabase) return;

    supabase
      .from('profiles')
      .select('nume_complet, telefon, adresa_livrare, oras, judet, cod_postal')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const parts = (data.nume_complet ?? '').trim().split(' ');
        const firstName = parts[0] ?? '';
        const lastName = parts.slice(1).join(' ');
        setForm((prev) => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          email: user.email ?? prev.email,
          phone: data.telefon ?? prev.phone,
          address: data.adresa_livrare ?? prev.address,
          city: data.oras ?? prev.city,
          county: data.judet ?? prev.county,
          postalCode: data.cod_postal ?? prev.postalCode,
        }));
      });
  }, [user, authLoading]);

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const shipping = calculateShipping(totalPrice);
  const shippingMessage = getShippingMessage(totalPrice);
  const grandTotal = totalPrice + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const orderItems = items.map(({ product, quantity }) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity,
      line_total: product.price * quantity,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          userId: user?.id ?? null,
          items: orderItems,
          subtotal: totalPrice,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Eroare la plasarea comenzii. Încearcă din nou.');
        return;
      }

      clearCart();
      router.push(`/comanda-confirmata/${data.orderId}`);
    } catch {
      setError('Eroare de rețea. Verifică conexiunea și încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-light-200 pb-20 pt-24">
          <div className="card mx-4 w-full max-w-md py-12 text-center">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
            <h2 className="mb-3 font-heading text-xl font-bold text-dark">Coșul tău este gol</h2>
            <Link href="/produse" className="btn-primary">
              Vezi produse
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-light-200 pb-20 pt-24">
        <div className="container mx-auto max-w-5xl px-4">
          <Link
            href="/produse"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-dark-300 transition-colors hover:text-dark"
          >
            <ArrowLeft size={16} />
            Continuă cumpărăturile
          </Link>

          <h1 className="mb-8 font-heading text-3xl font-bold text-dark">Finalizează comanda</h1>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-5">
              {/* ── Left column ── */}
              <div className="space-y-6 lg:col-span-3">
                {/* Delivery form */}
                <div className="card space-y-5">
                  <h2 className="border-b border-gray-100 pb-4 font-heading text-lg font-bold text-dark">
                    Date de livrare și contact
                  </h2>

                  {user && (
                    <p className="rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                      Date precompletate din profilul tău. Verifică și modifică dacă e nevoie.
                    </p>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-300">Prenume *</label>
                      <input type="text" name="firstName" required value={form.firstName} onChange={handle} placeholder="Ion" className={INPUT_CLASS} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-300">Nume *</label>
                      <input type="text" name="lastName" required value={form.lastName} onChange={handle} placeholder="Popescu" className={INPUT_CLASS} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-300">Email *</label>
                      <input type="email" name="email" required value={form.email} onChange={handle} placeholder="email@exemplu.ro" className={INPUT_CLASS} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-300">Telefon *</label>
                      <input type="tel" name="phone" required value={form.phone} onChange={handle} placeholder="07XX XXX XXX" className={INPUT_CLASS} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-300">Adresă *</label>
                    <input type="text" name="address" required value={form.address} onChange={handle} placeholder="Str. Exemplu nr. 10, Bloc A, Ap. 5" className={INPUT_CLASS} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="mb-1 block text-sm font-medium text-dark-300">Oraș *</label>
                      <input type="text" name="city" required value={form.city} onChange={handle} placeholder="Arad" className={INPUT_CLASS} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-300">Județ *</label>
                      <select name="county" required value={form.county} onChange={handle} className={INPUT_CLASS}>
                        <option value="">Selectează...</option>
                        {JUDETE.map((j) => <option key={j} value={j}>{j}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-300">Cod poștal</label>
                      <input type="text" name="postalCode" value={form.postalCode} onChange={handle} placeholder="310001" className={INPUT_CLASS} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-300">Mențiuni (opțional)</label>
                    <textarea name="notes" rows={3} value={form.notes} onChange={handle} placeholder="Etaj, interfon, instrucțiuni speciale livrare..." className={`${INPUT_CLASS} resize-none`} />
                  </div>
                </div>

                {/* Payment methods */}
                <div className="card space-y-4">
                  <h2 className="border-b border-gray-100 pb-4 font-heading text-lg font-bold text-dark">
                    Metodă de plată
                  </h2>

                  {/* Ramburs */}
                  <label className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${paymentMethod === 'ramburs' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value="ramburs" checked={paymentMethod === 'ramburs'} onChange={() => setPaymentMethod('ramburs')} className="mt-1 accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Truck size={18} className="text-primary" />
                        <span className="font-semibold text-dark">Plată la livrare (ramburs)</span>
                      </div>
                      <p className="mt-1 text-sm text-dark-300">Achitare în numerar curierului la primirea coletului.</p>
                    </div>
                  </label>

                  {/* Transfer bancar */}
                  <label className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="mt-1 accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote size={18} className="text-primary" />
                        <span className="font-semibold text-dark">Transfer bancar</span>
                      </div>
                      <p className="mt-1 text-sm text-dark-300">IBAN-ul și referința vor fi afișate după plasarea comenzii.</p>
                    </div>
                  </label>

                  {/* Card online — disabled */}
                  <div className="flex cursor-not-allowed items-start gap-4 rounded-xl border-2 border-gray-100 bg-gray-50 p-4 opacity-60">
                    <input type="radio" disabled className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-gray-400" />
                        <span className="font-semibold text-gray-400">Card online prin Netopia</span>
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-500">În curând</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400">Plata cu cardul va fi disponibilă în curând.</p>
                    </div>
                  </div>
                </div>

                {/* Legal notice */}
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-dark-300">
                  <strong className="text-primary">Informații precontractuale:</strong> Prețurile sunt în RON cu TVA 21% inclus. Stocul și disponibilitatea livrării se confirmă de PRO TERM înainte de procesare. Drept de retragere 14 zile conform OUG 34/2014.
                </div>

                <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-sm text-dark-300">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    Am citit și accept{' '}
                    <Link href="/termeni-si-conditii" className="font-semibold text-primary hover:underline">Termenii și condițiile</Link>,{' '}
                    <Link href="/politica-retur" className="font-semibold text-primary hover:underline">Politica de retur</Link> și{' '}
                    <Link href="/politica-confidentialitate" className="font-semibold text-primary hover:underline">Politica de confidențialitate</Link>.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 size={20} className="animate-spin" /> Se procesează...</>
                  ) : (
                    <>Comandă cu obligație de plată · {grandTotal.toLocaleString('ro-RO')} RON</>
                  )}
                </button>
              </div>

              {/* ── Right column — order summary ── */}
              <div className="space-y-4 lg:col-span-2">
                <div className="card">
                  <h2 className="mb-4 border-b border-gray-100 pb-4 font-heading text-lg font-bold text-dark">
                    Sumar comandă ({totalItems} {totalItems === 1 ? 'produs' : 'produse'})
                  </h2>

                  <div className="mb-4 space-y-3">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-3">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${BRAND_GRADIENT[product.brand]}`}>
                          <span className="text-[10px] font-bold text-white/70">{product.brand.slice(0, 2)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-dark">{product.name}</p>
                          <p className="text-xs text-dark-300">
                            Cant.: {quantity} · {product.price.toLocaleString('ro-RO')} RON/buc
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-bold text-dark">
                            {(product.price * quantity).toLocaleString('ro-RO')} RON
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="text-gray-300 transition-colors hover:text-brand"
                            aria-label="Șterge"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-sm text-dark-300">
                      <span>Subtotal produse</span>
                      <span>{totalPrice.toLocaleString('ro-RO')} RON</span>
                    </div>
                    <div className="flex justify-between text-sm text-dark-300">
                      <span>Transport</span>
                      <span>
                        {shipping === 0
                          ? <span className="font-semibold text-green-600">GRATUIT</span>
                          : `${shipping.toLocaleString('ro-RO')} RON`
                        }
                      </span>
                    </div>
                    {shippingMessage && (
                      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        {shippingMessage}
                      </p>
                    )}
                    {shipping === 0 && totalPrice >= SHIPPING_FREE_THRESHOLD && (
                      <p className="text-xs font-medium text-green-600">Transport gratuit pentru comenzi peste 2.500 RON!</p>
                    )}
                    <div className="mt-1 flex justify-between border-t border-gray-100 pt-3 font-bold text-lg text-dark">
                      <span>Total (TVA 21% inclus)</span>
                      <span>{grandTotal.toLocaleString('ro-RO')} RON</span>
                    </div>
                  </div>
                </div>

                <div className="card space-y-3">
                  {[
                    'Garanție legală și comercială conform documentelor produsului',
                    'Instalare profesională disponibilă în Arad și Timiș',
                    'Plată ramburs sau transfer bancar',
                    'Drept de retragere 14 zile pentru consumatori',
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2 text-sm text-dark-300">
                      <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-green-500" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
