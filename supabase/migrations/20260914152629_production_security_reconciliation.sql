-- Incremental reconciliation for the existing production schema and the dev baseline.
-- This draft changes access controls and adds only the guest confirmation hash column.

-- Fail before any mutation when the executor, schema, or legacy/dev function state is unsafe.
do $$
declare
  required_role text;
  target_table text;
  table_owner text;
  has_public boolean := to_regprocedure('public.handle_new_user()') is not null;
  has_private boolean := to_regprocedure('private.handle_new_user()') is not null;
  selected_function oid;
  selected_function_owner text;
  optional_function oid := to_regprocedure('public.set_updated_at_blog_posts()');
  private_schema_owner text;
  orders_table oid := to_regclass('public.orders');
  hash_attribute_number smallint;
  hash_type text;
  hash_is_not_null boolean;
  hash_has_default boolean;
  named_index oid := to_regclass('public.orders_confirmation_token_hash_unique_idx');
  normalized_index_predicate text;
  named_constraint oid;
  normalized_constraint_definition text;
begin
  if current_user <> 'postgres' or session_user <> 'postgres' then
    raise exception 'Reconciliation requires current_user and session_user to both be postgres';
  end if;

  foreach required_role in array
    array['anon', 'authenticated', 'service_role', 'supabase_auth_admin']
  loop
    if not exists (select 1 from pg_catalog.pg_roles where rolname = required_role) then
      raise exception 'Required role % does not exist', required_role;
    end if;
  end loop;

  foreach target_table in array
    array['products', 'profiles', 'blog_posts', 'orders', 'retrageri', 'favorites']
  loop
    if to_regclass(format('%I.%I', 'public', target_table)) is null then
      raise exception 'Required table public.% does not exist', target_table;
    end if;

    select pg_get_userbyid(c.relowner)
    into table_owner
    from pg_catalog.pg_class c
    where c.oid = to_regclass(format('%I.%I', 'public', target_table))
      and c.relkind in ('r', 'p');

    if table_owner is null then
      raise exception 'Required relation public.% is not an ordinary or partitioned table', target_table;
    elsif table_owner is distinct from 'postgres' then
      raise exception 'Required table public.% must be owned by postgres, found %', target_table, table_owner;
    end if;
  end loop;

  if to_regclass('auth.users') is null then
    raise exception 'Required table auth.users does not exist';
  end if;

  if to_regclass('storage.objects') is null or to_regclass('storage.buckets') is null then
    raise exception 'Required Storage tables storage.objects and storage.buckets do not exist';
  end if;

  if to_regnamespace('private') is not null then
    select pg_get_userbyid(n.nspowner)
    into private_schema_owner
    from pg_catalog.pg_namespace n
    where n.oid = to_regnamespace('private');

    if private_schema_owner is distinct from 'postgres' then
      raise exception 'Existing private schema must be owned by postgres, found %', private_schema_owner;
    end if;
  end if;

  if exists (
    select 1
    from pg_catalog.pg_class sequence_relation
    join pg_catalog.pg_namespace sequence_namespace
      on sequence_namespace.oid = sequence_relation.relnamespace
    join pg_catalog.pg_depend dependency
      on dependency.classid = 'pg_class'::regclass
     and dependency.objid = sequence_relation.oid
     and dependency.deptype in ('a', 'i')
    join pg_catalog.pg_class table_relation
      on table_relation.oid = dependency.refobjid
    join pg_catalog.pg_namespace table_namespace
      on table_namespace.oid = table_relation.relnamespace
    where sequence_relation.relkind = 'S'
      and sequence_namespace.nspname = 'public'
      and table_namespace.nspname = 'public'
      and table_relation.relname = any (
        array['products', 'profiles', 'blog_posts', 'orders', 'retrageri', 'favorites']
      )
  ) then
    raise exception 'An application table unexpectedly uses a serial/identity sequence';
  end if;

  if has_public and has_private then
    raise exception 'Both public.handle_new_user() and private.handle_new_user() exist; reconciliation is ambiguous';
  elsif not has_public and not has_private then
    raise exception 'Neither public.handle_new_user() nor private.handle_new_user() exists';
  end if;

  selected_function := coalesce(
    to_regprocedure('private.handle_new_user()')::oid,
    to_regprocedure('public.handle_new_user()')::oid
  );

  select pg_get_userbyid(p.proowner)
  into selected_function_owner
  from pg_catalog.pg_proc p
  where p.oid = selected_function;

  if selected_function_owner is distinct from 'postgres' then
    raise exception 'Selected handle_new_user() must be owned by postgres, found %', selected_function_owner;
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_trigger t
    where t.tgrelid = 'auth.users'::regclass
      and t.tgname = 'on_auth_user_created'
      and not t.tgisinternal
      and t.tgfoid = selected_function
      and t.tgtype = 5
      and t.tgenabled in ('O', 'A')
  ) then
    raise exception 'auth.users trigger on_auth_user_created does not invoke the selected handle_new_user()';
  end if;

  if optional_function is not null and not exists (
    select 1
    from pg_catalog.pg_proc p
    where p.oid = optional_function
      and pg_get_userbyid(p.proowner) = 'postgres'
  ) then
    raise exception 'public.set_updated_at_blog_posts() must be owned by postgres when present';
  end if;

  select
    a.attnum,
    pg_catalog.format_type(a.atttypid, a.atttypmod),
    a.attnotnull,
    ad.oid is not null
  into
    hash_attribute_number,
    hash_type,
    hash_is_not_null,
    hash_has_default
  from pg_catalog.pg_attribute a
  left join pg_catalog.pg_attrdef ad
    on ad.adrelid = a.attrelid
   and ad.adnum = a.attnum
  where a.attrelid = orders_table
    and a.attname = 'confirmation_token_hash'
    and a.attnum > 0
    and not a.attisdropped;

  if found and (
    hash_type is distinct from 'text'
    or hash_is_not_null
    or hash_has_default
  ) then
    raise exception 'public.orders.confirmation_token_hash must be nullable text without a default';
  end if;

  if named_index is not null then
    select lower(regexp_replace(
      coalesce(pg_catalog.pg_get_expr(i.indpred, i.indrelid), ''),
      '[[:space:]()]',
      '',
      'g'
    ))
    into normalized_index_predicate
    from pg_catalog.pg_index i
    where i.indexrelid = named_index
      and i.indrelid = orders_table
      and i.indisunique
      and i.indisvalid
      and i.indisready
      and i.indislive
      and i.indnkeyatts = 1
      and i.indnatts = 1
      and i.indkey[0] = hash_attribute_number;

    if not found or normalized_index_predicate <> 'confirmation_token_hashisnotnull' then
      raise exception 'Index public.orders_confirmation_token_hash_unique_idx has an incompatible definition';
    end if;
  end if;

  select c.oid
  into named_constraint
  from pg_catalog.pg_constraint c
  where c.conrelid = orders_table
    and c.conname = 'orders_confirmation_token_hash_check';

  if named_constraint is not null then
    select lower(regexp_replace(
      replace(pg_catalog.pg_get_constraintdef(c.oid, true), '::text', ''),
      '[[:space:]()]',
      '',
      'g'
    ))
    into normalized_constraint_definition
    from pg_catalog.pg_constraint c
    where c.oid = named_constraint
      and c.contype = 'c'
      and c.convalidated
      and c.conkey = array[hash_attribute_number]::smallint[];

    if not found or normalized_constraint_definition not in (
      'checkconfirmation_token_hash~''^[0-9a-f]{64}$''',
      'checkconfirmation_token_hashisnullorconfirmation_token_hash~''^[0-9a-f]{64}$'''
    ) then
      raise exception 'Constraint orders_confirmation_token_hash_check has an incompatible definition';
    end if;
  end if;
