import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import ProductPageClient from '@/app/produse/[slug]/ProductPageClient';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { FavoritesProvider } from '@/lib/favorites-context';
import { EMPTY_GUARANTEE_INFO } from '@/lib/consumer-guarantee';
import {
  POWER_SELECTION_NOTICE,
  PRICE_AVAILABILITY_NOTICE,
  QUOTE_ONLY_AVAILABILITY_NOTICE,
  SYSTEM_QUOTE_CTA,
  isDraftPreviewEnabled,
  parseCommercialDetails,
  type ProductCommercialDetails,
} from '@/lib/product-commercial';
import { getPublishBlockers, parseCommercialUpdate } from '@/lib/product-price-review';
import { validateQuoteRequest } from '@/lib/quote-request';
import { buildQuoteRequestHtml } from '@/lib/email';
import { dbProductToProduct, type DbProduct } from '@/lib/supabase';
import type { Product } from '@/lib/products';
import { STAGE1_PRODUCTS } from '../scripts/vaillant/stage1-catalog';
import { parsePublicPriceCsv } from '../scripts/vaillant/price-list';
import { testProduct } from './support/fixtures';

const ROOT = path.resolve(import.meta.dirname, '..');

const vaillantProduct: Product = {
  ...testProduct,
  id: '22222222-2222-4222-8222-222222222222',
  slug: 'vaillant-arotherm-pro-vwl-55-7-1-a-230v-s3',
  name: 'Pompă de căldură Vaillant aroTHERM pro VWL 55/7.1 A 230V S3',
  brand: 'Vaillant',
  category: 'pompe-caldura',
  btu: undefined,
  price: 19990,
  rating: 0,
  reviews: 0,
  quoteOnly: true,
};

const vaillantCommercial: ProductCommercialDetails = {
  manufacturerCode: '8000022169',
  productLine: 'arotherm-pro',
  powerSupply: '230V',
  includedComponents: ['Unitate exterioară aroTHERM pro VWL 55/7.1 A 230V S3'],
  excludedComponents: ['Boiler pentru apă caldă menajeră'],
  documents: [{ label: 'Fișă tehnică ErP', url: 'https://www.vaillant.com.ro/doc.pdf' }],
  quoteOnly: true,
};

function render(product: Product, commercial?: ProductCommercialDetails, isDraft = false) {
  return renderToStaticMarkup(
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ProductPageClient product={product} guarantee={EMPTY_GUARANTEE_INFO} related={[]} commercial={commercial} isDraft={isDraft} />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>,
  );
}

const validQuote = {
  offerOption: 'sistem-complet',
  product: 'Pompă de căldură Vaillant aroTHERM pro VWL 55/7.1 A 230V S3 (8000022169)',
  locality: 'Arad',
  areaSqm: 140,
  constructionYear: 1998,
  insulation: 'partiala',
  existingSystem: 'centrala-gaz',
  emitters: 'radiatoare',
  hotWater: 'da',
  occupants: 4,
  electricalSupply: 'monofazat',
  name: 'Ion Popescu',
  phone: '0749 000 000',
  email: 'ion@example.ro',
  details: '',
  gdprConsent: true,
};

