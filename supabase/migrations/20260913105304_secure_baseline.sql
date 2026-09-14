-- Secure baseline for a new Supabase development project.
-- Contains schema and access controls only; no commercial or personal data.

create extension if not exists pgcrypto;

create schema if not exists private authorization postgres;
alter schema private owner to postgres;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to supabase_auth_admin;

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
  gallery_images jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  image_url text,
  category text,
  author text not null default 'Echipa PRO TERM',
  read_time integer,
  published boolean not null default false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  tags text[] not null default '{}'::text[]
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nume_complet text not null default '',
  telefon text not null default '',
  adresa_livrare text not null default '',
  oras text not null default '',
  judet text not null default '',
  cod_postal text not null default '',
  is_admin boolean not null default false
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_price numeric(12, 2) not null default 0,
  product_image text,
  created_at timestamptz not null default now(),
  constraint favorites_user_product_key unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  county text not null,
  postal_code text not null default '',
  notes text not null default '',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2) not null default 0,
  shipping_cost numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  payment_method text not null default 'ramburs',
  status text not null default 'nou',
  payment_provider text,
  payment_status text not null default 'pending',
  netopia_ntp_id text,
  netopia_raw_response jsonb,
  invoice_series text,
  invoice_number text,
  invoice_url text,
  invoice_status text default 'pending',
  invoice_sent_at timestamptz,
  invoice_error text,
  smartbill_raw_response jsonb,
  confirmation_token_hash text unique,
  constraint orders_payment_method_check
    check (payment_method in ('ramburs', 'transfer', 'card')),
  constraint orders_status_check
    check (status in ('nou', 'confirmat', 'in-livrare', 'livrat', 'anulat')),
  constraint orders_confirmation_token_hash_check
    check (confirmation_token_hash ~ '^[0-9a-f]{64}$')
);

create table if not exists public.retrageri (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nume text not null,
  adresa text not null,
  telefon text not null,
  email text not null,
  numar_comanda text not null,
  produs text not null,
  cantitate integer not null,
  pret numeric(12, 2) not null,
  data_comanda date not null,
  data_primire date not null,
  motiv text not null,
  detalii text,
  metoda_rambursare text not null,
  iban text,
  status text not null default 'nou'
);

-- Explicit indexes cover the application's filters and ordering paths.
create index if not exists products_active_idx on public.products(active);
create index if not exists products_brand_idx on public.products(brand);
create index if not exists products_category_idx on public.products(category);
create index if not exists blog_posts_published_idx on public.blog_posts(published);
create index if not exists blog_posts_published_at_idx on public.blog_posts(published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts(category);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_netopia_ntp_id_idx on public.orders(netopia_ntp_id);
create index if not exists orders_invoice_status_idx on public.orders(invoice_status);
create index if not exists retrageri_email_idx on public.retrageri(lower(email));

-- Trigger helpers resolve every object by schema; no caller-controlled search path is used.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter function public.set_updated_at() owner to postgres;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nume_complet)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(
        btrim(
          concat_ws(
            ' ',
            new.raw_user_meta_data ->> 'first_name',
            new.raw_user_meta_data ->> 'last_name'
          )
        ),
        ''
      ),
      ''
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

alter function private.handle_new_user() owner to postgres;

-- Trigger-only functions are not callable through the client roles.
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function private.handle_new_user() from public, anon, authenticated;
grant execute on function private.handle_new_user() to supabase_auth_admin;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.products enable row level security;
alter table public.blog_posts enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.retrageri enable row level security;

-- Remove implicit client privileges before granting the minimum used by the application.
revoke all on schema public from public;
grant usage on schema public to anon, authenticated, service_role;

revoke all privileges on table public.products from anon, authenticated;
revoke all privileges on table public.blog_posts from anon, authenticated;
revoke all privileges on table public.profiles from anon, authenticated;
revoke all privileges on table public.favorites from anon, authenticated;
revoke all privileges on table public.orders from anon, authenticated;
revoke all privileges on table public.retrageri from anon, authenticated;

