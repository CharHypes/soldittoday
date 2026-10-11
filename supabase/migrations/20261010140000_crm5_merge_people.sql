-- =====================================================================
-- Sold It Today | CRM Stage 5 — merge_people(keep, dup)
-- Combines a duplicate contact into the one we keep: fills empty fields,
-- moves every linked record (transactions, listings, notes, reviews,
-- documents + log, relationships, referred-by), then deletes the dup.
-- SECURITY DEFINER with its own permission check: both contacts must be
-- in the caller's ACTIVE org and writable by them. Atomic.
-- =====================================================================
begin;

create or replace function public.merge_people(p_keep uuid, p_dup uuid)
  returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_keep_org uuid;
  v_dup_org  uuid;
begin
  if p_keep is null or p_dup is null or p_keep = p_dup then
    raise exception 'invalid merge (keep and duplicate must be two different contacts)';
  end if;

  select organization_id into v_keep_org from public.people where id = p_keep;
  select organization_id into v_dup_org  from public.people where id = p_dup;
  if v_keep_org is null or v_dup_org is null then
    raise exception 'contact not found';
  end if;
  if v_keep_org <> v_dup_org then
    raise exception 'cannot merge contacts from different organizations';
  end if;
  if v_keep_org <> public.active_org_id() then
    raise exception 'not your active workspace' using errcode = '42501';
  end if;
  if not (public._can_write_person(p_keep) and public._can_write_person(p_dup)) then
    raise exception 'not allowed to merge these contacts' using errcode = '42501';
  end if;

  -- 1) fill ONLY the empty fields on the keeper from the duplicate
  update public.people k set
    first_name            = coalesce(k.first_name, d.first_name),
    last_name             = coalesce(k.last_name, d.last_name),
    company               = coalesce(k.company, d.company),
    email                 = coalesce(k.email, d.email),
    phone                 = coalesce(k.phone, d.phone),
    address               = coalesce(k.address, d.address),
    birthday              = coalesce(k.birthday, d.birthday),
    marital_status        = coalesce(k.marital_status, d.marital_status),
    lead_source           = coalesce(k.lead_source, d.lead_source),
    referred_by_person_id = coalesce(k.referred_by_person_id, d.referred_by_person_id)
  from public.people d
  where k.id = p_keep and d.id = p_dup;

  -- 2) transactions: drop dup links that would collide with the keeper, move the rest
  delete from public.transaction_people d
   where d.person_id = p_dup
     and exists (select 1 from public.transaction_people k
                 where k.person_id = p_keep and k.transaction_id = d.transaction_id and k.role = d.role);
  update public.transaction_people set person_id = p_keep where person_id = p_dup;

  -- 3) listings: same collision handling
  delete from public.listing_people d
   where d.person_id = p_dup
     and exists (select 1 from public.listing_people k
                 where k.person_id = p_keep and k.listing_id = d.listing_id and k.role = d.role);
  update public.listing_people set person_id = p_keep where person_id = p_dup;

  -- 4) notes / reviews / documents (+ access log)
  update public.person_notes    set person_id = p_keep where person_id = p_dup;
  update public.person_reviews   set person_id = p_keep where person_id = p_dup;
  update public.person_documents set person_id = p_keep where person_id = p_dup;
  update public.person_doc_log   set person_id = p_keep where person_id = p_dup;

  -- 5) relationships in both directions, then drop any self-links created by the move
  update public.person_relationships set person_id = p_keep where person_id = p_dup;
  update public.person_relationships set related_person_id = p_keep where related_person_id = p_dup;
  delete from public.person_relationships where person_id = related_person_id;

  -- 6) re-point anyone the duplicate had referred
  update public.people set referred_by_person_id = p_keep where referred_by_person_id = p_dup;

  -- 7) remove the duplicate
  delete from public.people where id = p_dup;
end $$;

alter function public.merge_people(uuid, uuid) owner to postgres;
revoke all on function public.merge_people(uuid, uuid) from public;
grant execute on function public.merge_people(uuid, uuid) to authenticated;

commit;
