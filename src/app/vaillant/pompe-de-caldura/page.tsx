import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CommercialProductCard } from '@/components/vaillant/CommercialDetails';
import { DraftBanner, OfferOptionsSection, PowerSelectionNotice } from '@/components/vaillant/VaillantSections';
import { VAILLANT_SERIES } from '@/lib/vaillant-catalog';
import { SITE_URL, breadcrumbJsonLd, getVaillantCatalog, requireVaillantCatalog, showDraftBanner, vaillantRobots } from '../catalog';

export const revalidate = 60;

const PATH = '/vaillant/pompe-de-caldura';
const TITLE = 'Pompe de căldură Vaillant – prețuri cu TVA | PRO TERM';
const DESCRIPTION =
  'Pompe de căldură aer-apă Vaillant aroTHERM pro și aroTHERM plus: cod SKU, alimentare 230 V sau 400 V, componente incluse și preț final cu TVA.';

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

export default async function VaillantHeatPumpsPage() {
  const catalog = await requireVaillantCatalog();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Acasă', path: '' },
              { name: 'Vaillant', path: '/vaillant' },
              { name: 'Pompe de căldură', path: PATH },
            ]),
          ),
        }}
      />
      <Header />
      <main className="min-h-screen bg-light-200 pb-20 pt-24">
        {showDraftBanner(catalog) && <DraftBanner />}

        <section className="border-b border-slate-100 bg-white py-10">
          <div className="container mx-auto px-4">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-dark-300">
              <Link href="/" className="hover:text-primary">Acasă</Link>
              <span>/</span>
              <Link href="/vaillant" className="hover:text-primary">Vaillant</Link>
              <span>/</span>
              <span className="font-medium text-dark">Pompe de căldură</span>
            </nav>
            <h1 className="font-heading text-3xl font-bold text-dark md:text-5xl">Pompe de căldură Vaillant</h1>
            <p className="mt-4 max-w-3xl leading-relaxed text-dark-300">
              Fiecare model are afișate codul SKU, alimentarea electrică, componentele incluse și cele neincluse în preț,
              precum și prețul final cu TVA.
            </p>
            <div className="mt-5 max-w-3xl">
              <PowerSelectionNotice />
            </div>
          </div>
        </section>

        <div className="container mx-auto space-y-16 px-4 pt-12">
          {VAILLANT_SERIES.map((series) => {
            const items = catalog.items.filter((item) => item.commercial.productLine === series.slug);
            return (
              <section key={series.slug} aria-labelledby={`series-${series.slug}`}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">{series.type} · {series.refrigerant}</p>
                    <h2 id={`series-${series.slug}`} className="section-title mt-1">{series.name}</h2>
                  </div>
                  <Link href={`${PATH}/${series.slug}`} className="text-sm font-semibold text-primary hover:underline">
                    Despre seria {series.name} →
                  </Link>
                </div>
                {items.length > 0 ? (
                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {items.map(({ product, commercial }) => (
                      <CommercialProductCard key={product.id} product={product} commercial={commercial} />
                    ))}
                  </div>
                ) : (
                  <p className="card mt-6 text-sm text-dark-300">
                    Modelele din această serie sunt disponibile la cerere.{' '}
                    <Link href="/vaillant/cerere-oferta?optiune=sistem-complet" className="font-semibold text-primary hover:underline">
                      Solicită ofertă
                    </Link>
                  </p>
                )}
              </section>
            );
          })}

          <OfferOptionsSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
