import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The signed-in user's ACTIVE-workspace context, resolved server-side by the
 * `my_context()` RPC (SECURITY DEFINER): organization + role + this user's agent
 * profile for the one active organization. Works under both the current
 * (single-agent) RLS and the Phase 1 org RLS, so the app can be deployed before
 * the RLS cutover. Never trusts any client-supplied organization id.
 */
export type OrgContext = {
  orgId?: string;
  agentId?: string;
  role?: string;
  membershipId?: string;
};

export async function getOrgContext(supabase: SupabaseClient): Promise<OrgContext> {
  const { data } = await supabase.rpc("my_context");
  const row = Array.isArray(data) ? data[0] : data;
  return {
    orgId: row?.organization_id as string | undefined,
    agentId: row?.agent_id as string | undefined,
    role: row?.role as string | undefined,
    membershipId: row?.membership_id as string | undefined,
  };
}
