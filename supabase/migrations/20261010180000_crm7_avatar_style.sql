-- =====================================================================
-- Sold It Today | CRM Stage 7 — contact avatar style
-- Org setting: contact avatar circles as one solid mauve, or a rotation
-- of muted colors (deterministic per contact). Additive.
-- =====================================================================
begin;
alter table public.organizations
  add column if not exists avatar_style text not null default 'colorful'
  check (avatar_style in ('solid','colorful'));
commit;