describe('Vaillant product page (quote-only)', () => {
  const html = render(vaillantProduct, vaillantCommercial);

  it('shows SKU, power supply, included and excluded components', () => {
    assert.match(html, /data-testid="product-sku">8000022169</);
    assert.match(html, /data-testid="product-power-supply">230 V \(monofazat\)</);
    assert.match(html, /Unitate exterioară aroTHERM pro VWL 55\/7\.1 A 230V S3/);
    assert.match(html, /Boiler pentru apă caldă menajeră/);
  });

  it('shows the final price with VAT and the availability notice', () => {
    assert.match(html, /19.990 lei/);
    assert.ok(html.includes(PRICE_AVAILABILITY_NOTICE));
    assert.ok(html.includes(QUOTE_ONLY_AVAILABILITY_NOTICE));
    assert.ok(!html.includes('3–5 zile'));
  });

  it('shows the system quote CTA and the power-selection notice', () => {
    assert.ok(html.includes(SYSTEM_QUOTE_CTA));
    assert.ok(html.includes(POWER_SELECTION_NOTICE));
    assert.match(html, /href="\/vaillant\/cerere-oferta\?produs=vaillant-arotherm-pro-vwl-55-7-1-a-230v-s3&amp;optiune=sistem-complet"/);
  });

  it('never offers add-to-cart and hides the empty rating', () => {
    assert.doesNotMatch(html, /Adaugă în coș/);
    assert.doesNotMatch(html, /recenzii\)/);
  });

  it('keeps the legal guarantee section', () => {
    assert.match(html, /data-testid="product-guarantee-section"/);
  });

  it('premium top: logo, key benefits and price/CTA come before availability and component details', () => {
    assert.ok(html.includes('/media/vaillant/vaillant-logo.svg'));
    const benefits = html.indexOf('data-testid="quote-only-benefits"');
    const panel = html.indexOf('data-testid="quote-only-panel"');
    const availability = html.indexOf(QUOTE_ONLY_AVAILABILITY_NOTICE);
    const components = html.indexOf('data-testid="quote-only-components"');
    assert.ok(benefits > 0 && benefits < panel, 'benefits before price panel');
    assert.ok(panel < availability && availability < components, 'price/CTA before availability before components');
    assert.equal((html.match(/data-testid="quote-only-panel"/g) ?? []).length, 1);
  });

  it('marks drafts with a banner', () => {
    assert.match(render(vaillantProduct, vaillantCommercial, true), /data-testid="draft-banner"/);
    assert.doesNotMatch(html, /data-testid="draft-banner"/);
  });

  it('leaves regular products unchanged (cart still available)', () => {
    const regular = render(testProduct);
    assert.match(regular, /Adaugă în coș/);
    assert.doesNotMatch(regular, /data-testid="quote-only-panel"/);
  });
});

describe('commercial details parsing', () => {
  it('maps quote_only from the database row only when explicitly true', () => {
    const base = { id: 'x', slug: 's', name: 'n', brand: 'Vaillant', category: 'pompe-caldura', price: 1 } as unknown as DbProduct;
    assert.equal(dbProductToProduct({ ...base, quote_only: true }).quoteOnly, true);
    assert.equal(dbProductToProduct(base).quoteOnly, undefined);
  });

  it('drops non-https documents and invalid power supply', () => {
    const parsed = parseCommercialDetails({
      power_supply: '380V',
      documents: [{ label: 'ok', url: 'https://a.ro/x.pdf' }, { label: 'bad', url: 'http://a.ro/x.pdf' }, { label: 'js', url: 'javascript:alert(1)' }],
      included_components: ['A', 3, ''],
    });
    assert.equal(parsed.powerSupply, undefined);
    assert.deepEqual(parsed.documents, [{ label: 'ok', url: 'https://a.ro/x.pdf' }]);
    assert.deepEqual(parsed.includedComponents, ['A']);
  });

  it('shows drafts only in development and on Vercel Preview (fail-closed)', () => {
    assert.equal(isDraftPreviewEnabled({ NODE_ENV: 'production', VERCEL_ENV: 'production' }), false);
    assert.equal(isDraftPreviewEnabled({ NODE_ENV: 'production' }), false);
    assert.equal(isDraftPreviewEnabled({ NODE_ENV: 'production', VERCEL_ENV: 'preview' }), true);
    assert.equal(isDraftPreviewEnabled({ NODE_ENV: 'development' }), true);
  });
});

