'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { CATEGORY_LABEL, type Brand, type Category, type Product } from '@/lib/products';

const AUTHORIZED_BRANDS: Brand[] = ['Midea', 'Gree', 'Yamato'];

const BRANDS: Brand[] = [
  'Midea',
  'Gree',
  'Yamato',
  'Fujitsu',
  'Yukon',
  'Habitat',
  'Bosch',
  'Vaillant',
  'Immergas',
  'Viessmann',
  'Generic',
  'PRO TERM',
];

const CATEGORIES: Category[] = [
  'aer-conditionat',
  'centrale-termice',
  'pompe-caldura',
  'accesorii-montaj-ac',
  'teava-fitinguri',
  'condens-drenaj',
  'termostate-automatizari',
  'service-montaj',
];

const BTU_OPTIONS = [9000, 12000, 18000, 24000];

type SortKey = 'pret-asc' | 'pret-desc' | 'rating' | 'recenzii';

const SORT_LABELS: Record<SortKey, string> = {
  'pret-asc': 'Preț: mic → mare',
  'pret-desc': 'Preț: mare → mic',
  rating: 'Cele mai bine cotate',
  recenzii: 'Cele mai populare',
};

const BRAND_ORDER: Record<string, number> = { Midea: 0, Gree: 1, Yamato: 2 };

export default function ProductCatalog({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [selectedBrands, setSelectedBrands] = useState<Set<Brand>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [selectedBTU, setSelectedBTU] = useState<Set<number>>(new Set());
  const [showQuoteOnly, setShowQuoteOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('rating');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickBrand, setQuickBrand] = useState<Brand | null>(null);

  // Apply ?brand=X URL param on first render
  useEffect(() => {
    const urlBrand = searchParams.get('brand') as Brand | null;
    if (urlBrand && BRANDS.includes(urlBrand)) {
      setQuickBrand(urlBrand);
    }
  }, [searchParams]);

  function toggle<T>(set: Set<T>, val: T): Set<T> {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (quickBrand && p.brand !== quickBrand) return false;
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false;
      if (selectedBTU.size > 0 && (!p.btu || !selectedBTU.has(p.btu))) return false;
      if (showQuoteOnly && p.price > 0) return false;
      return true;
    });

    switch (sort) {
      case 'pret-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'pret-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list = [...list].sort((a, b) => {
          const brandDiff = (BRAND_ORDER[a.brand] ?? 99) - (BRAND_ORDER[b.brand] ?? 99);
          if (brandDiff !== 0) return brandDiff;
          return b.rating - a.rating;
        });
        break;
      case 'recenzii':
        list = [...list].sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return list;
  }, [products, selectedBrands, selectedCategories, selectedBTU, showQuoteOnly, sort]);

  function resetFilters() {
    setSelectedBrands(new Set());
    setSelectedCategories(new Set());
    setSelectedBTU(new Set());
    setShowQuoteOnly(false);
    setQuickBrand(null);
  }

  const hasFilters = selectedBrands.size > 0 || selectedCategories.size > 0 || selectedBTU.size > 0 || showQuoteOnly || quickBrand !== null;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-dark">Brand</h3>
        {BRANDS.map((b) => (
          <label key={b} className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={selectedBrands.has(b)}
              onChange={() => setSelectedBrands(toggle(selectedBrands, b))}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-dark-300">{b}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-dark">Categorie</h3>
        {CATEGORIES.map((c) => (
          <label key={c} className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={selectedCategories.has(c)}
              onChange={() => setSelectedCategories(toggle(selectedCategories, c))}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-dark-300">{CATEGORY_LABEL[c]}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-dark">Capacitate AC (BTU)</h3>
        {BTU_OPTIONS.map((btu) => (
          <label key={btu} className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={selectedBTU.has(btu)}
              onChange={() => setSelectedBTU(toggle(selectedBTU, btu))}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm text-dark-300">{btu.toLocaleString('ro-RO')} BTU</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-dark">Disponibilitate</h3>
        <label className="flex cursor-pointer items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={showQuoteOnly}
            onChange={() => setShowQuoteOnly((value) => !value)}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm text-dark-300">Produse cu ofertă personalizată</span>
        </label>
      </div>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="w-full rounded-lg border border-brand py-2 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white"
        >
          Resetează filtrele
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-dark">Magazin HVAC PRO TERM</h1>
        <p className="mt-1 text-dark-300">
          {filtered.length} produse și categorii · Aer condiționat, centrale, pompe de căldură și accesorii
        </p>
      </div>

      {/* Quick brand tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setQuickBrand(null)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${quickBrand === null ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-dark-300 hover:border-gray-300'}`}
        >
          Toate
        </button>
        {AUTHORIZED_BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setQuickBrand(quickBrand === b ? null : b)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${quickBrand === b ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-dark-300 hover:border-gray-300'}`}
          >
            {quickBrand === b && <ShieldCheck size={13} />}
            {b}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="card sticky top-24">
            <h2 className="mb-4 font-heading font-bold text-dark">Filtre</h2>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-dark-300 transition-colors hover:border-primary lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filtre
              {hasFilters && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">!</span>}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-dark-300 sm:block">Sortare:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm focus:border-primary focus:outline-none"
                >
                  {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-300" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-dark-300">Niciun produs nu corespunde filtrelor.</p>
              <button onClick={resetFilters} className="mt-4 font-medium text-primary hover:underline">
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-dark/50 transition-opacity lg:hidden ${
          filtersOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setFiltersOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto bg-white transition-transform duration-300 lg:hidden ${
          filtersOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b p-5">
          <span className="font-heading font-bold text-dark">Filtre</span>
          <button onClick={() => setFiltersOpen(false)}>
            <X size={20} className="text-dark-300" />
          </button>
        </div>
        <div className="p-5">
          <FilterPanel />
        </div>
      </div>
    </>
  );
}
