import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  GuaranteeCheckError,
  fetchGuaranteeLabels,
  guaranteeLabelsUrl,
  parseGuaranteeLabelsResponse,
} from '@/lib/guarantee-label-check';

const label = { years: 5, yearsLabel: '5', manufacturerName: 'Producător Test', modelIdentifier: 'MODEL-X1' };
const id = '11111111-1111-4111-8111-111111111111';

function mockFetch(handler: () => Promise<Response>): typeof fetch {
  return (() => handler()) as unknown as typeof fetch;
}
const json = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }));

describe('GARAN verification for checkout is fail-closed', () => {
  it('returns the labels of a valid response', async () => {
    assert.deepEqual(await fetchGuaranteeLabels([id], mockFetch(() => json({ labels: { [id]: label } }))), { [id]: label });
  });

  it('accepts a valid response without eligible products as "no labels"', async () => {
    assert.deepEqual(await fetchGuaranteeLabels([id], mockFetch(() => json({ labels: {} }))), {});
  });

  it('treats HTTP errors as errors, never as "no labels"', async () => {
    for (const status of [500, 503, 404]) {
      await assert.rejects(fetchGuaranteeLabels([id], mockFetch(() => json({ labels: {} }, status))), GuaranteeCheckError);
    }
  });

  it('treats network errors as errors', async () => {
    await assert.rejects(fetchGuaranteeLabels([id], mockFetch(() => Promise.reject(new TypeError('Failed to fetch')))));
  });

  it('rejects malformed payloads', () => {
    for (const payload of [null, {}, { labels: null }, { labels: [] }, { labels: { [id]: { ...label, years: 2 } } }, { labels: { [id]: { ...label, manufacturerName: '' } } }, { labels: { [id]: { ...label, yearsLabel: '7' } } }]) {
      assert.throws(() => parseGuaranteeLabelsResponse(payload), GuaranteeCheckError, JSON.stringify(payload));
    }
  });

  it('requests the exact cart ids', () => {
    assert.equal(guaranteeLabelsUrl(['b', 'a']), '/api/products/guarantee-labels?ids=a%2Cb');
  });
});

describe('CheckoutClient gates the order on the GARAN check', () => {
  const source = readFileSync(path.join(process.cwd(), 'src/app/checkout/CheckoutClient.tsx'), 'utf8');

  it('blocks handleSubmit before any request to /api/orders unless the check is ready', () => {
    const submit = source.slice(source.indexOf('async function handleSubmit'));
    const guard = submit.indexOf("if (guaranteeCheck.status !== 'ready')");
    const post = submit.indexOf("fetch('/api/orders'");
    assert.ok(guard > 0 && post > guard, 'guard precedes the POST');
    assert.match(submit.slice(guard, post), /return;/);
  });

  it('disables the order button unless the check is ready', () => {
    assert.match(source, /disabled=\{submitting \|\| guaranteeCheck\.status !== 'ready'\}/);
  });
});
