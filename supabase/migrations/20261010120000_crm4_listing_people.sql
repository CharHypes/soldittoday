-- =====================================================================
-- Sold It Today | CRM Stage 4 — LISTING_PEOPLE
-- Links a listing (the sell side) to its contact(s), mirroring
-- transaction_people, so a seller listing shows on the contact card and
-- "start a listing" can start a contact card. Same two-layer RLS,
-- composite-FK cross-org integrity. Additive; backfills existing listings.
-- =====================================================================
begin;

create table if not exists public.listing_people (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  listing_id       uuid not null,
  person_id        uuid not null,
  role             text not null default 'seller'
                     check (role in ('seller','co_seller','buyer','co_buyer','other')),
  name_on_deal     text,
  created_at       timestamptz not null default now(),
  constraint lsp_listing_fk
    foreign key (listing_id, organization_id)
    references public.listings (id, organization_id) on delete cascade,
  constraint lsp_person_fk
    foreign key (person_id, organization_id)
    references public.people (id, organization_id) on delete cascade,
  constraint lsp_unique unique (listing_id, person_id, role)
);
create index if not exists idx_lsp_listing on public.listing_people (listing_id);
create index if not exists idx_lsp_person  on public.listing_people (person_id);
create index if not exists idx_lsp_org     on public.listing_people (organization_id);

alter table public.listing_people enable row level security;

create policy lsp_tenant on public.listing_people as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy lsp_sel on public.listing_people for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_listing(listing_id) or public._can_read_person(person_id));
create policy lsp_ins on public.listing_people for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id)));
create policy lsp_upd on public.listing_people for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id)));
create policy lsp_del on public.listing_people for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id));

-- Backfill: link each existing listing to the person from its client.
insert into public.listing_people (organization_id, listing_id, person_id, role, name_on_deal)
select l.organization_id, l.id, p.id, 'seller', p.display_name
from public.listings l
join public.people p on p.source_client_id = l.client_id
where l.client_id is not null
  and l.organization_id is not null
  and l.organization_id = p.organization_id
  and not exists (select 1 from public.listing_people x where x.listing_id = l.id and x.person_id = p.id);

commit;
