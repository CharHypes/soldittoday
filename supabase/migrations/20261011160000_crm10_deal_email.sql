-- =====================================================================
-- Sold It Today | CRM Stage 10 — per-deal email address
-- Each transaction + listing gets a unique, unguessable email token. The
-- address is <email_token>@<deal email domain>. Inbound mail to it files
-- attachments onto that deal's Documents (via the webhook). Additive.
-- =====================================================================
begin;

alter table public.transactions add column if not exists email_token text;
alter table public.listings     add column if not exists email_token text;

update public.transactions set email_token = substr(replace(gen_random_uuid()::text, '-', ''), 1, 12) where email_token is null;
update public.listings     set email_token = substr(replace(gen_random_uuid()::text, '-', ''), 1, 12) where email_token is null;

alter table public.transactions alter column email_token set default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
alter table public.listings     alter column email_token set default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);

create unique index if not exists uq_transactions_email_token on public.transactions(email_token);
create unique index if not exists uq_listings_email_token     on public.listings(email_token);

commit;
