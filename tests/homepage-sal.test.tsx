import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import Home from '@/app/page';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { FavoritesProvider } from '@/lib/favorites-context';

// Ordinul ANPC nr. 449/2022, art. 2, as amended by Ordinul nr. 270/2026.
describe('homepage – ANPC SAL pictogram', () => {
  const html = renderToStaticMarkup(
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Home />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>,
  );
  const anchor = html.match(/<a[^>]*data-testid="anpc-sal-pictogram"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';

  it('is present on the homepage', () => {
    assert.ok(anchor, 'SAL pictogram link missing from the homepage');
    assert.match(anchor, /<img[^>]+src="\/legal\/anpc-sal-pictograma\.png"/);
    assert.match(anchor, /alt="[^"]*Soluționarea alternativă a litigiilor[^"]*"/);
  });

  it('is declared at exactly 250 × 50 px', () => {
    const img = anchor.match(/<img[^>]*>/)?.[0] ?? '';
    assert.match(img, /width="250"/);
    assert.match(img, /height="50"/);
    assert.match(img, /h-\[50px\]/);
    assert.match(img, /w-\[250px\]/);
    assert.match(anchor, /class="[^"]*h-\[50px\][^"]*w-\[250px\]/);
  });

  it('links exactly to https://reclamatiisal.anpc.ro', () => {
    assert.match(anchor, /^<a[^>]*href="https:\/\/reclamatiisal\.anpc\.ro"/);
  });

  it('keeps the ANPC and /garantii links', () => {
    assert.match(html, /href="https:\/\/anpc\.ro"/);
    assert.match(html, /href="\/garantii"/);
  });

  it('has no reference to the abolished EU ODR platform', () => {
    assert.doesNotMatch(html, /ODR|SOL\/|platforma SOL|ec\.europa\.eu\/consumers\/odr|online dispute|soluționare online/i);
  });
});
