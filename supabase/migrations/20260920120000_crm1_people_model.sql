-- =====================================================================
-- Sold It Today | CRM Stage 1 — PEOPLE MODEL (contact card foundation)
-- Adds the identity layer for the Agent Hub CRM, org-first, with the same
-- two-layer RLS as clients/listings/transactions:
--   RESTRICTIVE tenant wall  : organization_id = active_org_id()
--   PERMISSIVE role/own/vis   : owner/admin/team_lead, or owning agent, or
--                               visibility = 'organization'
-- New tables:
--   people               — one row per person (the contact)
--   person_relationships — spouse / co-buyer / "with X" links
--   transaction_people   — who is buyer/seller/co-* on each deal
-- Plus a non-breaking backfill from the existing `clients` + `transactions`.
-- Additive only: clients / listings / transactions are left untouched.
-- All-or-nothing.
-- =====================================================================
begin;

-- ---------------------------------------------------------------------
-- 1. PEOPLE  (owned table, mirrors clients)
-- ---------------------------------------------------------------------
create table if not exists public.people (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  agent_id         uuid references public.agents(id) on delete set null,
  visibility       text not null default 'organization'
                     check (visibility in ('private','organization','public')),
  -- name (structured; at least one part required)
  first_name       text,
  last_name        text,
  company          text,
  display_name     text,
  -- classification
  type             text not null default 'buyer'
                     check (type in ('buyer','seller','both','past_client','lead','investor','renter')),
  -- contact
  email            text,
  phone            text,
  -- personal
  birthday         date,
  marital_status   text
                     check (marital_status is null or marital_status in
                       ('single','married','partnered','divorced','widowed','prefer_not_to_say')),
  -- referral
  lead_source          text,
  referred_by_person_id uuid references public.people(id) on delete set null,
  -- provenance (so the one-time backfill is idempotent)
  source_client_id uuid references public.clients(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- a person must have at least one name part
  constraint people_has_name check (
    num_nonnulls(nullif(btrim(coalesce(first_name,'')),''),
                 nullif(btrim(coalesce(last_name,'')),''),
                 nullif(btrim(coalesce(company,'')),''),
                 nullif(btrim(coalesce(display_name,'')),'')) >= 1
  ),
  -- composite target so child tables can enforce same-org at the DB level
  constraint people_id_org_key unique (id, organization_id)
);

-- sortable "Last, First" key (last name, else company, else display name)
alter table public.people add column if not exists sort_key text
  generated always as (
    lower(coalesce(nullif(btrim(coalesce(last_name,'')),''),
                   nullif(btrim(coalesce(company,'')),''),
                   nullif(btrim(coalesce(display_name,'')),''),
                   nullif(btrim(coalesce(first_name,'')),''), ''))
  ) stored;

create index if not exists idx_people_org           on public.people (organization_id);
create index if not exists idx_people_org_sort       on public.people (organization_id, sort_key);
create index if not exists idx_people_agent          on public.people (agent_id);
create index if not exists idx_people_referred_by    on public.people (referred_by_person_id);
create unique index if not exists uq_people_source_client
  on public.people (source_client_id) where source_client_id is not null;

-- ---------------------------------------------------------------------
-- 2. PERSON_RELATIONSHIPS  (child of people; spouse / co-buyer / "with X")
--    related_person_id is optional: the other party may not be a contact,
--    so related_name carries the free-text name in that case.
-- ---------------------------------------------------------------------
create table if not exists public.person_relationships (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references public.organizations(id) on delete cascade,
  person_id         uuid not null,
  -- the other party may not be a contact, so it is a simple nullable FK
  -- (on delete set null cannot null the NOT NULL organization_id, so no composite here)
  related_person_id uuid references public.people(id) on delete set null,
  related_name      text,
  relation          text not null default 'other'
                      check (relation in
                        ('spouse','partner','co_buyer','co_seller','family','assistant','attorney','lender','other')),
  is_primary        boolean not null default false,   -- drives the header "with X (spouse)" line
  created_at        timestamptz not null default now(),
  -- person is same-org enforced at the DB level (composite FK)
  constraint person_rel_person_fk
    foreign key (person_id, organization_id)
    references public.people (id, organization_id) on delete cascade,
  constraint person_rel_has_other check (related_person_id is not null or nullif(btrim(coalesce(related_name,'')),'') is not null)
);
create index if not exists idx_person_rel_person  on public.person_relationships (person_id);
create index if not exists idx_person_rel_related on public.person_relationships (related_person_id);
create index if not exists idx_person_rel_org     on public.person_relationships (organization_id);

-- ---------------------------------------------------------------------
-- 3. TRANSACTION_PEOPLE  (child of BOTH transaction and person)
--    name_on_deal = the person's name exactly as it was on that deal.
-- ---------------------------------------------------------------------
create table if not exists public.transaction_people (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  transaction_id   uuid not null,
  person_id        uuid not null,
  role             text not null default 'buyer'
                     check (role in ('buyer','seller','co_buyer','co_seller','other')),
  name_on_deal     text,
  created_at       timestamptz not null default now(),
  constraint txp_transaction_fk
    foreign key (transaction_id, organization_id)
    references public.transactions (id, organization_id) on delete cascade,
  constraint txp_person_fk
    foreign key (person_id, organization_id)
    references public.people (id, organization_id) on delete cascade,
  constraint txp_unique unique (transaction_id, person_id, role)
);
create index if not exists idx_txp_transaction on public.transaction_people (transaction_id);
create index if not exists idx_txp_person      on public.transaction_people (person_id);
create index if not exists idx_txp_org         on public.transaction_people (organization_id);

-- ---------------------------------------------------------------------
-- 4. updated_at bump for people
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger
  language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;
alter function public.set_updated_at() owner to postgres;

drop trigger if exists people_set_updated_at on public.people;
create trigger people_set_updated_at before update on public.people
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 5. Parent-permission helpers for people (SECURITY DEFINER; no RLS recursion)
-- ---------------------------------------------------------------------
create or replace function public._can_read_person(p_id uuid) returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.people p where p.id = p_id and (
    public.has_org_role(p.organization_id, array['owner','admin','team_lead'])
    or p.agent_id = public.my_agent_id() or p.visibility = 'organization')); $$;
