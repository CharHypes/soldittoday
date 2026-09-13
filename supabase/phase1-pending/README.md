# Phase 1 — staged migrations (NOT yet applied to production)

These two migrations are validated on scratch (two-org RLS matrix, 27/27) but are
**Stage 2** — applied only after Charlotte reviews Stage 1.

- `phase1b_rls_cutover.sql` — the atomic RLS cutover (drop single-agent policies;
  install tenant-wall = `organization_id = active_org_id()` + role/ownership/visibility).
- `phase1c_drop_compat.sql` — drop the Phase 0 compatibility stamping triggers/functions.

They live OUTSIDE `supabase/migrations/` on purpose so `supabase db push` / `migration up`
will NOT apply them yet. In Stage 2 they move into `supabase/migrations/` (with the
versions Supabase records) and are applied via the approved cutover sequence.

Migration A (`20260913044439_phase1a_org_aware_machinery.sql`, already applied) is additive
and safe under the existing RLS.
