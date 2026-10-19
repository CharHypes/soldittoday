-- crm26: let Tasks and Milestones belong to a LISTING as well as a transaction,
-- so the listing workspace has real seller-side Tasks and Closing steps.
--
-- Security: the RESTRICTIVE org tenant walls (tasks_tenant / milestones_tenant)
-- are left exactly as they are ... this only widens the PERMISSIVE row policies
-- to also allow the listing path via the existing _can_read_listing /
-- _can_write_listing helpers, mirroring the transaction path. A one-parent CHECK
-- guarantees every row is owned by exactly one of (transaction_id, listing_id),
-- so a null id can never make a helper match the wrong record.

-- ---------- Tasks ----------
alter table public.tasks alter column transaction_id drop not null;
alter table public.tasks add column if not exists listing_id uuid references public.listings(id) on delete cascade;
create index if not exists tasks_listing_idx on public.tasks(listing_id);
alter table public.tasks drop constraint if exists tasks_one_parent;
alter table public.tasks add constraint tasks_one_parent
  check ((transaction_id is not null) <> (listing_id is not null));

drop policy if exists tasks_rw on public.tasks;
create policy tasks_rw on public.tasks for all to authenticated
  using (public.has_org_role(organization_id, array['owner','admin','team_lead'])
         or public._can_write_transaction(transaction_id)
         or public._can_write_listing(listing_id))
  with check (organization_id = public.active_org_id()
         and (public.has_org_role(organization_id, array['owner','admin','team_lead'])
              or public._can_write_transaction(transaction_id)
              or public._can_write_listing(listing_id)));

-- ---------- Milestones ----------
alter table public.milestones add column if not exists listing_id uuid references public.listings(id) on delete cascade;
create index if not exists milestones_listing_idx on public.milestones(listing_id);
alter table public.milestones drop constraint if exists milestones_one_parent;
alter table public.milestones add constraint milestones_one_parent
  check ((transaction_id is not null) <> (listing_id is not null));

drop policy if exists milestones_sel on public.milestones;
create policy milestones_sel on public.milestones for select to authenticated
  using (public.has_org_role(organization_id, array['owner','admin'])
         or public._can_read_transaction(transaction_id)
         or public._can_read_listing(listing_id));
drop policy if exists milestones_ins on public.milestones;
create policy milestones_ins on public.milestones for insert to authenticated
  with check (organization_id = public.active_org_id()
         and (public.has_org_role(organization_id, array['owner','admin'])
              or public._can_write_transaction(transaction_id)
              or public._can_write_listing(listing_id)));
drop policy if exists milestones_upd on public.milestones;
create policy milestones_upd on public.milestones for update to authenticated
  using (public.has_org_role(organization_id, array['owner','admin'])
         or public._can_write_transaction(transaction_id)
         or public._can_write_listing(listing_id))
  with check (organization_id = public.active_org_id()
         and (public.has_org_role(organization_id, array['owner','admin'])
              or public._can_write_transaction(transaction_id)
              or public._can_write_listing(listing_id)));
drop policy if exists milestones_del on public.milestones;
create policy milestones_del on public.milestones for delete to authenticated
  using (public.has_org_role(organization_id, array['owner','admin'])
         or public._can_write_transaction(transaction_id)
         or public._can_write_listing(listing_id));
