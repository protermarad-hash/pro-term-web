import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Droplets,
  FileText,
  Flame,
  History,
  Leaf,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Snowflake,
  Wrench,
} from 'lucide-react';
import type { CatalogItem } from '@/lib/product-commercial-server';
import { POWER_SUPPLY_LABEL, PRICE_AVAILABILITY_NOTICE } from '@/lib/product-commercial';
import { VAILLANT_SERIES } from '@/lib/vaillant-catalog';
import { DOCUMENT_TYPE_LABEL, VAILLANT_SERIES_DOCUMENTS } from '@/lib/vaillant-documents';
import {
  COMFORT_SECTION,
  CONVERSION_SECTION,
  EXPERIENCE_HERO,
  FILM_SECTION,
  PROCESS_SECTION,
  SEASONS,
  SERIES_COPY,
  STRATEGIC_MESSAGE,
  TECH_PILLARS,
  VAILLANT_MEDIA,
  WHY_VAILLANT,
} from '@/lib/vaillant-experience';
import { FILM_STORYBOARD } from '@/lib/vaillant-storyboard';
import QuoteRequestForm, { type QuoteProductOption } from '@/components/vaillant/QuoteRequestForm';
import { formatPriceRon } from '@/components/vaillant/CommercialDetails';
import { DraftBanner, PowerSelectionNotice } from '@/components/vaillant/VaillantSections';
import HeroBackdrop from './HeroBackdrop';
import FilmPlayer from './FilmPlayer';

