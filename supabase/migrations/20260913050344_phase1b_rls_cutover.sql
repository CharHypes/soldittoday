-- =====================================================================
-- Sold It Today | PHASE 1 · Migration B  (RLS CUTOVER — ONE atomic txn)
-- Drops the single-agent policies and installs the org/membership/role/
-- ownership/visibility model. Business tenant wall = organization_id =
-- active_org_id(). Not applied in Stage 1 (validated on scratch; applied
-- only after Stage 1 review). All-or-nothing: any failure rolls back.
-- =====================================================================
begin;

-- current_agent_id() -> membership-aware alias (deprecated; no policy uses it after this).
create or replace function public.current_agent_id() returns uuid
  language sql stable security definer set search_path = '' as $$ select public.my_agent_id() $$;
alter function public.current_agent_id() owner to postgres;

-- Parent-permission helpers (SECURITY DEFINER; avoid RLS-in-policy recursion).
create or replace function public._can_read_listing(l_id uuid) returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.listings l where l.id = l_id and (
    public.has_org_role(l.organization_id, array['owner','admin','team_lead'])
    or l.agent_id = public.my_agent_id() or l.visibility = 'organization')); $$;
create or replace function public._can_write_listing(l_id uuid) returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.listings l where l.id = l_id and (
    public.has_org_role(l.organization_id, array['owner','admin']) or l.agent_id = public.my_agent_id())); $$;
create or replace function public._can_read_transaction(t_id uuid) returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.transactions t where t.id = t_id and (
    public.has_org_role(t.organization_id, array['owner','admin','team_lead'])
    or t.agent_id = public.my_agent_id() or t.visibility = 'organization')); $$;
create or replace function public._can_write_transaction(t_id uuid) returns boolean
  language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.transactions t where t.id = t_id and (
    public.has_org_role(t.organization_id, array['owner','admin']) or t.agent_id = public.my_agent_id())); $$;
alter function public._can_read_listing(uuid)     owner to postgres;
alter function public._can_write_listing(uuid)    owner to postgres;
alter function public._can_read_transaction(uuid) owner to postgres;
alter function public._can_write_transaction(uuid) owner to postgres;
revoke all on function public._can_read_listing(uuid), public._can_write_listing(uuid),
  public._can_read_transaction(uuid), public._can_write_transaction(uuid) from public;
grant execute on function public._can_read_listing(uuid), public._can_write_listing(uuid),
  public._can_read_transaction(uuid), public._can_write_transaction(uuid) to authenticated;

-- ---------- AGENTS ----------
drop policy if exists agents_self_select on public.agents;
drop policy if exists agents_self_update on public.agents;
create policy agents_tenant on public.agents as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy agents_sel on public.agents for select to authenticated using (true);
create policy agents_upd on public.agents for update to authenticated
  using (id = public.my_agent_id() or public.has_org_role(organization_id, array['owner','admin']))
  with check (organization_id = public.active_org_id()
    and (id = public.my_agent_id() or public.has_org_role(organization_id, array['owner','admin'])));

-- ---------- CLIENTS / LISTINGS / TRANSACTIONS / DOCUMENTS (owned tables) ----------
-- clients
drop policy if exists clients_agent_all on public.clients;
create policy clients_tenant on public.clients as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy clients_sel on public.clients for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','team_lead']) or agent_id = public.my_agent_id() or visibility = 'organization');
create policy clients_ins on public.clients for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy clients_upd on public.clients for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id())
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy clients_del on public.clients for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id());

-- listings
drop policy if exists listings_agent_all on public.listings;
create policy listings_tenant on public.listings as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy listings_sel on public.listings for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','team_lead']) or agent_id = public.my_agent_id() or visibility = 'organization');
create policy listings_ins on public.listings for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy listings_upd on public.listings for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id())
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy listings_del on public.listings for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id());

-- transactions
drop policy if exists transactions_agent_all on public.transactions;
create policy transactions_tenant on public.transactions as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy transactions_sel on public.transactions for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','team_lead']) or agent_id = public.my_agent_id() or visibility = 'organization');
create policy transactions_ins on public.transactions for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy transactions_upd on public.transactions for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id())
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy transactions_del on public.transactions for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id());

-- documents
drop policy if exists docs_agent_all on public.documents;
drop policy if exists documents_agent_all on public.documents;
create policy documents_tenant on public.documents as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy documents_sel on public.documents for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','team_lead']) or agent_id = public.my_agent_id() or visibility = 'organization');
create policy documents_ins on public.documents for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy documents_upd on public.documents for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id())
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id()));
create policy documents_del on public.documents for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or agent_id = public.my_agent_id());

-- ---------- CHILD TABLES (permission derives from parent) ----------
-- engagement_snapshots (parent: listing)
drop policy if exists snap_agent_all on public.engagement_snapshots;
create policy snapshots_tenant on public.engagement_snapshots as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy snapshots_sel on public.engagement_snapshots for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_listing(listing_id));
create policy snapshots_ins on public.engagement_snapshots for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id)));
create policy snapshots_upd on public.engagement_snapshots for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id)));
create policy snapshots_del on public.engagement_snapshots for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id));

-- notes (parent: listing OR transaction)
drop policy if exists notes_agent_all on public.notes;
create policy notes_tenant on public.notes as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy notes_sel on public.notes for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_listing(listing_id) or public._can_read_transaction(transaction_id));
create policy notes_ins on public.notes for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id) or public._can_write_transaction(transaction_id)));
create policy notes_upd on public.notes for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id) or public._can_write_transaction(transaction_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id) or public._can_write_transaction(transaction_id)));
create policy notes_del on public.notes for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_listing(listing_id) or public._can_write_transaction(transaction_id));

-- milestones (parent: transaction)
drop policy if exists milestones_agent_all on public.milestones;
create policy milestones_tenant on public.milestones as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy milestones_sel on public.milestones for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_read_transaction(transaction_id));
create policy milestones_ins on public.milestones for insert to authenticated
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id)));
create policy milestones_upd on public.milestones for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id))
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id)));
create policy milestones_del on public.milestones for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or public._can_write_transaction(transaction_id));

-- ---------- LEADS (owner_agent_id + org; anon insert replaced by submit_lead RPC) ----------
drop policy if exists "Allow anonymous lead submissions" on public.leads;
create policy leads_tenant on public.leads as restrictive for all to authenticated
  using (organization_id = public.active_org_id()) with check (organization_id = public.active_org_id());
create policy leads_sel on public.leads for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or owner_agent_id = public.my_agent_id());
create policy leads_ins on public.leads for insert to authenticated
  with check (organization_id = public.active_org_id());
create policy leads_upd on public.leads for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or owner_agent_id = public.my_agent_id())
  with check (organization_id = public.active_org_id() and (public.has_org_role(organization_id, array['owner','admin']) or owner_agent_id = public.my_agent_id()));
create policy leads_del on public.leads for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin']) or owner_agent_id = public.my_agent_id());

-- ---------- ORGANIZATIONS / MEMBERSHIPS (use current_org_ids for selection/admin, NOT active wall) ----------
create policy organizations_sel on public.organizations for select to authenticated
  using (id in (select public.current_org_ids()));
create policy organizations_upd on public.organizations for update to authenticated
  using (public.has_org_role(id, array['owner'])) with check (id in (select public.current_org_ids()));

create policy memberships_sel on public.memberships for select to authenticated
  using (organization_id in (select public.current_org_ids()));
-- memberships: no insert/update/delete policy — writes only via invite_member / set_member_role / set_member_status RPCs.

commit;
