-- =====================================================================
-- Sold It Today | PHASE 1 · Migration A  (ADDITIVE — safe under old RLS)
-- Adds the org-aware machinery. Does NOT touch existing policies and does
-- NOT redefine current_agent_id() (that happens in Migration B). Deploying
-- this leaves production behaving exactly as before under the current RLS.
-- =====================================================================
begin;

-- 1. Re-grant helper execute to authenticated (Phase 0 hardening revoked these;
--    Migration B's policies call them). Harmless now — no policy uses them yet.
grant execute on function public.current_org_ids()            to authenticated;
grant execute on function public.my_agent_id()                to authenticated;
grant execute on function public.has_org_role(uuid, text[])   to authenticated;

-- 2. Allow invited (pre-login) memberships: user_id becomes nullable.
alter table public.memberships alter column user_id drop not null;

-- 3. Active workspace — persistent, keyed to auth.uid() (pooling/serverless safe).
create table if not exists public.active_workspace (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  updated_at      timestamptz not null default now()
);
alter table public.active_workspace enable row level security;
drop policy if exists active_workspace_self_read on public.active_workspace;
create policy active_workspace_self_read on public.active_workspace
  for select to authenticated using (user_id = auth.uid());
-- no write policy: writes only through set_active_workspace()

-- 4. active_org_id(): deterministic active-workspace resolver.
create or replace function public.active_org_id() returns uuid
  language sql stable security definer set search_path = '' as $$
  with mine as (
    select organization_id from public.memberships
    where user_id = auth.uid() and status = 'active'
  )
  select case
    when (select count(*) from mine) = 1 then (select organization_id from mine)
    else (
      select w.organization_id from public.active_workspace w
      where w.user_id = auth.uid()
        and w.organization_id in (select organization_id from mine)
    )
  end;
$$;

-- 5. set_active_workspace(): validated writer (checks active membership).
create or replace function public.set_active_workspace(p_org uuid) returns void
  language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.memberships
                 where user_id = auth.uid() and organization_id = p_org and status = 'active') then
    raise exception 'not an active member of %', p_org using errcode = '42501';
  end if;
  insert into public.active_workspace(user_id, organization_id)
  values (auth.uid(), p_org)
  on conflict (user_id) do update set organization_id = excluded.organization_id, updated_at = now();
end $$;

-- 6. Rework my_agent_id() to resolve for the ACTIVE org (not limit-1 over memberships).
create or replace function public.my_agent_id() returns uuid
  language sql stable security definer set search_path = '' as $$
  select a.id from public.agents a
  join public.memberships m on m.id = a.membership_id
  where m.user_id = auth.uid() and m.status = 'active'
    and m.organization_id = public.active_org_id()
  limit 1;   -- (user, org) is unique in memberships, so this is deterministic
$$;

-- 7. my_context(): the app's per-request context for the active workspace.
create or replace function public.my_context()
  returns table(organization_id uuid, role text, agent_id uuid, membership_id uuid)
  language sql stable security definer set search_path = '' as $$
  select m.organization_id, m.role, a.id, m.id
  from public.memberships m
  left join public.agents a on a.membership_id = m.id
  where m.user_id = auth.uid() and m.status = 'active'
    and m.organization_id = public.active_org_id()
  limit 1;
$$;

-- 8. organization_domains (host -> org) + seed SIT domains.
create table if not exists public.organization_domains (
  host            text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade
);
alter table public.organization_domains enable row level security;  -- no public policy; read via submit_lead
insert into public.organization_domains(host, organization_id)
select h, (select id from public.organizations where slug = 'sold-it-today')
from (values ('www.soldittoday.com'), ('soldittoday.com')) v(h)
on conflict (host) do nothing;

-- 9. submit_lead(): anon-safe lead intake. Org resolved from an ALLOWLISTED host,
--    never a client-supplied org id. Unknown host -> SIT (primary site) only.
create or replace function public.submit_lead(
  p_host text, p_first text, p_last text, p_email text, p_phone text,
  p_lead_type text, p_source_page text, p_message text)
  returns bigint language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_id bigint;
