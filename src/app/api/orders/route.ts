import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { calculateShipping } from '@/lib/shipping';
import {
  sendOrderConfirmationToClient,
  sendOrderNotificationToAdmin,
  type OrderEmailData,
} from '@/lib/email';

export async function POST(request: Request) {
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

  const orderPayload = {
    user_id: body.userId ? String(body.userId) : null,
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
  };

  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select('id, created_at')
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.code === '42P01' ? 'Tabela orders nu există. Rulează scripts/create-orders-table.sql în Supabase SQL Editor.' : error.message },
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
    sendOrderConfirmationToClient(emailData).catch(() => {}),
    sendOrderNotificationToAdmin(emailData).catch(() => {}),
  ]);

  return NextResponse.json({ orderId: order.id, orderRef });
}
