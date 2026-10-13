// Ruta de revenire automată a prețurilor (/api/cron/revert-midea-solstice-pricing)
// apelată direct, exact cum ar fi invocată de Vercel Cron — verifică
// autentificarea, guard-ul de campanie activă/expirată, scrierea
// condiționată (conflict / identitate), alertarea prin email la eșec și
// propagarea erorilor, fără a depinde de data reală de sistem.
import { test, describe, before, mock } from 'node:test';
import assert from 'node:assert/strict';
import {
  MIDEA_SOLSTICE_MODELS,
  MIDEA_SOLSTICE_CAMPAIGN_END,
  MIDEA_SOLSTICE_CAMPAIGN_END_LABEL,
} from '@/lib/campaigns/midea-solstice';
import type { GET as GetHandler } from '@/app/api/cron/revert-midea-solstice-pricing/route';

const CRON_SECRET = 'test-secret-value';
process.env.CRON_SECRET = CRON_SECRET;

type Row = { price: number; original_price: number | null; smartbill_code: string };
let rows: Record<string, Row> = {};
let updateCount = 0;
let failWriteFor: string | null = null;
let conflictFor: string | null = null;

const SKU = { nine: 'EZ-09RD6-I', twelve: 'EZ-12RD6-I' };

function makeFakeSupabase() {
  return {
    from(table: string) {
      assert.equal(table, 'products');
      return {
        select: () => ({
          eq: (_col: string, value: string) => ({
            maybeSingle: () => Promise.resolve({ data: rows[value] ?? null, error: null }),
          }),
        }),
        update: (payload: { price: number; original_price: null }) => {
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
              updateCount++;
              if (slug === failWriteFor) return Promise.resolve({ data: null, error: { message: 'simulated write failure' } });
              if (slug === conflictFor) return Promise.resolve({ data: [], error: null });
              rows[slug] = { ...rows[slug], price: payload.price, original_price: payload.original_price };
              return Promise.resolve({ data: [{ slug }], error: null });
            },
          };
          return builder;
        },
      };
    },
  };
}

let campaignActive = true;
const alertCalls: unknown[] = [];
let alertShouldThrow = false;

mock.module('@/lib/supabase-admin', {
  namedExports: { getSupabaseServiceClient: () => makeFakeSupabase() },
});
// Păstrăm exporturile reale (modelele/datele reale) și suprascriem DOAR
// funcția de activitate a campaniei, ca testele să nu depindă de data curentă
// de sistem.
mock.module('@/lib/campaigns/midea-solstice', {
  namedExports: {
    MIDEA_SOLSTICE_MODELS,
    MIDEA_SOLSTICE_CAMPAIGN_END,
    MIDEA_SOLSTICE_CAMPAIGN_END_LABEL,
    isMideaSolsticeCampaignActive: () => campaignActive,
  },
});
mock.module('@/lib/email', {
  namedExports: {
    sendMideaSolsticeRevertAlert: async (failures: unknown) => {
      alertCalls.push(failures);
      if (alertShouldThrow) throw new Error('simulated Resend outage');
    },
  },
});

let GET: typeof GetHandler;
before(async () => {
  ({ GET } = await import('@/app/api/cron/revert-midea-solstice-pricing/route'));
});

function makeRequest(authHeader?: string) {
  const headers = new Headers();
  if (authHeader !== undefined) headers.set('authorization', authHeader);
  return new Request('http://localhost/api/cron/revert-midea-solstice-pricing', { headers });
}

