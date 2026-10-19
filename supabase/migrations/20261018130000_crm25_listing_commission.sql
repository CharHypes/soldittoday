-- crm25: commission fields on listings (mirror transactions), for the seller-side
-- Commission tab. Column-only ... inherits the listings table RLS. The commission
-- numbers stay owner/admin-gated by the app: the server only serializes them to an
-- owner's page, and saveCommission refuses writes from non-owner/admin roles.
alter table public.listings
  add column if not exists commission_sale_price numeric,
  add column if not exists commission_rate        numeric,
  add column if not exists commission_flat         numeric,
  add column if not exists referral_pct            numeric,
  add column if not exists referral_to             text,
  add column if not exists sit_fee                 numeric,
  add column if not exists commission_splits       jsonb,
  add column if not exists commission_notes        text;
