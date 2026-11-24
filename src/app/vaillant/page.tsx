import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { VaillantFaq } from '@/components/vaillant/VaillantSections';
import {
  ComfortSection,
  ConversionSection,
  DocumentsSection,
  ExperienceHero,
  FilmSection,
  ModelsSection,
  ProcessSection,
  RangeSection,
  TechnologySection,
  WhyVaillantSection,
} from '@/components/vaillant/experience/ExperienceSections';
import { VAILLANT_SERIES } from '@/lib/vaillant-catalog';
import { SITE_URL, breadcrumbJsonLd, getVaillantCatalog, requireVaillantCatalog, showDraftBanner, vaillantRobots } from './catalog';

export const revalidate = 60;

const TITLE = 'Pompe de căldură Vaillant aroTHERM | PRO TERM';
const DESCRIPTION =
  'Pompe de căldură aer-apă Vaillant aroTHERM pro și aroTHERM plus, cu prețuri cu TVA și ofertă pentru sistem complet sau soluție la cheie, de la PRO TERM.';

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getVaillantCatalog();
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/vaillant` },
    openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/vaillant`, type: 'website' },
    robots: vaillantRobots(catalog),
  };
}

export default async function VaillantPage() {
  const catalog = await requireVaillantCatalog();
  const draft = showDraftBanner(catalog);
  const quoteProducts = catalog.items.map(({ product, commercial }) => ({
    value: product.slug,
    label: commercial.manufacturerCode ? `${product.name} (${commercial.manufacturerCode})` : product.name,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Acasă', path: '' }, { name: 'Vaillant', path: '/vaillant' }])) }}
      />
      <Header />
      <main className="bg-white">
        <ExperienceHero draft={draft} />
        <WhyVaillantSection />
        <ComfortSection />
        <RangeSection items={catalog.items} />
        <TechnologySection />
        <ProcessSection />
        <FilmSection preview={catalog.preview} />
        <ModelsSection items={catalog.items} />
        <DocumentsSection seriesSlugs={VAILLANT_SERIES.map((series) => series.slug)} />
        <ConversionSection products={quoteProducts} />
        <div className="container mx-auto px-4 pb-24">
          <VaillantFaq />
        </div>
      </main>
      <Footer />
    </>
  );
}
