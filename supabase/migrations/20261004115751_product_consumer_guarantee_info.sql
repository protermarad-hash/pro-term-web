-- Consumer guarantee information for products (OUG 34/2014 as amended by
-- OUG 18/2026, art. 4 and art. 6; Implementing Regulation (EU) 2025/1960).
-- See docs/legal/CONSUMER_GUARANTEE_COMPLIANCE_2026.md.
--
-- Additive and backward compatible:
--   * every new column is nullable or has a safe default;
--   * no existing row is marked eligible for the EU GARAN label;
--   * no data is modified, no grant or RLS policy changes are needed
--     (products uses table-level SELECT grants + products_public_read_active).
--
-- The harmonised notice on the legal guarantee of conformity is NOT stored per
-- product: it is mandatory for every good sold to consumers and is rendered at
-- shop level, so there is deliberately no flag that could switch it off.

alter table public.products
  add column if not exists durability_guarantee_eligible boolean not null default false,
  add column if not exists durability_guarantee_years numeric(3, 1),
  add column if not exists durability_guarantee_source text,
  add column if not exists manufacturer_name text,
  add column if not exists manufacturer_model_identifier text,
  add column if not exists commercial_warranty_terms text,
  add column if not exists commercial_warranty_conditions_url text,
  add column if not exists after_sales_service_info text,
  add column if not exists spare_parts_info text,
  add column if not exists repair_info text,
  add column if not exists software_updates_info text;

-- Durations follow the Commission guidelines (April 2026, section 3.1):
-- whole years or half years only, and strictly more than two years.
alter table public.products
  drop constraint if exists products_durability_guarantee_years_valid;
alter table public.products
  add constraint products_durability_guarantee_years_valid
  check (
    durability_guarantee_years is null
    or (
      durability_guarantee_years > 2
      and durability_guarantee_years <= 99
      and durability_guarantee_years * 2 = trunc(durability_guarantee_years * 2)
    )
  );

-- The label may only be enabled when the producer data printed on it, and a
-- reference to the producer document that supplied it, are present.
alter table public.products
  drop constraint if exists products_durability_guarantee_requires_data;
alter table public.products
  add constraint products_durability_guarantee_requires_data
  check (
    durability_guarantee_eligible = false
    or (
      durability_guarantee_years is not null
      and length(btrim(coalesce(manufacturer_name, ''))) > 0
      and length(btrim(coalesce(manufacturer_model_identifier, ''))) > 0
      and length(btrim(coalesce(durability_guarantee_source, ''))) > 0
    )
  );

alter table public.products
  drop constraint if exists products_commercial_warranty_conditions_url_https;
alter table public.products
  add constraint products_commercial_warranty_conditions_url_https
  check (
    commercial_warranty_conditions_url is null
    or commercial_warranty_conditions_url ~ '^https://[^[:space:]]+$'
  );

comment on column public.products.durability_guarantee_eligible is
  'EU GARAN label (Reg. (UE) 2025/1960 anexa II). TRUE only if the PRODUCER offers a commercial guarantee of durability at no extra cost, covering the entire good, longer than 2 years, and has made this information available to PRO TERM.';
comment on column public.products.durability_guarantee_years is
  'Duration in years of the producer commercial guarantee of durability (> 2, whole or half years).';
comment on column public.products.durability_guarantee_source is
  'Internal reference to the producer document that supplied the durability guarantee (never shown publicly).';
comment on column public.products.manufacturer_name is
  'Producer name as printed on the EU GARAN label (Brand/Trademark field).';
comment on column public.products.manufacturer_model_identifier is
  'Producer model identifier as printed on the EU GARAN label.';
comment on column public.products.commercial_warranty_terms is
  'Other commercial guarantees (producer/importer/seller) as stated in the guarantee certificate (art. 6 alin. (1) lit. m)). Not the EU GARAN label.';
comment on column public.products.commercial_warranty_conditions_url is
  'HTTPS link to the full commercial guarantee conditions.';
comment on column public.products.after_sales_service_info is
  'After-sales assistance and services and their conditions (OUG 34/2014 art. 6 alin. (1) lit. m); art. 4 alin. (1) lit. e^3)).';
comment on column public.products.spare_parts_info is
  'Producer-supplied availability, estimated cost and ordering procedure of spare parts (art. 6 alin. (1) lit. u)).';
comment on column public.products.repair_info is
  'Producer-supplied availability of repair and maintenance instructions and repair restrictions (art. 6 alin. (1) lit. u)).';
comment on column public.products.software_updates_info is
  'Goods with digital elements only: producer-supplied minimum software update period, as a duration or a date (art. 6 alin. (1) lit. l^3)).';