end;
$$;

-- Keep the public schema usable through the Data API, but never writable as a schema.
revoke all on schema public from public, anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;

-- The postgres executor is not a member of the platform-managed supabase_admin role.
-- Application objects are owned and created by postgres, so only postgres defaults
-- are changed here; no role escalation or supabase_admin default-ACL change is used.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;

-- Remove current broad privileges, including legacy column-level grants.
revoke all privileges on table public.products from public, anon, authenticated, service_role;
revoke all privileges on table public.profiles from public, anon, authenticated, service_role;
revoke all privileges on table public.blog_posts from public, anon, authenticated, service_role;
revoke all privileges on table public.orders from public, anon, authenticated, service_role;
revoke all privileges on table public.retrageri from public, anon, authenticated, service_role;
revoke all privileges on table public.favorites from public, anon, authenticated, service_role;

do $$
declare
  target_table text;
  column_list text;
begin
  foreach target_table in array
    array['products', 'profiles', 'blog_posts', 'orders', 'retrageri', 'favorites']
  loop
    select string_agg(format('%I', a.attname), ', ' order by a.attnum)
    into column_list
    from pg_catalog.pg_attribute a
    where a.attrelid = format('public.%I', target_table)::regclass
      and a.attnum > 0
      and not a.attisdropped;

    if column_list is not null then
      execute format(
        'revoke all privileges (%s) on table public.%I from public, anon, authenticated, service_role',
        column_list,
        target_table
      );
    end if;
  end loop;
