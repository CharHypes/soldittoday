create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text,
  last_name text,
  email text not null,
  phone text,
  lead_type text,
  message text,
  source_page text,
  status text not null default 'new',
  notes text,
  follow_up_date date
);

alter table public.leads enable row level security;

drop policy if exists "Anon can insert leads" on public.leads;
create policy "Anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (true);
