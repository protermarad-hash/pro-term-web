-- Online withdrawal Phase 2 hardening.
-- The server-side /api/withdrawal flow is live; browser clients no longer need
-- direct INSERT access to public.retrageri.

revoke insert (
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
) on table public.retrageri from anon, authenticated;

drop policy if exists retrageri_submit on public.retrageri;

-- Keep authenticated read-own-email access for existing/future account history.
-- service_role retains full CRUD and is the only role used by /api/withdrawal.
