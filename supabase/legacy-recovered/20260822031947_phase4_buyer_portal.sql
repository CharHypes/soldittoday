-- Phase 4: buyer transactions + closing-tracker milestones

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  address text not null,
  city text,
  state text,
  zip text,
  price numeric,
  status text not null default 'Under Contract',
  target_close_date date,
  portal_token text not null unique
    default (replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','')),
  created_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.transactions(id) on delete cascade,
  label text not null,
  status text not null default 'upcoming' check (status in ('upcoming','in_progress','done')),
  date date,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- notes can attach to a listing (seller) OR a transaction (buyer)
alter table public.notes add column if not exists transaction_id uuid references public.transactions(id) on delete cascade;

alter table public.transactions enable row level security;
alter table public.milestones enable row level security;

create policy transactions_agent_all on public.transactions for all to authenticated
  using (agent_id = public.current_agent_id())
  with check (agent_id = public.current_agent_id());

create policy milestones_agent_all on public.milestones for all to authenticated
  using (transaction_id in (select id from public.transactions where agent_id = public.current_agent_id()))
  with check (transaction_id in (select id from public.transactions where agent_id = public.current_agent_id()));

-- widen the notes policy to also cover transaction-linked notes
drop policy if exists notes_agent_all on public.notes;
create policy notes_agent_all on public.notes for all to authenticated
  using (
    listing_id in (select id from public.listings where agent_id = public.current_agent_id())
    or transaction_id in (select id from public.transactions where agent_id = public.current_agent_id())
  )
  with check (
    listing_id in (select id from public.listings where agent_id = public.current_agent_id())
    or transaction_id in (select id from public.transactions where agent_id = public.current_agent_id())
  );

-- token-only public read for the buyer portal
create or replace function public.get_buyer_portal(p_token text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'transaction', jsonb_build_object(
      'address', t.address, 'city', t.city, 'state', t.state, 'zip', t.zip,
      'price', t.price, 'status', t.status, 'target_close_date', t.target_close_date
    ),
    'agent', jsonb_build_object('name', a.name, 'brand', a.brand, 'phone', a.phone, 'email', a.email, 'avatar_url', a.avatar_url),
    'client', jsonb_build_object('name', c.name),
    'milestones', coalesce((
      select jsonb_agg(jsonb_build_object('label', m.label, 'status', m.status, 'date', m.date) order by m.sort_order)
      from public.milestones m where m.transaction_id = t.id
    ), '[]'::jsonb),
    'notes', coalesce((
      select jsonb_agg(jsonb_build_object('body', n.body, 'created_at', n.created_at) order by n.created_at desc)
      from public.notes n where n.transaction_id = t.id and n.client_visible
    ), '[]'::jsonb)
  )
  from public.transactions t
  left join public.agents a on a.id = t.agent_id
  left join public.clients c on c.id = t.client_id
  where t.portal_token = p_token
  limit 1;
$$;

revoke all on function public.get_buyer_portal(text) from public;
grant execute on function public.get_buyer_portal(text) to anon, authenticated;
