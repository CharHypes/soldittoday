-- =====================================================================
-- Sold It Today  |  PHASE 0: Organization / Tenancy Foundation
-- ADDITIVE ONLY migration (corrected per review 2026-09-12)
-- ---------------------------------------------------------------------
-- Guarantees:
--   * No renames, no drops, no NOT NULL added to existing columns.
--   * No existing RLS policy created/altered/dropped (Phase 1 does the flip).
--   * current_agent_id() and the portal RPCs are left untouched.
--   * transaction_participants is NOT created (deferred to Phase 2).
--   * membership is the single identity source: auth.users -> memberships -> agents.
--     agents gets membership_id (NOT user_id). NULL membership_id is allowed.
--   * No fake auth users; only Charlotte's agent links to her membership.
--   * QWOME is not referenced anywhere.
-- Fully additive => reversible by dropping the new objects/columns.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Organizations (the tenant)
-- ---------------------------------------------------------------------
create table if not exists public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text unique,
  created_at timestamptz not null default now()
);
alter table public.organizations enable row level security;
-- No policies yet: not queried by the current app; Phase 1 adds org RLS.

-- ---------------------------------------------------------------------
-- 2. Memberships (single identity source; uniqueness lives here)
-- ---------------------------------------------------------------------
create table if not exists public.memberships (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  role            text not null default 'agent'  check (role   in ('owner','admin','team_lead','agent')),
  status          text not null default 'active' check (status in ('active','invited','suspended')),
  created_at      timestamptz not null default now(),
  constraint memberships_org_user_key unique (organization_id, user_id),
  constraint memberships_id_org_key   unique (id, organization_id)   -- composite target for agents FK
);
alter table public.memberships enable row level security;

-- ---------------------------------------------------------------------
-- 3. Seed the Sold It Today org + Charlotte's OWNER membership
--    user_id is derived from the real auth.users row (no fake users).
-- ---------------------------------------------------------------------
insert into public.organizations (name, slug)
values ('Sold It Today', 'sold-it-today')
on conflict (slug) do nothing;

insert into public.memberships (organization_id, user_id, role, status)
select o.id, u.id, 'owner', 'active'
from public.organizations o
cross join auth.users u
where o.slug = 'sold-it-today'
  and lower(u.email) = lower('charlotte@soldittoday.com')
on conflict (organization_id, user_id) do nothing;

-- ---------------------------------------------------------------------
-- 4. Add tenancy + identity columns (ALL nullable — additive)
-- ---------------------------------------------------------------------
alter table public.agents               add column if not exists organization_id uuid references public.organizations(id);
alter table public.agents               add column if not exists membership_id   uuid;
alter table public.clients              add column if not exists organization_id uuid references public.organizations(id);
alter table public.listings             add column if not exists organization_id uuid references public.organizations(id);
alter table public.transactions         add column if not exists organization_id uuid references public.organizations(id);
alter table public.engagement_snapshots add column if not exists organization_id uuid references public.organizations(id);
alter table public.notes                add column if not exists organization_id uuid references public.organizations(id);
alter table public.milestones           add column if not exists organization_id uuid references public.organizations(id);
alter table public.documents            add column if not exists organization_id uuid references public.organizations(id);
alter table public.leads                add column if not exists organization_id uuid references public.organizations(id);

-- Ownership / visibility (Phase 1 permission layer will use these)
alter table public.leads        add column if not exists owner_agent_id uuid;
alter table public.listings     add column if not exists visibility text not null default 'private' check (visibility in ('private','organization','public'));
alter table public.transactions add column if not exists visibility text not null default 'private' check (visibility in ('private','organization','public'));
alter table public.clients      add column if not exists visibility text not null default 'private' check (visibility in ('private','organization','public'));
alter table public.documents    add column if not exists visibility text not null default 'private' check (visibility in ('private','organization','public'));

-- ---------------------------------------------------------------------
-- 5. Backfill tenancy => the Sold It Today org (existing rows only)
-- ---------------------------------------------------------------------
update public.agents               set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.clients              set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.listings             set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.transactions         set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.engagement_snapshots set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.notes                set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.milestones           set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.documents            set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;
update public.leads                set organization_id = (select id from public.organizations where slug='sold-it-today') where organization_id is null;

-- ---------------------------------------------------------------------
-- 6. Link ONLY Charlotte's agent profile to her membership.
--    Match by email to a membership's auth user. Agents without a matching
--    authenticated user keep membership_id = NULL (but still get the org above).
-- ---------------------------------------------------------------------
update public.agents a
set membership_id = m.id
from public.memberships m
join auth.users u on u.id = m.user_id
where m.organization_id = (select id from public.organizations where slug='sold-it-today')
  and lower(a.email) = lower(u.email)
  and a.membership_id is null;

-- ---------------------------------------------------------------------
-- 7. Parent composite uniques (targets for denormalized composite FKs)
-- ---------------------------------------------------------------------
alter table public.agents       add constraint agents_id_org_key       unique (id, organization_id);
alter table public.clients      add constraint clients_id_org_key      unique (id, organization_id);
alter table public.listings     add constraint listings_id_org_key     unique (id, organization_id);
alter table public.transactions add constraint transactions_id_org_key unique (id, organization_id);

