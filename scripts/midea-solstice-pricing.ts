/**
 * Activare / revenire manuală a prețurilor campaniei Midea Solstice.
 *
 * Implicit rulează în modul DRY-RUN (nu scrie nimic) — afișează doar ce s-ar
 * schimba. Scrie efectiv în Supabase NUMAI cu flag-ul --apply.
 *
 * Înainte de orice scriere (--apply), salvează local un backup JSON cu
 * valorile curente (price/original_price/SKU) ale ambelor produse, în
 * backups/midea-solstice/ — pentru restaurare manuală dacă e nevoie.
 *
 * Folosește aceeași funcție (applyMideaSolsticePricing) ca mecanismul automat
 * de revenire (src/app/api/cron/revert-midea-solstice-pricing) — o singură
 * regulă, nu două implementări divergente. Actualizarea e condiționată: dacă
 * prețul s-a schimbat în Supabase între citire și scriere (ex: o modificare
 * făcută între timp din admin), scrierea e REFUZATĂ și raportată ca
 * „conflict”, nu suprascrisă.
 *
 * Utilizare:
 *   npx tsx scripts/midea-solstice-pricing.ts --mode=campaign          (dry-run, activare)
 *   npx tsx scripts/midea-solstice-pricing.ts --mode=campaign --apply  (scrie efectiv)
 *   npx tsx scripts/midea-solstice-pricing.ts --mode=normal   --apply  (revenire manuală/fallback)
 *
 * Necesită .env.local cu NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { MIDEA_SOLSTICE_MODELS } from '../src/lib/campaigns/midea-solstice';
import { applyMideaSolsticePricing, type MideaSolsticePricingMode } from '../src/lib/campaigns/midea-solstice-server';

try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = value;
  }
} catch {
  console.error('❌  Nu am găsit .env.local. Creează fișierul cu NEXT_PUBLIC_SUPABASE_URL și SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const modeArg = args.find((a) => a.startsWith('--mode='))?.split('=')[1];

if (modeArg !== 'campaign' && modeArg !== 'normal') {
  console.error('❌  Specifică --mode=campaign sau --mode=normal.');
  process.exit(1);
}
const mode = modeArg as MideaSolsticePricingMode;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Lipsesc NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY în .env.local');
  process.exit(1);
}

function writeBackup(rows: Array<{ slug: string; price: number; original_price: number | null; smartbill_code: string | null }>) {
  const dir = resolve(process.cwd(), 'backups', 'midea-solstice');
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, `${new Date().toISOString().replace(/[:.]/g, '-')}-${mode}.json`);
  writeFileSync(file, JSON.stringify({ capturedAt: new Date().toISOString(), mode, rows }, null, 2));
  return file;
}

async function main() {
  console.log(`\n${apply ? '⚠️  MOD APLICARE — se va scrie în Supabase' : '🔎  DRY-RUN — nu se scrie nimic'} (mode=${mode})\n`);

  if (!apply) {
    for (const model of MIDEA_SOLSTICE_MODELS) {
      const target = mode === 'campaign' ? model.campaignPrice : model.normalPrice;
      console.log(`  ${model.slug}: preț țintă ${target} lei, original_price -> NULL (SKU așteptat: ${model.smartbillCode})`);
    }
    console.log('\nRulează din nou cu --apply pentru a scrie efectiv aceste valori.\n');
    return;
  }

  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

  // Backup read-only, ÎNAINTE de orice scriere.
  const backupRows = [];
  for (const model of MIDEA_SOLSTICE_MODELS) {
    const { data, error } = await supabase
      .from('products')
      .select('price, original_price, smartbill_code')
      .eq('slug', model.slug)
      .maybeSingle();
    if (error || !data) {
      console.error(`❌  Nu pot citi ${model.slug} pentru backup — opresc înainte de orice scriere. (${error?.message ?? 'produs inexistent'})`);
      process.exit(1);
    }
    backupRows.push({ slug: model.slug, ...data });
  }
  const backupFile = writeBackup(backupRows);
  console.log(`💾  Backup salvat: ${backupFile}\n`);

  const results = await applyMideaSolsticePricing(supabase, mode);

  let ok = 0;
  let failed = 0;
  for (const r of results) {
    if (r.ok && r.skipped) {
      console.log(`✅  ${r.slug}: deja la ${r.to} lei — nicio modificare necesară.`);
      ok++;
    } else if (r.ok) {
      console.log(`✅  ${r.slug}: ${r.before?.price} -> ${r.to} lei.`);
      ok++;
    } else if (r.identityMismatch) {
      console.error(`🚫  ${r.slug}: ${r.error}`);
      failed++;
    } else if (r.conflict) {
      console.error(`⚠️  ${r.slug}: CONFLICT — ${r.error} (preț citit: ${r.before?.price} lei)`);
      failed++;
    } else {
      console.error(`❌  ${r.slug}: ${r.error}`);
      failed++;
    }
  }

  console.log(`\n─────────────────────────────`);
  console.log(`✅  Reușite: ${ok}`);
  if (failed > 0) {
    console.log(`❌  Eșuate/refuzate: ${failed}`);
    console.log(`\nDacă e CONFLICT: altcineva a modificat prețul între timp — verifică manual în admin înainte de a reîncerca.`);
    console.log(`Backup-ul de dinainte de această rulare rămâne în ${backupFile} pentru referință.`);
  }
  console.log(`─────────────────────────────\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