begin
  select organization_id into v_org from public.organization_domains where host = p_host;
  if v_org is null then
    select id into v_org from public.organizations where slug = 'sold-it-today';
  end if;
  insert into public.leads (organization_id, first_name, last_name, email, phone, lead_type, source_page, message, status)
  values (v_org, p_first, p_last, p_email, p_phone, p_lead_type, p_source_page, p_message, 'new')
  returning id into v_id;
  return v_id;
end $$;

-- 10. reassign_owner(): hardened, strict allowlist, static per-table branches.
create or replace function public.reassign_owner(p_table text, p_id uuid, p_new_agent_id uuid)
  returns boolean language plpgsql security definer set search_path = '' as $$
declare v_org uuid;
begin
  if    p_table = 'listings'     then select organization_id into v_org from public.listings     where id = p_id;
  elsif p_table = 'transactions' then select organization_id into v_org from public.transactions where id = p_id;
  elsif p_table = 'clients'      then select organization_id into v_org from public.clients      where id = p_id;
  elsif p_table = 'documents'    then select organization_id into v_org from public.documents    where id = p_id;
  else  raise exception 'reassign_owner: unsupported table %', p_table using errcode = '22023';
  end if;
  if v_org is null then raise exception 'record not found' using errcode = 'P0002'; end if;

  if not (public.has_org_role(v_org, array['owner','admin','team_lead']) and v_org = public.active_org_id()) then
    raise exception 'not authorized to reassign in %', v_org using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.agents a join public.memberships m on m.id = a.membership_id
    where a.id = p_new_agent_id and a.organization_id = v_org and m.status = 'active'
  ) then raise exception 'target agent invalid for this org' using errcode = '22023';
  end if;

  if    p_table = 'listings'     then update public.listings     set agent_id = p_new_agent_id where id = p_id;
  elsif p_table = 'transactions' then update public.transactions set agent_id = p_new_agent_id where id = p_id;
  elsif p_table = 'clients'      then update public.clients      set agent_id = p_new_agent_id where id = p_id;
  elsif p_table = 'documents'    then update public.documents    set agent_id = p_new_agent_id where id = p_id;
  end if;
  return true;
end $$;

-- 11. Membership management RPCs (the ONLY write path to memberships; escalation-guarded).
create or replace function public.invite_member(p_email text, p_name text, p_role text)
  returns uuid language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_mid uuid;
begin
  v_org := public.active_org_id();
  if not public.has_org_role(v_org, array['owner','admin']) then
    raise exception 'not authorized' using errcode = '42501'; end if;
  if p_role not in ('admin','team_lead','agent') then
    raise exception 'invalid role for invite' using errcode = '22023'; end if;   -- cannot invite as owner
  if p_role = 'admin' and not public.has_org_role(v_org, array['owner']) then
    raise exception 'only owner can create admins' using errcode = '42501'; end if;
  insert into public.memberships(organization_id, user_id, role, status)
  values (v_org, null, p_role, 'invited') returning id into v_mid;
  insert into public.agents(name, email, organization_id, membership_id)
  values (coalesce(p_name, p_email), p_email, v_org, v_mid);
  return v_mid;
end $$;

create or replace function public.set_member_role(p_membership_id uuid, p_role text)
  returns boolean language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_target_user uuid; v_cur_role text;
begin
  select organization_id, user_id, role into v_org, v_target_user, v_cur_role
  from public.memberships where id = p_membership_id;
  if v_org is null then raise exception 'membership not found' using errcode = 'P0002'; end if;
  if v_org <> public.active_org_id() or not public.has_org_role(v_org, array['owner','admin']) then
    raise exception 'not authorized' using errcode = '42501'; end if;
  if v_target_user is not null and v_target_user = auth.uid() then
    raise exception 'cannot modify your own membership' using errcode = '42501'; end if;
  if p_role not in ('owner','admin','team_lead','agent') then
    raise exception 'invalid role' using errcode = '22023'; end if;
  if (p_role in ('owner','admin') or v_cur_role in ('owner','admin'))
     and not public.has_org_role(v_org, array['owner']) then
    raise exception 'only owner can manage owner/admin roles' using errcode = '42501'; end if;
  if v_cur_role = 'owner' and p_role <> 'owner'
     and (select count(*) from public.memberships
          where organization_id = v_org and role = 'owner' and status = 'active') <= 1 then
    raise exception 'cannot demote the last owner' using errcode = '42501'; end if;
  update public.memberships set role = p_role where id = p_membership_id;
  return true;
