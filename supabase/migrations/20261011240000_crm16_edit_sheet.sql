-- CRM16: fields the full Edit-transaction accordion captures (approved mockup).
-- file_needs stores the Documents / Follow-up checkbox states as JSON.

alter table public.transactions add column if not exists file_needs                 jsonb;   -- { docs:{key:bool}, actions:{key:bool} }
alter table public.transactions add column if not exists county                     text;
alter table public.transactions add column if not exists occupancy                  text;
alter table public.transactions add column if not exists inspection_period_days     int;
alter table public.transactions add column if not exists inspection_deadline        date;
alter table public.transactions add column if not exists appraisal_date             date;
alter table public.transactions add column if not exists financing_contingency_date date;
alter table public.transactions add column if not exists emd_received_date          date;
alter table public.transactions add column if not exists referral_how               text;
alter table public.transactions add column if not exists referral_amount            numeric;
