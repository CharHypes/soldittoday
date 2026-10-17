-- Sold It Today | CRM ... store the phone TYPE (Cell / Home / Work) the
-- Add-buyer pop-out already collects, so it shows on the contact card.
alter table public.people add column if not exists phone_type text;