/** Vaillant brand green, taken from the official logo file. */
const VAILLANT_GREEN_TEXT = 'text-[#00917e]';

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.2em] ${light ? 'text-[#5fd3c0]' : VAILLANT_GREEN_TEXT}`}>{children}</p>
  );
}

export function BrandLockup({ light = false }: { light?: boolean }) {
  const logo = light ? VAILLANT_MEDIA.vaillantLogoWhite : VAILLANT_MEDIA.vaillantLogo;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} unoptimized className="h-8 w-auto md:h-9" />
      <span className={`h-8 w-px ${light ? 'bg-white/30' : 'bg-slate-300'}`} aria-hidden="true" />
      <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
        <Image src="/logo-proterm.jpg" alt="PRO TERM" width={93} height={64} className="h-7 w-auto" />
      </span>
    </div>
  );
}

export function ExperienceHero({ draft }: { draft: boolean }) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#06131f] text-white" aria-labelledby="vx-hero-title">
      <HeroBackdrop poster={VAILLANT_MEDIA.hero} video={VAILLANT_MEDIA.heroVideo} />
      <div className="relative z-[1] flex flex-1 flex-col pt-24">
        {draft && <DraftBanner />}
        <div className="container mx-auto flex flex-1 flex-col justify-center px-4 pb-20 pt-10 md:pb-24">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Acasă</Link>
            <span>/</span>
            <span className="font-medium text-white">Vaillant</span>
          </nav>
          <BrandLockup light />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/75">{EXPERIENCE_HERO.eyebrow}</p>
          <h1 id="vx-hero-title" className="mt-4 max-w-4xl font-heading text-[2.5rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {EXPERIENCE_HERO.headline[0]}
            <br />
            <span className="text-[#7fe0cf]">{EXPERIENCE_HERO.headline[1]}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">{EXPERIENCE_HERO.subheadline}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#oferta" className="btn-primary justify-center px-8 py-4 text-base">
              {EXPERIENCE_HERO.primaryCta}
              <ArrowRight size={18} />
            </a>
            <a href="#gama" className="btn-outline justify-center px-8 py-4 text-base">
              {EXPERIENCE_HERO.secondaryCta}
            </a>
          </div>
          <p className="mt-12 max-w-xl text-xs text-white/55">{EXPERIENCE_HERO.attribution}</p>
        </div>
      </div>
    </section>
  );
}

const WHY_ICONS = {
  traditie: History,
  r290: Leaf,
  sistem: Flame,
  control: Smartphone,
  documentatie: FileText,
  reparatii: Wrench,
} as const;

export function WhyVaillantSection() {
  const heritage = VAILLANT_MEDIA.heritage;
  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="vx-why-title">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Vaillant</Eyebrow>
            <h2 id="vx-why-title" className="mt-3 font-heading text-3xl font-bold leading-tight text-dark md:text-5xl">{WHY_VAILLANT.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-dark-300">{WHY_VAILLANT.intro}</p>
          </div>
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl shadow-card">
            <Image src={heritage.src} alt={heritage.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_VAILLANT.benefits.map((benefit) => {
            const Icon = WHY_ICONS[benefit.id];
            return (
              <li key={benefit.id} className="bg-white p-7 md:p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00917e]/10 text-[#00917e]">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-dark">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-300">{benefit.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ComfortSection() {
  return (
    <section className="bg-light-200 py-20 md:py-28" aria-labelledby="vx-comfort-title">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 id="vx-comfort-title" className="font-heading text-3xl font-bold leading-tight text-dark md:text-5xl">{COMFORT_SECTION.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-dark-300">{COMFORT_SECTION.text}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map((season, index) => {
            const photo = VAILLANT_MEDIA.seasons[season.id];
            return (
              <figure
                key={season.id}
                className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-slate-200 p-6 text-white shadow-card ${index % 2 === 1 ? 'lg:translate-y-10' : ''}`}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <figcaption className="relative">
                  <span className="font-heading text-2xl font-bold">{season.name}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/90">{season.line}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function RangeSection({ items }: { items: CatalogItem[] }) {
  const countBySeries = new Map<string, number>();
  for (const { commercial } of items) {
    if (commercial.productLine) countBySeries.set(commercial.productLine, (countBySeries.get(commercial.productLine) ?? 0) + 1);
  }
  return (
    <section id="gama" className="scroll-mt-24 bg-white py-20 md:py-28" aria-labelledby="vx-range-title">
      <div className="container mx-auto px-4">
        <Eyebrow>Gama Vaillant aroTHERM</Eyebrow>
        <h2 id="vx-range-title" className="mt-3 font-heading text-3xl font-bold text-dark md:text-5xl">Descoperă gama</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {VAILLANT_SERIES.map((series) => {
            const copy = SERIES_COPY[series.slug];
            const photo = VAILLANT_MEDIA.seriesPhotos[series.slug];
            const count = countBySeries.get(series.slug) ?? 0;
            return (
              <article key={series.slug} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-contain p-8 mix-blend-multiply transition duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <Eyebrow>{series.type}</Eyebrow>
                  <h3 className="mt-2 font-heading text-3xl font-bold text-dark">{series.name}</h3>
                  <p className="mt-1 text-sm text-dark-300">{copy.tagline}</p>
                  <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-dark">
                    <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0 text-[#00917e]" />
                    {copy.benefit}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-dark-300">{copy.description}</p>
                  <p className="mt-4 text-xs font-semibold text-dark-300">
                    {series.skuPending || count === 0 ? 'Modele disponibile la cerere' : `${count} modele cu preț publicat`}
                  </p>
                  <Link href={`/vaillant/pompe-de-caldura/${series.slug}`} className="btn-primary mt-6 justify-center self-start">
                    Descoperă seria
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const PILLAR_ICONS = {
  incalzire: Flame,
  racire: Snowflake,
  'apa-calda': Droplets,
  control: SlidersHorizontal,
  eficienta: Leaf,
} as const;

export function TechnologySection() {
  const control = VAILLANT_MEDIA.pillars.control;
  const water = VAILLANT_MEDIA.pillars['apa-calda'];
  return (
    <section className="bg-[#06131f] py-20 text-white md:py-28" aria-labelledby="vx-tech-title">
      <div className="container mx-auto px-4">
        <Eyebrow light>Tehnologie și confort</Eyebrow>
        <h2 id="vx-tech-title" className="mt-3 max-w-3xl font-heading text-3xl font-bold md:text-5xl">Încălzire, răcire și apă caldă, într-un sistem configurat corect.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:col-span-2 md:aspect-auto">
            <Image src={control.src} alt={control.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl md:col-span-3">
            <Image src={water.src} alt={water.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
          </div>
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {TECH_PILLARS.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.id];
            return (
              <div key={pillar.id} className="bg-[#0b1d2d] p-7">
                <Icon size={28} className="text-[#5fd3c0]" aria-hidden="true" />
                <h3 className="mt-5 font-heading text-lg font-bold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{pillar.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="vx-process-title">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <Eyebrow>Rolul PRO TERM</Eyebrow>
          <h2 id="vx-process-title" className="mt-3 font-heading text-3xl font-bold leading-tight text-dark md:text-5xl">{PROCESS_SECTION.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-dark-300">{PROCESS_SECTION.intro}</p>
        </div>
        <ol className="mt-14 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {PROCESS_SECTION.steps.map((step, index) => (
            <li key={step.id} className="relative rounded-3xl border border-slate-100 bg-light-200 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-heading text-lg font-bold text-white">{index + 1}</span>
              <h3 className="mt-5 font-heading text-xl font-bold text-dark">{step.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-300">{step.text}</p>
            </li>
          ))}
        </ol>
        <blockquote className="mt-14 rounded-3xl bg-gradient-to-r from-[#00917e] to-[#007a6a] p-8 text-white md:p-12">
          <ShieldCheck size={32} className="text-white/80" aria-hidden="true" />
          <p className="mt-4 max-w-4xl font-heading text-2xl font-bold leading-snug md:text-3xl">{STRATEGIC_MESSAGE}</p>
          <a href="#oferta" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#00695b] transition hover:bg-white/90">
            Solicită ofertă <ArrowRight size={17} />
          </a>
        </blockquote>
      </div>
    </section>
  );
}

/** Rendered only when the film exists, or on preview builds as an explicit BLOCKED placeholder. */
export function FilmSection({ preview }: { preview: boolean }) {
  const film = VAILLANT_MEDIA.film;
  if (!film && !preview) return null;
  return (
    <section className="bg-[#06131f] py-20 text-white md:py-24" aria-labelledby="vx-film-title">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 id="vx-film-title" className="font-heading text-3xl font-bold md:text-4xl">{FILM_SECTION.title}</h2>
        <div className="mt-8">
          {film ? (
            <FilmPlayer film={film} title={FILM_SECTION.title} playLabel={FILM_SECTION.playLabel} />
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-amber-400/70 p-6 md:p-8">
              <span className="inline-flex items-center rounded-full border border-dashed border-amber-400 bg-amber-50/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                VIDEO FINAL = BLOCKED — storyboard, filmul nu este produs
              </span>
              <ol className="mt-6 space-y-3 text-sm">
                {FILM_STORYBOARD.map((shot) => (
                  <li key={shot.time} className="grid gap-1 md:grid-cols-[90px_1fr]">
                    <span className="font-mono text-white/60">{shot.time}</span>
                    <span className="text-white/85">
                      {shot.scene}
                      {shot.onScreenText && <span className="mt-1 block font-semibold text-accent">Text: „{shot.onScreenText}”</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ModelsSection({ items }: { items: CatalogItem[] }) {
  return (
    <section id="modele" className="scroll-mt-24 bg-light-200 py-20 md:py-28" aria-labelledby="vx-models-title">
      <div className="container mx-auto px-4">
        <Eyebrow>Prețuri publice</Eyebrow>
        <h2 id="vx-models-title" className="mt-3 font-heading text-3xl font-bold text-dark md:text-5xl">Modele și prețuri</h2>
        <p className="mt-4 max-w-2xl text-dark-300">
          Prețuri finale cu TVA pentru echipament, cu componentele incluse în preț. {PRICE_AVAILABILITY_NOTICE}
        </p>
        <div className="mt-6 max-w-3xl"><PowerSelectionNotice /></div>
        {items.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-white p-6 text-dark-300 shadow-card">Modelele sunt disponibile la cerere. Completează formularul de mai jos.</p>
        ) : (
          <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-card">
            <ul className="divide-y divide-slate-100">
              {items.map(({ product, commercial }) => (
                <li key={product.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center md:gap-6 md:px-7">
                  <div className="min-w-0">
                    <Link href={`/produse/${product.slug}`} className="font-semibold text-dark hover:text-primary">{product.name}</Link>
                    <p className="mt-1 text-xs text-dark-300">
                      {commercial.manufacturerCode && <>Cod SKU {commercial.manufacturerCode} · </>}
                      {commercial.powerSupply && <>{POWER_SUPPLY_LABEL[commercial.powerSupply]} · </>}
                      Inclus: {commercial.includedComponents.join(', ') || 'conform paginii produsului'}
                    </p>
                    {commercial.documents[0] && (
                      <a href={commercial.documents[0].url} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        <FileText size={13} /> {commercial.documents[0].label}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 md:justify-end">
                    <span className="font-heading text-xl font-bold text-dark">{product.price > 0 ? formatPriceRon(product.price) : 'Preț la cerere'}</span>
                    <Link href={`/produse/${product.slug}`} className="whitespace-nowrap text-sm font-semibold text-primary hover:underline">Detalii →</Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link href="/vaillant/pompe-de-caldura" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          Vezi catalogul complet, pe serii <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/** Official public documents grouped by series (or a single series). */
export function DocumentsSection({ seriesSlugs, title = 'Documentații oficiale' }: { seriesSlugs: readonly string[]; title?: string }) {
  return (
    <section id="documentatii" className="scroll-mt-24 bg-white py-20 md:py-24" aria-labelledby="vx-docs-title">
      <div className="container mx-auto px-4">
        <Eyebrow>Documentație Vaillant</Eyebrow>
        <h2 id="vx-docs-title" className="mt-3 font-heading text-3xl font-bold text-dark md:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-dark-300">Broșuri, fișe tehnice ErP și instrucțiuni publicate de Vaillant România. Documentele se deschid de pe serverele Vaillant.</p>
        <div className={`mt-10 grid gap-6 ${seriesSlugs.length > 1 ? 'lg:grid-cols-3' : ''}`}>
          {seriesSlugs.map((slug) => {
            const series = VAILLANT_SERIES.find((entry) => entry.slug === slug);
            const docs = VAILLANT_SERIES_DOCUMENTS[slug];
            if (!series || !docs) return null;
            return (
              <div key={slug} className="rounded-3xl border border-slate-100 bg-light-200 p-6 md:p-7">
                {seriesSlugs.length > 1 && <h3 className="font-heading text-xl font-bold text-dark">{series.name}</h3>}
                <ul className={`${seriesSlugs.length > 1 ? 'mt-4' : ''} grid gap-3 ${seriesSlugs.length === 1 ? 'md:grid-cols-2' : ''}`}>
                  {docs.documents.map((doc) => (
                    <li key={doc.url}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="group flex h-full gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-card">
                        <FileText size={20} className="mt-0.5 flex-shrink-0 text-[#00917e]" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block text-xs font-bold uppercase tracking-wide text-dark-300">{DOCUMENT_TYPE_LABEL[doc.type]} · PDF</span>
                          <span className="mt-0.5 block font-semibold text-dark group-hover:text-primary">{doc.title}</span>
                          <span className="mt-1 block text-xs text-dark-300">{doc.models}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={docs.sourcePage} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">
                  Sursa: pagina oficială {series.name} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ConversionSection({ products, initialProduct, initialOption }: { products: QuoteProductOption[]; initialProduct?: string; initialOption?: string }) {
  return (
    <section id="oferta" className="scroll-mt-24 bg-light-200 py-20 md:py-28" aria-labelledby="vx-offer-title">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-3">
        <div>
          <Eyebrow>Consultanță PRO TERM</Eyebrow>
          <h2 id="vx-offer-title" className="mt-3 font-heading text-3xl font-bold leading-tight text-dark md:text-5xl">{CONVERSION_SECTION.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-dark-300">{CONVERSION_SECTION.subtitle}</p>
          <ol className="mt-8 space-y-4 text-sm text-dark">
            {['Completezi datele despre locuință.', 'Un specialist PRO TERM analizează instalația și puterea necesară.', 'Primești oferta pentru echipament, sistem complet sau soluție la cheie.'].map((text, index) => (
              <li key={text} className="flex gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#00917e] text-xs font-bold text-white">{index + 1}</span>
                <span className="pt-1">{text}</span>
              </li>
            ))}
          </ol>
          <ul className="mt-8 space-y-3 text-sm text-dark">
            <li className="flex gap-2"><BadgeCheck size={17} className="mt-0.5 flex-shrink-0 text-[#00917e]" /> Echipament: preț publicat, cu TVA.</li>
            <li className="flex gap-2"><BadgeCheck size={17} className="mt-0.5 flex-shrink-0 text-[#00917e]" /> Sistem complet și soluție la cheie: ofertă după analiza tehnică PRO TERM, fără preț automat.</li>
          </ul>
          <a href="tel:+40749025610" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            <Phone size={17} /> Preferi să vorbim? 0749 025 610
          </a>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card md:p-10 lg:col-span-2">
          <QuoteRequestForm products={products} initialProduct={initialProduct} initialOption={initialOption} />
        </div>
      </div>
    </section>
  );
}
