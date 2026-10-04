import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';
import { fetchProductGuaranteeInfo } from '@/lib/consumer-guarantee-server';
import { getDurabilityLabel, type DurabilityLabelData } from '@/lib/consumer-guarantee';

export const dynamic = 'force-dynamic';

/**
 * Checkout needs fresh EU GARAN label data for the cart items (OUG 34/2014
 * art. 8 alin. (2): shown "imediat înainte ca acesta să plaseze comanda"),
 * because cart items are persisted in the browser and may be stale.
 * Returns only eligible products, and only the fields printed on the label.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get('ids') ?? '').split(',');

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ labels: {} });
  }

  const guarantees = await fetchProductGuaranteeInfo(supabase, ids);
  const labels: Record<string, DurabilityLabelData> = {};
  guarantees.forEach((info, id) => {
    const label = getDurabilityLabel(info);
    if (label) labels[id] = label;
  });

  return NextResponse.json({ labels }, { headers: { 'Cache-Control': 'no-store' } });
}
