import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DraftBanner, RepairNotice } from '@/components/vaillant/VaillantSections';
import { BrandLockup, ConversionSection } from '@/components/vaillant/experience/ExperienceSections';
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
      <main className="bg-white pt-24">
        {showDraftBanner(catalog) && <DraftBanner />}

        <section className="bg-gradient-to-b from-white to-light-200">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-dark-300">
              <Link href="/" className="hover:text-primary">Acasă</Link>
              <span>/</span>
              <Link href="/vaillant" className="hover:text-primary">Vaillant</Link>
              <span>/</span>
              <span className="font-medium text-dark">Cerere ofertă</span>
            </nav>
            <BrandLockup />
            <h1 className="mt-8 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight text-dark md:text-5xl">
              Cerere ofertă pompă de căldură Vaillant
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-dark-300">
              Completează datele despre clădire și instalație. Echipa PRO TERM verifică tehnic configurația și revine cu oferta.
            </p>
          </div>
        </section>

        <ConversionSection
          products={products}
          initialProduct={firstParam(searchParams.produs)}
          initialOption={firstParam(searchParams.optiune)}
        />
        <div className="container mx-auto px-4 pb-16">
          <RepairNotice />
        </div>
      </main>
      <Footer />
    </>
  );
}
