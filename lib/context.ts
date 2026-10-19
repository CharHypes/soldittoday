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

/**
 * The active org's contact-avatar style ("solid" | "colorful"), used app-wide so
 * every person avatar honors the Settings toggle. Defaults to "colorful".
 * Pass `orgId` to skip the extra my_context RPC when the caller already has it.
 */
export async function getAvatarStyle(
  supabase: SupabaseClient,
  orgId?: string,
): Promise<"solid" | "colorful"> {
  const id = orgId ?? (await getOrgContext(supabase)).orgId;
  if (!id) return "colorful";
  const { data } = await supabase.from("organizations").select("avatar_style").eq("id", id).maybeSingle();
  return (data?.avatar_style as string) === "solid" ? "solid" : "colorful";
}
