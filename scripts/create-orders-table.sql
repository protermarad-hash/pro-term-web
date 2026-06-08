-- Rulează în Supabase Dashboard → SQL Editor
-- sau prin: npx tsx scripts/run-migration.ts

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

CREATE POLICY IF NOT EXISTS "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);
