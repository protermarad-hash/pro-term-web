import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '@/components/Footer';
import CheckoutGuaranteeInfo from '@/components/legal/CheckoutGuaranteeInfo';
import GuaranteesPage from '@/app/garantii/page';
import TermsPage from '@/app/termeni-si-conditii/page';
import LegalInfoPage from '@/app/informatii-legale/page';
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

  const noop = () => {};
  const label = getDurabilityLabel(parseProductGuaranteeInfo(eligibleRow)) as DurabilityLabelData;
  const render = (status: 'loading' | 'ready' | 'error', labels: Record<string, DurabilityLabelData> = {}) =>
    renderToStaticMarkup(<CheckoutGuaranteeInfo items={items} status={status} labels={labels} onRetry={noop} />);

  it('always offers the official notice before the order is placed', () => {
    for (const status of ['loading', 'ready', 'error'] as const) {
      const html = render(status);
      assert.match(html, /data-testid="legal-guarantee-notice-trigger"/, status);
      assert.match(html, /href="\/garantii"/, status);
    }
  });

  it('loading: shows the verification message and no label', () => {
    const html = render('loading', { [items[0].id]: label });
    assert.match(html, /data-guarantee-status="loading"/);
    assert.match(html, /Se verifică informațiile de garanție…/);
    assert.match(html, /role="status"/);
    assert.doesNotMatch(html, /data-testid="garan-label-trigger"/);
  });

  it('error: shows the error message with a retry button, never labels', () => {
    const html = render('error', { [items[0].id]: label });
    assert.match(html, /role="alert"/);
    assert.match(html, /Nu am putut verifica informațiile de garanție\. Reîncearcă înainte de plasarea comenzii\./);
    assert.match(html, /data-testid="guarantee-check-retry"/);
    assert.doesNotMatch(html, /data-testid="garan-label-trigger"/);
  });

  it('ready without eligible products: no label, no message', () => {
    const html = render('ready');
    assert.doesNotMatch(html, /data-testid="checkout-durability-labels"/);
    assert.doesNotMatch(html, /guarantee-check-(loading|error)/);
  });

  it('ready: shows the GARAN label only for the eligible cart item', () => {
    const html = render('ready', { [items[0].id]: label });
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

describe('terms and conditions – section 11 (complaints)', () => {
  const html = renderToStaticMarkup(
    <AuthProvider>
      <CartProvider>
        <TermsPage />
      </CartProvider>
    </AuthProvider>,
  );
  const section = html.slice(html.indexOf('11. Reclamații'), html.indexOf('12. Comunicări'));

  it('no longer refers to the EU ODR platform (abolished by Reg. (UE) 2024/3228 from 20.07.2025)', () => {
    assert.ok(section.length > 0);
    assert.doesNotMatch(section, /SOL\/ODR|ODR|platforma SOL|ec\.europa\.eu\/consumers\/odr/);
  });

  it('keeps ANPC, SAL and the competent courts', () => {
    assert.match(section, /href="https:\/\/anpc\.ro"/);
    assert.match(section, /href="https:\/\/reclamatiisal\.anpc\.ro"/);
    assert.match(section, /instanțelor competente/);
  });
});

describe('no references to the abolished EU ODR platform (Reg. (UE) 2024/3228)', () => {
  const ODR = /ODR|SOL\/|platforma SOL|ec\.europa\.eu\/consumers\/odr|online dispute|soluționare online/i;
  const pages = {
    footer: () => renderToStaticMarkup(<AuthProvider><Footer /></AuthProvider>),
    'informații legale': () => renderToStaticMarkup(<AuthProvider><CartProvider><LegalInfoPage /></CartProvider></AuthProvider>),
    'termeni și condiții': () => renderToStaticMarkup(<AuthProvider><CartProvider><TermsPage /></CartProvider></AuthProvider>),
    '/garantii': () => renderToStaticMarkup(<AuthProvider><CartProvider><GuaranteesPage /></CartProvider></AuthProvider>),
  };

  for (const [name, render] of Object.entries(pages)) {
    it(`${name}: no ODR link or text, ANPC and SAL kept`, () => {
      const html = render();
      assert.doesNotMatch(html, ODR);
      assert.match(html, /href="https:\/\/anpc\.ro"/);
      assert.match(html, /href="https:\/\/reclamatiisal\.anpc\.ro"/);
    });
  }
});

describe('order confirmation e-mail', () => {
  it('contains the official notice (RGB PNG) and the Your Europe link', () => {
    const html = legalGuaranteeNoticeHtml();
    assert.match(html, /src="https:\/\/pro-term\.ro\/legal\/eu-notificare-garantie-legala-ro\.png"/);
    assert.ok(html.includes(YOUR_EUROPE_LEGAL_GUARANTEE_URL));
    assert.match(html, /pro-term\.ro\/garantii/);
  });
});
