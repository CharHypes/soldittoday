alter table public.agents add column if not exists avatar_url text;

-- Include the agent's avatar in the seller-portal payload.
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
    'agent', jsonb_build_object('name', a.name, 'brand', a.brand, 'phone', a.phone, 'email', a.email, 'avatar_url', a.avatar_url),
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

-- Set Charlotte's headshot (served from the site).
update public.agents set avatar_url = '/assets/team/charlotte-hypes.png'
where lower(email) = 'charlotte@soldittoday.com';