describe('publication rules', () => {
  const complete = {
    quoteOnly: true,
    price: 19990,
    manufacturerCode: '8000022169',
    powerSupply: '230V',
    includedComponents: ['Unitate exterioară'],
    excludedComponents: ['Boiler'],
    review: { priceVerifiedAt: '2026-11-23T12:00:00.000Z', approvalSource: 'Lista', needsReverification: false },
  };

  it('allows publishing only when every required field is verified', () => {
    assert.deepEqual(getPublishBlockers(complete), []);
    assert.equal(getPublishBlockers({ ...complete, review: { ...complete.review, needsReverification: true } }).length, 1);
    assert.ok(getPublishBlockers({ ...complete, review: { ...complete.review, priceVerifiedAt: null } }).length > 0);
    assert.ok(getPublishBlockers({ ...complete, excludedComponents: [] }).length > 0);
    assert.ok(getPublishBlockers({ ...complete, price: 0 }).length > 0);
  });

  it('never blocks regular (non quote-only) products', () => {
    assert.deepEqual(getPublishBlockers({ ...complete, quoteOnly: false, price: 0, manufacturerCode: null }), []);
  });

  it('validates the admin payload', () => {
    const now = new Date('2026-11-23T15:00:00Z');
    const ok = parseCommercialUpdate(
      { id: vaillantProduct.id, price: '19990', powerSupply: '400V', includedComponents: 'A\nB', documents: 'Fișă | https://x.ro/a.pdf', priceVerifiedAt: '2026-11-23', approvalSource: 'Lista' },
      now,
    );
    assert.ok(ok.ok);
    if (ok.ok) {
      assert.deepEqual(ok.update.includedComponents, ['A', 'B']);
      assert.deepEqual(ok.update.documents, [{ label: 'Fișă', url: 'https://x.ro/a.pdf' }]);
      assert.equal(ok.update.review.needsReverification, true, 'defaults to needing re-verification');
    }
    assert.equal(parseCommercialUpdate({ id: vaillantProduct.id, price: 1, priceVerifiedAt: '2027-05-01' }, now).ok, false);
    assert.equal(parseCommercialUpdate({ id: 'not-a-uuid', price: 1 }, now).ok, false);
    assert.equal(parseCommercialUpdate({ id: vaillantProduct.id, price: -5 }, now).ok, false);
    assert.equal(parseCommercialUpdate({ id: vaillantProduct.id, price: 1, powerSupply: '380V' }, now).ok, false);
  });
});

describe('quote request', () => {
  it('accepts a complete request', () => {
    const result = validateQuoteRequest(validQuote, new Date('2026-11-23'));
    assert.ok(result.ok);
  });

  it('requires GDPR consent and the technical fields', () => {
    assert.deepEqual(validateQuoteRequest({ ...validQuote, gdprConsent: false }), { ok: false, field: 'gdprConsent' });
    assert.deepEqual(validateQuoteRequest({ ...validQuote, areaSqm: 3 }), { ok: false, field: 'areaSqm' });
    assert.deepEqual(validateQuoteRequest({ ...validQuote, electricalSupply: 'altceva' }), { ok: false, field: 'electricalSupply' });
    assert.deepEqual(validateQuoteRequest({ ...validQuote, offerOption: 'pret-final' }), { ok: false, field: 'offerOption' });
    assert.deepEqual(validateQuoteRequest({ ...validQuote, locality: '' }), { ok: false, field: 'locality' });
    assert.deepEqual(validateQuoteRequest({ ...validQuote, occupants: 0 }), { ok: false, field: 'occupants' });
  });

  it('treats a filled honeypot as spam', () => {
    assert.deepEqual(validateQuoteRequest({ ...validQuote, honeypot: 'http://spam' }), { ok: false, spam: true });
  });

  it('escapes user input in the team email and includes no price', () => {
    const result = validateQuoteRequest({ ...validQuote, name: '<script>x</script>', details: '<b>a</b>' });
    assert.ok(result.ok);
    if (!result.ok) return;
    const html = buildQuoteRequestHtml(result.data, '23.11.2026');
    assert.doesNotMatch(html, /<script>x<\/script>/);
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /\blei\b|RON/);
  });
});

