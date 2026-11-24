-- Commercial details for quote-led catalogue lines (first use: Vaillant heat pumps).
--
-- Additive and backward compatible:
--   * every new column on products is nullable or has a safe default;
--   * no existing row changes behaviour (quote_only defaults to false);
--   * no existing grant or RLS policy is modified.
--
-- Public vs internal data
--   products is publicly readable (products_public_read_active: every column of
--   active rows is visible to anon). Only data that may be shown on the site
--   lives there. Review metadata (price verification date, approval source,
--   "needs re-verification") lives in product_price_reviews, which has RLS
--   enabled, NO policies and no anon/authenticated grants: it is reachable only
--   through the service role used by the protected admin API.
--
--   Purchase prices, margins, contract terms, logistics costs and negotiation
--   thresholds must NOT be stored in this database (kept in a separate internal
--   register). There is deliberately no column for them.

alter table public.products
  add column if not exists manufacturer_code text,
  add column if not exists product_line text,
  add column if not exists power_supply text,
  add column if not exists included_components jsonb not null default '[]'::jsonb,
  add column if not exists excluded_components jsonb not null default '[]'::jsonb,
  add column if not exists documents jsonb not null default '[]'::jsonb,
  add column if not exists quote_only boolean not null default false;

alter table public.products
  drop constraint if exists products_power_supply_valid;
alter table public.products
  add constraint products_power_supply_valid
  check (power_supply is null or power_supply in ('230V', '400V'));

alter table public.products
  drop constraint if exists products_commercial_lists_are_arrays;
alter table public.products
  add constraint products_commercial_lists_are_arrays
  check (
    jsonb_typeof(included_components) = 'array'
    and jsonb_typeof(excluded_components) = 'array'
    and jsonb_typeof(documents) = 'array'
  );

create unique index if not exists products_manufacturer_code_brand_key
  on public.products (brand, manufacturer_code)
  where manufacturer_code is not null;

comment on column public.products.manufacturer_code is
  'Manufacturer article number (SKU), shown publicly, e.g. Vaillant 8000022169.';
comment on column public.products.product_line is
  'Product series slug used for catalogue grouping, e.g. arotherm-pro.';
comment on column public.products.power_supply is
  'Electrical supply shown publicly: 230V or 400V.';
comment on column public.products.included_components is
  'JSON array of strings: components included in the published price.';
comment on column public.products.excluded_components is
  'JSON array of strings: components NOT included in the published price.';
comment on column public.products.documents is
  'JSON array of {label, url} links to official manufacturer documents (https only, validated by the admin API).';
comment on column public.products.quote_only is
  'TRUE: the product is never added to the cart; the page shows the public price with VAT plus quote-request CTAs.';

create table if not exists public.product_price_reviews (
  product_id uuid primary key references public.products (id) on delete cascade,
  price_verified_at timestamptz,
  approval_source text,
  needs_reverification boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint product_price_reviews_source_length
    check (approval_source is null or char_length(approval_source) <= 300)
);

alter table public.product_price_reviews enable row level security;
-- Default privileges for postgres-owned tables are revoked in this project
-- (20260914152629_production_security_reconciliation), so the server-side
-- service role needs an explicit grant; clients get nothing.
revoke all on table public.product_price_reviews from public, anon, authenticated;
grant select, insert, update, delete on table public.product_price_reviews to service_role;

comment on table public.product_price_reviews is
  'INTERNAL price review metadata. Never exposed publicly: RLS on, no policies, service role only.';
comment on column public.product_price_reviews.price_verified_at is
  'When the public price (products.price) was last verified.';
comment on column public.product_price_reviews.approval_source is
  'Internal reference to who/what approved the public price (e.g. "Lista PRO TERM 23.11.2026"). No purchase prices or margins.';
comment on column public.product_price_reviews.needs_reverification is
  'TRUE while the price/configuration must be reconfirmed before (re)publishing.';
