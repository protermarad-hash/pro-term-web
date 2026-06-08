import { Resend } from 'resend';

const IBAN = 'RO15BTRLRONCRT0CK3829101';
const ADMIN_EMAIL = 'proterm.arad@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'comenzi@pro-term.ro';

export type OrderEmailData = {
  orderId: string;
  orderRef: string; // e.g. "2778C492"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postalCode: string;
  notes: string;
  items: Array<{ name: string; quantity: number; price: number; line_total: number }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'ramburs' | 'transfer';
};

function fmt(n: number) {
  return n.toLocaleString('ro-RO') + ' RON';
}

function itemsTable(items: OrderEmailData['items']) {
  return items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f5f5;font-size:14px;">${i.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f5f5;text-align:center;font-size:14px;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f5f5;text-align:right;font-size:14px;">${fmt(i.price)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f5f5f5;text-align:right;font-weight:600;font-size:14px;">${fmt(i.line_total)}</td>
      </tr>`
    )
    .join('');
}

function paymentInfo(d: OrderEmailData) {
  if (d.paymentMethod === 'transfer') {
    return `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-weight:700;color:#1d4ed8;margin:0 0 8px;">Transfer bancar</p>
        <p style="margin:4px 0;font-size:14px;">IBAN: <strong>${IBAN}</strong></p>
        <p style="margin:4px 0;font-size:14px;">Beneficiar: PRO TERM SRL</p>
        <p style="margin:4px 0;font-size:14px;">Referință: <strong>Comanda #${d.orderRef}</strong></p>
        <p style="margin:4px 0;font-size:14px;">Suma: <strong>${fmt(d.total)}</strong></p>
        <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">Comanda se confirmă după recepționarea plății.</p>
      </div>`;
  }
  return `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="font-weight:700;color:#15803d;margin:0 0 4px;">Plată la livrare (ramburs)</p>
      <p style="margin:0;font-size:14px;color:#374151;">Vei achita <strong>${fmt(d.total)}</strong> curierului la livrare.</p>
    </div>`;
}

function buildClientHtml(d: OrderEmailData) {
  return `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
  <tr><td style="background:linear-gradient(135deg,#0066cc,#0052a3);padding:32px 40px;">
    <h1 style="color:#fff;margin:0;font-size:24px;">PRO TERM SRL</h1>
    <p style="color:#93c5fd;margin:4px 0 0;font-size:14px;">Sisteme de climatizare și termoficare</p>
  </td></tr>
  <tr><td style="padding:32px 40px;">
    <h2 style="color:#1f2937;font-size:20px;margin:0 0 8px;">Comanda #${d.orderRef} confirmată!</h2>
    <p style="color:#6b7280;margin:0 0 24px;">Mulțumim, <strong>${d.firstName}</strong>! Comanda ta a fost înregistrată cu succes.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Produs</th>
          <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Cant.</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Preț/buc</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsTable(d.items)}</tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:4px 0;font-size:14px;color:#6b7280;">Subtotal produse</td><td style="padding:4px 0;font-size:14px;text-align:right;">${fmt(d.subtotal)}</td></tr>
      <tr><td style="padding:4px 0;font-size:14px;color:#6b7280;">Transport</td><td style="padding:4px 0;font-size:14px;text-align:right;">${d.shippingCost === 0 ? '<span style="color:#16a34a;font-weight:600;">GRATUIT</span>' : fmt(d.shippingCost)}</td></tr>
      <tr><td style="padding:8px 0 4px;font-size:16px;font-weight:700;border-top:2px solid #f0f0f0;">Total de plată</td><td style="padding:8px 0 4px;font-size:16px;font-weight:700;text-align:right;border-top:2px solid #f0f0f0;">${fmt(d.total)}</td></tr>
    </table>

    ${paymentInfo(d)}

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:24px 0;">
      <p style="font-weight:700;color:#374151;margin:0 0 8px;font-size:14px;">Adresa de livrare</p>
      <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">${d.firstName} ${d.lastName}<br>${d.address}<br>${d.city}, ${d.county}${d.postalCode ? ', ' + d.postalCode : ''}</p>
    </div>

    <p style="color:#374151;font-size:14px;margin:24px 0 8px;">Te vom contacta la <strong>${d.phone}</strong> pentru confirmarea livrării.</p>
    <p style="color:#6b7280;font-size:13px;margin:0;">Ai întrebări? Sună la <strong>0749 025 610</strong> sau scrie la <a href="mailto:office@pro-term.ro" style="color:#0066cc;">office@pro-term.ro</a>.</p>
  </td></tr>
  <tr><td style="background:#f9fafb;padding:20px 40px;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">PRO TERM SRL · Arad · 0749 025 610 · office@pro-term.ro</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildAdminHtml(d: OrderEmailData) {
  return `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
  <tr><td style="background:#1f2937;padding:24px 40px;">
    <h1 style="color:#fff;margin:0;font-size:20px;">Comandă nouă #${d.orderRef}</h1>
    <p style="color:#9ca3af;margin:4px 0 0;font-size:13px;">Total: <strong style="color:#fff;">${fmt(d.total)}</strong> · ${d.paymentMethod === 'transfer' ? 'Transfer bancar' : 'Ramburs'}</p>
  </td></tr>
  <tr><td style="padding:28px 40px;">
    <h3 style="color:#374151;font-size:15px;margin:0 0 12px;">Date client</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:24px;">
      <tr><td style="padding:4px 0;color:#6b7280;width:140px;">Nume</td><td style="padding:4px 0;font-weight:600;">${d.firstName} ${d.lastName}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="padding:4px 0;">${d.email}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Telefon</td><td style="padding:4px 0;font-weight:600;">${d.phone}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Adresă</td><td style="padding:4px 0;">${d.address}, ${d.city}, ${d.county}${d.postalCode ? ' ' + d.postalCode : ''}</td></tr>
      ${d.notes ? `<tr><td style="padding:4px 0;color:#6b7280;">Mențiuni</td><td style="padding:4px 0;">${d.notes}</td></tr>` : ''}
    </table>

    <h3 style="color:#374151;font-size:15px;margin:0 0 12px;">Produse comandate</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;">Produs</th>
          <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;">Cant.</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${d.items.map((i) => `<tr><td style="padding:8px 12px;border-top:1px solid #f5f5f5;font-size:14px;">${i.name}</td><td style="padding:8px 12px;border-top:1px solid #f5f5f5;text-align:center;font-size:14px;">${i.quantity}</td><td style="padding:8px 12px;border-top:1px solid #f5f5f5;text-align:right;font-weight:600;font-size:14px;">${fmt(i.line_total)}</td></tr>`).join('')}
      </tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr><td style="padding:3px 0;font-size:14px;color:#6b7280;">Subtotal</td><td style="padding:3px 0;font-size:14px;text-align:right;">${fmt(d.subtotal)}</td></tr>
      <tr><td style="padding:3px 0;font-size:14px;color:#6b7280;">Transport</td><td style="padding:3px 0;font-size:14px;text-align:right;">${d.shippingCost === 0 ? 'GRATUIT' : fmt(d.shippingCost)}</td></tr>
      <tr><td style="padding:6px 0 0;font-size:16px;font-weight:700;border-top:2px solid #f0f0f0;">TOTAL</td><td style="padding:6px 0 0;font-size:16px;font-weight:700;text-align:right;border-top:2px solid #f0f0f0;">${fmt(d.total)}</td></tr>
    </table>

    <p style="font-size:14px;color:#374151;">Metodă plată: <strong>${d.paymentMethod === 'transfer' ? 'Transfer bancar' : 'Ramburs'}</strong></p>
    <p style="font-size:13px;color:#6b7280;margin:0;">ID comandă: ${d.orderId}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendOrderConfirmationToClient(d: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY lipsă — email client nesent');
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: d.email,
    subject: `Comanda #${d.orderRef} confirmată — PRO TERM`,
    html: buildClientHtml(d),
  });
}

export async function sendOrderNotificationToAdmin(d: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY lipsă — email admin nesent');
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Comandă nouă #${d.orderRef} — ${d.firstName} ${d.lastName}`,
    html: buildAdminHtml(d),
  });
}
