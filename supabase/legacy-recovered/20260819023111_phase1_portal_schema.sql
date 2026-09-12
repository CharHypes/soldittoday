-- Phase 1: in-house client portal schema

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  logo_url text,
  phone text,
  email text,
  license text,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  type text not null default 'seller' check (type in ('seller','buyer')),
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  mls_number text,
  address text not null,
  city text,
  state text,
  zip text,
  price numeric,
  beds int,
  baths numeric,
  sqft int,
  status text not null default 'Active',
  list_date date,
  photo_url text,
  source text not null default 'manual',
  portal_token text not null unique
    default (replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','')),
  created_at timestamptz not null default now()
);

create table if not exists public.engagement_snapshots (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  period_start date,
  period_end date,
  total_views int not null default 0,
  shares int not null default 0,
  favorites int not null default 0,
  returning_pct int,
  by_source jsonb not null default '[]'::jsonb,
  by_city jsonb not null default '[]'::jsonb,
  source text not null default 'listtrac',
  captured_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  body text not null,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  name text not null,
  storage_path text,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Lock everything down: RLS on, no public policies. Access only via the RPC below.
alter table public.agents enable row level security;
alter table public.clients enable row level security;
alter table public.listings enable row level security;
alter table public.engagement_snapshots enable row level security;
alter table public.notes enable row level security;
alter table public.documents enable row level security;

-- Token-only read for the seller portal. Security definer so it bypasses RLS,
-- but only ever returns the single listing matching the unguessable token.
create or replace function public.get_seller_portal(p_token text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'listing', jsonb_build_object(
      'address', l.address, 'city', l.city, 'state', l.state, 'zip', l.zip,
      'price', l.price, 'beds', l.beds, 'baths', l.baths, 'sqft', l.sqft,
      'status', l.status, 'mls_number', l.mls_number, 'photo_url', l.photo_url,
      'list_date', l.list_date
    ),
    'agent', jsonb_build_object('name', a.name, 'brand', a.brand, 'phone', a.phone, 'email', a.email),
    'client', jsonb_build_object('name', c.name),
    'stats', (
      select to_jsonb(s) - 'id' - 'listing_id'
      from public.engagement_snapshots s
      where s.listing_id = l.id
      order by s.period_end desc nulls last, s.captured_at desc
      limit 1
    ),
    'notes', coalesce((
      select jsonb_agg(jsonb_build_object('body', n.body, 'created_at', n.created_at) order by n.created_at desc)
      from public.notes n where n.listing_id = l.id and n.client_visible
    ), '[]'::jsonb),
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object('name', d.name, 'storage_path', d.storage_path) order by d.created_at desc)
      from public.documents d where d.listing_id = l.id and d.client_visible
    ), '[]'::jsonb)
  )
  from public.listings l
  left join public.agents a on a.id = l.agent_id
  left join public.clients c on c.id = l.client_id
  where l.portal_token = p_token
  limit 1;
$$;

revoke all on function public.get_seller_portal(text) from public;
grant execute on function public.get_seller_portal(text) to anon, authenticated;
