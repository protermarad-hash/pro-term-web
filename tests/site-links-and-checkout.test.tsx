import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '@/components/Footer';
import CheckoutGuaranteeInfo from '@/components/legal/CheckoutGuaranteeInfo';
import GuaranteesPage from '@/app/garantii/page';
import TermsPage from '@/app/termeni-si-conditii/page';
import sitemap from '@/app/sitemap';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { legalGuaranteeNoticeHtml } from '@/lib/email';
import {
  LEGAL_NOTICE_SVG_PATH,
  LEGAL_NOTICE_TEXT_RO,
  YOUR_EUROPE_LEGAL_GUARANTEE_URL,
  getDurabilityLabel,
  parseProductGuaranteeInfo,
  type DurabilityLabelData,
} from '@/lib/consumer-guarantee';
import { eligibleRow } from './support/fixtures';

describe('footer', () => {
  it('links to "Garanții și drepturile consumatorului"', () => {
    const html = renderToStaticMarkup(
      <AuthProvider>
        <Footer />
      </AuthProvider>,
    );
    assert.match(html, /<a[^>]+href="\/garantii"[^>]*>Garanții și drepturile consumatorului<\/a>/);
  });
});

describe('/garantii page', () => {
  const html = renderToStaticMarkup(
    <AuthProvider>
      <CartProvider>
        <GuaranteesPage />
      </CartProvider>
    </AuthProvider>,
  );

  it('shows the official notice file, unmodified, with its text alternative and Your Europe link', () => {
    assert.match(html, /data-testid="eu-legal-guarantee-notice"/);
    assert.ok(html.includes(`src="${LEGAL_NOTICE_SVG_PATH}"`));
    assert.ok(html.includes(`href="${YOUR_EUROPE_LEGAL_GUARANTEE_URL}"`));
    for (const paragraph of LEGAL_NOTICE_TEXT_RO) assert.ok(html.includes(paragraph), paragraph.slice(0, 40));
  });

  it('covers legal guarantee, commercial guarantee, GARAN, procedure, after-sales and B2B', () => {
    for (const heading of [
      'Garanția legală de conformitate (pentru consumatori)',
      'Garanția comercială – diferența față de garanția legală',
      'Eticheta GARAN – garanția comercială de durabilitate',
      'Cum ne semnalezi o neconformitate',
      'Servicii post-vânzare',
      'Clienți persoane juridice',
    ]) {
      assert.ok(html.includes(heading), heading);
    }
    assert.match(html, /office@pro-term\.ro/);
  });

  it('is listed in the sitemap', async () => {
    const entries = await sitemap();
    assert.ok(entries.some((entry) => entry.url === 'https://pro-term.ro/garantii'));
  });
});

describe('checkout', () => {
  const items = [
    { id: '11111111-1111-4111-8111-111111111111', name: 'Produs eligibil' },
    { id: '22222222-2222-4222-8222-222222222222', name: 'Produs fără etichetă' },
  ];

  it('always offers the official notice before the order is placed', () => {
    const html = renderToStaticMarkup(<CheckoutGuaranteeInfo items={items} initialLabels={{}} />);
    assert.match(html, /data-testid="legal-guarantee-notice-trigger"/);
    assert.match(html, /href="\/garantii"/);
    assert.doesNotMatch(html, /data-testid="checkout-durability-labels"/);
  });

  it('shows the GARAN label only for the eligible cart item', () => {
    const label = getDurabilityLabel(parseProductGuaranteeInfo(eligibleRow)) as DurabilityLabelData;
    const html = renderToStaticMarkup(<CheckoutGuaranteeInfo items={items} initialLabels={{ [items[0].id]: label }} />);
    assert.match(html, /data-testid="checkout-durability-labels"/);
    assert.match(html, /Produs eligibil/);
    assert.equal(html.match(/data-testid="garan-label-trigger"/g)?.length, 1);
    assert.doesNotMatch(html.slice(html.indexOf('checkout-durability-labels')), /Produs fără etichetă/);
  });

  it('is rendered directly above the order button in CheckoutClient', () => {
    const source = readFileSync(path.join(process.cwd(), 'src/app/checkout/CheckoutClient.tsx'), 'utf8');
    const info = source.indexOf('<CheckoutGuaranteeInfo');
    const submit = source.indexOf('type="submit"');
    assert.ok(info > 0 && info < submit, 'CheckoutGuaranteeInfo precedes the submit button');
    assert.ok(!source.slice(info, submit).includes('<div className="card'), 'no other card in between');
  });
});

describe('terms and conditions – section 9 (guarantees)', () => {
  const html = renderToStaticMarkup(
    <AuthProvider>
      <CartProvider>
        <TermsPage />
      </CartProvider>
    </AuthProvider>,
  );
  const section = html.slice(html.indexOf('9. Garanții'), html.indexOf('10. Retur'));

  it('does not present legal and commercial guarantees as alternatives', () => {
    assert.ok(section.length > 0);
    assert.doesNotMatch(section, /și\/sau/);
  });

  it('states the legal guarantee independently of commercial guarantees, links /garantii and keeps B2C/B2B apart', () => {
    assert.match(section, /nu depinde de existența unei garanții comerciale/);
    assert.match(section, /nu afectează drepturile consumatorului din garanția legală/);
    assert.match(section, /href="\/garantii"/);
    assert.match(section, /persoane juridice/);
    assert.match(section, /este suficientă o dovadă a achiziției/);
  });
});

describe('order confirmation e-mail', () => {
  it('contains the official notice (RGB PNG) and the Your Europe link', () => {
    const html = legalGuaranteeNoticeHtml();
    assert.match(html, /src="https:\/\/pro-term\.ro\/legal\/eu-notificare-garantie-legala-ro\.png"/);
    assert.ok(html.includes(YOUR_EUROPE_LEGAL_GUARANTEE_URL));
    assert.match(html, /pro-term\.ro\/garantii/);
  });
});