end;
$$;

-- Existing functions must not remain implicitly callable by clients.
revoke all privileges on all functions in schema public from public, anon, authenticated;

-- Add the nullable guest-confirmation hash without changing any existing order data.
alter table public.orders
  add column if not exists confirmation_token_hash text;

do $$
declare
  hash_attribute_number smallint;
  hash_type text;
begin
  select a.attnum, pg_catalog.format_type(a.atttypid, a.atttypmod)
  into hash_attribute_number, hash_type
  from pg_catalog.pg_attribute a
  where a.attrelid = 'public.orders'::regclass
    and a.attname = 'confirmation_token_hash'
    and a.attnum > 0
    and not a.attisdropped;

  if hash_type is distinct from 'text' then
    raise exception 'public.orders.confirmation_token_hash exists but is not text';
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_constraint c
    where c.conrelid = 'public.orders'::regclass
      and c.contype = 'u'
      and c.conkey = array[hash_attribute_number]::smallint[]
  ) and to_regclass('public.orders_confirmation_token_hash_unique_idx') is null then
    create unique index orders_confirmation_token_hash_unique_idx
      on public.orders (confirmation_token_hash)
      where confirmation_token_hash is not null;
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_constraint c
    where c.conrelid = 'public.orders'::regclass
      and c.conname = 'orders_confirmation_token_hash_check'
  ) then
    alter table public.orders
      add constraint orders_confirmation_token_hash_check
      check (
        confirmation_token_hash is null
        or confirmation_token_hash ~ '^[0-9a-f]{64}$'
      );
  end if;
end;
$$;

-- Remove every legacy policy from the six reconciled tables. Policy identifiers
-- come only from PostgreSQL catalogs and table names come from this fixed allowlist.
do $$
declare
  target_table text;
  policy_record record;
begin
  foreach target_table in array
    array['products', 'profiles', 'blog_posts', 'orders', 'retrageri', 'favorites']
  loop
    for policy_record in
      select p.polname
      from pg_catalog.pg_policy p
      join pg_catalog.pg_class c on c.oid = p.polrelid
      join pg_catalog.pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = target_table
    loop
      execute format('drop policy %I on public.%I', policy_record.polname, target_table);
    end loop;
  end loop;
end;
$$;

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.orders enable row level security;
alter table public.retrageri enable row level security;
alter table public.favorites enable row level security;

-- Products: public catalog reads active rows only; writes stay server-side.
grant select on table public.products to anon, authenticated;
grant select, insert, update, delete on table public.products to service_role;

create policy products_public_read_active
on public.products
for select
to anon, authenticated
using (active = true);

-- Profiles: users can read and upsert only their own non-administrative fields.
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
grant select, insert, update, delete on table public.profiles to service_role;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = (select auth.uid()));

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Blog administration uses authorized server routes; clients read published posts only.
grant select on table public.blog_posts to anon, authenticated;
grant select, insert, update, delete on table public.blog_posts to service_role;

create policy blog_posts_public_read_published
on public.blog_posts
for select
to anon, authenticated
using (published = true);

-- Orders have no client grants and no policies. RLS therefore denies direct Data API access.
grant select, insert, update, delete on table public.orders to service_role;

