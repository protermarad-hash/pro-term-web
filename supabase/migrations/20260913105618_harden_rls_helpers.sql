-- Prevent Data API roles from invoking the platform RLS event-trigger helper.
-- The event trigger itself continues to run as its owner.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Keep the same ownership rule while allowing PostgreSQL to initialize auth.jwt() once.
drop policy if exists retrageri_select_own_email on public.retrageri;

create policy retrageri_select_own_email
on public.retrageri
for select
to authenticated
using (
lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
);
