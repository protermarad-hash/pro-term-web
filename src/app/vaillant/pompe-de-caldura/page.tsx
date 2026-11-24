import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CommercialProductCard } from '@/components/vaillant/CommercialDetails';
import { DraftBanner, PowerSelectionNotice } from '@/components/vaillant/VaillantSections';
import { BrandLockup, ConversionSection, DocumentsSection } from '@/components/vaillant/experience/ExperienceSections';
import { VAILLANT_SERIES } from '@/lib/vaillant-catalog';
import { SERIES_COPY, VAILLANT_MEDIA } from '@/lib/vaillant-experience';
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
  const quoteProducts = catalog.items.map(({ product, commercial }) => ({
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
              { name: 'Pompe de căldură', path: PATH },
            ]),
          ),
        }}
      />
      <Header />
      <main className="bg-white pt-24">
        {showDraftBanner(catalog) && <DraftBanner />}

        <section className="bg-gradient-to-b from-white to-light-200">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-dark-300">
              <Link href="/" className="hover:text-primary">Acasă</Link>
              <span>/</span>
              <Link href="/vaillant" className="hover:text-primary">Vaillant</Link>
              <span>/</span>
              <span className="font-medium text-dark">Pompe de căldură</span>
            </nav>
            <BrandLockup />
            <h1 className="mt-8 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight text-dark md:text-6xl">
              Pompe de căldură Vaillant aroTHERM
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-dark-300">
              Fiecare model are afișate codul SKU, alimentarea electrică, componentele incluse și neincluse în preț și prețul final cu TVA.
              Pentru sistem complet sau soluție la cheie, oferta se face după analiza instalației.
            </p>
            <div className="mt-6 max-w-3xl">
              <PowerSelectionNotice />
            </div>
            <nav aria-label="Serii" className="mt-8 flex flex-wrap gap-3">
              {VAILLANT_SERIES.map((series) => (
                <a
                  key={series.slug}
                  href={`#serie-${series.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-dark shadow-sm transition hover:border-[#00917e] hover:text-[#00917e]"
                >
                  {series.name}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {VAILLANT_SERIES.map((series, index) => {
          const items = catalog.items.filter((item) => item.commercial.productLine === series.slug);
          const copy = SERIES_COPY[series.slug];
          const photo = VAILLANT_MEDIA.seriesPhotos[series.slug];
          return (
            <section
              key={series.slug}
              id={`serie-${series.slug}`}
              className={`scroll-mt-24 py-16 md:py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-light-200'}`}
              aria-labelledby={`series-${series.slug}`}
            >
              <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-contain p-8 mix-blend-multiply" />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#00917e]">{series.type} · {series.refrigerant}</p>
                  <h2 id={`series-${series.slug}`} className="mt-2 font-heading text-3xl font-bold text-dark md:text-4xl">{series.name}</h2>
                  <p className="mt-2 text-dark-300">{copy.tagline}</p>
                  <ul className="mt-4 space-y-2 text-sm text-dark">
                    {copy.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#00917e]" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <Link href={`${PATH}/${series.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                    Descoperă seria {series.name} <ArrowRight size={16} />
                  </Link>
                </div>
                <div>
                  {items.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2">
                      {items.map(({ product, commercial }) => (
                        <CommercialProductCard key={product.id} product={product} commercial={commercial} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-card">
                      <p className="font-heading text-xl font-bold text-dark">Modele disponibile la cerere</p>
                      <p className="mt-2 text-dark-300">Spune-ne câteva lucruri despre locuință și îți propunem modelul și configurația potrivite.</p>
                      <a href="#oferta" className="btn-primary mt-6">Solicită ofertă <ArrowRight size={17} /></a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        <DocumentsSection seriesSlugs={VAILLANT_SERIES.map((series) => series.slug)} />
        <ConversionSection products={quoteProducts} initialOption="sistem-complet" />
      </main>
      <Footer />
    </>
  );
}
