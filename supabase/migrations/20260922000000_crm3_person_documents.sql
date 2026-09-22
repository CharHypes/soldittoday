-- =====================================================================
-- Sold It Today | CRM Stage 2 — PERSON DOCUMENTS VAULT (data model)
-- The metadata + append-only access log for the private document vault.
-- FILE BYTES live in a PRIVATE Storage bucket (created separately); nobody
-- reads them directly ... access is server-only, 60-second signed links,
-- and every look is logged here. SSN cards ARE stored for Sold It Today
-- (DPA programs) at the highest sensitivity ... this OVERRIDES Butler's
-- "never store SSN cards" rule. Child-of-person RLS. Additive only.
-- =====================================================================
begin;

-- ---------------------------------------------------------------------
-- 1. person_documents — metadata for each stored file (bytes in the bucket)
-- ---------------------------------------------------------------------
create table if not exists public.person_documents (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references public.organizations(id) on delete cascade,
  person_id          uuid not null,
  kind               text not null default 'other'
                       check (kind in ('drivers_license','state_id','passport','resident_card',
                                       'pre_approval','proof_of_funds','income_letter',
                                       'ssn_card','other')),
  sensitivity        text not null default 'standard' check (sensitivity in ('standard','high')),
  storage_bucket     text not null default 'person-docs',
  storage_path       text not null,            -- path within the private bucket
  filename           text,
  content_type       text,
  byte_size          bigint,
  view_only          boolean not null default false,  -- IDs: view, no save
  expires_on         date,                     -- for IDs that expire
  keep_until         date,                     -- retention: 5y after last closing, then review
  uploaded_by_agent_id uuid references public.agents(id) on delete set null,
  created_at         timestamptz not null default now(),
  constraint person_documents_person_fk
    foreign key (person_id, organization_id)
    references public.people (id, organization_id) on delete cascade,
  constraint person_documents_path_key unique (storage_bucket, storage_path)
);
create index if not exists idx_person_documents_person on public.person_documents (person_id);
create index if not exists idx_person_documents_org    on public.person_documents (organization_id);

-- ---------------------------------------------------------------------
-- 2. person_doc_log — APPEND-ONLY audit trail (who, which doc, what, when)
--    No update/delete policies ever ... the log cannot be altered.
-- ---------------------------------------------------------------------
create table if not exists public.person_doc_log (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  document_id      uuid references public.person_documents(id) on delete set null,
  person_id        uuid,
  actor_agent_id   uuid references public.agents(id) on delete set null,
  action           text not null check (action in ('upload','view','download','copy','delete')),
  created_at       timestamptz not null default now()
);
create index if not exists idx_person_doc_log_doc    on public.person_doc_log (document_id);
create index if not exists idx_person_doc_log_person on public.person_doc_log (person_id);
create index if not exists idx_person_doc_log_org    on public.person_doc_log (organization_id);

-- ---------------------------------------------------------------------
-- 3. RLS
-- ---------------------------------------------------------------------
alter table public.person_documents enable row level security;
alter table public.person_doc_log   enable row level security;

-- documents: metadata readable/writable by members who can read/write the person.
-- (The FILE itself is never served from here ... only via the server function.)
create policy person_documents_tenant on public.person_documents as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy person_documents_sel on public.person_documents for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_person(person_id));
create policy person_documents_ins on public.person_documents for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_documents_upd on public.person_documents for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id)));
create policy person_documents_del on public.person_documents for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_person(person_id));

-- log: APPEND-ONLY. Members can read the log for people they can read, and insert
-- rows (the server function also writes it). There is deliberately NO update or
-- delete policy, so the audit trail cannot be altered from the app.
create policy person_doc_log_tenant on public.person_doc_log as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy person_doc_log_sel on public.person_doc_log for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_person(person_id));
create policy person_doc_log_ins on public.person_doc_log for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_person(person_id)));
-- (no update/delete policies: append-only)

commit;
