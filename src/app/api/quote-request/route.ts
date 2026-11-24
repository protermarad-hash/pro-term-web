import { NextResponse } from 'next/server';
import { sendQuoteRequest } from '@/lib/email';
import { validateQuoteRequest } from '@/lib/quote-request';

const GENERIC_ERROR =
  'Cererea nu a putut fi trimisă. Te rugăm să încerci din nou sau să ne contactezi telefonic la 0749 025 610.';
const INVALID_ERROR = 'Verifică datele completate în formular și încearcă din nou.';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: INVALID_ERROR }, { status: 400 });
  }

  const result = validateQuoteRequest(body);

  if (!result.ok) {
    // Honeypot filled: answer like a success without sending anything.
    if ('spam' in result) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: INVALID_ERROR, field: result.field }, { status: 400 });
  }

  try {
    await sendQuoteRequest(result.data);
  } catch (err) {
    console.error('[quote-request] send error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
