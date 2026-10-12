-- CRM19: public (token-only) read for the Under Contract Timeline, so the buyer
-- can open a textable link with no login. Security-definer, returns only the
-- single transaction matching the unguessable portal token.

create or replace function public.get_buyer_timeline(p_token text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'address', t.address, 'city', t.city, 'state', t.state, 'zip', t.zip,
    'price', t.price, 'emd_amount', t.emd_amount,
    'acceptance_date', t.acceptance_date, 'emd_received_date', t.emd_received_date,
    'inspection_deadline', t.inspection_deadline, 'appraisal_date', t.appraisal_date,
    'insurance_date', t.insurance_date, 'walkthrough_date', t.walkthrough_date,
    'target_close_date', t.target_close_date,
    'client_name', (select c.name from public.clients c where c.id = t.client_id),
    'title_company', (
      select coalesce(pe.company, pe.display_name, tp.name_on_deal)
      from public.transaction_people tp
      left join public.people pe on pe.id = tp.person_id
      where tp.transaction_id = t.id and tp.role ilike '%title%'
      limit 1
    )
  )
  from public.transactions t
  where t.portal_token = p_token
  limit 1;
$$;

grant execute on function public.get_buyer_timeline(text) to anon, authenticated;
