import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

const VALID_STATUSES = ['nou', 'confirmat', 'in-livrare', 'livrat', 'anulat'] as const;

export async function GET() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server config error.' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, first_name, last_name, email, phone, city, county, total, payment_method, status, items')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    if (error.code === '42P01') {
      return NextResponse.json({ orders: [], warning: 'Tabela orders nu există. Rulează scripts/create-orders-table.sql.' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(request: Request) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server config error.' }, { status: 500 });
  }

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
