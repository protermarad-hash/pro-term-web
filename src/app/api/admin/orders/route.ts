import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';

const VALID_STATUSES = ['nou', 'confirmat', 'in-livrare', 'livrat', 'anulat'] as const;

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, first_name, last_name, email, phone, city, county, total, payment_method, status, items')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'Nu am putut încărca comenzile.' }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;
  const supabase = admin.serviceClient;

  const body = await request.json();
  const { id, status } = body;

  if (!id) return NextResponse.json({ error: 'ID lipsă.' }, { status: 400 });
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Status invalid. Valori acceptate: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error) return NextResponse.json({ error: 'Statusul comenzii nu a putut fi actualizat.' }, { status: 500 });
  return NextResponse.json({ order: data });
}
