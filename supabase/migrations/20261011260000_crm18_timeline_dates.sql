-- CRM18: the two remaining Under-Contract-Timeline dates, so the whole handout auto-fills.

alter table public.transactions add column if not exists insurance_date   date;  -- obtain home insurance plan
alter table public.transactions add column if not exists walkthrough_date date;  -- schedule the walk through
