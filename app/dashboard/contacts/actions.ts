"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/context";

const str = (v: FormDataEntryValue | null): string | null => {
  const s = String(v ?? "").trim();
  return s || null;
};

/**
 * Update a person's own fields. RLS scopes the update to a contact the signed-in
 * agent may write in their active org. Only the fields present in the submitted
 * form are changed ... other columns are left untouched.
 */
export async function updatePerson(formData: FormData) {
  const supabase = createSupabaseServer();
  const { orgId, agentId } = await getOrgContext(supabase);
  if (!agentId || !orgId) redirect("/dashboard/login");

  const id = str(formData.get("id"));
  if (!id) return;

  const patch: Record<string, string | null> = {};
  const setIf = (key: string, col = key) => {
    if (formData.has(key)) patch[col] = str(formData.get(key));
  };
  setIf("first_name");
  setIf("last_name");
  setIf("company");
  setIf("display_name");
  setIf("type");
  setIf("email");
  setIf("phone");
  setIf("address");
  setIf("birthday");
  setIf("marital_status");
  setIf("lead_source");

  if (Object.keys(patch).length === 0) return;

  await supabase.from("people").update(patch).eq("id", id);
  revalidatePath("/dashboard/contacts");
}

/** Add a private note to a contact. */
export async function addPersonNote(formData: FormData) {
  const supabase = createSupabaseServer();
  const { orgId, agentId } = await getOrgContext(supabase);
  if (!agentId || !orgId) redirect("/dashboard/login");
  const person_id = str(formData.get("person_id"));
  const body = str(formData.get("body"));
  if (!person_id || !body) return;
  await supabase.from("person_notes").insert({ organization_id: orgId, person_id, body, author_agent_id: agentId });
  revalidatePath("/dashboard/contacts");
}

/** Delete a note. RLS scopes it to the org. */
export async function deletePersonNote(formData: FormData) {
  const supabase = createSupabaseServer();
  const { agentId } = await getOrgContext(supabase);
  if (!agentId) redirect("/dashboard/login");
  const id = str(formData.get("id"));
  if (!id) return;
  await supabase.from("person_notes").delete().eq("id", id);
  revalidatePath("/dashboard/contacts");
}

/** Create or update the contact's review record. */
export async function savePersonReview(formData: FormData) {
  const supabase = createSupabaseServer();
  const { orgId, agentId } = await getOrgContext(supabase);
  if (!agentId || !orgId) redirect("/dashboard/login");
  const person_id = str(formData.get("person_id"));
  if (!person_id) return;

  const ratingRaw = str(formData.get("rating"));
  const rating = ratingRaw ? Math.min(5, Math.max(1, Number(ratingRaw))) : null;
  const patch = {
    status: str(formData.get("status")) ?? "requested",
    platform: str(formData.get("platform")),
    rating,
    quote: str(formData.get("quote")),
    url: str(formData.get("url")),
  };

  const review_id = str(formData.get("review_id"));
  if (review_id) {
    await supabase.from("person_reviews").update(patch).eq("id", review_id);
  } else {
    await supabase.from("person_reviews").insert({ organization_id: orgId, person_id, ...patch });
  }
  revalidatePath("/dashboard/contacts");
}
