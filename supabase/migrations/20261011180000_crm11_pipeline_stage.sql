-- CRM11: pipeline stage on the buyer-side deal record.
--
-- Makes a buyer-side deal ONE record that moves through stages
--   lead -> buyer -> under_contract -> closed  (plus 'archived' for dead leads)
-- instead of being created fresh at each step. A lead / active buyer has no
-- house yet, so the property address becomes optional. Also adds the lead/buyer
-- CRM fields (source, pre-approval, financing, DPA, search criteria) so the Lead
-- details and the transaction DPA row have somewhere to live.
--
-- Safe/additive: no RLS policy changes, no SECURITY DEFINER changes. Only this
-- org's rows are ever visible/updatable through the existing tenant policies.

begin;

-- 1) A lead or active buyer has no property yet, so address is optional.
alter table public.transactions alter column address drop not null;

-- 2) Pipeline stage + when it last changed (for "days in stage" on the board).
alter table public.transactions
  add column if not exists pipeline_stage   text        not null default 'under_contract',
  add column if not exists stage_changed_at timestamptz not null default now();

alter table public.transactions
  drop constraint if exists transactions_pipeline_stage_chk;
alter table public.transactions
  add  constraint transactions_pipeline_stage_chk
  check (pipeline_stage in ('lead','buyer','under_contract','closed','archived'));

-- Backfill existing rows from their current status. Every existing transaction
-- is a real under-contract (or closed) deal, so this preserves today's data.
update public.transactions set pipeline_stage = case
    when status ilike '%clos%'                                           then 'closed'
    when status ilike '%cancel%' or status ilike '%withdraw%'
      or status ilike '%dead%'  or status ilike '%fell%'                 then 'archived'
    else 'under_contract'
  end
  where pipeline_stage = 'under_contract';

-- 3) Lead / buyer CRM fields (all nullable, filled in as the deal progresses).
alter table public.transactions
  add column if not exists lead_source        text,
  add column if not exists timeframe          text,
  add column if not exists preapproval_amount numeric,
  add column if not exists financing_type     text,
  add column if not exists first_time_buyer   boolean,
  add column if not exists qualifies_dpa      boolean,
  add column if not exists dpa_program        text,
  add column if not exists dpa_amount         numeric,
  add column if not exists search_criteria    jsonb;

-- 4) Index the board / pipeline views (filter by org + stage).
create index if not exists transactions_org_stage_idx
  on public.transactions (organization_id, pipeline_stage);

commit;
