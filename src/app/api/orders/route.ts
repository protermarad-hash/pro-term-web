import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';
import { authenticateRequest } from '@/lib/server-auth';
import {
  createOrderConfirmationToken,
  ORDER_CONFIRMATION_COOKIE,
  ORDER_CONFIRMATION_MAX_AGE_SECONDS,
} from '@/lib/order-confirmation';
import { calculateShipping } from '@/lib/shipping';
import {
  sendOrderConfirmationToClient,
  sendOrderNotificationToAdmin,
  type OrderEmailData,
} from '@/lib/email';

export async function POST(request: Request) {
  const auth = await authenticateRequest(request, { optional: true });
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Server config error.' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalid.' }, { status: 400 });
  }

  const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'county'];
  for (const f of required) {
    if (!String(body[f] ?? '').trim()) {
      return NextResponse.json({ error: `Câmpul ${f} este obligatoriu.` }, { status: 400 });
    }
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 });
  }

  const subtotal = Number(body.subtotal) || 0;
  const shippingCost = calculateShipping(subtotal);
  const total = subtotal + shippingCost;
  const paymentMethod = ['ramburs', 'transfer'].includes(String(body.paymentMethod))
    ? String(body.paymentMethod)
    : 'ramburs';
  const confirmation = auth.user ? null : createOrderConfirmationToken();

  const orderPayload = {
    user_id: auth.user?.id ?? null,
    first_name: String(body.firstName).trim(),
    last_name: String(body.lastName).trim(),
    email: String(body.email).trim().toLowerCase(),
    phone: String(body.phone).trim(),
    address: String(body.address).trim(),
    city: String(body.city).trim(),
    county: String(body.county).trim(),
    postal_code: String(body.postalCode ?? '').trim(),
    notes: String(body.notes ?? '').trim(),
    items,
    subtotal,
    shipping_cost: shippingCost,
    total,
    payment_method: paymentMethod,
    status: 'nou',
    confirmation_token_hash: confirmation?.hash ?? null,
  };

  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select('id, created_at')
    .single();

  if (error) {
    console.error('[orders] insert error:', error);
    return NextResponse.json(
      { error: 'Comanda nu a putut fi salvată.' },
      { status: 500 },
    );
  }

  const orderRef = order.id.replace(/-/g, '').slice(0, 8).toUpperCase();

  const emailData: OrderEmailData = {
    orderId: order.id,
    orderRef,
    firstName: orderPayload.first_name,
    lastName: orderPayload.last_name,
    email: orderPayload.email,
    phone: orderPayload.phone,
    address: orderPayload.address,
    city: orderPayload.city,
    county: orderPayload.county,
    postalCode: orderPayload.postal_code,
    notes: orderPayload.notes,
    items: items as OrderEmailData['items'],
    subtotal,
    shippingCost,
    total,
    paymentMethod: paymentMethod as 'ramburs' | 'transfer',
  };

  // Emails trimise asincron — nu blochează răspunsul
  Promise.all([
    sendOrderConfirmationToClient(emailData).catch((e) =>
      console.error('[email] client error:', e?.message),
    ),
    sendOrderNotificationToAdmin(emailData).catch((e) =>
      console.error('[email] admin error:', e?.message),
    ),
  ]);

  const response = NextResponse.json({ orderId: order.id, orderRef });
  if (confirmation) {
    response.cookies.set({
      name: ORDER_CONFIRMATION_COOKIE,
      value: confirmation.token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: ORDER_CONFIRMATION_MAX_AGE_SECONDS,
      path: `/api/orders/${order.id}`,
    });
  }
  return response;
}
