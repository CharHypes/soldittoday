alter table public."Leads" rename to leads;

alter table public.leads enable row level security;

create policy "Allow anonymous lead submissions"
  on public.leads for insert
  to anon
  with check (true);
