import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCatalog from '@/components/ProductCatalog';
import { products as fallbackProducts } from '@/lib/products';
import { dbProductToProduct, getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        <div className="container mx-auto px-4">
          <ProductCatalog products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
