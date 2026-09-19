import { NextRequest, NextResponse } from 'next/server';
import {
  ORDER_CONFIRMATION_COOKIE,
  orderConfirmationTokenMatches,
} from '@/lib/order-confirmation';
import { authenticateRequest, userIsAdmin } from '@/lib/server-auth';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';

const ORDER_COLUMNS = [
  'id',
  'created_at',
  'first_name',
  'last_name',
  'email',
  'phone',
  'address',
  'city',
  'county',
  'postal_code',
  'notes',
  'items',
  'subtotal',
  'shipping_cost',
  'total',
  'payment_method',
  'status',
] as const;

const INTERNAL_ORDER_COLUMNS = 'id, created_at, first_name, last_name, email, phone, address, city, county, postal_code, notes, items, subtotal, shipping_cost, total, payment_method, status, user_id, confirmation_token_hash';

// One response for every "you can't see this order" outcome (missing, wrong owner,
// not admin, bad or mismatched token) so the status code never discloses whether
// the order ID actually exists.
function orderNotFound() {
  return NextResponse.json({ error: 'Comanda nu a fost găsită.' }, { status: 404 });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateRequest(request, { optional: true });
  if (!auth.ok) return auth.response;

  const confirmationToken = request.cookies.get(ORDER_CONFIRMATION_COOKIE)?.value;
  if (!auth.user && !confirmationToken) {
    return NextResponse.json({ error: 'Autentificare necesară.' }, { status: 401 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server config error.' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select(INTERNAL_ORDER_COLUMNS)
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'Comanda nu a putut fi încărcată.' }, { status: 500 });
  }
  if (!data) {
    return orderNotFound();
  }

  let allowed = auth.user?.id === data.user_id;

  if (auth.user && !allowed) {
    const admin = await userIsAdmin(auth.userClient!, auth.user.id);
    if (!admin.ok) {
      return NextResponse.json({ error: 'Eroare internă de autorizare.' }, { status: 500 });
    }
    allowed = admin.isAdmin;
  }

  if (!allowed && confirmationToken && data.confirmation_token_hash) {
    allowed = orderConfirmationTokenMatches(confirmationToken, data.confirmation_token_hash);
  }

  if (!allowed) {
    return orderNotFound();
  }

  const order = Object.fromEntries(ORDER_COLUMNS.map((column) => [column, data[column]]));
  return NextResponse.json({ order });
}
