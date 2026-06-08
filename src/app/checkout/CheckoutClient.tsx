'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Trash2, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { BRAND_GRADIENT } from '@/lib/products';

const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brașov', 'Brăila', 'București', 'Buzău', 'Caraș-Severin', 'Călărași',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea',
];

export default function CheckoutClient() {
  const { items, removeFromCart, totalItems, totalPrice } = useCart();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    address:   '',
    city:      '',
    county:    '',
    notes:     '',
  });

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const shipping = totalPrice >= 3000 ? 0 : 299;
  const grandTotal = totalPrice + shipping;

  if (placed) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-20 bg-light-200 flex items-center justify-center">
          <div className="card max-w-md w-full mx-4 text-center py-12">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-dark mb-3">
              Comandă plasată cu succes!
            </h1>
            <p className="text-dark-300 mb-2">
              Îți mulțumim pentru comandă, <strong>{form.firstName}</strong>!
            </p>
            <p className="text-dark-300 text-sm mb-8">
              Vei primi un email de confirmare la{' '}
              <span className="font-semibold text-primary">{form.email}</span>.
              Te vom contacta în maxim 24h pentru confirmare.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/produse" className="btn-primary justify-center">
                Continuă cumpărăturile
              </Link>
              <Link href="/" className="text-sm text-dark-300 hover:text-dark transition-colors">
                Înapoi la pagina principală
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-20 bg-light-200 flex items-center justify-center">
          <div className="card max-w-md w-full mx-4 text-center py-12">
            <ShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold font-heading text-dark mb-3">
              Coșul tău este gol
            </h2>
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
      <main className="pt-24 pb-20 bg-light-200">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back */}
          <Link
            href="/produse"
            className="inline-flex items-center gap-1.5 text-sm text-dark-300 hover:text-dark transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Continuă cumpărăturile
          </Link>

          <h1 className="text-3xl font-bold font-heading text-dark mb-8">
            Finalizează comanda
          </h1>

          <div className="grid lg:grid-cols-5 gap-8">

            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={(e) => { e.preventDefault(); setPlaced(true); }}
                className="card space-y-5"
              >
                <h2 className="text-lg font-bold font-heading text-dark border-b border-gray-100 pb-4">
                  Date de livrare
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Prenume *
                    </label>
                    <input
                      type="text" name="firstName" required
                      value={form.firstName} onChange={handle}
                      placeholder="Ion"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Nume *
                    </label>
                    <input
                      type="text" name="lastName" required
                      value={form.lastName} onChange={handle}
                      placeholder="Popescu"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email" name="email" required
                      value={form.email} onChange={handle}
                      placeholder="email@exemplu.ro"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel" name="phone" required
                      value={form.phone} onChange={handle}
                      placeholder="07XX XXX XXX"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Adresă *
                  </label>
                  <input
                    type="text" name="address" required
                    value={form.address} onChange={handle}
                    placeholder="Str. Exemplu nr. 10, Bloc A, Ap. 5"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Oraș *
                    </label>
                    <input
                      type="text" name="city" required
                      value={form.city} onChange={handle}
                      placeholder="București"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">
                      Județ *
                    </label>
                    <select
                      name="county" required
                      value={form.county} onChange={handle}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                    >
                      <option value="">Selectează județul...</option>
                      {JUDETE.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Mențiuni (opțional)
                  </label>
                  <textarea
                    name="notes" rows={3}
                    value={form.notes} onChange={handle}
                    placeholder="Etaj, interfon, instrucțiuni speciale livrare..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </div>

                {/* Payment note */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-sm text-dark-300">
                  <strong className="text-primary">Plată la livrare (ramburs)</strong> sau{' '}
                  <strong className="text-primary">transfer bancar</strong>.
                  Detaliile de plată vor fi trimise pe email după confirmarea comenzii.
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                  Plasează comanda · {grandTotal.toLocaleString('ro-RO')} RON
                </button>

                <p className="text-xs text-dark-300 text-center">
                  Prin plasarea comenzii ești de acord cu{' '}
                  <Link href="#" className="text-primary hover:underline">Termenii și Condițiile</Link>.
                </p>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card">
                <h2 className="text-lg font-bold font-heading text-dark mb-4 border-b border-gray-100 pb-4">
                  Sumar comandă ({totalItems} {totalItems === 1 ? 'produs' : 'produse'})
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${BRAND_GRADIENT[product.brand]} flex-shrink-0 flex items-center justify-center`}
                      >
                        <span className="text-white/70 text-[10px] font-bold">
                          {product.brand.slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark truncate">{product.name}</p>
                        <p className="text-xs text-dark-300">
                          Cant.: {quantity} · {product.price.toLocaleString('ro-RO')} RON/buc
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-dark">
                          {(product.price * quantity).toLocaleString('ro-RO')} RON
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-300 hover:text-brand transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-dark-300">
                    <span>Subtotal</span>
                    <span>{totalPrice.toLocaleString('ro-RO')} RON</span>
                  </div>
                  <div className="flex justify-between text-sm text-dark-300">
                    <span>Transport</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">Gratuit</span>
                      ) : (
                        `${shipping} RON`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-dark-300">
                      Transport gratuit la comenzi peste 3.000 RON
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-dark text-lg border-t border-gray-100 pt-3 mt-1">
                    <span>Total</span>
                    <span>{grandTotal.toLocaleString('ro-RO')} RON</span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="card space-y-3">
                {[
                  'Garanție 2 ani pe echipamente',
                  'Instalare profesională disponibilă',
                  'Plată ramburs sau transfer',
                  'Retur 30 zile fără întrebări',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-dark-300">
                    <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
