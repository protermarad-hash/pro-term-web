'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Copy, ExternalLink, ImagePlus, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { CATEGORY_LABEL, type Brand, type Category, type StockStatus } from '@/lib/products';

const BRANDS: Brand[] = ['Gree', 'Midea', 'Yamato', 'Fujitsu', 'Yukon', 'Habitat', 'Bosch', 'Vaillant', 'Immergas', 'Viessmann', 'Generic', 'PRO TERM'];
const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];
const STOCK_STATUSES: StockStatus[] = ['in-stock', 'low-stock', 'out-of-stock', 'on-request'];

interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  btu: number | null;
  capacity_label: string | null;
  price: number;
  price_label: string | null;
  original_price: number | null;
  rating: number;
  reviews: number;
  is_new: boolean;
  is_bestseller: boolean;
  energy_class: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  smartbill_code: string | null;
  manage_stock: boolean;
  stock_status: string;
  stock_qty: number | null;
  image_url: string | null;
  gallery_images?: string[] | null;
  active: boolean;
  created_at: string;
}

const initialForm = {
  name: '',
  slug: '',
  brand: 'Gree',
  category: 'aer-conditionat',
  btu: '',
  capacityLabel: '',
  price: '',
  priceLabel: '',
  originalPrice: '',
  energyClass: 'A++',
  rating: '4.7',
  reviews: '0',
  smartbillCode: '',
  stockStatus: 'on-request',
  stockQty: '',
  imageUrl: '',
  galleryImages: '',
  description: '',
  features: 'DC Inverter\nR32\nMontaj disponibil în Arad\nService zonal PRO TERM',
  specs: 'Brand:\nModel:\nCapacitate:\nAgent frigorific: R32',
  isNew: false,
  isBestseller: false,
  active: true,
};

type ProductForm = typeof initialForm;

function specsToText(specs: AdminProduct['specs']) {
  return Array.isArray(specs) ? specs.map((spec) => `${spec.label}: ${spec.value}`).join('\n') : '';
}

function productToForm(product: AdminProduct): ProductForm {
  return {
    name: product.name ?? '',
    slug: product.slug ?? '',
    brand: product.brand ?? 'Gree',
    category: product.category ?? 'aer-conditionat',
    btu: product.btu ? String(product.btu) : '',
    capacityLabel: product.capacity_label ?? '',
    price: product.price ? String(product.price) : '',
    priceLabel: product.price_label ?? '',
    originalPrice: product.original_price ? String(product.original_price) : '',
    energyClass: product.energy_class ?? 'A++',
    rating: product.rating ? String(product.rating) : '4.7',
    reviews: product.reviews ? String(product.reviews) : '0',
    smartbillCode: product.smartbill_code ?? '',
    stockStatus: product.stock_status ?? 'on-request',
    stockQty: product.stock_qty ? String(product.stock_qty) : '',
    imageUrl: product.image_url ?? '',
    galleryImages: Array.isArray(product.gallery_images) ? product.gallery_images.join('\n') : '',
    description: product.description ?? '',
    features: Array.isArray(product.features) ? product.features.join('\n') : '',
    specs: specsToText(product.specs),
    isNew: Boolean(product.is_new),
    isBestseller: Boolean(product.is_bestseller),
    active: product.active !== false,
  };
}

