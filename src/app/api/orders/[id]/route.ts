import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server config error.' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Comanda nu a fost găsită.' }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
