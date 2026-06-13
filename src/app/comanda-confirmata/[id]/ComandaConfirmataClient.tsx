'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  Phone,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const IBAN = 'RO15BTRLRONCRT0CK3829101';

interface Order {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postal_code: string;
  notes: string;
  items: Array<{ name: string; quantity: number; price: number; line_total: number }>;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: 'ramburs' | 'transfer';
  status: string;
}

function fmt(n: number) {
  return n.toLocaleString('ro-RO') + ' RON';
}

function orderRef(id: string) {
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

export default function ComandaConfirmataClient() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then(({ order: o, error: e }) => {
        if (e) setError(e);
        else setOrder(o);
      })
      .catch(() => setError('Nu am putut încărca comanda.'))
      .finally(() => setLoading(false));
  }, [id]);

  function copyIBAN() {
    navigator.clipboard.writeText(IBAN).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-light-200 pb-20 pt-24">
          <Loader2 size={32} className="animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-light-200 pb-20 pt-24">
          <div className="card mx-4 w-full max-w-md py-12 text-center">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
            <h2 className="mb-3 font-heading text-xl font-bold text-dark">Comanda nu a fost găsită</h2>
            <p className="mb-6 text-sm text-dark-300">{error || 'Verifică link-ul sau contactează-ne.'}</p>
            <Link href="/" className="btn-primary">Înapoi acasă</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const ref = orderRef(order.id);
  const isTransfer = order.payment_method === 'transfer';

  return (
    <>
      <Header />
      <main className="bg-light-200 pb-20 pt-24">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Success banner */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white shadow-lg">
            <CheckCircle2 size={56} className="mx-auto mb-4" />
            <h1 className="mb-2 font-heading text-3xl font-bold">Comanda a fost plasată!</h1>
            <p className="text-lg text-green-100">Mulțumim, {order.first_name}! Comanda #{ref} a fost înregistrată.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Payment instructions */}
            <div className="card md:col-span-2">
              {isTransfer ? (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                      <Banknote size={20} className="text-blue-600" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-dark">Transfer bancar</h2>
                  </div>
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 space-y-3">
                    <p className="text-sm font-medium text-blue-800">Efectuează plata în cel mult 3 zile lucrătoare:</p>
                    <div className="space-y-2 text-sm text-dark-300">
                      <div className="flex items-center justify-between gap-4">
                        <span>IBAN</span>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-white px-2 py-1 font-mono text-sm font-bold text-dark border border-blue-200">{IBAN}</code>
                          <button onClick={copyIBAN} className="flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200 transition-colors">
                            <Copy size={12} />
                            {copied ? 'Copiat!' : 'Copiază'}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between"><span>Beneficiar</span><span className="font-semibold text-dark">PRO TERM SRL</span></div>
                      <div className="flex justify-between"><span>Referință obligatorie</span><span className="font-bold text-blue-700">Comanda #{ref}</span></div>
                      <div className="flex justify-between border-t border-blue-200 pt-2"><span className="font-semibold">Sumă de plată</span><span className="font-bold text-dark">{fmt(order.total)}</span></div>
                    </div>
                    <p className="text-xs text-blue-600 border-t border-blue-200 pt-2">Comanda se confirmă și se expediază după recepționarea plății. Vei primi o confirmare pe email.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <Truck size={20} className="text-green-600" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-dark">Plată la livrare (ramburs)</h2>
                  </div>
                  <div className="rounded-xl bg-green-50 border border-green-200 p-5 space-y-2 text-sm text-dark-300">
                    <p className="font-medium text-green-800">Nu e necesară nicio acțiune din partea ta acum.</p>
                    <p>Vei achita <strong className="text-dark">{fmt(order.total)}</strong> curierului în numerar la primirea coletului.</p>
                    <p>Te vom contacta la <strong className="text-dark">{order.phone}</strong> pentru a confirma comanda și a stabili livrarea.</p>
                  </div>
                </>
              )}
            </div>

            {/* Order summary */}
            <div className="card">
              <h2 className="mb-4 border-b border-gray-100 pb-3 font-heading text-lg font-bold text-dark">
                Sumar comandă #{ref}
              </h2>
              <div className="mb-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between gap-2 text-sm">
                    <span className="text-dark-300">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-dark">{fmt(item.line_total)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 border-t border-gray-100 pt-3 text-sm">
                <div className="flex justify-between text-dark-300">
                  <span>Subtotal produse</span>
                  <span>{fmt(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>Transport</span>
                  <span>{order.shipping_cost === 0 ? <span className="font-semibold text-green-600">GRATUIT</span> : fmt(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-dark">
                  <span>Total (TVA 21% inclus)</span>
                  <span>{fmt(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="card">
              <h2 className="mb-4 border-b border-gray-100 pb-3 font-heading text-lg font-bold text-dark">
                Adresă livrare
              </h2>
              <div className="space-y-2 text-sm text-dark-300">
                <p className="font-semibold text-dark">{order.first_name} {order.last_name}</p>
                <p>{order.address}</p>
                <p>{order.city}, {order.county}{order.postal_code ? `, ${order.postal_code}` : ''}</p>
                <p className="pt-1">Tel: <span className="font-semibold text-dark">{order.phone}</span></p>
                <p>Email: <span className="font-semibold text-dark">{order.email}</span></p>
                {order.notes && (
                  <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700">Mențiuni: {order.notes}</p>
                )}
              </div>
            </div>

            {/* What's next */}
            <div className="card md:col-span-2">
              <h2 className="mb-4 font-heading text-lg font-bold text-dark">Ce urmează?</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Confirmare comandă</p>
                    <p className="text-xs text-dark-300 mt-0.5">Primești email de confirmare în câteva minute.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Procesare & expediere</p>
                    <p className="text-xs text-dark-300 mt-0.5">{isTransfer ? 'Expedierea se face după confirmarea plății.' : 'Te contactăm pentru a confirma disponibilitatea.'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Livrare la domiciliu</p>
                    <p className="text-xs text-dark-300 mt-0.5">Curier Fan Courier sau DPD, timp estimat 2-5 zile lucrătoare.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 md:col-span-2">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Phone size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-sm text-dark-300">
                <span className="font-semibold text-dark">Ai întrebări? </span>
                Suntem disponibili la{' '}
                <a href="tel:0749025610" className="font-bold text-primary hover:underline">0749 025 610</a>{' '}
                sau{' '}
                <a href="mailto:office@pro-term.ro" className="font-semibold text-primary hover:underline">office@pro-term.ro</a>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center md:col-span-2">
              <Link href="/produse" className="btn-outline gap-2">
                Continuă cumpărăturile
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
