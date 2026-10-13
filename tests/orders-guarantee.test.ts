// Server-side GARAN fail-closed gate for /api/orders (OUG 34/2014 art. 8
// alin. (2)): the checkout UI already blocks on a failed/loading guarantee
// check, but that is only a client-side convenience. These tests call the
// real POST handler directly — exactly like a request that never passed
// through CheckoutClient — with a fake Supabase client, to prove the server
// itself refuses the order when the guarantee check cannot be trusted.
import { test, describe, before, mock } from 'node:test';
import assert from 'node:assert/strict';
import { GUARANTEE_CHECK_ERROR_MESSAGE } from '@/lib/guarantee-label-check';
import type { POST as PostHandler } from '@/app/api/orders/route';

type ProductRow = Record<string, unknown>;
type Scenario = {
  productsError: { code?: string; message?: string } | null;
  productsRows: ProductRow[];
};

let scenario: Scenario = { productsError: null, productsRows: [] };
let ordersInsertCalled = false;

function makeBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: () => builder,
    in: () => builder,
    eq: () => builder,
    insert: () => {
      ordersInsertCalled = true;
      return builder;
    },
    single: () => builder,
    then: (onFulfilled: (v: unknown) => unknown, onRejected?: (e: unknown) => unknown) =>
      Promise.resolve(result).then(onFulfilled, onRejected),
  };
  return builder;
}

const fakeSupabase = {
  from(table: string) {
    if (table === 'products') {
      return makeBuilder({
        data: scenario.productsError ? null : scenario.productsRows,
        error: scenario.productsError,
      });
    }
    if (table === 'orders') {
      return makeBuilder({ data: { id: 'test-order-id', created_at: new Date().toISOString() }, error: null });
    }
    throw new Error(`Unexpected table in test fake: ${table}`);
  },
};

let POST: typeof PostHandler;

before(async () => {
  mock.module('@/lib/supabase-admin', {
    namedExports: { getSupabaseServiceClient: () => fakeSupabase },
  });
  ({ POST } = await import('@/app/api/orders/route'));
});

const BASE_FIELDS = {
  firstName: 'Ion',
  lastName: 'Popescu',
  email: 'ion@example.ro',
  phone: '0712345678',
  address: 'Str. Exemplu 1',
  city: 'Arad',
  county: 'Arad',
};

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const ELIGIBLE_PRODUCT_ID = '11111111-1111-4111-8111-111111111111';
const PLAIN_PRODUCT_ID = '22222222-2222-4222-8222-222222222222';

describe('/api/orders — GARAN server-side fail-closed gate', () => {
  test('Test 1 — eligible product, guarantee data valid: order proceeds', async () => {
    ordersInsertCalled = false;
    scenario = {
      productsError: null,
      productsRows: [
        {
          id: ELIGIBLE_PRODUCT_ID,
          durability_guarantee_eligible: true,
          durability_guarantee_years: 5,
          manufacturer_name: 'Gree',
          manufacturer_model_identifier: 'GWH12',
        },
      ],
    };
    const res = await POST(
      makeRequest({
        ...BASE_FIELDS,
        items: [{ id: ELIGIBLE_PRODUCT_ID, name: 'AC', price: 1000, quantity: 1 }],
        subtotal: 1000,
      }),
    );
    assert.equal(res.status, 200);
    assert.equal(ordersInsertCalled, true, 'order should be created once GARAN is verified');
  });

  test('Test 2 — guarantee verification fails (DB error): order refused', async () => {
    ordersInsertCalled = false;
    scenario = { productsError: { code: '500', message: 'connection reset' }, productsRows: [] };
    const res = await POST(
      makeRequest({
        ...BASE_FIELDS,
        items: [{ id: PLAIN_PRODUCT_ID, name: 'AC', price: 1000, quantity: 1 }],
        subtotal: 1000,
      }),
    );
    assert.equal(res.status, 503);
    const data = (await res.json()) as { error?: string };
    assert.equal(data.error, GUARANTEE_CHECK_ERROR_MESSAGE);
    assert.equal(ordersInsertCalled, false, 'no order should be created on a failed check');
  });

  test('Test 3 — direct POST bypassing the checkout UI: same protection applies', async () => {
    // Nothing here goes through CheckoutClient/useGuaranteeLabelCheck — this
    // is exactly the "curl straight at /api/orders" scenario from the audit.
    ordersInsertCalled = false;
    scenario = { productsError: { code: '500', message: 'simulated outage' }, productsRows: [] };
    const res = await POST(
      makeRequest({
        ...BASE_FIELDS,
        items: [{ id: PLAIN_PRODUCT_ID, name: 'AC', price: 1000, quantity: 1 }],
        subtotal: 1000,
      }),
    );
    assert.equal(res.status, 503);
    assert.equal(ordersInsertCalled, false, 'direct API bypass must not create an order');
  });

  test('Test 4 — eligible product, guarantee data incomplete/invalid: order refused', async () => {
    ordersInsertCalled = false;
    scenario = {
      productsError: null,
      productsRows: [
        {
          id: ELIGIBLE_PRODUCT_ID,
          durability_guarantee_eligible: true,
          durability_guarantee_years: null,
          manufacturer_name: 'Gree',
          manufacturer_model_identifier: null,
        },
      ],
    };
    const res = await POST(
      makeRequest({
        ...BASE_FIELDS,
        items: [{ id: ELIGIBLE_PRODUCT_ID, name: 'AC', price: 1000, quantity: 1 }],
        subtotal: 1000,
      }),
    );
    assert.equal(res.status, 503);
    assert.equal(ordersInsertCalled, false, 'eligible product with unconfirmable data must block the order');
  });

  test('Test 5 — product that does not need the GARAN label: verified correctly, order proceeds', async () => {
    ordersInsertCalled = false;
    scenario = {
      productsError: null,
      productsRows: [{ id: PLAIN_PRODUCT_ID, durability_guarantee_eligible: false }],
    };
    const res = await POST(
      makeRequest({
        ...BASE_FIELDS,
        items: [{ id: PLAIN_PRODUCT_ID, name: 'Centrală', price: 500, quantity: 1 }],
        subtotal: 500,
      }),
    );
    assert.equal(res.status, 200);
    assert.equal(ordersInsertCalled, true, 'a confirmed non-eligible product must not block the order');
  });

  test('Test 6 — invalid/manipulated payload (item without id): rejected before any guarantee check', async () => {
    ordersInsertCalled = false;
    scenario = { productsError: null, productsRows: [] };
    const res = await POST(
      makeRequest({
        ...BASE_FIELDS,
        items: [{ quantity: 1 }],
        subtotal: 500,
      }),
    );
    assert.equal(res.status, 400);
    assert.equal(ordersInsertCalled, false);
  });

  test('migration not yet applied (missing column): no product can be eligible, order proceeds', async () => {
    ordersInsertCalled = false;
    scenario = { productsError: { code: '42703', message: 'column does not exist' }, productsRows: [] };
    const res = await POST(
      makeRequest({
        ...BASE_FIELDS,
        items: [{ id: PLAIN_PRODUCT_ID, name: 'AC', price: 1000, quantity: 1 }],
        subtotal: 1000,
      }),
    );
    assert.equal(res.status, 200);
    assert.equal(ordersInsertCalled, true);
  });
});
