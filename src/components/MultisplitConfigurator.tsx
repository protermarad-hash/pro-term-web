'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, ShoppingCart, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/products';

// ─── BTU helpers ────────────────────────────────────────────────────────────

function btuForSqm(sqm: number): number {
  if (sqm <= 15) return 7000;
  if (sqm <= 20) return 9000;
  if (sqm <= 30) return 12000;
  return 18000;
}

function btuLabel(btu: number): string {
  return `${(btu / 1000).toFixed(0)}.000 BTU`;
}

// ─── UE selection ────────────────────────────────────────────────────────────

function pickUE(ueProducts: Product[], totalBtu: number, numRooms: number): Product | null {
  // Get UE max rooms from specs
  const ues = ueProducts
    .map((p) => {
      const maxUI = Number(p.specs.find((s) => s.label === 'unitati_interioare_max')?.value ?? 0);
      return { product: p, maxUI };
    })
    .filter((u) => u.product.btu != null && u.product.btu >= totalBtu && u.maxUI >= numRooms)
    .sort((a, b) => (a.product.btu ?? 0) - (b.product.btu ?? 0));

  return ues[0]?.product ?? null;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface RoomConfig {
  sqm: number;
  btu: number;
  type: 'perete' | 'caseta';
  autoTypeError: boolean;
}

interface Props {
  /** When provided, pre-loads a package configuration */
  preloadedRooms?: RoomConfig[];
  preloadedNumRooms?: number;
  uiProducts: Product[];
  ueProducts: Product[];
}

const DEFAULT_SQM = 20;

function defaultRoom(): RoomConfig {
  return { sqm: DEFAULT_SQM, btu: btuForSqm(DEFAULT_SQM), type: 'perete', autoTypeError: false };
}

export default function MultisplitConfigurator({ preloadedRooms, preloadedNumRooms, uiProducts, ueProducts }: Props) {
  const { addToCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [numRooms, setNumRooms] = useState<number>(preloadedNumRooms ?? 2);
  const [rooms, setRooms] = useState<RoomConfig[]>(
    preloadedRooms ?? Array.from({ length: 2 }, defaultRoom)
  );
  const [selectedUE, setSelectedUE] = useState<Product | null>(null);
  const [addedAll, setAddedAll] = useState(false);

  // When numRooms changes, reset rooms array
  useEffect(() => {
    setRooms((prev) => {
      const next = Array.from({ length: numRooms }, (_, i) => prev[i] ?? defaultRoom());
      return next;
    });
  }, [numRooms]);

  // Recalculate UE whenever rooms change
  useEffect(() => {
    const totalBtu = rooms.reduce((s, r) => s + r.btu, 0);
    setSelectedUE(pickUE(ueProducts, totalBtu, numRooms));
  }, [rooms, numRooms, ueProducts]);

  const updateRoom = useCallback((idx: number, patch: Partial<RoomConfig>) => {
    setRooms((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const next = { ...r, ...patch };
        // Recalc BTU if sqm changed
        if ('sqm' in patch) next.btu = btuForSqm(next.sqm);
        // Validate type
        if (next.type === 'caseta' && next.btu < 12000) {
          next.type = 'perete';
          next.autoTypeError = true;
        } else {
          next.autoTypeError = false;
        }
        return next;
      })
    );
  }, []);

  // Find UI product matching btu + type
  function findUI(btu: number, type: 'perete' | 'caseta'): Product | undefined {
    return uiProducts.find((p) => {
      const tipSpec = p.specs.find((s) => s.label === 'tip')?.value;
      const tipMatch = type === 'caseta' ? tipSpec === 'caseta' : tipSpec === 'perete';
      return p.btu === btu && tipMatch;
    });
  }

  const totalBtu = rooms.reduce((s, r) => s + r.btu, 0);
  const totalPrice =
    rooms.reduce((s, r) => {
      const ui = findUI(r.btu, r.type);
      return s + (ui?.price ?? 0);
    }, 0) + (selectedUE?.price ?? 0);

  function handleAddAll() {
    rooms.forEach((r) => {
      const ui = findUI(r.btu, r.type);
      if (ui) addToCart(ui);
    });
    if (selectedUE) addToCart(selectedUE);
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 3000);
  }

  function buildWhatsAppText(): string {
    const lines = rooms.map((r, i) => {
      const ui = findUI(r.btu, r.type);
      return `Camera ${i + 1}: ${ui?.name ?? `${btuLabel(r.btu)} perete`} (${r.sqm} m²)`;
    });
    if (selectedUE) lines.push(`UE: ${selectedUE.name}`);
    lines.push(`Total: ${totalPrice.toLocaleString('ro-RO')} RON`);
    return encodeURIComponent(
      `Bună ziua! Doresc o ofertă pentru sistem multisplit:\n${lines.join('\n')}`
    );
  }

  // ─── Step 1 ───────────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
        <h3 className="mb-2 font-heading text-xl font-bold text-dark">Configurator personalizat</h3>
        <p className="mb-6 text-sm text-dark-300">Câte camere dorești să climatizezi?</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => { setNumRooms(n); setStep(2); }}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-5 transition-all hover:border-primary hover:bg-primary/5 ${
                numRooms === n ? 'border-primary bg-primary/5' : 'border-slate-200'
              }`}
            >
              <span className="font-heading text-4xl font-bold text-primary">{n}</span>
              <span className="mt-1 text-sm font-semibold text-dark-300">camere</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Step 2 ───────────────────────────────────────────────────────────────

  if (step === 2) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-dark">Configurează camerele</h3>
            <p className="text-sm text-dark-300">Sistem de {numRooms} camere</p>
          </div>
          <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
            <ChevronLeft size={16} /> Înapoi
          </button>
        </div>

        <div className="space-y-4">
          {rooms.map((room, i) => {
            const ui = findUI(room.btu, room.type);
            return (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-3 font-heading text-sm font-bold text-dark">Camera {i + 1}</p>

                {/* Suprafata slider */}
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-xs text-dark-300">
                    <span>Suprafață</span>
                    <span className="font-semibold text-dark">{room.sqm} m² → {btuLabel(room.btu)}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={1}
                    value={room.sqm}
                    onChange={(e) => updateRoom(i, { sqm: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-dark-300">
                    <span>10 m²</span>
                    <span>60 m²</span>
                  </div>
                </div>

                {/* Tip unitate */}
                <div className="mb-2">
                  <p className="mb-1.5 text-xs text-dark-300">Tip unitate interioară</p>
                  <div className="flex gap-2">
                    {(['perete', 'caseta'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateRoom(i, { type: t })}
                        className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all ${
                          room.type === t
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 text-dark-300 hover:border-primary'
                        }`}
                      >
                        {t === 'perete' ? 'Perete (Bora A5)' : 'Casetă (4 direcții)'}
                      </button>
                    ))}
                  </div>
                </div>

                {room.autoTypeError && (
                  <div className="mb-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                    <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                    Caseta nu este disponibilă pentru această capacitate, am selectat automat unitatea de perete.
                  </div>
                )}

                {ui ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-300">{ui.name}</span>
                    <span className="font-bold text-dark">{ui.price.toLocaleString('ro-RO')} RON</span>
                  </div>
                ) : (
                  <p className="text-xs text-red-500">Unitate nedisponibilă pentru această configurație</p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setStep(3)}
          className="btn-primary mt-5 w-full justify-center"
        >
          Continuă spre sumar <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  // ─── Step 3 — Sumar ───────────────────────────────────────────────────────

  const ueUpgrades = ueProducts
    .filter((p) => {
      const maxUI = Number(p.specs.find((s) => s.label === 'unitati_interioare_max')?.value ?? 0);
      return (p.btu ?? 0) >= totalBtu && maxUI >= numRooms;
    })
    .sort((a, b) => (a.btu ?? 0) - (b.btu ?? 0));

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold text-dark">Configurația ta</h3>
        <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
          <ChevronLeft size={16} /> Modifică
        </button>
      </div>

      {/* Rooms summary */}
      <div className="mb-4 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
        {rooms.map((room, i) => {
          const ui = findUI(room.btu, room.type);
          return (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-dark">Camera {i + 1}</p>
                <p className="text-xs text-dark-300">{ui?.name ?? `${btuLabel(room.btu)} perete`} · {room.sqm} m²</p>
              </div>
              <span className="text-sm font-bold text-dark">
                {ui ? `${ui.price.toLocaleString('ro-RO')} RON` : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {/* UE section */}
      <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dark-300">Unitate exterioară</p>
        {selectedUE ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-dark">{selectedUE.name}</p>
              <span className="text-sm font-bold text-dark">{selectedUE.price.toLocaleString('ro-RO')} RON</span>
            </div>
            {ueUpgrades.length > 1 && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-dark-300">Upgrade la unitate exterioară:</p>
                <div className="flex flex-wrap gap-2">
                  {ueUpgrades.map((ue) => (
                    <button
                      key={ue.id}
                      onClick={() => setSelectedUE(ue)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        selectedUE.id === ue.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-200 text-dark-300 hover:border-primary'
                      }`}
                    >
                      {btuLabel(ue.btu ?? 0)} · {ue.price.toLocaleString('ro-RO')} RON
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-red-500">Nicio unitate exterioară compatibilă găsită</p>
        )}
      </div>

      {/* Total */}
      <div className="mb-5 rounded-xl bg-primary/5 p-4 text-center">
        <p className="text-xs text-dark-300">Total configurație (TVA inclus)</p>
        <p className="font-heading text-3xl font-bold text-dark">{totalPrice.toLocaleString('ro-RO')} RON</p>
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={handleAddAll}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition-all hover:bg-primary/90"
        >
          {addedAll ? (
            <><CheckCircle2 size={18} /> Adăugat în coș!</>
          ) : (
            <><ShoppingCart size={18} /> Adaugă tot în coș</>
          )}
        </button>
        <a
          href={`https://wa.me/40749025610?text=${buildWhatsAppText()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3.5 font-bold text-white transition-all hover:bg-green-600"
        >
          <MessageCircle size={18} />
          Solicită ofertă
        </a>
      </div>
    </div>
  );
}
