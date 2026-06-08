import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const FROM = 'PRO TERM SRL <noreply@pro-term.ro>';
const TO_BUSINESS = 'proterm.arad@gmail.com';

function refNumber(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RET-${new Date().getFullYear()}-${rand}`;
}

function businessHtml(d: Record<string, string>, ref: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1e293b">
      <div style="background:#1e3a5f;padding:24px 32px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">Cerere retragere din contract</h1>
        <p style="color:#94a3b8;margin:6px 0 0;font-size:14px">Referință: <strong style="color:#f97316">${ref}</strong></p>
      </div>
      <div style="background:#f8fafc;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">

        <h2 style="font-size:14px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin:0 0 16px">Date consumator</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${row('Nume și prenume', d.name)}
          ${row('Adresă', d.address)}
          ${row('Telefon', d.phone)}
          ${row('Email', d.email)}
        </table>

        <h2 style="font-size:14px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin:0 0 16px">Date comandă</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${row('Număr comandă', d.orderNumber)}
          ${row('Produse returnate', d.products)}
          ${row('Cantitate', d.quantity)}
          ${row('Preț plătit', `${d.pricePaid} RON`)}
          ${row('Data comenzii', d.orderDate)}
          ${row('Data primirii', d.deliveryDate)}
          ${row('Motiv retragere', d.reason)}
        </table>

        ${d.details ? `<h2 style="font-size:14px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin:0 0 8px">Detalii suplimentare</h2><p style="margin:0 0 24px;font-size:14px">${d.details}</p>` : ''}

        <h2 style="font-size:14px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin:0 0 16px">Rambursare</h2>
        <table style="width:100%;border-collapse:collapse">
          ${row('Metoda preferată', d.refundMethod)}
          ${d.iban ? row('IBAN', d.iban) : ''}
        </table>

        <p style="margin:32px 0 0;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px">
          Cerere transmisă electronic prin formularul de pe pro-term.ro la ${new Date().toLocaleString('ro-RO')}.
        </p>
      </div>
    </div>
  `;
}

function clientHtml(d: Record<string, string>, ref: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
      <div style="background:#1e3a5f;padding:24px 32px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">Cererea dvs. a fost înregistrată</h1>
      </div>
      <div style="background:#f8fafc;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">
        <p>Stimate/Stimată <strong>${d.name}</strong>,</p>
        <p>Am primit cererea dvs. de retragere din contract. Aceasta a fost înregistrată cu numărul de referință:</p>
        <div style="text-align:center;padding:20px;background:#fff;border-radius:10px;border:2px dashed #f97316;margin:20px 0">
          <span style="font-size:24px;font-weight:700;color:#f97316;letter-spacing:.05em">${ref}</span>
        </div>
        <p>Vom analiza cererea și vă vom contacta în cel mult <strong>14 zile lucrătoare</strong> la adresa de email sau telefon furnizate, cu detalii privind procesul de returnare și rambursare.</p>
        <p style="margin-top:24px">Datele înregistrate:</p>
        <ul style="font-size:14px;color:#475569;line-height:1.8">
          <li>Comandă nr.: <strong>${d.orderNumber}</strong></li>
          <li>Produse: <strong>${d.products}</strong></li>
          <li>Motiv: <strong>${d.reason}</strong></li>
          <li>Metodă rambursare: <strong>${d.refundMethod}</strong></li>
        </ul>
        <p style="margin-top:24px;font-size:14px;color:#64748b">
          Dacă aveți întrebări suplimentare, ne puteți contacta la<br>
          <a href="tel:+40749025610" style="color:#f97316">0749 025 610</a> sau
          <a href="mailto:proterm.arad@gmail.com" style="color:#f97316">proterm.arad@gmail.com</a>
        </p>
        <p style="margin-top:32px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px">
          PRO TERM SRL · pro-term.ro · Arad, România
        </p>
      </div>
    </div>
  `;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px;background:#fff;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:40%;font-weight:600">${label}</td>
      <td style="padding:8px 12px;background:#fff;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b">${value}</td>
    </tr>
  `;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Serviciul de email nu este configurat. Contactați-ne la 0749 025 610.' },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  }

  const required = [
    'name', 'address', 'phone', 'email',
    'orderNumber', 'products', 'quantity', 'pricePaid',
    'orderDate', 'deliveryDate', 'reason', 'refundMethod',
  ];
  for (const field of required) {
    if (!data[field]?.trim()) {
      return NextResponse.json({ error: `Câmpul "${field}" este obligatoriu.` }, { status: 400 });
    }
  }
  if (data.refundMethod === 'Transfer bancar' && !data.iban?.trim()) {
    return NextResponse.json({ error: 'IBAN-ul este obligatoriu pentru transfer bancar.' }, { status: 400 });
  }

  const ref = refNumber();

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: TO_BUSINESS,
        replyTo: data.email,
        subject: `[${ref}] Retragere contract — ${data.name} — Cmd ${data.orderNumber}`,
        html: businessHtml(data, ref),
      }),
      resend.emails.send({
        from: FROM,
        to: data.email,
        subject: `Cerere retragere înregistrată [${ref}] — PRO TERM SRL`,
        html: clientHtml(data, ref),
      }),
    ]);
  } catch (err) {
    console.error('[retragere] Resend error:', err);
    return NextResponse.json(
      { error: 'Eroare la trimiterea emailului. Încercați din nou sau contactați-ne direct.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ref });
}
