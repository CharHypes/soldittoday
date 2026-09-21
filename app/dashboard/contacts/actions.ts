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
  setIf("birthday");
  setIf("marital_status");
  setIf("lead_source");

  if (Object.keys(patch).length === 0) return;

  await supabase.from("people").update(patch).eq("id", id);
  revalidatePath("/dashboard/contacts");
}
