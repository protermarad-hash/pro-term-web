import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ExternalLink, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CommercialProductCard } from '@/components/vaillant/CommercialDetails';
import { DraftBanner, PowerSelectionNotice, RepairNotice, VaillantFaq } from '@/components/vaillant/VaillantSections';
import { BrandLockup, ConversionSection, DocumentsSection, ProcessSection } from '@/components/vaillant/experience/ExperienceSections';
import { VAILLANT_SERIES, getVaillantSeries } from '@/lib/vaillant-catalog';
import { POWER_SELECTION_NOTICE } from '@/lib/product-commercial';
import { SERIES_COPY, STRATEGIC_MESSAGE, VAILLANT_MEDIA } from '@/lib/vaillant-experience';
import { SITE_URL, breadcrumbJsonLd, getVaillantCatalog, requireVaillantCatalog, showDraftBanner, vaillantRobots } from '../../catalog';

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return VAILLANT_SERIES.map((series) => ({ serie: series.slug }));
}

const DESCRIPTIONS: Record<string, string> = {
  'arotherm-pro':
    'Vaillant aroTHERM pro: pompă de căldură aer-apă monobloc cu R290, variante 230 V și 400 V. Cod SKU, componente incluse și preț final cu TVA.',
  'arotherm-plus':
    'Vaillant aroTHERM plus: pompă de căldură aer-apă monobloc cu R290, livrată cu automatizare VWZ AI. Cod SKU, componente incluse și preț cu TVA.',
  'arotherm-split-plus':
    'Vaillant aroTHERM Split plus: pompă de căldură aer-apă split cu agent R32, alimentare 230 V. Modele și ofertă disponibile la cerere, la PRO TERM.',
};

export async function generateMetadata({ params }: { params: { serie: string } }): Promise<Metadata> {
  const series = getVaillantSeries(params.serie);
  if (!series) return {};
  const catalog = await getVaillantCatalog();
  const title = `Vaillant ${series.name} – pompă de căldură | PRO TERM`;
  const description = DESCRIPTIONS[series.slug];
  const url = `${SITE_URL}/vaillant/pompe-de-caldura/${series.slug}`;
  const photo = VAILLANT_MEDIA.seriesPhotos[series.slug];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: [{ url: `${SITE_URL}${photo.src}`, alt: photo.alt }] },
    robots: vaillantRobots(catalog),
  };
}

export default async function VaillantSeriesPage({ params }: { params: { serie: string } }) {
  const series = getVaillantSeries(params.serie);
  if (!series) notFound();

  const catalog = await requireVaillantCatalog();
  const items = catalog.items.filter((item) => item.commercial.productLine === series.slug);
  const path = `/vaillant/pompe-de-caldura/${series.slug}`;
  const copy = SERIES_COPY[series.slug];
  const photo = VAILLANT_MEDIA.seriesPhotos[series.slug];
  const scene = VAILLANT_MEDIA.seriesScenes[series.slug];
  const quoteProducts = items.map(({ product, commercial }) => ({
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
              { name: 'Pompe de căldură', path: '/vaillant/pompe-de-caldura' },
              { name: series.name, path },
            ]),
          ),
        }}
      />
      <Header />
      <main className="bg-white pt-24">
        {showDraftBanner(catalog) && <DraftBanner />}

        <section className="overflow-hidden bg-gradient-to-b from-white to-light-200">
          <div className="container mx-auto grid items-center gap-10 px-4 py-12 md:py-16 lg:grid-cols-2 lg:gap-16">
            <div>
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-dark-300">
                <Link href="/" className="hover:text-primary">Acasă</Link>
                <span>/</span>
                <Link href="/vaillant" className="hover:text-primary">Vaillant</Link>
                <span>/</span>
                <Link href="/vaillant/pompe-de-caldura" className="hover:text-primary">Pompe de căldură</Link>
                <span>/</span>
                <span className="font-medium text-dark">{series.name}</span>
              </nav>
              <BrandLockup />
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#00917e]">{series.type}</p>
              <h1 className="mt-3 font-heading text-4xl font-bold leading-tight tracking-tight text-dark md:text-6xl">Vaillant {series.name}</h1>
              <p className="mt-4 text-xl leading-relaxed text-dark-300">{copy.tagline}</p>
              <ul className="mt-6 space-y-2.5">
                {copy.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-dark">
                    <CheckCircle2 size={19} className="mt-0.5 flex-shrink-0 text-[#00917e]" />
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#oferta" className="btn-primary justify-center px-8 py-4 text-base">
                  Solicită ofertă <ArrowRight size={18} />
                </a>
                <a
                  href="#modele"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-8 py-4 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {items.length > 0 ? 'Vezi modelele și prețurile' : 'Vezi modelele'}
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full">
              <div className="absolute inset-[8%] rounded-full bg-[#00917e]/10 blur-3xl" aria-hidden="true" />
              <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain mix-blend-multiply" />
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden" aria-label="Mesajul PRO TERM">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[21/8]">
            <Image src={scene.src} alt={scene.alt} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06131f]/85 via-[#06131f]/45 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <p className="max-w-xl font-heading text-2xl font-bold leading-snug text-white md:text-4xl">{STRATEGIC_MESSAGE}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20" aria-labelledby="facts-title">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2">
            <div>
              <h2 id="facts-title" className="font-heading text-3xl font-bold text-dark md:text-4xl">Date-cheie din documentația oficială</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {series.facts.map((fact) => (
                  <li key={fact} className="rounded-2xl border border-slate-100 bg-light-200 px-5 py-4 text-sm text-dark">{fact}</li>
                ))}
              </ul>
              <a href={series.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                <ExternalLink size={15} />
                Pagina oficială Vaillant pentru {series.name}
              </a>
            </div>
            <div className="rounded-3xl bg-[#06131f] p-7 text-white md:p-9">
              <h2 className="flex items-center gap-2 font-heading text-2xl font-bold">
                <Info size={22} className="text-[#5fd3c0]" /> Configurație și preț
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
                {copy.configuration.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#5fd3c0]" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-white/85">{POWER_SELECTION_NOTICE}</p>
            </div>
          </div>
        </section>

        <section id="modele" className="scroll-mt-24 bg-light-200 py-16 md:py-20" aria-labelledby="models-title">
          <div className="container mx-auto px-4">
            <h2 id="models-title" className="font-heading text-3xl font-bold text-dark md:text-4xl">Modele {series.name}</h2>
            <div className="mt-5 max-w-3xl">
              <PowerSelectionNotice />
            </div>
            {items.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map(({ product, commercial }) => (
                  <CommercialProductCard key={product.id} product={product} commercial={commercial} />
                ))}
              </div>
            ) : (
              <p className="mt-8 rounded-2xl bg-white p-6 text-dark-300 shadow-card">
                Modelele din seria {series.name} sunt disponibile la cerere. Completează formularul de mai jos și revenim cu oferta.
              </p>
            )}
          </div>
        </section>

        <ProcessSection />
        <DocumentsSection seriesSlugs={[series.slug]} title={`Documentație ${series.name}`} />
        <ConversionSection products={quoteProducts} initialOption="sistem-complet" />
        <div className="container mx-auto space-y-10 px-4 py-16">
          <RepairNotice />
          <VaillantFaq />
        </div>
      </main>
      <Footer />
    </>
  );
}