-- ---------------------------------------------------------------------
-- 8. Composite foreign keys (DB-enforced tenancy integrity).
--    MATCH SIMPLE (default): skipped automatically when a nullable
--    referencing column is NULL, so existing partial data is unaffected.
-- ---------------------------------------------------------------------
-- 8a. agents identity chain (1:1 agent<->membership)
alter table public.agents add constraint agents_membership_id_key unique (membership_id);
alter table public.agents add constraint agents_membership_org_fkey
  foreign key (membership_id, organization_id) references public.memberships (id, organization_id);

-- 8b. owned records -> agents (agent_id, org)
alter table public.listings     add constraint listings_agent_org_fkey     foreign key (agent_id, organization_id) references public.agents(id, organization_id);
alter table public.transactions add constraint transactions_agent_org_fkey foreign key (agent_id, organization_id) references public.agents(id, organization_id);
alter table public.clients      add constraint clients_agent_org_fkey      foreign key (agent_id, organization_id) references public.agents(id, organization_id);
alter table public.documents    add constraint documents_agent_org_fkey    foreign key (agent_id, organization_id) references public.agents(id, organization_id);

-- 8c. client links (client_id, org) -> clients
alter table public.listings     add constraint listings_client_org_fkey     foreign key (client_id, organization_id) references public.clients(id, organization_id);
alter table public.transactions add constraint transactions_client_org_fkey foreign key (client_id, organization_id) references public.clients(id, organization_id);

-- 8d. child records -> parent (parent_id, org)
alter table public.engagement_snapshots add constraint snapshots_listing_org_fkey    foreign key (listing_id, organization_id)     references public.listings(id, organization_id);
alter table public.notes                add constraint notes_listing_org_fkey        foreign key (listing_id, organization_id)     references public.listings(id, organization_id);
alter table public.notes                add constraint notes_transaction_org_fkey    foreign key (transaction_id, organization_id) references public.transactions(id, organization_id);
alter table public.milestones           add constraint milestones_transaction_org_fkey foreign key (transaction_id, organization_id) references public.transactions(id, organization_id);
alter table public.documents            add constraint documents_listing_org_fkey     foreign key (listing_id, organization_id)     references public.listings(id, organization_id);
alter table public.documents            add constraint documents_transaction_org_fkey foreign key (transaction_id, organization_id) references public.transactions(id, organization_id);

-- 8e. leads owner (owner_agent_id, org) -> agents
alter table public.leads add constraint leads_owner_agent_org_fkey foreign key (owner_agent_id, organization_id) references public.agents(id, organization_id);

-- ---------------------------------------------------------------------
-- 9. Hardened membership helper functions (DEFINED, not yet used by any policy).
--    search_path = '' + fully-qualified refs; owned by postgres;
--    execute revoked from public, granted to authenticated.
-- ---------------------------------------------------------------------
create or replace function public.current_org_ids() returns setof uuid
  language sql stable security definer set search_path = ''
  as $$ select m.organization_id from public.memberships m
        where m.user_id = auth.uid() and m.status = 'active'; $$;

create or replace function public.my_agent_id() returns uuid
  language sql stable security definer set search_path = ''
  as $$ select a.id from public.agents a
        join public.memberships m on m.id = a.membership_id
        where m.user_id = auth.uid() and m.status = 'active' limit 1; $$;

create or replace function public.has_org_role(p_org uuid, p_roles text[]) returns boolean
  language sql stable security definer set search_path = ''
  as $$ select exists (
          select 1 from public.memberships m
          where m.user_id = auth.uid() and m.organization_id = p_org
            and m.status = 'active' and m.role = any(p_roles)); $$;

alter function public.current_org_ids()            owner to postgres;
alter function public.my_agent_id()                owner to postgres;
alter function public.has_org_role(uuid, text[])   owner to postgres;
revoke all on function public.current_org_ids()          from public;
revoke all on function public.my_agent_id()              from public;
revoke all on function public.has_org_role(uuid, text[]) from public;
grant execute on function public.current_org_ids()          to authenticated;
grant execute on function public.my_agent_id()              to authenticated;
grant execute on function public.has_org_role(uuid, text[]) to authenticated;

-- ---------------------------------------------------------------------
-- 10. COMPATIBILITY LAYER (TEMPORARY — remove/replace in Phase 1).
--     The current app does not send organization_id yet. These BEFORE INSERT
--     triggers DERIVE org from the owning agent / parent record (never trust
--     client-supplied org). SECURITY DEFINER so they resolve org regardless
--     of the caller's RLS (required for the anonymous website-lead path).
--     >>> PHASE 1 REMOVAL: drop these triggers + functions once the app sends
--         organization_id via host/org resolution. <<<
-- ---------------------------------------------------------------------
create or replace function public._phase0_sit_org() returns uuid
  language sql stable security definer set search_path = ''
  as $$ select id from public.organizations where slug = 'sold-it-today' limit 1; $$;

