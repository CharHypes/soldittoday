alter table public.transactions add column if not exists photo_url text;

create or replace function public.get_buyer_portal(p_token text)
returns jsonb
language sql
security definer
set search_path = public
as $$
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
grant execute on function public.get_buyer_portal(text) to anon, authenticated;
