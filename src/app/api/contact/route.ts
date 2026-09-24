import { NextResponse } from 'next/server';
import { sendContactRequest } from '@/lib/email';

const MAX_NAME = 100;
const MAX_PHONE = 30;
const MAX_EMAIL = 200;
const MAX_INTEREST = 150;
const MAX_DETAILS = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_ERROR =
  'Solicitarea nu a putut fi trimisă. Te rugăm să încerci din nou sau să ne contactezi telefonic.';

function badRequest() {
  return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest();
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return badRequest();
  }

  const payload = body as Record<string, unknown>;

  // Honeypot: câmp invizibil pentru utilizatori reali. Dacă e completat, e un bot —
  // răspundem generic, fără să trimitem email și fără să dezvăluim mecanismul.
  const honeypot = payload.honeypot;
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { name, phone, email, interest, details } = payload;

  if (!isNonEmptyString(name) || name.trim().length > MAX_NAME) {
    return badRequest();
  }
  if (!isNonEmptyString(phone) || phone.trim().length > MAX_PHONE) {
    return badRequest();
  }

  let cleanEmail: string | undefined;
  if (email !== undefined && email !== null && email !== '') {
    if (typeof email !== 'string' || email.trim().length > MAX_EMAIL || !EMAIL_RE.test(email.trim())) {
      return badRequest();
    }
    cleanEmail = email.trim();
  }

  if (interest !== undefined && interest !== null) {
    if (typeof interest !== 'string' || interest.length > MAX_INTEREST) {
      return badRequest();
    }
  }
  if (details !== undefined && details !== null) {
    if (typeof details !== 'string' || details.length > MAX_DETAILS) {
      return badRequest();
    }
  }

  try {
    await sendContactRequest({
      name: name.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      interest: typeof interest === 'string' ? interest.trim() : '',
      details: typeof details === 'string' ? details.trim() : '',
    });
  } catch (err) {
    console.error('[contact] send error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
