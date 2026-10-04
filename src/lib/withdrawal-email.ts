import 'server-only';

import { Resend } from 'resend';

const ADMIN_EMAIL = 'proterm.arad@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'comenzi@pro-term.ro';

export type WithdrawalEmailData = {
  reference: string;
  name: string;
  orderNumber: string;
  confirmationEmail: string;
  statement: string;
  details?: string;
  submittedAtIso: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function withdrawalConfirmationHtml(d: WithdrawalEmailData): string {
  const localTime = new Date(d.submittedAtIso).toLocaleString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    dateStyle: 'long',
    timeStyle: 'medium',
  });

  return `<!doctype html>
<html lang="ro"><body style="font-family:Arial,Helvetica,sans-serif;color:#1f2937;line-height:1.6">
  <h2>Confirmare primire retragere — PRO TERM</h2>
  <p>Am primit declarația ta online de retragere din contract.</p>
  <p><strong>Referință:</strong> ${escapeHtml(d.reference)}<br>
  <strong>Data și ora transmiterii:</strong> ${escapeHtml(localTime)}</p>
  <div style="border:1px solid #d1d5db;border-radius:8px;padding:16px;background:#f9fafb">
    <p style="margin-top:0"><strong>Conținutul declarației:</strong></p>
    <p>${escapeHtml(d.statement)}</p>
    <p><strong>Nume:</strong> ${escapeHtml(d.name)}<br>
    <strong>Comandă/contract:</strong> ${escapeHtml(d.orderNumber)}<br>
    <strong>Email confirmare:</strong> ${escapeHtml(d.confirmationEmail)}</p>
    ${d.details ? `<p><strong>Detalii suplimentare:</strong><br>${escapeHtml(d.details)}</p>` : ''}
  </div>
  <p>Această confirmare este transmisă pe un suport durabil în conformitate cu OUG 34/2014, art. 11^1.</p>
  <p>Pentru întrebări: <a href="mailto:office@pro-term.ro">office@pro-term.ro</a> · 0749 025 610.</p>
</body></html>`;
}

export async function sendWithdrawalConfirmation(d: WithdrawalEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY lipsă.');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: d.confirmationEmail,
    subject: `Confirmare retragere ${d.reference} — PRO TERM`,
    html: withdrawalConfirmationHtml(d),
  });
  if (result.error) throw new Error(result.error.message || 'Trimiterea confirmării a eșuat.');
}

export async function sendWithdrawalNotificationToAdmin(d: WithdrawalEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    replyTo: d.confirmationEmail,
    subject: `Retragere online nouă ${d.reference} — ${d.name}`,
    html: withdrawalConfirmationHtml(d),
  });
}
