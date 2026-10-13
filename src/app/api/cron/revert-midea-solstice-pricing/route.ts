import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase-admin';
import { isMideaSolsticeCampaignActive } from '@/lib/campaigns/midea-solstice';
import { applyMideaSolsticePricing } from '@/lib/campaigns/midea-solstice-server';
import { sendMideaSolsticeRevertAlert } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * Revenire automată la prețurile normale pentru Midea Solstice, după
 * expirarea campaniei (30.10.2026, 23:59:59 Europe/Bucharest). Declanșat de
 * Vercel Cron (vezi vercel.json) — NEACTIVAT încă (fișierul vercel.json nu a
 * fost încă publicat/deploy-uit).
 *
 * Protecție: necesită CRON_SECRET (același mecanism documentat de Vercel
 * pentru rute de cron). Fail-closed dacă secretul lipsește din configurație.
 *
 * Idempotent și condiționat: dacă prețul e deja cel normal, nu scrie nimic;
 * dacă rândul s-a schimbat față de ce a fost citit (ex: modificare din admin
 * între timp), scrierea e refuzată, nu suprascrisă (vezi
 * applyMideaSolsticePricing). Rulările repetate (zilnice) sunt sigure.
 *
 * Dacă o scriere eșuează sau e respinsă ca „conflict”, prețul de campanie
 * rămâne activ până la intervenție manuală — alegere deliberată: mai sigur
 * să rămână prețul redus puțin mai mult decât să suprascrie o modificare
 * administrativă sau să eșueze într-o stare parțial aplicată. În acest caz
 * se trimite și o alertă prin email (nu doar jurnalizare).
 */
export async function GET(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    console.error('[cron:midea-solstice] CRON_SECRET missing from configuration — refusing to run.');
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (isMideaSolsticeCampaignActive()) {
    console.log('[cron:midea-solstice] campaign still active — nothing to revert.');
    return NextResponse.json({ ok: true, reverted: false, reason: 'campaign-active' });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error('[cron:midea-solstice] Supabase service client unavailable.');
    return NextResponse.json({ error: 'Server config error.' }, { status: 500 });
  }

  const results = await applyMideaSolsticePricing(supabase, 'normal');

  // Backup minimal în loguri (Vercel): singura formă de backup persistentă
  // disponibilă într-o funcție serverless — sistemul de fișiere e efemer.
  console.log('[cron:midea-solstice] backup snapshot before this run:', JSON.stringify(results.map((r) => ({ slug: r.slug, before: r.before }))));

  for (const r of results) {
    if (r.ok) {
      console.log(
        r.skipped
          ? `[cron:midea-solstice] ${r.slug}: already at normal price (${r.to} lei) — skipped.`
          : `[cron:midea-solstice] ${r.slug}: reverted ${r.before?.price} -> ${r.to} lei.`,
      );
    } else {
      console.error(`[cron:midea-solstice] ${r.slug}: FAILED — ${r.error}`);
    }
  }

  const failures = results.filter((r) => !r.ok);
  if (failures.length > 0) {
    try {
      await sendMideaSolsticeRevertAlert(
        failures.map((f) => ({ slug: f.slug, error: f.error, conflict: f.conflict, identityMismatch: f.identityMismatch })),
      );
    } catch (alertError) {
      // Alertarea însăși a eșuat (ex: RESEND_API_KEY lipsă) — rămâne cel
      // puțin jurnalizat mai sus; nu lăsăm acest eșec secundar să ascundă
      // răspunsul real al cron-ului.
      console.error('[cron:midea-solstice] alert email failed:', alertError instanceof Error ? alertError.message : alertError);
    }
  }

  return NextResponse.json({ ok: failures.length === 0, reverted: true, results }, { status: failures.length > 0 ? 500 : 200 });
}
