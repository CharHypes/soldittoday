-- =====================================================================
-- Sold It Today | CRM Stage 27 — public listings (FSBO + overrides)
-- Lets a listing row be PUBLISHED to the public marketing site:
--   * FSBO / standalone (no MLS number): rendered at /l/<slug> from our DB.
--   * Override: a published row whose mls_number matches an IDX feed
--     listing; its non-null fields overlay the live feed on /listing/<id>.
--
-- Public (anon) reads go ONLY through SECURITY DEFINER functions that
-- return published rows and PUBLIC-SAFE columns (never portal/email tokens,
-- client/agent ids, org id, owner names, or private remarks). The existing
-- authenticated tenant wall and per-row policies are left untouched, so a
-- draft (published = false) is never exposed and tenant isolation is intact.
-- Additive + idempotent.
-- =====================================================================
begin;

alter table public.listings add column if not exists published   boolean not null default false;
alter table public.listings add column if not exists public_slug text;
alter table public.listings add column if not exists description  text;
alter table public.listings add column if not exists photos       text[];
-- Only the fields Charlotte DELIBERATELY overrides on a feed listing (never the
-- whole row), e.g. {"sqft":2365,"description":"..."}. Overlaid onto the IDX feed.
alter table public.listings add column if not exists overrides    jsonb;

-- One public URL per slug (enforced only for rows that have a slug).
create unique index if not exists uq_listings_public_slug
  on public.listings(public_slug) where public_slug is not null;

-- Fast lookups for the two public reads.
create index if not exists idx_listings_published_slug
  on public.listings(public_slug) where published;
create index if not exists idx_listings_published_mls
  on public.listings(mls_number) where published and mls_number is not null;

-- ---------------------------------------------------------------------
-- Public read #1: a standalone / FSBO listing by its unguessable-free,
-- human slug. Only ever returns a PUBLISHED row and public-safe columns.
-- ---------------------------------------------------------------------
create or replace function public.get_public_listing(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id',          l.id,
    'slug',        l.public_slug,
    'is_fsbo',     (l.mls_number is null),
    'mls_number',  l.mls_number,
    'address',     l.address,
    'city',        l.city,
    'state',       l.state,
    'zip',         l.zip,
    'price',       l.price,
    'beds',        l.beds,
    'baths',       l.baths,
    'sqft',        l.sqft,
    'status',      l.status,
    'description', l.description,
    'photo_url',   l.photo_url,
    'photos',      coalesce(l.photos, '{}'::text[]),
    'list_date',   l.list_date,
    'agent', jsonb_build_object(
      'name', a.name, 'brand', a.brand, 'phone', a.phone, 'email', a.email
    )
  )
  from public.listings l
  left join public.agents a on a.id = l.agent_id
  where l.public_slug = p_slug and l.published
  limit 1;
$$;

revoke all on function public.get_public_listing(text) from public;
grant execute on function public.get_public_listing(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Public read #2: override fields for a PUBLISHED row that matches an
-- MLS feed listing. The public /listing page overlays the non-null
-- values onto the live feed. Returns '{}'/null when there is no override.
-- ---------------------------------------------------------------------
create or replace function public.get_listing_override(p_mls text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_strip_nulls(coalesce(l.overrides, '{}'::jsonb))
  from public.listings l
  where l.published and l.mls_number is not null and l.mls_number = p_mls
  order by l.created_at desc
  limit 1;
$$;

revoke all on function public.get_listing_override(text) from public;
grant execute on function public.get_listing_override(text) to anon, authenticated;

commit;
