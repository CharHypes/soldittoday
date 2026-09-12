-- Agent-scoped access, keyed to the logged-in user's email (case-insensitive).
-- Only the agent whose email matches the auth session can read/write their data.

create or replace function public.current_agent_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.agents
  where lower(email) = lower(auth.jwt() ->> 'email')
  limit 1;
$$;

grant execute on function public.current_agent_id() to authenticated;

-- agents: see and edit only your own row
create policy agents_self_select on public.agents for select to authenticated
  using (id = public.current_agent_id());
create policy agents_self_update on public.agents for update to authenticated
  using (id = public.current_agent_id()) with check (id = public.current_agent_id());

-- listings
create policy listings_agent_all on public.listings for all to authenticated
  using (agent_id = public.current_agent_id())
  with check (agent_id = public.current_agent_id());

-- clients
create policy clients_agent_all on public.clients for all to authenticated
  using (agent_id = public.current_agent_id())
  with check (agent_id = public.current_agent_id());

-- engagement snapshots (via parent listing)
create policy snap_agent_all on public.engagement_snapshots for all to authenticated
  using (listing_id in (select id from public.listings where agent_id = public.current_agent_id()))
  with check (listing_id in (select id from public.listings where agent_id = public.current_agent_id()));

-- notes (via parent listing)
create policy notes_agent_all on public.notes for all to authenticated
  using (listing_id in (select id from public.listings where agent_id = public.current_agent_id()))
  with check (listing_id in (select id from public.listings where agent_id = public.current_agent_id()));

-- documents (via parent listing)
create policy docs_agent_all on public.documents for all to authenticated
  using (listing_id in (select id from public.listings where agent_id = public.current_agent_id()))
  with check (listing_id in (select id from public.listings where agent_id = public.current_agent_id()));