describe('stage 1 Vaillant catalogue', () => {
  const brief: Record<string, '230V' | '400V'> = {
    '8000022169': '230V', '8000022192': '230V', '8000022201': '230V', '8000022212': '400V', '8000022204': '230V',
    '8000022215': '400V', '8000049535': '230V', '8000049536': '230V', '8000049543': '400V', '8000049544': '400V',
  };

  it('contains exactly the 10 approved SKUs with the right power supply', () => {
    assert.equal(STAGE1_PRODUCTS.length, 10);
    for (const product of STAGE1_PRODUCTS) assert.equal(brief[product.sku], product.powerSupply, product.sku);
  });

  it('lists included and excluded components for every product', () => {
    for (const product of STAGE1_PRODUCTS) {
      assert.ok(product.includedComponents.length > 0 && product.excludedComponents.length > 0, product.sku);
      if (product.productLine === 'arotherm-plus') assert.ok(product.includedComponents.includes('Automatizare VWZ AI /7'));
    }
  });

  it('states measurement conditions for every power value and links only to official https documents', () => {
    for (const product of STAGE1_PRODUCTS) {
      for (const spec of product.specs.filter((s) => s.label.startsWith('Putere termică'))) {
        assert.match(spec.label, /A-?\d+\/W\d+/, `${product.sku}: ${spec.label}`);
      }
      for (const doc of product.documents) assert.match(doc.url, /^https:\/\/www\.vaillant\.com\.ro\//);
    }
  });

  it('has unique slugs and never claims a heated area', () => {
    assert.equal(new Set(STAGE1_PRODUCTS.map((p) => p.slug)).size, STAGE1_PRODUCTS.length);
    for (const product of STAGE1_PRODUCTS) assert.doesNotMatch(JSON.stringify(product), /m²|(^|[^a-zăâîșț])mp([^a-zăâîșț]|$)|metri pătrați/i);
  });
});

describe('public price list import', () => {
  it('parses public prices with VAT', () => {
    const { rows, errors } = parsePublicPriceCsv('sku;public_price_with_vat;verified_at;approval_source\n8000022169;19.990;2026-11-23;Lista\n');
    assert.deepEqual(errors, []);
    assert.equal(rows[0].priceWithVat, 19990);
  });

  it('refuses files with purchase-price, margin or discount columns', () => {
    for (const column of ['pret_achizitie', 'marja', 'discount', 'cost_logistic', 'prag_negociere']) {
      const { rows, errors } = parsePublicPriceCsv(`sku;public_price_with_vat;verified_at;approval_source;${column}\n8000022169;19990;2026-11-23;Lista;1\n`);
      assert.equal(rows.length, 0, column);
      assert.ok(errors.length > 0, column);
    }
  });

  it('rejects duplicates and invalid rows', () => {
    const { errors } = parsePublicPriceCsv('sku;public_price_with_vat;verified_at;approval_source\n8000022169;19990;2026-11-23;L\n8000022169;1;2026-11-23;L\nabc;1;2026-11-23;L\n');
    assert.equal(errors.length, 2);
  });
});

describe('forbidden wording', () => {
  const FORBIDDEN = [/reprezentanț[aă] vaillant/i, /service vaillant pro term/i, /garanție extinsă/i, /distribuitor autorizat/i, /dealer autorizat vaillant/i];
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(tsx?|csv)$/.test(entry)) files.push(full);
    }
  }
  walk(path.join(ROOT, 'src/app/vaillant'));
  walk(path.join(ROOT, 'src/components/vaillant'));
  walk(path.join(ROOT, 'scripts/vaillant'));
  files.push(path.join(ROOT, 'src/lib/vaillant-catalog.ts'), path.join(ROOT, 'src/lib/product-commercial.ts'), path.join(ROOT, 'src/lib/vaillant-experience.ts'), path.join(ROOT, 'src/lib/vaillant-storyboard.ts'));

  it('is not used in Vaillant pages, components or catalogue data', () => {
    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      for (const pattern of FORBIDDEN) assert.doesNotMatch(content, pattern, `${path.relative(ROOT, file)} matches ${pattern}`);
    }
  });
});
