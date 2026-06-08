/**
 * Download official product images and upload to Supabase Storage "product-images" bucket.
 * Updates image_url in products table for all rows where image_url IS NULL.
 * Run: npx tsx scripts/upload-product-images.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
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
  console.error('❌  Nu am găsit .env.local');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'product-images';

// Series slug prefix → official image URL
// IMPORTANT: 'yamato-avanti-black' must come before 'yamato-avanti' (prefix match order)
const SERIES_IMAGES: Record<string, string> = {
  'gree-amber':
    'https://miramax-clima.bg/storage/images/products/gallery/c4d9cbbaf76206da12d9f9e96b6a0356.jpg',
  'gree-bora-a4-silver':
    'https://www.gree.ro/wp-content/uploads/2024/04/interioara-bora.jpg',
  'gree-clivia':
    'https://www.gree.ro/wp-content/uploads/2025/07/gree-clivia-panel-1.jpg',
  'gree-pulsar':
    'https://www.gree.ro/wp-content/uploads/2021/08/gree-pulsar-panel.jpg',
  'midea-breezeless-e':
    'https://s13emagst.akamaized.net/products/59361/59360693/images/res_77a4b91fdc7c959df5463bb81f5ebaa4.jpg?width=720&height=720&hash=BD1DAEF88A04138D00E2297CBD1E0ECC',
  'midea-solstice':
    'https://www.midea.bg/1390-tm_large_default/midea-ez-12rd6-i-solstice-inverter-air-conditioner.jpg',
  'midea-solunar-lite':
    'https://s13emagst.akamaized.net/products/118333/118332328/images/res_fd01e731d0da6e952267016a188de2ab.jpg',
  'yamato-avanti-black':
    'https://www.yamato.ro/wp-content/uploads/2025/02/yamato-avanti-black.jpg',
  'yamato-avanti':
    'https://www.yamato.ro/wp-content/uploads/2024/08/panel_avanti_t3.jpg',
  'yamato-optimum':
    'https://www.yamato.ro/wp-content/uploads/2024/02/ui-optimum-2024.jpg',
};

function getSeriesKey(slug: string): string | null {
  for (const key of Object.keys(SERIES_IMAGES)) {
    if (slug.startsWith(key)) return key;
  }
  return null;
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: new URL(url).origin + '/',
      },
    });
    if (!resp.ok) {
      console.error(`  HTTP ${resp.status} — ${url}`);
      return null;
    }
    return Buffer.from(await resp.arrayBuffer());
  } catch (err) {
    console.error(`  Fetch error: ${err}`);
    return null;
  }
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, name, image_url')
    .is('image_url', null);

  if (error) {
    console.error('❌  Eroare fetch produse:', error.message);
    process.exit(1);
  }

  console.log(`\n🔍  ${products!.length} produse fără imagine\n`);

  // Download each series image once
  const cache = new Map<string, Buffer>();
  for (const [key, url] of Object.entries(SERIES_IMAGES)) {
    process.stdout.write(`⬇️   ${key} ... `);
    const buf = await downloadImage(url);
    if (buf) {
      cache.set(key, buf);
      console.log(`✓ ${Math.round(buf.length / 1024)} KB`);
    } else {
      console.log('✗ EȘUAT');
    }
  }

  console.log('\n─────────────────────────────────────────\n');

  let ok = 0;
  let fail = 0;
  let skipped = 0;

  for (const product of products!) {
    const seriesKey = getSeriesKey(product.slug);
    if (!seriesKey) {
      console.log(`⏭️   ${product.name} — fără mapping, skip`);
      skipped++;
      continue;
    }

    const buf = cache.get(seriesKey);
    if (!buf) {
      console.log(`❌  ${product.name} — imaginea seriei nu a putut fi descărcată`);
      fail++;
      continue;
    }

    const fileName = `${product.slug}.jpg`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buf, { contentType: 'image/jpeg', upsert: true });

    if (uploadErr) {
      console.error(`❌  ${product.name} — upload: ${uploadErr.message}`);
      fail++;
      continue;
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    const { error: updateErr } = await supabase
      .from('products')
      .update({ image_url: pub.publicUrl })
      .eq('id', product.id);

    if (updateErr) {
      console.error(`❌  ${product.name} — DB update: ${updateErr.message}`);
      fail++;
    } else {
      console.log(`✅  ${product.name}`);
      ok++;
    }
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`✅  Actualizate cu succes: ${ok}`);
  if (fail > 0) console.log(`❌  Eșuate: ${fail}`);
  if (skipped > 0) console.log(`⏭️   Skip (fără mapping): ${skipped}`);
  console.log('─────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
