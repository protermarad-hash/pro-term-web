/**
 * Import Vaillant stage-1 heat pumps into Supabase as DRAFTS.
 *
 * Implicit DRY-RUN: afișează doar ce s-ar schimba. Scrie NUMAI cu --apply.
 *
 *   npx tsx scripts/vaillant/import-stage1.ts            (dry-run)
 *   npx tsx scripts/vaillant/import-stage1.ts --apply    (scrie efectiv)
 *
 * Reguli:
 *   - produsele noi se creează cu active = false (draft) și quote_only = true;
 *   - scriptul NU activează niciodată un produs și nu modifică `active` pentru
 *     produsele existente — publicarea se face doar din admin, după aprobări;
 *   - prețurile publice cu TVA se citesc din private/vaillant-public-prices.csv
 *     (exclus din git); fiecare rând primește needs_reverification = true;
 *   - înainte de --apply se salvează un backup JSON în backups/vaillant/.
 *
 * Necesită migrația 20261123120000_product_commercial_details.sql aplicată și
 * .env.local cu NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { STAGE1_PRODUCTS } from './stage1-catalog';
import { parsePublicPriceCsv, type PublicPriceRow } from './price-list';

function loadEnv() {
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
    // .env.local is optional when variables are already exported.
  }
}

async function main() {
  loadEnv();
  const apply = process.argv.includes('--apply');
  const priceFile = resolve(process.cwd(), 'private/vaillant-public-prices.csv');

  let prices = new Map<string, PublicPriceRow>();
  if (existsSync(priceFile)) {
    const parsed = parsePublicPriceCsv(readFileSync(priceFile, 'utf8'));
    if (parsed.errors.length > 0) {
      process.stderr.write(`Erori în lista de prețuri:\n- ${parsed.errors.join('\n- ')}\n`);
      process.exit(1);
    }
    prices = new Map(parsed.rows.map((row) => [row.sku, row]));
  } else {
    process.stdout.write('Atenție: private/vaillant-public-prices.csv lipsește — produsele se importă fără preț (price = 0).\n');
  }

  const unknownSkus = Array.from(prices.keys()).filter((sku) => !STAGE1_PRODUCTS.some((p) => p.sku === sku));
  if (unknownSkus.length > 0) {
    process.stderr.write(`SKU-uri din lista de prețuri care nu există în catalogul etapei 1: ${unknownSkus.join(', ')}\n`);
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    process.stderr.write('Lipsesc NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.\n');
    process.exit(1);
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: existing, error } = await supabase
    .from('products')
    .select('id, slug, name, price, active, manufacturer_code, quote_only')
    .in('slug', STAGE1_PRODUCTS.map((p) => p.slug));
  if (error) {
    process.stderr.write(`Nu pot citi produsele (migrația este aplicată?): ${error.message}\n`);
    process.exit(1);
  }
  const bySlug = new Map((existing ?? []).map((row) => [row.slug as string, row]));

  for (const product of STAGE1_PRODUCTS) {
    const current = bySlug.get(product.slug);
    const price = prices.get(product.sku);
    process.stdout.write(
      `${current ? 'UPDATE' : 'INSERT (draft)'}  ${product.sku}  ${product.name}  ` +
        `preț: ${current ? `${current.price} → ` : ''}${price ? price.priceWithVat : 0} lei${current?.active ? '  [ACTIV — rămâne activ]' : ''}\n`,
    );
  }

  if (!apply) {
    process.stdout.write('\nDRY-RUN: nimic nu a fost scris. Rulează cu --apply pentru import.\n');
    return;
  }

  const backupDir = resolve(process.cwd(), 'backups/vaillant');
  mkdirSync(backupDir, { recursive: true });
  const backupFile = resolve(backupDir, `before-import-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  writeFileSync(backupFile, JSON.stringify(existing ?? [], null, 2));
  process.stdout.write(`Backup: ${backupFile}\n`);

  let failures = 0;
  for (const product of STAGE1_PRODUCTS) {
    const current = bySlug.get(product.slug);
    const price = prices.get(product.sku);
    const fields = {
      name: product.name,
      brand: 'Vaillant',
      category: 'pompe-caldura',
      description: product.description,
      features: [],
      specs: product.specs,
      energy_class: product.energyClass,
      price: price?.priceWithVat ?? 0,
      manage_stock: false,
      manufacturer_name: 'Vaillant',
      manufacturer_model_identifier: product.model,
      manufacturer_code: product.sku,
      product_line: product.productLine,
      power_supply: product.powerSupply,
      included_components: product.includedComponents,
      excluded_components: product.excludedComponents,
      documents: product.documents,
      quote_only: true,
      image_url: product.imageUrl,
      updated_at: new Date().toISOString(),
    };

    const result = current
      ? await supabase.from('products').update(fields).eq('id', current.id).select('id').single()
      : await supabase
          .from('products')
          .insert({ ...fields, slug: product.slug, active: false, stock_status: 'la_comanda', rating: 0, reviews: 0 })
          .select('id')
          .single();

    if (result.error || !result.data) {
      failures += 1;
      process.stderr.write(`EȘEC ${product.sku}: ${result.error?.message ?? 'fără rezultat'}\n`);
      continue;
    }

    const { error: reviewError } = await supabase.from('product_price_reviews').upsert({
      product_id: result.data.id,
      price_verified_at: price ? new Date(`${price.verifiedAt}T12:00:00Z`).toISOString() : null,
      approval_source: price?.approvalSource ?? null,
      needs_reverification: true,
      updated_at: new Date().toISOString(),
    });
    if (reviewError) {
      failures += 1;
      process.stderr.write(`EȘEC verificare preț ${product.sku}: ${reviewError.message}\n`);
    }
  }

  process.stdout.write(failures === 0 ? '\nImport finalizat. Toate produsele noi sunt DRAFT.\n' : `\nImport cu ${failures} erori.\n`);
  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
