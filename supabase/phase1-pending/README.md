# Phase 1 — staged migration (NOT yet applied to production)

`phase1c_drop_compat.sql` — drops the Phase 0 compatibility stamping triggers/functions.
Applied in Stage 3, ONLY after Charlotte confirms the authenticated production dashboard
looks correct under the new (Migration B) RLS.

Migration B (`phase1b_rls_cutover.sql`) has been promoted into `supabase/migrations/`
and applied. Migration A (`..._phase1a_org_aware_machinery.sql`) was applied in Stage 1.
