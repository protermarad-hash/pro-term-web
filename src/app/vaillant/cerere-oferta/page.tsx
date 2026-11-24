import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteRequestForm from '@/components/vaillant/QuoteRequestForm';
import { DraftBanner } from '@/components/vaillant/VaillantSections';
import { SITE_URL, breadcrumbJsonLd, getVaillantCatalog, requireVaillantCatalog, showDraftBanner, vaillantRobots } from '../catalog';

export const dynamic = 'force-dynamic';

const PATH = '/vaillant/cerere-oferta';
const TITLE = 'Cerere ofertă pompă de căldură Vaillant | PRO TERM';
const DESCRIPTION =
  'Cere ofertă pentru o pompă de căldură Vaillant: echipament, sistem complet sau soluție la cheie. Echipa PRO TERM validează tehnic și comercial fiecare cerere.';

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getVaillantCatalog();
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}${PATH}` },
    openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, type: 'website' },
    robots: vaillantRobots(catalog),
  };
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VaillantQuotePage({
  searchParams,
}: {
  searchParams: { produs?: string | string[]; optiune?: string | string[] };
}) {
  const catalog = await requireVaillantCatalog();
  const products = catalog.items.map(({ product, commercial }) => ({
    value: product.slug,
    label: commercial.manufacturerCode ? `${product.name} (${commercial.manufacturerCode})` : product.name,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Acasă', path: '' },
              { name: 'Vaillant', path: '/vaillant' },
              { name: 'Cerere ofertă', path: PATH },
            ]),
          ),
        }}
      />
      <Header />
      <main className="min-h-screen bg-light-200 pb-20 pt-24">
        {showDraftBanner(catalog) && <DraftBanner />}

        <div className="container mx-auto px-4 pt-10">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-dark-300">
            <Link href="/" className="hover:text-primary">Acasă</Link>
            <span>/</span>
            <Link href="/vaillant" className="hover:text-primary">Vaillant</Link>
            <span>/</span>
            <span className="font-medium text-dark">Cerere ofertă</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="font-heading text-3xl font-bold text-dark md:text-4xl">Cerere ofertă pompă de căldură Vaillant</h1>
              <p className="mt-3 max-w-2xl leading-relaxed text-dark-300">
                Completează datele despre clădire și instalație. Echipa PRO TERM verifică tehnic configurația și revine cu oferta.
              </p>
              <div className="card mt-8">
                <QuoteRequestForm
                  products={products}
                  initialProduct={firstParam(searchParams.produs)}
                  initialOption={firstParam(searchParams.optiune)}
                />
              </div>
            </div>
            <aside className="space-y-4">
              <div className="card">
                <h2 className="font-heading text-lg font-bold text-dark">Ce se întâmplă după trimitere</h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-dark-300">
                  <li>Analizăm datele despre clădire și instalația existentă.</li>
                  <li>Te contactăm pentru detaliile lipsă și, dacă e nevoie, pentru o vizită tehnică.</li>
                  <li>Primești oferta pentru varianta aleasă, după validarea tehnică și comercială.</li>
                </ol>
              </div>
              <a href="tel:+40749025610" className="card flex items-center gap-3 font-semibold text-primary">
                <Phone size={20} />
                Preferi telefonic? 0749 025 610
              </a>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
