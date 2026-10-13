// Campania Midea Solstice (octombrie 2026): prețurile confirmate nu sunt
// recalculate, bannerul dispare automat după expirare, iar mecanismul de
// activare/revenire a prețurilor este idempotent, verifică identitatea
// produsului (SKU), scrie condiționat (optimistic concurrency — nu
// suprascrie o modificare administrativă concurentă) și nu lasă niciodată
// original_price setat (fără reducere/preț barat neverificat legal).
import { describe, it, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MIDEA_SOLSTICE_MODELS,
  MIDEA_SOLSTICE_CAMPAIGN_END,
  isMideaSolsticeCampaignActive,
} from '@/lib/campaigns/midea-solstice';
import { applyMideaSolsticePricing } from '@/lib/campaigns/midea-solstice-server';

describe('campania Midea Solstice — date comerciale', () => {
  it('conține exact cele două modele confirmate, cu prețuri de campanie, normale și SKU exacte', () => {
    assert.equal(MIDEA_SOLSTICE_MODELS.length, 2);

    const nine = MIDEA_SOLSTICE_MODELS.find((m) => m.btu === 9000);
    const twelve = MIDEA_SOLSTICE_MODELS.find((m) => m.btu === 12000);

    assert.ok(nine);
    assert.equal(nine?.slug, 'midea-solstice-9000-btu');
    assert.equal(nine?.smartbillCode, 'EZ-09RD6-I');
    assert.equal(nine?.campaignPrice, 2149);
    assert.equal(nine?.normalPrice, 2575);

    assert.ok(twelve);
    assert.equal(twelve?.slug, 'midea-solstice-12000-btu');
    assert.equal(twelve?.smartbillCode, 'EZ-12RD6-I');
    assert.equal(twelve?.campaignPrice, 2294);
    assert.equal(twelve?.normalPrice, 2685);
  });

  it('prețul de campanie este mai mic decât prețul normal pentru fiecare model (verificare de bun-simț)', () => {
    for (const model of MIDEA_SOLSTICE_MODELS) {
      assert.ok(model.campaignPrice < model.normalPrice, `${model.slug}: campaignPrice ar trebui < normalPrice`);
    }
  });
});

describe('campania Midea Solstice — fereastră temporală (Europe/Bucharest)', () => {
  it('30.10.2026, 23:59:59 ora României corespunde la 21:59:59 UTC (oră de iarnă, UTC+2)', () => {
    // DST în UE se încheie ultima duminică din octombrie — 25.10.2026 — deci
    // pe 30.10.2026 România este deja pe ora de iarnă (EET, UTC+2).
    assert.equal(MIDEA_SOLSTICE_CAMPAIGN_END.toISOString(), '2026-10-30T21:59:59.000Z');

    const bucharestOffset = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Bucharest',
      timeZoneName: 'shortOffset',
    })
      .formatToParts(MIDEA_SOLSTICE_CAMPAIGN_END)
      .find((p) => p.type === 'timeZoneName')?.value;
    assert.equal(bucharestOffset, 'GMT+2');
  });

  it('este activă înainte și la data limită, inclusiv', () => {
    assert.equal(isMideaSolsticeCampaignActive(new Date('2026-10-01T00:00:00+02:00')), true);
    assert.equal(isMideaSolsticeCampaignActive(new Date('2026-10-30T23:59:58+02:00')), true);
    assert.equal(isMideaSolsticeCampaignActive(MIDEA_SOLSTICE_CAMPAIGN_END), true);
  });

  it('expiră imediat după 30.10.2026 ora României, fără a mai necesita un deploy', () => {
    assert.equal(isMideaSolsticeCampaignActive(new Date('2026-10-31T00:00:00+02:00')), false);
    assert.equal(isMideaSolsticeCampaignActive(new Date('2026-11-15T12:00:00+02:00')), false);
  });
});

// ── Fake Supabase client pentru testarea applyMideaSolsticePricing ──────────
type Row = { price: number; original_price: number | null; smartbill_code: string };

interface FakeOptions {
  rows: Record<string, Row | 'read-error' | 'missing'>;
  /** Simulează o modificare concurentă: scrierea condiționată nu mai potrivește niciun rând pentru acest slug. */
  simulateConflictFor?: string;
  /** Simulează o eroare DB la scriere pentru acest slug. */
  writeErrorFor?: string;
}

function fakeSupabase({ rows, simulateConflictFor, writeErrorFor }: FakeOptions) {
  const updateCalls: Array<{ slug: string; payload: unknown }> = [];

  function resultFor(slug: string) {
    const row = rows[slug];
    if (row === 'read-error') return { data: null, error: { message: 'simulated read failure' } };
    if (row === 'missing' || !row) return { data: null, error: null };
    return { data: row, error: null };
  }

  const client = {
    from(table: string) {
      assert.equal(table, 'products');
      return {
        select: () => ({
          eq: (_col: string, value: string) => ({
            maybeSingle: () => Promise.resolve(resultFor(value)),
          }),
        }),
        update: (payload: unknown) => {
          const builder = {
            _slug: undefined as string | undefined,
            eq(col: string, value: string) {
              if (col === 'slug') builder._slug = value;
              return builder;
            },
            is() {
              return builder;
            },
            select: () => {
              const slug = builder._slug!;
              updateCalls.push({ slug, payload });
              if (slug === writeErrorFor) return Promise.resolve({ data: null, error: { message: 'simulated write failure' } });
              if (slug === simulateConflictFor) return Promise.resolve({ data: [], error: null });
              return Promise.resolve({ data: [{ slug }], error: null });
            },
          };
          return builder;
        },
      };
    },
  };

  return { client: client as unknown as import('@supabase/supabase-js').SupabaseClient, updateCalls };
}

