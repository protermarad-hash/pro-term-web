import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import {
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
import { VAILLANT_MEDIA, type ImageAsset } from '@/lib/vaillant-experience';
import { VAILLANT_SERIES_DOCUMENTS } from '@/lib/vaillant-documents';
import type { CatalogItem } from '@/lib/product-commercial-server';
import { testProduct } from './support/fixtures';

const ROOT = path.resolve(import.meta.dirname, '..');

const item: CatalogItem = {
  product: {
    ...testProduct,
    id: '33333333-3333-4333-8333-333333333333',
    slug: 'vaillant-arotherm-pro-vwl-55-7-1-a-230v-s3',
    name: 'Pompă de căldură Vaillant aroTHERM pro VWL 55/7.1 A 230V S3',
    brand: 'Vaillant',
    category: 'pompe-caldura',
    price: 19990,
    quoteOnly: true,
  },
  commercial: {
    manufacturerCode: '8000022169',
    productLine: 'arotherm-pro',
    powerSupply: '230V',
    includedComponents: ['Unitate exterioară aroTHERM pro VWL 55/7.1 A 230V S3'],
    excludedComponents: ['Boiler pentru apă caldă menajeră'],
    documents: [{ label: 'Fișă tehnică ErP', url: 'https://www.vaillant.com.ro/doc.pdf' }],
    quoteOnly: true,
  },
};

function allImages(): ImageAsset[] {
  return [
    VAILLANT_MEDIA.vaillantLogo,
    VAILLANT_MEDIA.vaillantLogoWhite,
    VAILLANT_MEDIA.hero,
    VAILLANT_MEDIA.heritage,
    ...Object.values(VAILLANT_MEDIA.seriesPhotos),
    ...Object.values(VAILLANT_MEDIA.seriesScenes),
    ...Object.values(VAILLANT_MEDIA.seasons),
    ...Object.values(VAILLANT_MEDIA.pillars),
  ];
}

describe('/vaillant landing', () => {
  it('hero shows the official logo, the headline and both CTAs (offer first)', () => {
    const html = renderToStaticMarkup(<ExperienceHero draft={false} />);
    assert.ok(html.includes('Confortul se simte.'));
    assert.ok(html.includes('Tehnologia îl face posibil.'));
    assert.ok(html.includes('/media/vaillant/vaillant-logo-white.svg'));
    assert.match(html, /href="#oferta"[^>]*>Solicită ofertă/);
    assert.match(html, /href="#gama"[^>]*>Descoperă gama/);
    assert.ok(html.includes('Vaillant este o marcă înregistrată a proprietarului său'));
    assert.ok(!html.includes('<video'), 'no video element without a licensed film');
    assert.match(html, /aria-label="Oprește animația de fundal"/);
  });

  it('shows the draft banner only for drafts', () => {
    assert.ok(renderToStaticMarkup(<ExperienceHero draft />).includes('data-testid="draft-banner"'));
    assert.ok(!renderToStaticMarkup(<ExperienceHero draft={false} />).includes('data-testid="draft-banner"'));
  });

  it('"De ce Vaillant?" lists six verifiable benefits and no authorised-status titles', () => {
    const html = renderToStaticMarkup(<WhyVaillantSection />);
    assert.ok(html.includes('De ce Vaillant?'));
    assert.equal((html.match(/<li /g) ?? []).length, 6);
    assert.ok(html.includes('1874'));
    assert.doesNotMatch(html, /distribuitor autorizat|service autorizat Vaillant PRO TERM|garanție extinsă/i);
  });

  it('film section is hidden in production until a film exists, BLOCKED storyboard in preview', () => {
    assert.equal(renderToStaticMarkup(<FilmSection preview={false} />), '');
    const preview = renderToStaticMarkup(<FilmSection preview />);
    assert.ok(preview.includes('VIDEO FINAL = BLOCKED'));
    assert.ok(!preview.includes('<video'));
  });

  it('range cards use the official series photos and lead to the series pages', () => {
    const html = renderToStaticMarkup(<RangeSection items={[item]} />);
    for (const slug of ['arotherm-pro', 'arotherm-plus', 'arotherm-split-plus']) {
      assert.ok(html.includes(`href="/vaillant/pompe-de-caldura/${slug}"`), slug);
      assert.ok(html.includes(encodeURIComponent(`/media/vaillant/${slug}.png`)) || html.includes(`/media/vaillant/${slug}.png`), `${slug} photo`);
    }
    assert.equal((html.match(/Descoperă seria/g) ?? []).length, 3);
  });

  it('models section keeps SKU, supply, included components, price notice and official document', () => {
    const html = renderToStaticMarkup(<ModelsSection items={[item]} />);
    assert.ok(html.includes('8000022169'));
    assert.ok(html.includes('230 V (monofazat)'));
    assert.ok(html.includes('Unitate exterioară aroTHERM pro'));
    assert.match(html, /19.990 lei/);
    assert.ok(html.includes('Preț supus confirmării disponibilității.'));
    assert.ok(html.includes('href="/produse/vaillant-arotherm-pro-vwl-55-7-1-a-230v-s3"'));
  });

  it('documentation section lists every official document of each series with its source page', () => {
    const slugs = Object.keys(VAILLANT_SERIES_DOCUMENTS);
    const html = renderToStaticMarkup(<DocumentsSection seriesSlugs={slugs} />);
    for (const slug of slugs) {
      const docs = VAILLANT_SERIES_DOCUMENTS[slug];
      assert.ok(html.includes(docs.sourcePage), `${slug} source`);
      for (const doc of docs.documents) assert.ok(html.includes(doc.url), doc.url);
    }
    assert.ok(html.includes('Broșură'));
    assert.ok(html.includes('Fișă tehnică ErP'));
  });

  it('conversion section embeds the quote form with the three offer options and no add-to-cart', () => {
    const html = renderToStaticMarkup(<ConversionSection products={[{ value: item.product.slug, label: item.product.name }]} />);
    assert.ok(html.includes('id="oferta"'));
    for (const option of ['echipament', 'sistem-complet', 'la-cheie']) assert.ok(html.includes(`value="${option}"`), option);
    assert.ok(!/adaugă în coș/i.test(html));
  });

  it('technology and process copy contain no unverified performance or status claims', () => {
    const html = renderToStaticMarkup(
      <>
        <TechnologySection />
        <ProcessSection />
      </>,
    );
    const text = html.replace(/<[^>]+>/g, ' ');
    assert.doesNotMatch(text, /%|\bCOP\b|dB|°C|economi|garanți|service autorizat PRO TERM|certificat/i);
    for (const step of ['Consultanță', 'Alegerea puterii', 'Soluție completă', 'Montaj', 'PIF', 'Suport']) assert.ok(text.includes(step), step);
    assert.ok(text.includes('Nu vindem doar echipamentul. Livrăm sistemul corect.'));
  });
});

describe('official Vaillant material', () => {
  it('every image file exists locally and records an official vaillant.com.ro source', () => {
    for (const asset of allImages()) {
      assert.ok(existsSync(path.join(ROOT, 'public', asset.src)), `missing ${asset.src}`);
      assert.match(asset.source, /^https:\/\/www\.vaillant\.com\.ro\/produse\//, asset.src);
      assert.ok(asset.alt.trim().length > 3, `alt for ${asset.src}`);
    }
  });

  it('documents are https links to Vaillant hosts only', () => {
    for (const { sourcePage, documents } of Object.values(VAILLANT_SERIES_DOCUMENTS)) {
      assert.match(sourcePage, /^https:\/\/www\.vaillant\.com\.ro\//);
      for (const doc of documents) assert.match(doc.url, /^https:\/\/waaminioprodfc9546ee\.blob\.core\.windows\.net\/b2c-products\/[\w.-]+\.pdf$/);
    }
  });

  it('logo SVGs contain no scripts or external references', () => {
    for (const file of ['vaillant-logo.svg', 'vaillant-logo-white.svg']) {
      const svg = readFileSync(path.join(ROOT, 'public/media/vaillant', file), 'utf8');
      assert.doesNotMatch(svg, /<script|on\w+=|href=/i, file);
    }
  });

  it('campaign copy files contain no savings, COP, noise or temperature figures', () => {
    for (const file of ['src/lib/vaillant-experience.ts', 'src/lib/vaillant-storyboard.ts']) {
      const content = readFileSync(path.join(ROOT, file), 'utf8').replace(/^\s*\/\/.*$/gm, '');
      assert.doesNotMatch(content, /\d+\s*%|\bCOP\b|dB\(A\)|°C|economisi|economie de/i, file);
    }
  });
});

describe('hero film integration (Google Flow films, files supplied separately)', () => {
  it('picks the portrait film on portrait viewports and falls back to landscape', async () => {
    const { pickHeroVideo } = await import('@/lib/vaillant-experience');
    const landscape = { mp4: '/l.mp4', poster: '/l.jpg', durationSeconds: 8, source: 'Google Flow' };
    const portrait = { mp4: '/p.mp4', poster: '/p.jpg', durationSeconds: 8, source: 'Google Flow' };
    assert.equal(pickHeroVideo({ landscape, portrait, aiGenerated: true }, true), portrait);
    assert.equal(pickHeroVideo({ landscape, portrait, aiGenerated: true }, false), landscape);
    assert.equal(pickHeroVideo({ landscape, aiGenerated: true }, true), landscape);
  });

  it('the AI notice says the equipment is not a Vaillant model', async () => {
    const { AI_VIDEO_NOTICE } = await import('@/lib/vaillant-experience');
    assert.match(AI_VIDEO_NOTICE, /generat cu AI/);
    assert.match(AI_VIDEO_NOTICE, /nu reprezintă un model Vaillant/);
  });

  it('server render never contains a video element: the static key visual is the first paint', () => {
    const html = renderToStaticMarkup(<ExperienceHero draft={false} />);
    assert.ok(!html.includes('<video'));
    assert.ok(html.includes('hero-arotherm-plus.jpg'));
  });
});
