-- =====================================================================
-- Sold It Today | Security hardening — lock down privileged RPCs
-- The security advisor flagged SECURITY DEFINER functions callable by anon.
-- Most self-check roles, but link_membership_on_login does NOT and could let
-- anyone claim a pending team invite. Nothing in the app calls it, so restrict
-- it to service_role. Also drop anon from the admin/membership functions
-- (they stay callable by signed-in users, who the app calls them as).
-- Portal/lead functions (get_*_portal, get_buyer_timeline, add_buyer_reply,
-- submit_lead) are intentionally anon and are deliberately NOT touched.
-- =====================================================================
begin;

-- The real fix: no internal permission check + exposed to the public API.
revoke execute on function public.link_membership_on_login(uuid, text) from public, anon, authenticated;
grant  execute on function public.link_membership_on_login(uuid, text) to service_role;

-- Defense in depth: admin/membership functions self-gate, but should never be
-- anon-callable. Keep authenticated (the signed-in owner/admin calls them).
revoke execute on function public.invite_member(text, text, text)  from public, anon;
grant  execute on function public.invite_member(text, text, text)  to authenticated;
revoke execute on function public.set_member_role(uuid, text)      from public, anon;
grant  execute on function public.set_member_role(uuid, text)      to authenticated;
revoke execute on function public.set_member_status(uuid, text)    from public, anon;
grant  execute on function public.set_member_status(uuid, text)    to authenticated;
revoke execute on function public.reassign_owner(text, uuid, uuid) from public, anon;
grant  execute on function public.reassign_owner(text, uuid, uuid) to authenticated;
revoke execute on function public.merge_people(uuid, uuid)         from public, anon;
grant  execute on function public.merge_people(uuid, uuid)         to authenticated;
revoke execute on function public.set_active_workspace(uuid)       from public, anon;
grant  execute on function public.set_active_workspace(uuid)       to authenticated;

commit;
