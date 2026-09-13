-- =====================================================================
-- Sold It Today | PHASE 1 · Migration C  (drop Phase 0 compatibility layer)
-- Run ONLY after the app writes organization_id explicitly and Migration B
-- is live and verified. Removes the temporary stamping triggers/functions.
-- Keeps current_org_ids / my_agent_id / has_org_role / active_org_id (in use).
-- =====================================================================
begin;

drop trigger if exists phase0_stamp_org on public.listings;
drop trigger if exists phase0_stamp_org on public.transactions;
drop trigger if exists phase0_stamp_org on public.clients;
drop trigger if exists phase0_stamp_org on public.engagement_snapshots;
drop trigger if exists phase0_stamp_org on public.notes;
drop trigger if exists phase0_stamp_org on public.milestones;
drop trigger if exists phase0_stamp_org on public.documents;
drop trigger if exists phase0_stamp_org on public.leads;

drop function if exists public._phase0_stamp_from_agent();
drop function if exists public._phase0_stamp_snapshot();
drop function if exists public._phase0_stamp_note();
drop function if exists public._phase0_stamp_milestone();
drop function if exists public._phase0_stamp_document();
drop function if exists public._phase0_stamp_lead();
drop function if exists public._phase0_sit_org();

commit;
