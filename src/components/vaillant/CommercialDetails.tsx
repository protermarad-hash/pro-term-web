import Link from 'next/link';
import { CheckCircle2, FileText, MinusCircle, Zap } from 'lucide-react';
import {
  POWER_SUPPLY_LABEL,
  PRICE_AVAILABILITY_NOTICE,
  SYSTEM_QUOTE_CTA,
  type ProductCommercialDetails,
} from '@/lib/product-commercial';
import type { Product } from '@/lib/products';

export function formatPriceRon(value: number): string {
  return `${value.toLocaleString('ro-RO')} lei`;
}

export function systemQuoteHref(slug: string): string {
  return `/vaillant/cerere-oferta?produs=${encodeURIComponent(slug)}&optiune=sistem-complet`;
}

export function equipmentQuoteHref(slug: string): string {
  return `/vaillant/cerere-oferta?produs=${encodeURIComponent(slug)}&optiune=echipament`;
}

/** SKU + power supply lines, exactly as required for every product. */
export function ProductIdentity({ commercial }: { commercial: ProductCommercialDetails }) {
  return (
    <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
      <dt className="text-dark-300">Cod SKU</dt>
      <dd className="font-semibold text-dark" data-testid="product-sku">
        {commercial.manufacturerCode ?? 'Se confirmă la ofertare'}
      </dd>
      <dt className="text-dark-300">Alimentare</dt>
      <dd className="font-semibold text-dark" data-testid="product-power-supply">
        {commercial.powerSupply ? POWER_SUPPLY_LABEL[commercial.powerSupply] : 'Se confirmă la ofertare'}
      </dd>
    </dl>
  );
}

export function ComponentLists({ commercial }: { commercial: ProductCommercialDetails }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div data-testid="included-components">
        <p className="mb-2 text-sm font-bold text-dark">Componente incluse în preț</p>
        {commercial.includedComponents.length > 0 ? (
          <ul className="space-y-1.5">
            {commercial.includedComponents.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-dark-300">
                <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-dark-300">Se confirmă la ofertare.</p>
        )}
      </div>
      <div data-testid="excluded-components">
        <p className="mb-2 text-sm font-bold text-dark">Nu sunt incluse</p>
        {commercial.excludedComponents.length > 0 ? (
          <ul className="space-y-1.5">
            {commercial.excludedComponents.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-dark-300">
                <MinusCircle size={15} className="mt-0.5 flex-shrink-0 text-dark-300" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-dark-300">Se confirmă la ofertare.</p>
        )}
      </div>
    </div>
  );
}

export function PriceWithNotice({ price }: { price: number }) {
  if (price <= 0) {
    return <p className="font-heading text-2xl font-bold text-dark">Preț la cerere</p>;
  }
  return (
    <div>
      <p className="font-heading text-3xl font-bold text-dark" data-testid="product-price">
        {formatPriceRon(price)}
      </p>
      <p className="text-xs text-dark-300">Preț final, TVA inclus. {PRICE_AVAILABILITY_NOTICE}</p>
    </div>
  );
}

export function SystemQuoteButton({ slug, className = '' }: { slug: string; className?: string }) {
  return (
    <Link href={systemQuoteHref(slug)} className={`btn-primary justify-center ${className}`}>
      <Zap size={18} />
      {SYSTEM_QUOTE_CTA}
    </Link>
  );
}

export function DocumentLinks({ commercial }: { commercial: ProductCommercialDetails }) {
  if (commercial.documents.length === 0) {
    return <p className="text-sm text-dark-300">Documentația oficială se oferă la cerere.</p>;
  }
  return (
    <ul className="space-y-2">
      {commercial.documents.map((doc) => (
        <li key={doc.url}>
          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <FileText size={16} className="flex-shrink-0" />
            {doc.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Compact listing card used on the Vaillant category / series pages. */
export function CommercialProductCard({ product, commercial }: { product: Product; commercial: ProductCommercialDetails }) {
  return (
    <article className="card flex h-full flex-col gap-4" data-testid="commercial-product-card">
      <div>
        <h3 className="font-heading text-lg font-bold text-dark">
          <Link href={`/produse/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="mt-3">
          <ProductIdentity commercial={commercial} />
        </div>
      </div>
      <ComponentLists commercial={commercial} />
      <div className="mt-auto space-y-3 border-t border-slate-100 pt-4">
        <PriceWithNotice price={product.price} />
        <SystemQuoteButton slug={product.slug} className="w-full" />
        <Link href={`/produse/${product.slug}`} className="block text-center text-sm font-semibold text-primary hover:underline">
          Date tehnice și documentație
        </Link>
      </div>
    </article>
  );
}
