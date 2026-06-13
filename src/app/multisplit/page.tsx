import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MultisplitClientSection from '@/components/MultisplitClientSection';
import { getSupabaseServiceClient, dbProductToProduct } from '@/lib/supabase';
import type { Product } from '@/lib/products';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Sisteme Multisplit Gree | Configurator Online | PRO TERM',
  description:
    'Sisteme multisplit Gree cu livrare în România. Configurează online 2, 3 sau 4 camere cu o singură unitate exterioară. Pachete preconfigurate sau configurare personalizată.',
  alternates: { canonical: 'https://pro-term.ro/multisplit' },
  openGraph: {
    title: 'Sisteme Multisplit Gree | Configurator Online | PRO TERM',
    description:
      'Climatizează mai multe camere cu o singură unitate exterioară Gree. Pachete preconfigurate 2-4 camere, livrare în toată România.',
    url: 'https://pro-term.ro/multisplit',
  },
};

const COLS =
  'id, slug, name, brand, category, btu, capacity_label, price, price_label, original_price, rating, reviews, is_new, is_bestseller, energy_class, description, features, specs, smartbill_code, manage_stock, stock_status, stock_qty, image_url, active';

async function getMultisplitData(): Promise<{ packages: Product[]; units: Product[] }> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { packages: [], units: [] };

  const [pkgRes, unitRes] = await Promise.all([
    supabase
      .from('products')
      .select(COLS)
      .eq('category', 'multisplit-pachet')
      .eq('active', true)
      .order('price', { ascending: true }),
    supabase
      .from('products')
      .select(COLS)
      .eq('category', 'multisplit')
      .eq('active', true)
      .order('btu', { ascending: true }),
  ]);

  return {
    packages: (pkgRes.data ?? []).map(dbProductToProduct),
    units: (unitRes.data ?? []).map(dbProductToProduct),
  };
}

export default async function MultisplitPage() {
  const { packages, units } = await getMultisplitData();

  const schemaItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pachete multisplit Gree',
    itemListElement: packages.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://pro-term.ro/produse/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList) }}
      />
      <Header />
      <main className="bg-light-200 pb-20 pt-28">
        <div className="container mx-auto px-4">

          {/* Hero */}
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
              Dealer autorizat Gree
            </span>
            <h1 className="mb-4 font-heading text-4xl font-bold text-dark md:text-5xl">
              Sisteme Multisplit Gree
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-dark-300">
              Climatizează 2, 3 sau 4 camere cu o singură unitate exterioară.
              Alege un pachet preconfigurat sau personalizează-ți sistemul.
            </p>
          </div>

          {/* Interactive sections (client) */}
          <MultisplitClientSection packages={packages} units={units} />

          {/* Banner avertizare montaj */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 flex-shrink-0 text-orange-500" size={20} />
              <div>
                <p className="font-bold text-orange-800">
                  Montajul sistemului multisplit nu este inclus în preț.
                </p>
                <p className="mt-1 text-sm text-orange-700">
                  Contactați-ne pentru o ofertă de montaj personalizată.
                  Montaj disponibil în județul Arad și Timiș.
                </p>
                <a
                  href="tel:+40749025610"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600"
                >
                  Sună pentru ofertă montaj: 0749 025 610
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