const SKU = { nine: 'EZ-09RD6-I', twelve: 'EZ-12RD6-I' };

describe('applyMideaSolsticePricing — activare/revenire', () => {
  test('mode "campaign": setează prețul de campanie și NULL pe original_price, inclusiv când original_price era deja setat', async () => {
    const { client, updateCalls } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': { price: 2575, original_price: 2575, smartbill_code: SKU.nine },
        'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
      },
    });

    const results = await applyMideaSolsticePricing(client, 'campaign');

    assert.equal(results.every((r) => r.ok), true);
    assert.equal(updateCalls.length, 2);
    for (const call of updateCalls) {
      const payload = call.payload as { price: number; original_price: null };
      assert.equal(payload.original_price, null);
    }
    const nine = results.find((r) => r.slug === 'midea-solstice-9000-btu');
    assert.equal(nine?.to, 2149);
    assert.deepEqual(nine?.before, { price: 2575, originalPrice: 2575 });
  });

  test('mode "normal": revine la prețul normal', async () => {
    const { client } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': { price: 2149, original_price: null, smartbill_code: SKU.nine },
        'midea-solstice-12000-btu': { price: 2294, original_price: null, smartbill_code: SKU.twelve },
      },
    });

    const results = await applyMideaSolsticePricing(client, 'normal');
    assert.equal(results.find((r) => r.slug === 'midea-solstice-9000-btu')?.to, 2575);
    assert.equal(results.find((r) => r.slug === 'midea-solstice-12000-btu')?.to, 2685);
  });

  test('este idempotent: dacă prețul e deja cel țintă și original_price e NULL, nu scrie nimic', async () => {
    const { client, updateCalls } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': { price: 2575, original_price: null, smartbill_code: SKU.nine },
        'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
      },
    });

    const results = await applyMideaSolsticePricing(client, 'normal');

    assert.equal(updateCalls.length, 0, 'nu ar trebui să existe niciun UPDATE când prețul e deja corect');
    assert.ok(results.every((r) => r.ok && r.skipped));
  });

  test('refuză actualizarea dacă SKU-ul citit nu corespunde celui așteptat (identitate greșită)', async () => {
    const { client, updateCalls } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': { price: 2575, original_price: null, smartbill_code: 'ALT-SKU-NEASTEPTAT' },
        'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
      },
    });

    const results = await applyMideaSolsticePricing(client, 'campaign');
    const nine = results.find((r) => r.slug === 'midea-solstice-9000-btu');
    const twelve = results.find((r) => r.slug === 'midea-solstice-12000-btu');

    assert.equal(nine?.ok, false);
    assert.equal(nine?.identityMismatch, true);
    assert.equal(
      updateCalls.some((c) => c.slug === 'midea-solstice-9000-btu'),
      false,
      'nu trebuie trimis niciun UPDATE când identitatea nu corespunde',
    );
    assert.equal(twelve?.ok, true, 'celălalt produs, cu SKU corect, tot trebuie procesat');
  });

  test('refuză actualizarea dacă prețul s-a schimbat concurent între citire și scriere (conflict, nu suprascriere)', async () => {
    const { client } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': { price: 2575, original_price: null, smartbill_code: SKU.nine },
        'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
      },
      simulateConflictFor: 'midea-solstice-9000-btu',
    });

    const results = await applyMideaSolsticePricing(client, 'campaign');
    const nine = results.find((r) => r.slug === 'midea-solstice-9000-btu');
    const twelve = results.find((r) => r.slug === 'midea-solstice-12000-btu');

    assert.equal(nine?.ok, false);
    assert.equal(nine?.conflict, true);
    assert.ok(nine?.before, 'rezultatul de conflict tot trebuie să conțină starea citită, pentru backup/diagnostic');
    assert.equal(twelve?.ok, true, 'celălalt produs, fără conflict, tot trebuie actualizat');
  });

  test('o eroare de citire pentru un produs nu oprește procesarea celuilalt', async () => {
    const { client } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': 'read-error',
        'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
      },
    });

    const results = await applyMideaSolsticePricing(client, 'normal');
    const nine = results.find((r) => r.slug === 'midea-solstice-9000-btu');
    const twelve = results.find((r) => r.slug === 'midea-solstice-12000-btu');

    assert.equal(nine?.ok, false);
    assert.match(nine?.error ?? '', /read/);
    assert.equal(twelve?.ok, true);
  });

  test('o eroare de scriere pentru un produs este raportată, fără a opri celălalt produs', async () => {
    const { client } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': { price: 2575, original_price: null, smartbill_code: SKU.nine },
        'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
      },
      writeErrorFor: 'midea-solstice-9000-btu',
    });

    const results = await applyMideaSolsticePricing(client, 'campaign');
    const nine = results.find((r) => r.slug === 'midea-solstice-9000-btu');
    const twelve = results.find((r) => r.slug === 'midea-solstice-12000-btu');

    assert.equal(nine?.ok, false);
    assert.match(nine?.error ?? '', /update/);
    assert.equal(twelve?.ok, true);
  });

  test('produs lipsă din DB este raportat ca eroare, nu ca succes silențios', async () => {
    const { client } = fakeSupabase({
      rows: {
        'midea-solstice-9000-btu': 'missing',
        'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
      },
    });

    const results = await applyMideaSolsticePricing(client, 'normal');
    const nine = results.find((r) => r.slug === 'midea-solstice-9000-btu');
    assert.equal(nine?.ok, false);
    assert.match(nine?.error ?? '', /not found/);
  });
});
