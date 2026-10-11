-- =====================================================================
-- Sold It Today | CRM Stage 9 — own-storage copy of MLS photos
-- Public bucket that holds OUR copy of each property's main photo,
-- downloaded from the MLS at sync time so we keep it even if the MLS
-- later drops it. Public read (property photos are public); writes via
-- the service role. Additive.
-- =====================================================================
begin;
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;
commit;
