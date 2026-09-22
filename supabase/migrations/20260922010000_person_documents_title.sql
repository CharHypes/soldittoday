-- Sold It Today | CRM ... let person documents carry a human name (title),
-- so agents name their own documents instead of picking from a fixed list.
alter table public.person_documents add column if not exists title text;
