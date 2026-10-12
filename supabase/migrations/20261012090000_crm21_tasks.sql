-- CRM21: per-deal tasks (the transaction workspace Tasks tab).

create table if not exists public.tasks (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  transaction_id  uuid not null references public.transactions(id) on delete cascade,
  agent_id        uuid,
  title           text not null,
  due_date        date,
  assignee        text,
  done            boolean not null default false,
  done_at         timestamptz,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists tasks_transaction_idx on public.tasks(transaction_id);

alter table public.tasks enable row level security;

-- Tenant fence: only ever the active organization's rows.
drop policy if exists tasks_tenant on public.tasks;
create policy tasks_tenant on public.tasks as restrictive for all to authenticated
  using (organization_id = public.active_org_id())
  with check (organization_id = public.active_org_id());

-- Read/write: owners/admins/team-leads, or anyone who can write the parent deal.
drop policy if exists tasks_rw on public.tasks;
create policy tasks_rw on public.tasks for all to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','team_lead'])
         or public._can_write_transaction(transaction_id))
  with check (organization_id = public.active_org_id()
         and (public.has_org_role(organization_id, array['owner','admin','team_lead'])
              or public._can_write_transaction(transaction_id)));
