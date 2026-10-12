-- CRM14: per-deal commission figures (owner-only in the UI; stored on the transaction).
-- The live calculator reads/writes these; nothing here is exposed to the client/buyer portal.

alter table public.transactions add column if not exists commission_sale_price numeric;      -- commissionable price (defaults to price in UI)
alter table public.transactions add column if not exists commission_rate      numeric;      -- this side's commission %, e.g. 3.00
alter table public.transactions add column if not exists commission_flat      numeric;      -- optional flat $ instead of %
alter table public.transactions add column if not exists referral_pct         numeric;      -- referral taken off the top, %
alter table public.transactions add column if not exists referral_to          text;         -- who the referral is paid to
alter table public.transactions add column if not exists sit_fee              numeric;      -- Sold It Today fee, flat $, separate line
alter table public.transactions add column if not exists commission_splits    jsonb;        -- [{ "name": "Charlotte", "pct": 80 }, ...]
alter table public.transactions add column if not exists commission_notes     text;