export default function AdminPage() {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadProducts() {
    try {
      const response = await fetch('/api/admin/products', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Nu am putut încărca produsele.');
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută.');
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField(name: keyof ProductForm, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setMessage('');
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Produsul nu a fost salvat.');

      setMessage(editingId ? 'Produs actualizat cu succes.' : 'Produs salvat cu succes.');
      setForm(initialForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));
      formData.append('productName', form.name || 'produs');

      const response = await fetch('/api/admin/product-images', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Nu am putut încărca imaginile.');

      const urls = (data.urls || []) as string[];
      setForm((current) => {
        const existing = current.galleryImages.trim();
        const nextGallery = [existing, ...urls].filter(Boolean).join('\n');
        return {
          ...current,
          imageUrl: current.imageUrl || urls[0] || '',
          galleryImages: nextGallery,
        };
      });
      setMessage('Imaginile au fost încărcate în Supabase Storage. Salvează produsul ca să rămână asociate.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută.');
    } finally {
      setUploading(false);
    }
  }

  function editProduct(product: AdminProduct) {
    setForm(productToForm(product));
    setEditingId(product.id);
    setMessage(`Editezi produsul: ${product.name}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function duplicateProduct(product: AdminProduct) {
    const duplicated = productToForm(product);
    setForm({
      ...duplicated,
      name: `${duplicated.name} - copie`,
      slug: '',
      btu: duplicated.btu || '',
      capacityLabel: duplicated.capacityLabel || '',
    });
    setEditingId(null);
    setMessage('Produs duplicat în formular. Schimbă capacitatea/prețul și salvează ca produs nou.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteProduct(product: AdminProduct) {
    if (!confirm(`Ștergi produsul „${product.name}”?`)) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/products?id=${product.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Produsul nu a fost șters.');
      setMessage('Produs șters cu succes.');
      if (editingId === product.id) resetForm();
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-light-200 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">PRO TERM Admin</p>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Produse magazin</h1>
            <p className="mt-2 max-w-2xl text-dark-300">
              Adaugă, editează, duplică sau șterge produse. Imaginile se pot încărca în Supabase Storage.
            </p>
          </div>
          <Link href="/produse" className="btn-outline w-fit">
            Vezi catalogul
            <ExternalLink size={18} />
          </Link>
        </div>

        {message && <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{message}</div>}
        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-card md:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <Plus size={20} />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-bold text-dark">{editingId ? 'Editează produs' : 'Adaugă produs'}</h2>
                  <p className="text-sm text-dark-300">Completează câmpurile importante. Restul pot fi editate ulterior.</p>
                </div>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-dark-300 hover:border-primary hover:text-primary">
                  <X size={16} /> Renunță
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-bold text-dark">Nume produs *</span>
                <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Gree Pulsar 12.000 BTU" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Brand</span>
                <select value={form.brand} onChange={(e) => updateField('brand', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
                  {BRANDS.map((brand) => <option key={brand}>{brand}</option>)}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Categorie</span>
                <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
                  {CATEGORIES.map((category) => <option key={category} value={category}>{CATEGORY_LABEL[category]}</option>)}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Preț vânzare RON</span>
                <input value={form.price} onChange={(e) => updateField('price', e.target.value)} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="2499" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Preț vechi RON</span>
                <input value={form.originalPrice} onChange={(e) => updateField('originalPrice', e.target.value)} type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="opțional" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">BTU</span>
                <input value={form.btu} onChange={(e) => updateField('btu', e.target.value)} type="number" min="0" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="12000" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Capacitate afișată</span>
                <input value={form.capacityLabel} onChange={(e) => updateField('capacityLabel', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="12.000 BTU / 3.5 kW" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Clasă energetică</span>
                <input value={form.energyClass} onChange={(e) => updateField('energyClass', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="A++" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Cod SmartBill</span>
                <input value={form.smartbillCode} onChange={(e) => updateField('smartbillCode', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="GWH12AGBXB-K6DNA1A" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Status stoc</span>
                <select value={form.stockStatus} onChange={(e) => updateField('stockStatus', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
                  {STOCK_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Cantitate stoc</span>
                <input value={form.stockQty} onChange={(e) => updateField('stockQty', e.target.value)} type="number" min="0" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="0" />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-bold text-dark">URL poză principală</span>
                <input value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="https://...jpg" />
              </label>

              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-bold text-dark">Galerie imagini, câte un URL pe linie</span>
                <textarea value={form.galleryImages} onChange={(e) => updateField('galleryImages', e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="https://...jpg" />
              </label>

              <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-light-200 p-4">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-white p-5 text-center transition-colors hover:bg-slate-50">
                  <ImagePlus size={26} className="text-primary" />
                  <span className="text-sm font-bold text-dark">Încarcă imagini din PC în Supabase Storage</span>
                  <span className="text-xs text-dark-300">Poți selecta mai multe poze odată. Linkurile se adaugă automat în galerie.</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                </label>
                {uploading && <p className="mt-3 text-center text-sm font-semibold text-primary">Se încarcă imaginile...</p>}
              </div>

              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-bold text-dark">Descriere</span>
                <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Descriere produs pentru client" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Avantaje / features, câte unul pe linie</span>
                <textarea value={form.features} onChange={(e) => updateField('features', e.target.value)} rows={6} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
              </label>

              <label>
                <span className="mb-1 block text-sm font-bold text-dark">Specificații, format Label: Valoare</span>
                <textarea value={form.specs} onChange={(e) => updateField('specs', e.target.value)} rows={6} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
              </label>

              <div className="md:col-span-2 flex flex-wrap gap-4 rounded-2xl bg-light-200 p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => updateField('isNew', e.target.checked)} className="h-4 w-4 accent-primary" />
                  Produs nou
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                  <input type="checkbox" checked={form.isBestseller} onChange={(e) => updateField('isBestseller', e.target.checked)} className="h-4 w-4 accent-primary" />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark">
                  <input type="checkbox" checked={form.active} onChange={(e) => updateField('active', e.target.checked)} className="h-4 w-4 accent-primary" />
                  Activ pe site
                </label>
              </div>
            </div>

            <button disabled={loading || uploading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-bold text-white transition-colors hover:bg-primary-600 disabled:opacity-60">
              <Save size={18} />
              {loading ? 'Se salvează...' : editingId ? 'Actualizează produs' : 'Salvează produs'}
            </button>
          </form>

          <aside className="rounded-3xl bg-white p-5 shadow-card md:p-8">
            <h2 className="font-heading text-xl font-bold text-dark">Produse recente</h2>
            <p className="mt-1 text-sm text-dark-300">Editează, duplică sau șterge produse existente.</p>
            <div className="mt-5 space-y-3">
              {products.length === 0 ? (
                <p className="rounded-2xl bg-light-200 p-4 text-sm text-dark-300">Nu există produse încă sau Supabase nu este configurat.</p>
              ) : (
                products.slice(0, 20).map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="font-bold text-dark">{product.name}</div>
                    <div className="mt-1 text-xs text-dark-300">
                      {product.brand} · {CATEGORY_LABEL[product.category as Category] ?? product.category} · {Number(product.price).toLocaleString('ro-RO')} RON
                    </div>
                    <div className="mt-2 text-xs font-semibold text-primary">{product.active ? 'Activ' : 'Inactiv'} · {product.stock_status}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => editProduct(product)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold text-dark-300 hover:border-primary hover:text-primary">
                        <Pencil size={14} /> Editează
                      </button>
                      <button type="button" onClick={() => duplicateProduct(product)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold text-dark-300 hover:border-primary hover:text-primary">
                        <Copy size={14} /> Duplică
                      </button>
                      <button type="button" onClick={() => deleteProduct(product)} className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                        <Trash2 size={14} /> Șterge
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
