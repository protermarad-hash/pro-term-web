import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCatalog from '@/components/ProductCatalog';
import { products as fallbackProducts } from '@/lib/products';
import { dbProductToProduct, getSupabaseServiceClient } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Produse HVAC România | Aer condiționat, pompe de căldură, centrale | PRO TERM',
  description:
    'Catalog produse HVAC cu livrare în România: aparate de aer condiționat, pompe de căldură, centrale termice, accesorii și servicii de montaj PRO TERM.',
};

export const revalidate = 60;

async function getProducts() {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return fallbackProducts;
  }

  return data.map(dbProductToProduct);
}

export default async function ProdusePage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-200 pb-20 pt-24">
        <section className="bg-white py-10 border-b border-slate-100">
          <div className="container mx-auto px-4">
            <span className="text-sm font-bold uppercase tracking-widest text-accent">
              Produse HVAC cu livrare în România
            </span>
            <h1 className="mt-2 font-heading text-3xl font-bold text-dark md:text-5xl">
              Aer condiționat, pompe de căldură, centrale termice și accesorii HVAC
            </h1>
            <p className="mt-4 max-w-4xl text-dark-300 leading-relaxed">
              PRO TERM pune la dispoziție echipamente HVAC pentru clienți din România: aparate de aer condiționat,
              pompe de căldură, centrale termice, termostate, accesorii de montaj și servicii asociate. Pentru Arad și
              Timișoara oferim și suport local pentru montaj, service și mentenanță.
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 pt-10">
          <Suspense fallback={<p className="py-20 text-center text-dark-300">Se încarcă produsele...</p>}>
            <ProductCatalog products={products} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
