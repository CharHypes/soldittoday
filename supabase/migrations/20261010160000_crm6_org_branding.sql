-- =====================================================================
-- Sold It Today | CRM Stage 6 — organization branding
-- Per-org logo + brand name + tagline (white-label), and a PUBLIC bucket
-- for logos (served via the public CDN; uploads go through the service
-- role; the org row is updated under RLS by the owner). Additive.
-- =====================================================================
begin;

alter table public.organizations add column if not exists logo_url   text;
alter table public.organizations add column if not exists brand_name text;
alter table public.organizations add column if not exists tagline    text;

-- public bucket for brand logos (public read; writes via service role only)
insert into storage.buckets (id, name, public)
values ('brand-logos', 'brand-logos', true)
on conflict (id) do nothing;

commit;