end $$;

create or replace function public.set_member_status(p_membership_id uuid, p_status text)
  returns boolean language plpgsql security definer set search_path = '' as $$
declare v_org uuid; v_target_user uuid; v_cur_role text;
begin
  select organization_id, user_id, role into v_org, v_target_user, v_cur_role
  from public.memberships where id = p_membership_id;
  if v_org is null then raise exception 'membership not found' using errcode = 'P0002'; end if;
  if v_org <> public.active_org_id() or not public.has_org_role(v_org, array['owner','admin']) then
    raise exception 'not authorized' using errcode = '42501'; end if;
  if v_target_user is not null and v_target_user = auth.uid() then
    raise exception 'cannot modify your own membership' using errcode = '42501'; end if;
  if p_status not in ('active','invited','suspended') then
    raise exception 'invalid status' using errcode = '22023'; end if;
  if v_cur_role in ('owner','admin') and not public.has_org_role(v_org, array['owner']) then
    raise exception 'only owner can manage owner/admin members' using errcode = '42501'; end if;
  if v_cur_role = 'owner' and p_status <> 'active'
     and (select count(*) from public.memberships
          where organization_id = v_org and role = 'owner' and status = 'active') <= 1 then
    raise exception 'cannot suspend the last owner' using errcode = '42501'; end if;
  update public.memberships set status = p_status where id = p_membership_id;
  return true;
end $$;

-- 12. link_membership_on_login(): match an invited membership by email to a new auth user.
--     Called from the app auth callback (service role) on first sign-in.
create or replace function public.link_membership_on_login(p_user_id uuid, p_email text)
  returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.memberships m
  set user_id = p_user_id, status = 'active'
  from public.agents a
  where a.membership_id = m.id
    and m.user_id is null
    and lower(a.email) = lower(p_email);
end $$;

-- 13. Harden ownership + grants on all new/reworked functions.
alter function public.active_org_id()                          owner to postgres;
alter function public.set_active_workspace(uuid)               owner to postgres;
alter function public.my_agent_id()                            owner to postgres;
alter function public.my_context()                             owner to postgres;
alter function public.submit_lead(text,text,text,text,text,text,text,text) owner to postgres;
alter function public.reassign_owner(text,uuid,uuid)           owner to postgres;
alter function public.invite_member(text,text,text)            owner to postgres;
alter function public.set_member_role(uuid,text)              owner to postgres;
alter function public.set_member_status(uuid,text)            owner to postgres;
alter function public.link_membership_on_login(uuid,text)     owner to postgres;

revoke all on function public.active_org_id()                          from public;
revoke all on function public.set_active_workspace(uuid)               from public;
revoke all on function public.my_context()                            from public;
revoke all on function public.submit_lead(text,text,text,text,text,text,text,text) from public;
revoke all on function public.reassign_owner(text,uuid,uuid)          from public;
revoke all on function public.invite_member(text,text,text)           from public;
revoke all on function public.set_member_role(uuid,text)             from public;
revoke all on function public.set_member_status(uuid,text)           from public;
revoke all on function public.link_membership_on_login(uuid,text)    from public;

grant execute on function public.active_org_id()             to authenticated;
grant execute on function public.set_active_workspace(uuid)  to authenticated;
grant execute on function public.my_context()               to authenticated;
grant execute on function public.submit_lead(text,text,text,text,text,text,text,text) to anon, authenticated;
grant execute on function public.reassign_owner(text,uuid,uuid)      to authenticated;
grant execute on function public.invite_member(text,text,text)       to authenticated;
grant execute on function public.set_member_role(uuid,text)         to authenticated;
grant execute on function public.set_member_status(uuid,text)       to authenticated;
-- link_membership_on_login: service-role only (called from the auth callback). Not granted to anon/authenticated.

-- 14. Column-level lock on agents: profile columns editable by authenticated; tenancy/identity not.
revoke update on public.agents from authenticated;
grant update (name, brand, logo_url, phone, email, license, avatar_url) on public.agents to authenticated;

commit;
