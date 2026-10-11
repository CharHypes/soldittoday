"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/context";
import { createAdminClient, BRAND_BUCKET } from "@/lib/supabase/admin";

const str = (v: FormDataEntryValue | null): string | null => {
  const s = String(v ?? "").trim();
  return s || null;
};

/** Owner-only guard. Branding + org settings are the owner's to change. */
async function ownerCtx() {
  const supabase = createSupabaseServer();
  const { orgId, agentId, role } = await getOrgContext(supabase);
  if (!agentId || !orgId) redirect("/dashboard/login");
  return { supabase, orgId, role };
}

/** Upload (or replace) the org logo. File bytes go to the PUBLIC brand bucket via
 *  the service role; the org row is updated under RLS (owner only). */
export async function uploadOrgLogo(formData: FormData) {
  const { supabase, orgId, role } = await ownerCtx();
  if (role !== "owner" && role !== "admin") return;
  const admin = createAdminClient();
  if (!admin) return;

  const file = formData.get("logo") as File | null;
  if (!file || file.size === 0) return;
  if (!file.type.startsWith("image/")) return;

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${orgId}/logo-${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const up = await admin.storage.from(BRAND_BUCKET).upload(path, bytes, {
    contentType: file.type || "image/png",
    upsert: false,
  });
  if (up.error) return;

  const { data: pub } = admin.storage.from(BRAND_BUCKET).getPublicUrl(path);
  const url = pub?.publicUrl;
  if (!url) return;

  // Update the org row through the user client so RLS enforces owner-only.
  const { error } = await supabase.from("organizations").update({ logo_url: url }).eq("id", orgId);
  if (error) {
    // not allowed / failed: remove the orphaned file
    await admin.storage.from(BRAND_BUCKET).remove([path]);
    return;
  }
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/settings?saved=logo");
}

/** Remove the org logo (reverts to the Sold It Today wordmark). */
export async function removeOrgLogo() {
  const { supabase, orgId, role } = await ownerCtx();
  if (role !== "owner" && role !== "admin") return;
  await supabase.from("organizations").update({ logo_url: null }).eq("id", orgId);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/settings?saved=logo");
}

/** Contact avatar style: one solid mauve, or a colorful rotation. */
export async function updateAvatarStyle(formData: FormData) {
  const { supabase, orgId, role } = await ownerCtx();
  if (role !== "owner" && role !== "admin") return;
  const val = str(formData.get("avatar_style")) === "solid" ? "solid" : "colorful";
  await supabase.from("organizations").update({ avatar_style: val }).eq("id", orgId);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/settings?saved=avatars");
}

/** Update the brand name + tagline shown in the workspace. */
export async function updateBranding(formData: FormData) {
  const { supabase, orgId, role } = await ownerCtx();
  if (role !== "owner" && role !== "admin") return;
  await supabase
    .from("organizations")
    .update({ brand_name: str(formData.get("brand_name")), tagline: str(formData.get("tagline")) })
    .eq("id", orgId);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/settings?saved=brand");
}
