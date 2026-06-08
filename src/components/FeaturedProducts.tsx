import Link from 'next/link';
import { ArrowRight, CheckCircle2, PackageCheck, Store } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

const featuredProducts = products
  .filter((product) => product.isBestseller || product.isNew)
  .slice(0, 6);

const shopBenefits = [
  'Prețuri vizibile pentru produsele din listă',
  'Ofertă cu montaj și accesorii la cerere',
  'Recomandare tehnică înainte de comandă',
  'Branduri potrivite pentru locuințe și spații comerciale',
];

export default function FeaturedProducts() {
  return (
    <section id="magazin" className="relative overflow-hidden bg-light-200 py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-accent">
              <Store size={15} />
              Magazin online
            </span>
            <h2 className="section-title mt-4">
              Produse HVAC selectate pentru comandă, ofertă și montaj.
            </h2>
            <p className="section-subtitle">
              Începem cu gamele cerute cel mai des: aer condiționat Gree și Yamato, accesorii, centrale și soluții tehnice pentru locuințe sau spații comerciale.
            </p>
          </div>

          <Link href="/produse" className="btn-primary w-fit whitespace-nowrap">
            Vezi tot catalogul
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card lg:sticky lg:top-28 lg:self-start">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
              <PackageCheck size={24} />
            </div>
            <h3 className="font-heading text-xl font-bold text-dark">Magazin + consultanță</h3>
            <p className="mt-2 text-sm leading-relaxed text-dark-300">
              Pentru echipamente tehnice, prețul produsului este doar o parte din decizie. Te ajutăm să alegi capacitatea, accesoriile și soluția de montaj.
            </p>

            <div className="mt-6 space-y-3">
              {shopBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-secondary" />
                  <span className="text-sm leading-relaxed text-dark-300">{benefit}</span>
                </div>
              ))}
            </div>

            <Link href="/#contact" className="mt-6 flex w-full items-center justify-center rounded-xl border-2 border-primary px-4 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white">
              Cere recomandare
            </Link>
          </aside>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
