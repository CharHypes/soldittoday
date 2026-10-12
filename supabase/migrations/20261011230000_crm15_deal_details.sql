-- CRM15: the remaining transaction-detail fields the deal workspace shows
-- (matches the approved mockup's details grid + header meta strip). All nullable.

alter table public.transactions add column if not exists acceptance_date date;          -- offer accepted
alter table public.transactions add column if not exists emd_amount      numeric;       -- earnest money
alter table public.transactions add column if not exists emd_held_by     text;          -- who holds the EMD
alter table public.transactions add column if not exists deal_type       text;          -- Purchase / Sale / Lease ...
alter table public.transactions add column if not exists office          text;          -- team / brokerage office
alter table public.transactions add column if not exists year_built      int;
alter table public.transactions add column if not exists seller_name     text;          -- the other side (display)
alter table public.transactions add column if not exists waiting_on      text;          -- current blocker (header meta)
alter table public.transactions add column if not exists skyslope_email  text;          -- forward-to-broker address
alter table public.transactions add column if not exists referred_by     text;          -- referrer (header meta display)
