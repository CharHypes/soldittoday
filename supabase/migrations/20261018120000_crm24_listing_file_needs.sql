-- crm24: seller-side checklist storage on listings.
-- Mirrors transactions.file_needs so the Listing workspace Checklist tab can
-- store its docs/actions/custom/waiting state. Column-level only ... it inherits
-- the listings table's existing RLS, so there is no policy change and tenant
-- isolation is unchanged.
alter table public.listings add column if not exists file_needs jsonb;
comment on column public.listings.file_needs is
  'Seller-side checklist state (docs/actions/custom/waiting), same shape as transactions.file_needs.';
