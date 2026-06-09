'use client';

import { ShoppingCart, Settings, CheckCircle2, Zap } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/products';

interface PackageSpecs {
  camere?: number;
  configuratie?: string;
  suprafata_recomandata?: string;
  componente?: Record<string, string>;
  ue?: string;
}

interface Props {
  product: Product;
  onPersonalize?: (product: Product) => void;
}

function parsePackageSpecs(specs: Product['specs']): PackageSpecs {
  if (!Array.isArray(specs)) return {};
  const obj: Record<string, string> = {};
  for (const s of specs) obj[s.label] = s.value;
  return obj as unknown as PackageSpecs;
}

function getPackageSpecsRaw(product: Product): PackageSpecs {
  // specs stored as object in DB — comes through as array of {label, value} after dbProductToProduct
  // but for packages, specs are a JSON object — check both forms
  const raw = (product as unknown as { _rawSpecs?: PackageSpecs })._rawSpecs;
  if (raw) return raw;
  // Reconstruct from label-value array
  return parsePackageSpecs(product.specs);
}

export default function MultisplitPackageCard({ product, onPersonalize }: Props) {
  const { addToCart } = useCart();

  // Specs are stored as JSON object in Supabase — after dbProductToProduct they become
  // [{label: "camere", value: "2"}, ...] via parseSpecs which handles object form
  const specsMap: Record<string, string> = {};
  for (const s of product.specs) specsMap[s.label] = s.value;

  const camere = specsMap['camere'] ? Number(specsMap['camere']) : undefined;
  const configuratie = specsMap['configuratie'];
  const suprafata = specsMap['suprafata_recomandata'];

  // Parse components from nested spec
  let componenteSpec = specsMap['componente'];
  let componente: Record<string, string> = {};
  try {
    if (componenteSpec) componente = JSON.parse(componenteSpec);
  } catch {}

  const roomBadgeColor =
    camere === 2 ? 'bg-blue-100 text-blue-700' :
    camere === 3 ? 'bg-emerald-100 text-emerald-700' :
    camere === 4 ? 'bg-purple-100 text-purple-700' :
    'bg-orange-100 text-orange-700';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-100 bg-white shadow-card transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="rounded-t-2xl bg-gradient-to-br from-emerald-600 to-green-500 p-5 text-white">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-heading text-lg font-bold leading-tight">{product.name}</h3>
          {camere && (
            <span className={`ml-2 flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${roomBadgeColor}`}>
              {camere} CAMERE
            </span>
          )}
        </div>
        {configuratie && (
          <p className="text-sm font-semibold text-green-100">{configuratie.replace(/\+/g, ' + ')} BTU</p>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {suprafata && (
          <div className="mb-3 flex items-center gap-2 text-sm text-dark-300">
            <Zap size={14} className="text-accent" />
            <span>Suprafață: <strong className="text-dark">{suprafata}</strong></span>
          </div>
        )}

        {/* Components list */}
        {Object.keys(componente).length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-dark-300">Componente incluse</p>
            <ul className="space-y-1.5">
              {Object.entries(componente).map(([key, model]) => (
                <li key={key} className="flex items-start gap-2 text-xs text-dark-300">
                  <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  <span>
                    <strong className="text-dark uppercase">{key}:</strong> {model}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="mb-4 rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs text-dark-300">Preț total (TVA inclus)</p>
            <p className="font-heading text-2xl font-bold text-dark">
              {product.price.toLocaleString('ro-RO')} RON
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90"
            >
              <ShoppingCart size={16} />
              Adaugă în coș
            </button>
            {onPersonalize && (
              <button
                onClick={() => onPersonalize(product)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-4 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/5"
              >
                <Settings size={16} />
                Personalizează
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