create or replace function public._phase0_stamp_from_agent() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  if new.agent_id is not null then
    select a.organization_id into new.organization_id from public.agents a where a.id = new.agent_id;
  end if;
  return new;
end $$;

create or replace function public._phase0_stamp_snapshot() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  if new.listing_id is not null then
    select l.organization_id into new.organization_id from public.listings l where l.id = new.listing_id;
  end if;
  return new;
end $$;

create or replace function public._phase0_stamp_note() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  if new.listing_id is not null then
    select l.organization_id into new.organization_id from public.listings l where l.id = new.listing_id;
  elsif new.transaction_id is not null then
    select t.organization_id into new.organization_id from public.transactions t where t.id = new.transaction_id;
  end if;
  return new;
end $$;

create or replace function public._phase0_stamp_milestone() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  if new.transaction_id is not null then
    select t.organization_id into new.organization_id from public.transactions t where t.id = new.transaction_id;
  end if;
  return new;
end $$;

create or replace function public._phase0_stamp_document() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  if new.agent_id is not null then
    select a.organization_id into new.organization_id from public.agents a where a.id = new.agent_id;
  elsif new.listing_id is not null then
    select l.organization_id into new.organization_id from public.listings l where l.id = new.listing_id;
  elsif new.transaction_id is not null then
    select t.organization_id into new.organization_id from public.transactions t where t.id = new.transaction_id;
  end if;
  return new;
end $$;

create or replace function public._phase0_stamp_lead() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  if new.owner_agent_id is not null then
    select a.organization_id into new.organization_id from public.agents a where a.id = new.owner_agent_id;
  end if;
  if new.organization_id is null then
    new.organization_id := public._phase0_sit_org();  -- TEMP: anonymous leads default to Sold It Today
  end if;
  return new;
end $$;

create trigger phase0_stamp_org before insert on public.listings             for each row execute function public._phase0_stamp_from_agent();
create trigger phase0_stamp_org before insert on public.transactions         for each row execute function public._phase0_stamp_from_agent();
create trigger phase0_stamp_org before insert on public.clients              for each row execute function public._phase0_stamp_from_agent();
create trigger phase0_stamp_org before insert on public.engagement_snapshots for each row execute function public._phase0_stamp_snapshot();
create trigger phase0_stamp_org before insert on public.notes                for each row execute function public._phase0_stamp_note();
create trigger phase0_stamp_org before insert on public.milestones           for each row execute function public._phase0_stamp_milestone();
create trigger phase0_stamp_org before insert on public.documents            for each row execute function public._phase0_stamp_document();
create trigger phase0_stamp_org before insert on public.leads                for each row execute function public._phase0_stamp_lead();

-- harden ownership of the compatibility functions too
alter function public._phase0_sit_org()          owner to postgres;
alter function public._phase0_stamp_from_agent() owner to postgres;
alter function public._phase0_stamp_snapshot()   owner to postgres;
alter function public._phase0_stamp_note()       owner to postgres;
alter function public._phase0_stamp_milestone()  owner to postgres;
alter function public._phase0_stamp_document()   owner to postgres;
alter function public._phase0_stamp_lead()       owner to postgres;
revoke all on function public._phase0_sit_org()          from public;
revoke all on function public._phase0_stamp_from_agent() from public;
revoke all on function public._phase0_stamp_snapshot()   from public;
revoke all on function public._phase0_stamp_note()       from public;
revoke all on function public._phase0_stamp_milestone()  from public;
revoke all on function public._phase0_stamp_document()   from public;
revoke all on function public._phase0_stamp_lead()       from public;

-- ---------------------------------------------------------------------
-- 11. Indexes (org scoping + ownership lookups)
-- ---------------------------------------------------------------------
create index if not exists idx_agents_org        on public.agents(organization_id);
create index if not exists idx_clients_org       on public.clients(organization_id);
create index if not exists idx_listings_org      on public.listings(organization_id);
create index if not exists idx_transactions_org  on public.transactions(organization_id);
create index if not exists idx_snapshots_org     on public.engagement_snapshots(organization_id);
create index if not exists idx_notes_org         on public.notes(organization_id);
create index if not exists idx_milestones_org    on public.milestones(organization_id);
create index if not exists idx_documents_org     on public.documents(organization_id);
create index if not exists idx_leads_org         on public.leads(organization_id);
create index if not exists idx_memberships_user     on public.memberships(user_id);
create index if not exists idx_memberships_org_role on public.memberships(organization_id, role);
create index if not exists idx_listings_org_agent     on public.listings(organization_id, agent_id);
create index if not exists idx_transactions_org_agent on public.transactions(organization_id, agent_id);
create index if not exists idx_clients_org_agent      on public.clients(organization_id, agent_id);
create index if not exists idx_documents_org_agent    on public.documents(organization_id, agent_id);
create index if not exists idx_leads_org_owner        on public.leads(organization_id, owner_agent_id);

commit;
