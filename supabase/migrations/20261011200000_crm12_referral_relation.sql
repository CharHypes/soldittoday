-- CRM12: allow "referred_by" / "referral" on person_relationships.
--
-- So "who referred this buyer" is stored as a real link between two contacts
-- (buyer --referred_by--> referrer, and the reverse referrer --referral--> buyer),
-- and shows on BOTH contact cards instead of being lost. Additive: widens an
-- existing CHECK, no data touched, no RLS change.

begin;

alter table public.person_relationships
  drop constraint if exists person_relationships_relation_check;

alter table public.person_relationships
  add constraint person_relationships_relation_check
  check (relation in (
    'spouse','partner','co_buyer','co_seller','family',
    'assistant','attorney','lender','other',
    'referred_by','referral'
  ));

commit;
