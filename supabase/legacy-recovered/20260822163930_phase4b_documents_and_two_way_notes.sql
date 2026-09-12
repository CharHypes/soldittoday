-- ============ Documents: link to transactions, track uploader, own for RLS ============
alter table public.documents
  add column if not exists transaction_id uuid references public.transactions(id) on delete cascade,
  add column if not exists agent_id uuid references public.agents(id) on delete cascade,
  add column if not exists uploaded_by text not null default 'agent',
  add column if not exists content_type text,
  add column if not exists size_bytes bigint;

alter table public.documents drop constraint if exists documents_uploaded_by_check;
alter table public.documents
  add constraint documents_uploaded_by_check check (uploaded_by in ('agent','buyer'));

create index if not exists documents_transaction_id_idx on public.documents(transaction_id);
create index if not exists documents_agent_id_idx on public.documents(agent_id);

-- Agent-scoped RLS (dashboard reads/writes go through the authenticated agent).
alter table public.documents enable row level security;
drop policy if exists documents_agent_all on public.documents;
create policy documents_agent_all on public.documents
  for all
  using (agent_id = public.current_agent_id())
  with check (agent_id = public.current_agent_id());

-- ============ Notes: mark buyer replies for the two-way thread ============
alter table public.notes
  add column if not exists from_client boolean not null default false;

-- ============ Private storage bucket (all access is server-side via service role) ============
insert into storage.buckets (id, name, public)
values ('portal-docs','portal-docs', false)
on conflict (id) do nothing;

-- ============ Buyer reply: security-definer so the tokenized portal (anon) can post
--              a message safely without any service key ============
create or replace function public.add_buyer_reply(p_token text, p_body text)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_tx uuid;
begin
  select id into v_tx from public.transactions where portal_token = p_token limit 1;
  if v_tx is null then return false; end if;
  if coalesce(btrim(p_body), '') = '' then return false; end if;
  insert into public.notes (transaction_id, body, client_visible, from_client)
  values (v_tx, left(p_body, 4000), true, true);
  return true;
end;
$function$;
grant execute on function public.add_buyer_reply(text, text) to anon, authenticated;

-- ============ Buyer portal payload: add documents + two-way message thread ============
create or replace function public.get_buyer_portal(p_token text)
returns jsonb
language sql
security definer
set search_path to 'public'
as $function$
  select jsonb_build_object(
    'transaction', jsonb_build_object(
      'address', t.address, 'city', t.city, 'state', t.state, 'zip', t.zip,
      'price', t.price, 'status', t.status, 'target_close_date', t.target_close_date,
      'photo_url', t.photo_url
    ),
    'agent', jsonb_build_object('name', a.name, 'brand', a.brand, 'phone', a.phone, 'email', a.email, 'avatar_url', a.avatar_url),
    'client', jsonb_build_object('name', c.name),
    'milestones', coalesce((
      select jsonb_agg(jsonb_build_object('label', m.label, 'status', m.status, 'date', m.date) order by m.sort_order)
      from public.milestones m where m.transaction_id = t.id
    ), '[]'::jsonb),
    'notes', coalesce((
      select jsonb_agg(jsonb_build_object('body', n.body, 'created_at', n.created_at, 'from_client', n.from_client) order by n.created_at asc)
      from public.notes n
      where n.transaction_id = t.id and (n.client_visible or n.from_client)
    ), '[]'::jsonb),
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object('id', d.id, 'name', d.name, 'uploaded_by', d.uploaded_by, 'created_at', d.created_at) order by d.created_at desc)
      from public.documents d
      where d.transaction_id = t.id and (d.client_visible or d.uploaded_by = 'buyer')
    ), '[]'::jsonb)
  )
  from public.transactions t
  left join public.agents a on a.id = t.agent_id
  left join public.clients c on c.id = t.client_id
  where t.portal_token = p_token
  limit 1;
$function$;
