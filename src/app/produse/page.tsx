'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, type Brand, type Category, CATEGORY_LABEL } from '@/lib/products';

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
  'pret-asc':  'Preț: mic → mare',
  'pret-desc': 'Preț: mare → mic',
  rating:      'Cele mai bine cotate',
  recenzii:    'Cele mai populare',
};

export default function ProdusePage() {
  const [selectedBrands,     setSelectedBrands]     = useState<Set<Brand>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [selectedBTU,        setSelectedBTU]        = useState<Set<number>>(new Set());
  const [showQuoteOnly,      setShowQuoteOnly]      = useState(false);
  const [sort,               setSort]               = useState<SortKey>('rating');
  const [filtersOpen,        setFiltersOpen]        = useState(false);

  function toggle<T>(set: Set<T>, val: T): Set<T> {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedBrands.size     > 0 && !selectedBrands.has(p.brand))        return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(p.category)) return false;
      if (selectedBTU.size        > 0 && (!p.btu || !selectedBTU.has(p.btu)))  return false;
      if (showQuoteOnly && p.price > 0)                                        return false;
      return true;
    });

    switch (sort) {
      case 'pret-asc':  list = [...list].sort((a, b) => a.price - b.price);    break;
      case 'pret-desc': list = [...list].sort((a, b) => b.price - a.price);    break;
      case 'rating':    list = [...list].sort((a, b) => b.rating - a.rating);  break;
      case 'recenzii':  list = [...list].sort((a, b) => b.reviews - a.reviews);break;
    }
    return list;
  }, [selectedBrands, selectedCategories, selectedBTU, showQuoteOnly, sort]);

  function resetFilters() {
    setSelectedBrands(new Set());
    setSelectedCategories(new Set());
    setSelectedBTU(new Set());
    setShowQuoteOnly(false);
  }

  const hasFilters =
    selectedBrands.size > 0 ||
    selectedCategories.size > 0 ||
    selectedBTU.size > 0 ||
    showQuoteOnly;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Brand</h3>
        {BRANDS.map((b) => (
          <label key={b} className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={selectedBrands.has(b)}
              onChange={() => setSelectedBrands(toggle(selectedBrands, b))}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-dark-300">{b}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Categorie</h3>
        {CATEGORIES.map((c) => (
          <label key={c} className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={selectedCategories.has(c)}
              onChange={() => setSelectedCategories(toggle(selectedCategories, c))}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-dark-300">{CATEGORY_LABEL[c]}</span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">
          Capacitate AC (BTU)
        </h3>
        {BTU_OPTIONS.map((btu) => (
          <label key={btu} className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={selectedBTU.has(btu)}
              onChange={() => setSelectedBTU(toggle(selectedBTU, btu))}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-dark-300">
              {btu.toLocaleString('ro-RO')} BTU
            </span>
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold text-dark uppercase tracking-wide mb-3">Disponibilitate</h3>
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={showQuoteOnly}
            onChange={() => setShowQuoteOnly((v) => !v)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-dark-300">Produse cu ofertă personalizată</span>
        </label>
      </div>

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="w-full text-sm text-brand font-medium py-2 border border-brand rounded-lg hover:bg-brand hover:text-white transition-colors"
        >
          Resetează filtrele
        </button>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 bg-light-200 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading text-dark">
              Magazin HVAC PRO TERM
            </h1>
            <p className="text-dark-300 mt-1">
              {filtered.length} produse și categorii · Aer condiționat, centrale, pompe de căldură și accesorii
            </p>
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="card sticky top-24">
                <h2 className="font-bold font-heading text-dark mb-4">Filtre</h2>
                <FilterPanel />
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 gap-4">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-dark-300 hover:border-primary transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Filtre
                  {hasFilters && (
                    <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      !
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-dark-300 hidden sm:block">Sortare:</span>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary"
                    >
                      {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-dark-300" />
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-dark-300 text-lg">Niciun produs nu corespunde filtrelor.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Resetează filtrele
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <>
        <div
          className={`fixed inset-0 bg-dark/50 z-40 lg:hidden transition-opacity ${
            filtersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setFiltersOpen(false)}
        />
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden transition-transform duration-300 overflow-y-auto ${
            filtersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b">
            <span className="font-bold font-heading text-dark">Filtre</span>
            <button onClick={() => setFiltersOpen(false)}>
              <X size={20} className="text-dark-300" />
            </button>
          </div>
          <div className="p-5">
            <FilterPanel />
          </div>
        </div>
      </>

      <Footer />
    </>
  );
}
