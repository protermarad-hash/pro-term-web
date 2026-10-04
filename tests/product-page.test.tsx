import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import ProductPageClient from '@/app/produse/[slug]/ProductPageClient';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { FavoritesProvider } from '@/lib/favorites-context';
import { EMPTY_GUARANTEE_INFO, parseProductGuaranteeInfo, type ProductGuaranteeInfo } from '@/lib/consumer-guarantee';
import { eligibleRow, normalCommercialWarrantyRow, testProduct } from './support/fixtures';

function renderProductPage(guarantee: ProductGuaranteeInfo): string {
  return renderToStaticMarkup(
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ProductPageClient product={testProduct} guarantee={guarantee} related={[]} />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>,
  );
}

describe('product page – guarantee and consumer rights', () => {
  it('shows the "Garanție și drepturile consumatorului" section with access to the official notice', () => {
    const html = renderProductPage(EMPTY_GUARANTEE_INFO);
    assert.match(html, /data-testid="product-guarantee-section"/);
    assert.match(html, /Garanție și drepturile consumatorului/);
    assert.match(html, /data-testid="legal-guarantee-notice-trigger"/);
    assert.match(html, /Drepturile tale privind garanția legală/);
  });

  it('places the section right after the price / add-to-cart block', () => {
    const html = renderProductPage(EMPTY_GUARANTEE_INFO);
    const addToCart = html.indexOf('Adaugă în coș');
    const section = html.indexOf('data-testid="product-guarantee-section"');
    const specs = html.indexOf('Specificații tehnice');
    assert.ok(addToCart > 0 && section > addToCart && section < specs, 'section between CTA and specifications');
  });

  it('links to the guarantees page', () => {
    assert.match(renderProductPage(EMPTY_GUARANTEE_INFO), /href="\/garantii"/);
  });

  it('does not show the EU GARAN label by default', () => {
    const html = renderProductPage(EMPTY_GUARANTEE_INFO);
    assert.doesNotMatch(html, /data-testid="product-durability-label"/);
    assert.doesNotMatch(html, /data-testid="garan-label-trigger"/);
  });

  it('shows the label, with producer and model, for an explicitly eligible product', () => {
    const html = renderProductPage(parseProductGuaranteeInfo(eligibleRow));
    assert.match(html, /data-testid="product-durability-label"/);
    assert.match(html, /data-testid="garan-label-trigger"/);
    assert.match(html, /Producător: Producător Test/);
    assert.match(html, /Model: MODEL-X1/);
    assert.match(html, /5 ani/);
  });

  it('a normal commercial warranty is shown as text and does not receive the GARAN label', () => {
    const html = renderProductPage(parseProductGuaranteeInfo(normalCommercialWarrantyRow));
    assert.match(html, /data-testid="product-commercial-warranty"/);
    assert.match(html, /5 ani garanție comercială, cu condiția montajului autorizat/);
    assert.match(html, /href="https:\/\/example.ro\/conditii-garantie.pdf"/);
    assert.doesNotMatch(html, /data-testid="garan-label-trigger"/);
  });

  it('renders no empty fields', () => {
    const html = renderProductPage(EMPTY_GUARANTEE_INFO);
    assert.doesNotMatch(html, /data-testid="product-commercial-warranty"/);
    assert.doesNotMatch(html, /data-testid="product-consumer-info"/);
    for (const title of ['Servicii post-vânzare', 'Piese de schimb', 'Reparare și întreținere', 'Actualizări software']) {
      assert.doesNotMatch(html, new RegExp(title), title);
    }
  });

  it('renders only the producer information that was provided', () => {
    const html = renderProductPage(parseProductGuaranteeInfo({ spare_parts_info: 'Piese disponibile prin producător, la comandă.' }));
    assert.match(html, /data-testid="product-consumer-info"/);
    assert.match(html, /Piese disponibile prin producător, la comandă\./);
    assert.doesNotMatch(html, /Actualizări software/);
    assert.doesNotMatch(html, /Servicii post-vânzare/);
  });

  it('keeps the B2C / B2B distinction explicit', () => {
    assert.match(renderProductPage(EMPTY_GUARANTEE_INFO), /persoane juridice se aplică regimul general al Codului civil/);
  });
});
