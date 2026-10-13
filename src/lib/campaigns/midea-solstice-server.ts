// Deliberat FĂRĂ 'server-only': spre deosebire de consumer-guarantee-server.ts
// (folosit doar din rute Next.js), acest modul e reutilizat intenționat și de
// scriptul standalone scripts/midea-solstice-pricing.ts (executat prin tsx,
// în afara bundler-ului Next, unde pachetul 'server-only' nu e rezolvabil).
// Nu citește niciun secret direct — primește clientul Supabase deja construit
// ca parametru, deci nu e nevoie de protecția de bundling client/server.
import type { SupabaseClient } from '@supabase/supabase-js';
import { MIDEA_SOLSTICE_MODELS } from './midea-solstice';

export type MideaSolsticePricingMode = 'campaign' | 'normal';

export interface MideaSolsticePriceSnapshot {
  price: number;
  originalPrice: number | null;
}

export interface MideaSolsticePricingResult {
  slug: string;
  ok: boolean;
  /** true dacă prețul era deja la valoarea țintă — nicio scriere efectuată. */
  skipped?: boolean;
  /**
   * true dacă rândul s-a schimbat între citire și scriere (ex: o modificare
   * din admin între timp) — actualizarea a fost REFUZATĂ, nu suprascrisă.
   */
  conflict?: boolean;
  /** true dacă SKU-ul din DB nu corespunde celui așteptat pentru acest slug. */
  identityMismatch?: boolean;
  /** Starea citită înainte de orice scriere — backup minimal pentru audit/restaurare. */
  before?: MideaSolsticePriceSnapshot;
  to?: number;
  error?: string;
}

function targetPrice(mode: MideaSolsticePricingMode, model: (typeof MIDEA_SOLSTICE_MODELS)[number]): number {
  return mode === 'campaign' ? model.campaignPrice : model.normalPrice;
}

/**
 * Activează sau revine la prețurile normale pentru cele două produse Midea
 * Solstice din campanie. Folosită atât de scriptul manual de activare/revenire
 * (scripts/midea-solstice-pricing.ts), cât și de cron-ul de revenire automată
 * (src/app/api/cron/revert-midea-solstice-pricing/route.ts) — o singură
 * implementare a regulii, nu două divergente.
 *
 * Pentru fiecare produs, în ordine:
 * 1. Citește rândul curent (price, original_price, smartbill_code).
 * 2. Verifică identitatea: SKU-ul citit trebuie să corespundă exact celui
 *    așteptat pentru acel slug — altfel ABANDONEAZĂ acel produs
 *    (`identityMismatch`), fără nicio scriere. Nu presupunem niciodată că
 *    slug-ul încă indică produsul corect.
 * 3. Dacă prețul e deja cel țintă și original_price e deja NULL, sare peste
 *    (idempotent, nicio scriere).
 * 4. Scrie CONDIȚIONAT: UPDATE ... WHERE slug = ? AND price = <valoarea
 *    citită la pasul 1> AND original_price IS/= <valoarea citită>. Dacă
 *    niciun rând nu a fost afectat (cineva a modificat prețul între citire și
 *    scriere — de exemplu din admin), actualizarea e RESPINSĂ și raportată ca
 *    `conflict`, nu suprascrisă orbește.
 *
 * Fiecare produs e tratat independent — o eroare/conflict la unul nu oprește
 * procesarea celuilalt. Nu aruncă pentru erori per-produs; le raportează în
 * rezultat (`before` conține starea dinainte de scriere, utilă ca backup
 * minimal), ca apelantul să decidă (status HTTP, alertă, jurnal).
 *
 * `original_price` este întotdeauna adus la NULL la o scriere reușită,
 * indiferent de mod — aceste două produse nu folosesc niciodată mecanismul de
 * preț barat/reducere procentuală (vezi midea-solstice.ts pentru motivul legal).
 */
export async function applyMideaSolsticePricing(
  supabase: SupabaseClient,
  mode: MideaSolsticePricingMode,
): Promise<MideaSolsticePricingResult[]> {
  const results: MideaSolsticePricingResult[] = [];

  for (const model of MIDEA_SOLSTICE_MODELS) {
    const to = targetPrice(mode, model);
    try {
      const { data: current, error: readError } = await supabase
        .from('products')
        .select('price, original_price, smartbill_code')
        .eq('slug', model.slug)
        .maybeSingle();

      if (readError) {
        results.push({ slug: model.slug, ok: false, error: `read: ${readError.message}` });
        continue;
      }
      if (!current) {
        results.push({ slug: model.slug, ok: false, error: 'product not found' });
        continue;
      }
      if (current.smartbill_code !== model.smartbillCode) {
        results.push({
          slug: model.slug,
          ok: false,
          identityMismatch: true,
          error: `SKU neașteptat: găsit "${current.smartbill_code}", așteptat "${model.smartbillCode}" — actualizare refuzată.`,
        });
        continue;
      }

      const currentPrice = Number(current.price);
      const currentOriginalPrice = current.original_price === null ? null : Number(current.original_price);
      const before: MideaSolsticePriceSnapshot = { price: currentPrice, originalPrice: currentOriginalPrice };

      const alreadyApplied = currentPrice === to && currentOriginalPrice === null;
      if (alreadyApplied) {
        results.push({ slug: model.slug, ok: true, skipped: true, before, to });
        continue;
      }

      // Scriere condiționată (optimistic concurrency): WHERE include exact
      // valorile citite mai sus, ca o modificare administrativă concurentă să
      // facă filtrul să nu se potrivească niciunui rând, în loc să fie
      // suprascrisă.
      let query = supabase
        .from('products')
        .update({ price: to, original_price: null, updated_at: new Date().toISOString() })
        .eq('slug', model.slug)
        .eq('price', currentPrice);
      query = currentOriginalPrice === null ? query.is('original_price', null) : query.eq('original_price', currentOriginalPrice);

      const { data: updated, error: updateError } = await query.select('slug');

      if (updateError) {
        results.push({ slug: model.slug, ok: false, before, to, error: `update: ${updateError.message}` });
        continue;
      }
      if (!updated || updated.length === 0) {
        results.push({
          slug: model.slug,
          ok: false,
          conflict: true,
          before,
          to,
          error: 'Rândul s-a schimbat între citire și scriere (probabil o modificare din admin) — actualizare refuzată, nicio suprascriere.',
        });
        continue;
      }

      results.push({ slug: model.slug, ok: true, before, to });
    } catch (err) {
      results.push({ slug: model.slug, ok: false, error: err instanceof Error ? err.message : 'unknown error' });
    }
  }

  return results;
}
