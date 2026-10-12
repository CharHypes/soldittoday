-- CRM17: home anniversary on a contact (the date they closed on their home).
-- Set manually on the contact card, or auto-filled from a deal's closing date
-- when the transaction is marked closed.

alter table public.people add column if not exists home_anniversary date;
