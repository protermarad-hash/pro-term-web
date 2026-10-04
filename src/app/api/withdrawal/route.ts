import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';
import {
  buildWithdrawalStatement,
  validateWithdrawalInput,
} from '@/lib/withdrawal';
import {
  sendWithdrawalConfirmation,
  sendWithdrawalNotificationToAdmin,
  type WithdrawalEmailData,
} from '@/lib/withdrawal-email';

function responseError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return responseError('Datele transmise sunt invalide.');
  }

  const validation = validateWithdrawalInput(body);
  if (!validation.ok) return responseError(validation.error);
  const input = validation.value;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return responseError('Serviciul nu este configurat.', 500);

  const statement = buildWithdrawalStatement(input);

  const { data: existing, error: existingError } = await supabase
    .from('retrageri')
    .select('id, created_at, nume, numar_comanda, confirmation_email, declaratie, confirmation_email_sent_at')
    .eq('client_submission_id', input.submissionId)
    .maybeSingle();

  if (existingError) {
    console.error('[withdrawal] lookup error:', existingError);
    return responseError('Retragerea nu a putut fi verificată.', 500);
  }

  let row = existing;
  if (row) {
    const declaration = (row.declaratie ?? {}) as Record<string, unknown>;
    if (
      row.nume !== input.name ||
      row.numar_comanda !== input.orderNumber ||
      row.confirmation_email !== input.confirmationEmail ||
      declaration.statement !== statement
    ) {
      return responseError('Identificatorul retragerii a fost deja folosit pentru alte date.', 409);
    }
  } else {
    const confirmedAt = new Date().toISOString();
    const declaration = {
      version: 1,
      statement,
      name: input.name,
      orderNumber: input.orderNumber,
      confirmationEmail: input.confirmationEmail,
      details: input.details ?? null,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('retrageri')
      .insert({
        nume: input.name,
        email: input.confirmationEmail,
        numar_comanda: input.orderNumber,
        detalii: input.details ?? null,
        status: 'nou',
        client_submission_id: input.submissionId,
        declaratie: declaration,
        confirmation_email: input.confirmationEmail,
        confirmata_la: confirmedAt,
      })
      .select('id, created_at, nume, numar_comanda, confirmation_email, declaratie, confirmation_email_sent_at')
      .single();

    if (insertError || !inserted) {
      console.error('[withdrawal] insert error:', insertError);
      return responseError('Retragerea nu a putut fi înregistrată.', 500);
    }
    row = inserted;
  }

  const reference = `RET-${String(row.id).replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  const submittedAtIso = String(row.created_at);
  const emailData: WithdrawalEmailData = {
    reference,
    name: input.name,
    orderNumber: input.orderNumber,
    confirmationEmail: input.confirmationEmail,
    statement,
    details: input.details,
    submittedAtIso,
  };

  if (!row.confirmation_email_sent_at) {
    try {
      await sendWithdrawalConfirmation(emailData);
      const sentAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('retrageri')
        .update({ confirmation_email_sent_at: sentAt })
        .eq('id', row.id);
      if (updateError) console.error('[withdrawal] sent-at update error:', updateError);

      sendWithdrawalNotificationToAdmin(emailData).catch((error) =>
        console.error('[withdrawal] admin email error:', error instanceof Error ? error.message : error),
      );
    } catch (error) {
      console.error('[withdrawal] confirmation email error:', error instanceof Error ? error.message : error);
      return responseError(
        'Retragerea a fost înregistrată, dar confirmarea pe email nu a putut fi trimisă. Reîncearcă trimiterea confirmării.',
        502,
        { recorded: true, reference, submittedAt: submittedAtIso },
      );
    }
  }

  return NextResponse.json({ ok: true, reference, submittedAt: submittedAtIso });
}
