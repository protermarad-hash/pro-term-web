/**
 * Creează tabela orders în Supabase via Management API.
 * Necesită SUPABASE_ACCESS_TOKEN (din supabase.com/dashboard/account/tokens).
 * Alternativ rulează scripts/create-orders-table.sql în SQL Editor din dashboard.
 *
 * Run: SUPABASE_ACCESS_TOKEN=your_token npx tsx scripts/run-migration.ts
 */

import { readFileSync } from 'fs';
import { resolve as pathResolve } from 'path';

try {
  const envFile = readFileSync(pathResolve(process.cwd(), '.env.local'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = value;
  }
} catch { /* no .env.local */ }

const PROJECT_REF = 'dydzfhyndsdbrhrwvgib';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SQL = `
CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  county          TEXT NOT NULL,
  postal_code     TEXT NOT NULL DEFAULT '',
  notes           TEXT NOT NULL DEFAULT '',
  items           JSONB NOT NULL DEFAULT '[]',
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost   NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method  TEXT NOT NULL DEFAULT 'ramburs',
  status          TEXT NOT NULL DEFAULT 'nou'
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Users can view own orders'
  ) THEN
    CREATE POLICY "Users can view own orders"
      ON public.orders FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
`;

if (!ACCESS_TOKEN) {
  console.log('\n⚠️  SUPABASE_ACCESS_TOKEN lipsă.');
  console.log('   Rulează SQL-ul din scripts/create-orders-table.sql în:');
  console.log('   https://supabase.com/dashboard/project/dydzfhyndsdbrhrwvgib/sql\n');
  process.exit(0);
}

fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: SQL }),
})
  .then(async (r) => {
    const data = await r.json();
    if (!r.ok) {
      console.error('❌  Eroare Management API:', JSON.stringify(data));
      process.exit(1);
    }
    console.log('✅  Tabela orders creată cu succes!');
  })
  .catch((e) => {
    console.error('❌  Fetch error:', e.message);
    process.exit(1);
  });
