import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';
import {
  WITHDRAWAL_CONFIRM_LABEL,
  WITHDRAWAL_ENTRY_LABEL,
  buildWithdrawalStatement,
  validateWithdrawalInput,
} from '@/lib/withdrawal';
import { withdrawalConfirmationHtml } from '@/lib/withdrawal-email';

describe('online withdrawal function – OUG 34/2014 art. 11^1', () => {
  it('keeps the withdrawal function visibly available from the global footer', () => {
    const html = renderToStaticMarkup(<AuthProvider><Footer /></AuthProvider>);
    assert.ok(html.includes(`href="/formular-retragere"`));
    assert.ok(html.includes(WITHDRAWAL_ENTRY_LABEL));
  });

  it('requires only the legal identification fields and validates them', () => {
    const good = validateWithdrawalInput({
      submissionId: '11111111-1111-4111-8111-111111111111',
      name: 'Ion Popescu',
      orderNumber: 'CMD-123',
      confirmationEmail: 'ION@example.ro',
    });
    assert.equal(good.ok, true);
    if (good.ok) assert.equal(good.value.confirmationEmail, 'ion@example.ro');

    assert.equal(validateWithdrawalInput({}).ok, false);
  });

  it('builds an unequivocal declaration', () => {
    assert.match(
      buildWithdrawalStatement({ name: 'Ion Popescu', orderNumber: 'CMD-123' }),
      /mă retrag din contractul\/comanda/,
    );
  });

  it('uses a distinct second confirmation function', () => {
    // Checks the actual wiring (which function each step's action calls),
    // not the presence of a literal string in the file — the component only
    // ever references the label through the imported WITHDRAWAL_CONFIRM_LABEL
    // constant, so searching for the literal text can never match.
    const source = readFileSync(
      path.join(process.cwd(), 'src/app/formular-retragere/FormularRetragereClient.tsx'),
      'utf8',
    );

    const entryButton = source.match(/<button[^>]*data-testid="withdrawal-entry"[\s\S]{0,500}?<\/button>/)?.[0];
    const confirmButton = source.match(/<button[^>]*data-testid="withdrawal-confirm"[\s\S]{0,500}?<\/button>/)?.[0];
    assert.ok(entryButton, 'step 1 "withdrawal-entry" button not found');
    assert.ok(confirmButton, 'step 2 "withdrawal-confirm" button not found');

    // Step 1 is a plain form submit (type="submit"); its handler lives on the
    // enclosing <form onSubmit={...}>, not on the button itself.
    const entryHandler = source.match(/<form[^>]*onSubmit=\{(\w+)\}[\s\S]*?data-testid="withdrawal-entry"/)?.[1];
    const confirmHandler = confirmButton?.match(/onClick=\{(\w+)\}/)?.[1];
    assert.ok(entryHandler, 'step 1 submit handler not found');
    assert.ok(confirmHandler, 'step 2 confirm handler not found');
    assert.notEqual(confirmHandler, entryHandler, 'the two steps must use distinct handler functions');

    // The confirm step's handler must be the one doing the actual submission.
    const confirmHandlerBody = source.match(
      new RegExp(`function ${confirmHandler}\\s*\\([\\s\\S]*?\\n  \\}`),
    )?.[0];
    assert.ok(confirmHandlerBody?.includes("fetch('/api/withdrawal'"), 'confirm handler must perform the actual withdrawal submission');

    // The entry step only validates and advances to step 2 — it must not
    // itself call the withdrawal API (that would collapse the two steps).
    const entryHandlerBody = source.match(
      new RegExp(`function ${entryHandler}\\s*\\([\\s\\S]*?\\n  \\}`),
    )?.[0];
    assert.ok(entryHandlerBody && !entryHandlerBody.includes("fetch('/api/withdrawal'"), 'entry handler must not submit the withdrawal itself');

    // The confirm button renders the shared label constant (not a duplicated
    // string), and that constant itself must be a real, non-empty label.
    assert.match(confirmButton as string, /WITHDRAWAL_CONFIRM_LABEL/);
    assert.ok(WITHDRAWAL_CONFIRM_LABEL.trim().length > 0, 'WITHDRAWAL_CONFIRM_LABEL must not be empty');
  });

  it('durable-medium email contains declaration, contract, reference and transmission timestamp', () => {
    const html = withdrawalConfirmationHtml({
      reference: 'RET-ABC12345',
      name: 'Ion Popescu',
      orderNumber: 'CMD-123',
      confirmationEmail: 'ion@example.ro',
      statement: 'Declarație test',
      submittedAtIso: '2026-10-04T12:00:00.000Z',
    });
    for (const expected of ['RET-ABC12345', 'Ion Popescu', 'CMD-123', 'Declarație test', 'Data și ora transmiterii']) {
      assert.ok(html.includes(expected), expected);
    }
  });
});
