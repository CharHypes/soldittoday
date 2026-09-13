-- =====================================================================
-- Sold It Today | PHASE 1 · Migration C  (drop Phase 0 compatibility layer)
-- Run after Migration B is live/verified and the authenticated dashboard is
-- confirmed. First makes the last trigger-dependent writer (add_buyer_reply)
-- set organization_id explicitly, THEN removes the temporary stamping triggers
-- and functions. Keeps the permanent org/RLS helpers
-- (current_org_ids / my_agent_id / has_org_role / active_org_id / my_context /
-- set_active_workspace / reassign_owner / submit_lead / membership RPCs).
-- =====================================================================
begin;

-- 1. add_buyer_reply: derive + write organization_id from the transaction, so it
--    no longer relies on the compat trigger to stamp the note.
create or replace function public.add_buyer_reply(p_token text, p_body text)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_tx uuid;
  v_org uuid;
begin
  select id, organization_id into v_tx, v_org from public.transactions where portal_token = p_token limit 1;
  if v_tx is null then return false; end if;
  if coalesce(btrim(p_body), '') = '' then return false; end if;
  insert into public.notes (organization_id, transaction_id, body, client_visible, from_client)
  values (v_org, v_tx, left(p_body, 4000), true, true);
  return true;
end;
$function$;

-- 2. Drop the temporary Phase 0 compatibility stamping triggers.
drop trigger if exists phase0_stamp_org on public.listings;
drop trigger if exists phase0_stamp_org on public.transactions;
drop trigger if exists phase0_stamp_org on public.clients;
drop trigger if exists phase0_stamp_org on public.engagement_snapshots;
drop trigger if exists phase0_stamp_org on public.notes;
drop trigger if exists phase0_stamp_org on public.milestones;
drop trigger if exists phase0_stamp_org on public.documents;
drop trigger if exists phase0_stamp_org on public.leads;

-- 3. Drop their now-unused functions.
drop function if exists public._phase0_stamp_from_agent();
drop function if exists public._phase0_stamp_snapshot();
drop function if exists public._phase0_stamp_note();
drop function if exists public._phase0_stamp_milestone();
drop function if exists public._phase0_stamp_document();
drop function if exists public._phase0_stamp_lead();
drop function if exists public._phase0_sit_org();

commit;
