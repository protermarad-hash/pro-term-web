-- PRO TERM Supabase schema
-- Rulează acest SQL în Supabase → SQL Editor → New query → Run.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  category text not null,
  btu integer,
  capacity_label text,
  price numeric(12, 2) not null default 0,
  price_label text,
  original_price numeric(12, 2),
  rating numeric(3, 2) not null default 4.7,
  reviews integer not null default 0,
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  energy_class text not null default 'La cerere',
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  smartbill_code text,
  manage_stock boolean not null default true,
  stock_status text not null default 'on-request',
  stock_qty integer,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_idx on public.products(active);
create index if not exists products_brand_idx on public.products(brand);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_slug_idx on public.products(slug);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Activăm RLS. Citirea publică e permisă doar pentru produse active.
alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (active = true);

-- Inserarea/editarea/ștergerea se face doar din API-ul serverului Next.js cu SUPABASE_SERVICE_ROLE_KEY.
-- Nu crea policy publică pentru insert/update/delete.

-- Bucket pentru poze produse. Dacă apare eroare aici, creează manual bucket-ul în Storage cu numele product-images.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Permitem citirea publică a imaginilor din bucket.
drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
using (bucket_id = 'product-images');
