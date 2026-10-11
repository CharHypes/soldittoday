-- =====================================================================
-- Sold It Today | CRM Stage 8 — buyer transaction MLS + photo sync
-- Buyer deals can carry the property's MLS number + the stable Spark
-- ListingKey, so we can pull the home's main photo from IDX (same as
-- listings). transactions.photo_url already exists. Additive.
-- =====================================================================
begin;
alter table public.transactions add column if not exists mls_number  text;
alter table public.transactions add column if not exists listing_key text;
create index if not exists idx_transactions_listing_key on public.transactions(listing_key);
commit;
