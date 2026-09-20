-- =====================================================================
-- Sold It Today | Agent Hub: cache the stable external MLS listing key
-- ADDITIVE. Stores the Spark/flexmls ListingKey (stable, unique) on our
-- listing so IDX primary-photo sync resolves once and reads our own DB
-- thereafter (no per-render feed calls). listings is already org-scoped.
-- =====================================================================
alter table public.listings add column if not exists listing_key text;
create index if not exists idx_listings_listing_key on public.listings(listing_key);