create or replace function public._can_write_person(p_id uuid) returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.people p where p.id = p_id and (
    public.has_org_role(p.organization_id, array['owner','admin']) or p.agent_id = public.my_agent_id())); $$;
alter function public._can_read_person(uuid)  owner to postgres;
alter function public._can_write_person(uuid) owner to postgres;
revoke all on function public._can_read_person(uuid), public._can_write_person(uuid) from public;
grant execute on function public._can_read_person(uuid), public._can_write_person(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 6. RLS
-- ---------------------------------------------------------------------
alter table public.people               enable row level security;
alter table public.person_relationships enable row level security;
alter table public.transaction_people   enable row level security;

-- people (owned)
create policy people_tenant on public.people as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy people_sel on public.people for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','team_lead']) or agent_id = public.my_agent_id() or visibility = 'organization');
create policy people_ins on public.people for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy people_upd on public.people for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id())
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy people_del on public.people for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id());

-- person_relationships (child of person)
create policy person_rel_tenant on public.person_relationships as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy person_rel_sel on public.person_relationships for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_person(person_id));
create policy person_rel_ins on public.person_relationships for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_rel_upd on public.person_relationships for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_rel_del on public.person_relationships for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id));

-- transaction_people (child of transaction + person)
create policy txp_tenant on public.transaction_people as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy txp_sel on public.transaction_people for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_transaction(transaction_id) or public._can_read_person(person_id));
create policy txp_ins on public.transaction_people for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id)));
create policy txp_upd on public.transaction_people for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id)));
create policy txp_del on public.transaction_people for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id));

-- ---------------------------------------------------------------------
-- 7. BACKFILL  (idempotent; keyed on people.source_client_id)
--    One person per existing client; last token -> last_name for sorting.
-- ---------------------------------------------------------------------
insert into public.people
  (organization_id, agent_id, visibility, first_name, last_name, display_name, type, email, phone, source_client_id)
select
  c.organization_id,
  c.agent_id,
  'organization',
  nullif(btrim(regexp_replace(c.name, '\S+\s*$', '')), '')                       as first_name, -- everything before last token
  coalesce(nullif(reverse(split_part(reverse(btrim(c.name)), ' ', 1)), ''), btrim(c.name)) as last_name,  -- last token
  btrim(c.name)                                                                  as display_name,
  case when c.type in ('buyer','seller') then c.type else 'buyer' end            as type,
  c.email,
  c.phone,
  c.id
from public.clients c
where c.organization_id is not null
  and nullif(btrim(coalesce(c.name,'')),'') is not null
  and not exists (select 1 from public.people p where p.source_client_id = c.id);

-- Link existing transactions to the person backfilled from their client.
insert into public.transaction_people
  (organization_id, transaction_id, person_id, role, name_on_deal)
select
  t.organization_id,
  t.id,
  p.id,
  case when p.type = 'seller' then 'seller' else 'buyer' end,
  p.display_name
from public.transactions t
join public.people p on p.source_client_id = t.client_id
where t.client_id is not null
  and t.organization_id is not null
  and t.organization_id = p.organization_id
  and not exists (
    select 1 from public.transaction_people x
    where x.transaction_id = t.id and x.person_id = p.id
  );

commit;
