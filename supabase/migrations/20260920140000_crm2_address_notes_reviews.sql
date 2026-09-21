-- =====================================================================
-- Sold It Today | CRM Stage 2-lite — ADDRESS + NOTES + REVIEWS
-- Additive: a mailing address on people, plus per-contact notes and a
-- review tracker. Child tables mirror the person RLS (tenant wall +
-- role/ownership/visibility via _can_read/write_person). Additive only.
-- =====================================================================
begin;

-- 1. people.address (mailing address shown in Contact info)
alter table public.people add column if not exists address text;

-- 2. person_notes — private notes about a contact
create table if not exists public.person_notes (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  person_id        uuid not null,
  body             text not null,
  author_agent_id  uuid references public.agents(id) on delete set null,
  created_at       timestamptz not null default now(),
  constraint person_notes_person_fk
    foreign key (person_id, organization_id)
    references public.people (id, organization_id) on delete cascade
);
create index if not exists idx_person_notes_person on public.person_notes (person_id);
create index if not exists idx_person_notes_org    on public.person_notes (organization_id);

-- 3. person_reviews — track the review we asked for and where it landed
create table if not exists public.person_reviews (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  person_id        uuid not null,
  status           text not null default 'requested'
                     check (status in ('requested','left','declined')),
  platform         text,
  rating           int check (rating is null or rating between 1 and 5),
  quote            text,
  url              text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint person_reviews_person_fk
    foreign key (person_id, organization_id)
    references public.people (id, organization_id) on delete cascade
);
create index if not exists idx_person_reviews_person on public.person_reviews (person_id);
create index if not exists idx_person_reviews_org    on public.person_reviews (organization_id);

drop trigger if exists person_reviews_set_updated_at on public.person_reviews;
create trigger person_reviews_set_updated_at before update on public.person_reviews
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS (child-of-person, same shape as person_relationships)
-- ---------------------------------------------------------------------
alter table public.person_notes   enable row level security;
alter table public.person_reviews enable row level security;

-- notes
create policy person_notes_tenant on public.person_notes as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy person_notes_sel on public.person_notes for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_person(person_id));
create policy person_notes_ins on public.person_notes for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_notes_upd on public.person_notes for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_notes_del on public.person_notes for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id));

-- reviews
create policy person_reviews_tenant on public.person_reviews as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy person_reviews_sel on public.person_reviews for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_person(person_id));
create policy person_reviews_ins on public.person_reviews for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_reviews_upd on public.person_reviews for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_reviews_del on public.person_reviews for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id));

commit;
