-- =====================================================================
-- Sold It Today | Phase 0 follow-up: SECURITY DEFINER least-privilege hardening
-- ADDITIVE. Revokes direct EXECUTE from anon + authenticated on the Phase 0
-- functions. They do NOT need direct API callability:
--   * _phase0_stamp_* fire via triggers (trigger execution does not require
--     the invoking role to hold EXECUTE on the function).
--   * _phase0_sit_org() is only called internally by _phase0_stamp_lead()
--     (SECURITY DEFINER, owned by postgres), so it resolves under the owner.
--   * current_org_ids/my_agent_id/has_org_role are unused until Phase 1;
--     Phase 1 will grant exactly the access its RLS policies need.
-- Ownership (postgres) and service_role EXECUTE are preserved. Function
-- bodies and their SET search_path='' are unchanged.
-- =====================================================================

begin;

-- Trigger-only / internal helpers: no direct caller should reach these.
revoke execute on function public._phase0_sit_org()          from anon, authenticated;
revoke execute on function public._phase0_stamp_from_agent() from anon, authenticated;
revoke execute on function public._phase0_stamp_snapshot()   from anon, authenticated;
revoke execute on function public._phase0_stamp_note()       from anon, authenticated;
revoke execute on function public._phase0_stamp_milestone()  from anon, authenticated;
revoke execute on function public._phase0_stamp_document()   from anon, authenticated;
revoke execute on function public._phase0_stamp_lead()       from anon, authenticated;

-- Membership helpers: unused until Phase 1. Revoke now; Phase 1 re-grants
-- only what its authenticated RLS policies require.
revoke execute on function public.current_org_ids()            from anon, authenticated;
revoke execute on function public.my_agent_id()                from anon, authenticated;
revoke execute on function public.has_org_role(uuid, text[])   from anon, authenticated;

commit;