-- Favorites remain a direct authenticated-client feature scoped to auth.uid().
grant select, insert, update, delete on table public.favorites to authenticated;
grant select, insert, update, delete on table public.favorites to service_role;

create policy favorites_select_own
on public.favorites
for select
to authenticated
using (user_id = (select auth.uid()));

create policy favorites_insert_own
on public.favorites
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy favorites_update_own
on public.favorites
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy favorites_delete_own
on public.favorites
for delete
to authenticated
using (user_id = (select auth.uid()));

-- Withdrawal clients cannot set status; the existing safe default supplies 'nou'.
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
  iban
) on public.retrageri to anon, authenticated;
grant select (id, created_at, numar_comanda, produs, pret, status, motiv)
on public.retrageri to authenticated;
grant select, insert, update, delete on table public.retrageri to service_role;

create policy retrageri_submit
on public.retrageri
for insert
to anon, authenticated
with check (status = 'nou');

create policy retrageri_select_own_email
on public.retrageri
for select
to authenticated
using (
  nullif((select auth.jwt()) ->> 'email', '') is not null
  and lower(email) = lower(nullif((select auth.jwt()) ->> 'email', ''))
);

-- Reconcile the legacy public function with the private dev-baseline function.
create schema if not exists private authorization postgres;
alter schema private owner to postgres;
revoke all on schema private from public, anon, authenticated, service_role;
grant usage on schema private to supabase_auth_admin;

do $$
declare
  has_public boolean := to_regprocedure('public.handle_new_user()') is not null;
  has_private boolean := to_regprocedure('private.handle_new_user()') is not null;
begin
  if has_public and has_private then
    raise exception 'Both public.handle_new_user() and private.handle_new_user() exist; reconciliation is ambiguous';
  elsif has_public then
    execute 'alter function public.handle_new_user() set schema private';
  elsif not has_private then
    raise exception 'Neither public.handle_new_user() nor private.handle_new_user() exists';
  end if;
end;
$$;

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
revoke all on function private.handle_new_user() from public, anon, authenticated, service_role;
grant execute on function private.handle_new_user() to supabase_auth_admin;

-- Moving a function preserves trigger dependencies; fail safely if auth.users no longer
-- points to the final private function instead of recreating an unknown legacy trigger.
do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_trigger t
    join pg_catalog.pg_proc p on p.oid = t.tgfoid
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where t.tgrelid = 'auth.users'::regclass
      and t.tgname = 'on_auth_user_created'
      and not t.tgisinternal
      and t.tgfoid = to_regprocedure('private.handle_new_user()')::oid
      and t.tgtype = 5
      and t.tgenabled in ('O', 'A')
      and n.nspname = 'private'
      and p.proname = 'handle_new_user'
      and p.pronargs = 0
  ) then
    raise exception 'No auth.users trigger invokes private.handle_new_user()';
  end if;
end;
$$;

-- Harden the legacy blog timestamp helper only when production contains it.
do $$
begin
  if to_regprocedure('public.set_updated_at_blog_posts()') is not null then
    execute format(
      'alter function public.set_updated_at_blog_posts() set search_path = %L',
      ''
    );
    execute 'revoke all on function public.set_updated_at_blog_posts() from public, anon, authenticated';
  end if;
end;
$$;

-- Keep the existing public bucket unchanged. Remove policies tied to product-images;
-- known public URLs remain available without Data API metadata access for clients.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select p.polname
    from pg_catalog.pg_policy p
    where p.polrelid = 'storage.objects'::regclass
      and (
        p.polname = 'product_images_public_read'
        or coalesce(pg_catalog.pg_get_expr(p.polqual, p.polrelid), '') like '%product-images%'
        or coalesce(pg_catalog.pg_get_expr(p.polwithcheck, p.polrelid), '') like '%product-images%'
      )
  loop
    execute format('drop policy %I on storage.objects', policy_record.polname);
  end loop;
end;
$$;

revoke all privileges on table storage.objects
from public, anon, authenticated, service_role;
revoke all privileges on table storage.buckets
from public, anon, authenticated, service_role;

grant select, insert, update, delete on table storage.objects to service_role;
grant select on table storage.buckets to service_role;