grant select on table public.products to anon, authenticated;
grant select on table public.blog_posts to anon, authenticated;
grant insert, update, delete on table public.blog_posts to authenticated;

grant select on table public.profiles to authenticated;
grant insert (
  id,
  updated_at,
  nume_complet,
  telefon,
  adresa_livrare,
  oras,
  judet,
  cod_postal
) on public.profiles to authenticated;
grant update (
  updated_at,
  nume_complet,
  telefon,
  adresa_livrare,
  oras,
  judet,
  cod_postal
) on public.profiles to authenticated;

grant select, insert, update, delete on table public.favorites to authenticated;
grant insert (
  nume,
  adresa,
  telefon,
  email,
  numar_comanda,
  produs,
  cantitate,
  pret,
  data_comanda,
  data_primire,
  motiv,
  detalii,
  metoda_rambursare,
  iban,
  status
) on public.retrageri to anon, authenticated;
grant select (id, created_at, numar_comanda, produs, pret, status, motiv)
on public.retrageri to authenticated;

-- The service role receives CRUD only; schema ownership and DDL remain separate.
grant select, insert, update, delete on table public.products to service_role;
grant select, insert, update, delete on table public.blog_posts to service_role;
grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.favorites to service_role;
grant select, insert, update, delete on table public.orders to service_role;
grant select, insert, update, delete on table public.retrageri to service_role;

drop policy if exists products_public_read_active on public.products;
create policy products_public_read_active
on public.products
for select
to anon, authenticated
using (active = true);

drop policy if exists blog_posts_public_read_published on public.blog_posts;
create policy blog_posts_public_read_published
on public.blog_posts
for select
to anon, authenticated
using (published = true);

-- Admin checks use the caller's own protected profile, never mere authentication.
drop policy if exists blog_posts_admin_read_all on public.blog_posts;
create policy blog_posts_admin_read_all
on public.blog_posts
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.is_admin = true
  )
);

drop policy if exists blog_posts_admin_insert on public.blog_posts;
create policy blog_posts_admin_insert
on public.blog_posts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.is_admin = true
  )
);

drop policy if exists blog_posts_admin_update on public.blog_posts;
create policy blog_posts_admin_update
on public.blog_posts
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.is_admin = true
  )
);

drop policy if exists blog_posts_admin_delete on public.blog_posts;
create policy blog_posts_admin_delete
on public.blog_posts
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.is_admin = true
  )
);

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

-- INSERT supports the client's upsert; column grants exclude is_admin.
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = (select auth.uid()));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists favorites_select_own on public.favorites;
create policy favorites_select_own
on public.favorites
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists favorites_insert_own on public.favorites;
create policy favorites_insert_own
on public.favorites
for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists favorites_update_own on public.favorites;
create policy favorites_update_own
on public.favorites
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists favorites_delete_own on public.favorites;
create policy favorites_delete_own
on public.favorites
for delete
to authenticated
using (user_id = (select auth.uid()));

-- orders is accessed exclusively through authorized server route handlers
-- (service_role, after the request passes authenticateRequest/requireAdmin).
-- anon and authenticated intentionally receive no Data API grants and no
-- policies on this table; RLS stays enabled with no policies, which denies
-- all direct client access by default.

drop policy if exists retrageri_submit on public.retrageri;
create policy retrageri_submit
on public.retrageri
for insert
to anon, authenticated
with check (status = 'nou');

drop policy if exists retrageri_select_own_email on public.retrageri;
create policy retrageri_select_own_email
on public.retrageri
for select
to authenticated
using (
  lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
);

-- Create an empty public bucket. Client roles may read but never upload or delete.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

revoke all privileges on table storage.objects from anon, authenticated;
revoke all privileges on table storage.buckets from anon, authenticated;
grant select on table storage.objects to anon, authenticated;
grant select, insert, update, delete on table storage.objects to service_role;
grant select on table storage.buckets to service_role;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');
