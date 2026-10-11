-- CRM13: widen people.type for the real back-office contact types.
--
-- The old set was buyer/seller-centric (buyer, seller, both, past_client, lead,
-- investor, renter). A CRM that stores lenders, title, insurance, agents and
-- referral sources as contacts needs those as valid types ... otherwise saving
-- a lender or a referrer silently fails the CHECK. Additive superset of the old
-- set, so every existing row still passes. No RLS change.

begin;

alter table public.people drop constraint if exists people_type_check;

alter table public.people add constraint people_type_check
  check (type in (
    'buyer','seller','both','past_client','lead','investor','renter',
    'lender','title','insurance','agent','attorney','referral_source','vendor','other'
  ));

commit;
