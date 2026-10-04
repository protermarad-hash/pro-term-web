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
    const source = readFileSync(
      path.join(process.cwd(), 'src/app/formular-retragere/FormularRetragereClient.tsx'),
      'utf8',
    );
    assert.ok(source.includes('data-testid="withdrawal-entry"'));
    assert.ok(source.includes('data-testid="withdrawal-confirm"'));
    assert.ok(source.includes(WITHDRAWAL_CONFIRM_LABEL));
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