describe('/api/cron/revert-midea-solstice-pricing', () => {
  test('refuză fără Authorization corect (401)', async () => {
    const res = await GET(makeRequest('Bearer wrong-secret'));
    assert.equal(res.status, 401);
  });

  test('refuză fără header Authorization deloc (401)', async () => {
    const res = await GET(makeRequest());
    assert.equal(res.status, 401);
  });

  test('cu secretul corect, dar campania încă activă: nu reverte nimic', async () => {
    campaignActive = true;
    rows = {
      'midea-solstice-9000-btu': { price: 2149, original_price: null, smartbill_code: SKU.nine },
      'midea-solstice-12000-btu': { price: 2294, original_price: null, smartbill_code: SKU.twelve },
    };
    updateCount = 0;
    failWriteFor = null;
    conflictFor = null;
    alertCalls.length = 0;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));
    const body = (await res.json()) as { ok: boolean; reverted: boolean; reason?: string };

    assert.equal(res.status, 200);
    assert.equal(body.reverted, false);
    assert.equal(body.reason, 'campaign-active');
    assert.equal(updateCount, 0, 'nu trebuie să scrie nimic cât timp campania e activă');
  });

  test('după expirare: reverte efectiv la prețurile normale, fără alertă', async () => {
    campaignActive = false;
    rows = {
      'midea-solstice-9000-btu': { price: 2149, original_price: null, smartbill_code: SKU.nine },
      'midea-solstice-12000-btu': { price: 2294, original_price: null, smartbill_code: SKU.twelve },
    };
    updateCount = 0;
    failWriteFor = null;
    conflictFor = null;
    alertCalls.length = 0;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));
    const body = (await res.json()) as { ok: boolean; reverted: boolean; results: Array<{ slug: string; to: number }> };

    assert.equal(res.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.reverted, true);
    assert.equal(updateCount, 2);
    assert.equal(rows['midea-solstice-9000-btu'].price, 2575);
    assert.equal(rows['midea-solstice-12000-btu'].price, 2685);
    assert.equal(alertCalls.length, 0, 'nicio alertă nu trebuie trimisă când totul reușește');
  });

  test('după expirare, dacă prețul e deja normal: nu scrie nimic (idempotent)', async () => {
    campaignActive = false;
    rows = {
      'midea-solstice-9000-btu': { price: 2575, original_price: null, smartbill_code: SKU.nine },
      'midea-solstice-12000-btu': { price: 2685, original_price: null, smartbill_code: SKU.twelve },
    };
    updateCount = 0;
    failWriteFor = null;
    conflictFor = null;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));
    assert.equal(res.status, 200);
    assert.equal(updateCount, 0);
  });

  test('dacă un produs eșuează la scriere: 500, alertă trimisă, celălalt produs tot revine', async () => {
    campaignActive = false;
    rows = {
      'midea-solstice-9000-btu': { price: 2149, original_price: null, smartbill_code: SKU.nine },
      'midea-solstice-12000-btu': { price: 2294, original_price: null, smartbill_code: SKU.twelve },
    };
    updateCount = 0;
    failWriteFor = 'midea-solstice-9000-btu';
    conflictFor = null;
    alertCalls.length = 0;
    alertShouldThrow = false;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));
    const body = (await res.json()) as { ok: boolean; results: Array<{ slug: string; ok: boolean; error?: string }> };

    assert.equal(res.status, 500);
    assert.equal(body.ok, false);
    const nine = body.results.find((r) => r.slug === 'midea-solstice-9000-btu');
    const twelve = body.results.find((r) => r.slug === 'midea-solstice-12000-btu');
    assert.equal(nine?.ok, false);
    assert.equal(twelve?.ok, true, 'celălalt produs tot trebuie să fie revenit cu succes');
    assert.equal(alertCalls.length, 1, 'alerta trebuie trimisă când cel puțin un produs eșuează');
  });

  test('conflict (modificare administrativă concurentă) la un produs: raportat distinct, alertă trimisă, nicio suprascriere', async () => {
    campaignActive = false;
    rows = {
      'midea-solstice-9000-btu': { price: 2149, original_price: null, smartbill_code: SKU.nine },
      'midea-solstice-12000-btu': { price: 2294, original_price: null, smartbill_code: SKU.twelve },
    };
    updateCount = 0;
    failWriteFor = null;
    conflictFor = 'midea-solstice-9000-btu';
    alertCalls.length = 0;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));
    const body = (await res.json()) as { results: Array<{ slug: string; ok: boolean; conflict?: boolean }> };

    assert.equal(res.status, 500);
    const nine = body.results.find((r) => r.slug === 'midea-solstice-9000-btu');
    assert.equal(nine?.ok, false);
    assert.equal(nine?.conflict, true);
    assert.equal(rows['midea-solstice-9000-btu'].price, 2149, 'prețul NU trebuie suprascris în caz de conflict');
    assert.equal(alertCalls.length, 1);
  });

  test('dacă alertarea însăși eșuează (ex: Resend indisponibil), ruta tot răspunde coerent, fără să crape', async () => {
    campaignActive = false;
    rows = {
      'midea-solstice-9000-btu': { price: 2149, original_price: null, smartbill_code: SKU.nine },
      'midea-solstice-12000-btu': { price: 2294, original_price: null, smartbill_code: SKU.twelve },
    };
    updateCount = 0;
    failWriteFor = 'midea-solstice-9000-btu';
    conflictFor = null;
    alertCalls.length = 0;
    alertShouldThrow = true;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));
    assert.equal(res.status, 500);
    const body = (await res.json()) as { ok: boolean };
    assert.equal(body.ok, false);
    assert.equal(alertCalls.length, 1, 'tentativa de alertare tot trebuie încercată');

    alertShouldThrow = false;
  });
});
