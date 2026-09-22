"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/context";
import { createAdminClient, PERSON_DOCS_BUCKET } from "@/lib/supabase/admin";

const ID_KINDS = ["drivers_license", "state_id", "passport", "resident_card"];

/**
 * Option B access gate for high-sensitivity docs (SSN cards): only an
 * owner/admin, or the agent who owns that contact, may open or delete them.
 */
async function canAccessHigh(
  supabase: ReturnType<typeof createSupabaseServer>,
  role: string | undefined,
  agentId: string,
  personId: string
): Promise<boolean> {
  if (role === "owner" || role === "admin") return true;
  const { data } = await supabase.from("people").select("agent_id").eq("id", personId).maybeSingle();
  return (data?.agent_id ?? null) === agentId;
}

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

/* ---------------- Document vault (private bucket, server-only, logged) ---------------- */

/** Upload a person document into the private bucket. Metadata write is RLS-gated;
 *  the file bytes go in via the service role. Every upload is logged. */
export async function uploadPersonDocument(formData: FormData) {
  const supabase = createSupabaseServer();
  const { orgId, agentId } = await getOrgContext(supabase);
  if (!agentId || !orgId) redirect("/dashboard/login");
  const admin = createAdminClient();
  if (!admin) return; // service key not configured

  const person_id = str(formData.get("person_id"));
  const file = formData.get("file") as File | null;
  if (!person_id || !file || file.size === 0) return;

  // Agents NAME their document; a single "sensitive" flag drives masking + the
  // Option B access gate (SSN cards, etc.). No fixed kind dropdown.
  const title = str(formData.get("title")) ?? file.name;
  const sensitive = formData.get("sensitive") === "on";
  const sensitivity = sensitive ? "high" : "standard";
  const kind = "other";
  const view_only = false;
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${orgId}/${person_id}/${randomUUID()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const up = await admin.storage.from(PERSON_DOCS_BUCKET).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (up.error) return;

  // Metadata insert goes through the user client, so RLS enforces write permission.
  const ins = await supabase
    .from("person_documents")
    .insert({
      organization_id: orgId,
      person_id,
      kind,
      title,
      sensitivity,
      storage_bucket: PERSON_DOCS_BUCKET,
      storage_path: path,
      filename: file.name,
      content_type: file.type,
      byte_size: file.size,
      view_only,
      uploaded_by_agent_id: agentId,
    })
    .select("id")
    .single();

  if (ins.error || !ins.data) {
    // permission denied or failure: remove the orphaned file, do not leave bytes behind
    await admin.storage.from(PERSON_DOCS_BUCKET).remove([path]);
    return;
  }

  await supabase.from("person_doc_log").insert({
    organization_id: orgId,
    document_id: ins.data.id,
    person_id,
    actor_agent_id: agentId,
    action: "upload",
  });
  revalidatePath("/dashboard/contacts");
}

/** Return a 60-second signed link to open a document, after the access gate + logging.
 *  Called directly from the client; the URL is never rendered into the page. */
export async function openPersonDocument(documentId: string): Promise<{ url?: string; error?: string }> {
  const supabase = createSupabaseServer();
  const { orgId, agentId, role } = await getOrgContext(supabase);
  if (!agentId || !orgId) return { error: "auth" };
  const admin = createAdminClient();
  if (!admin) return { error: "unavailable" };

  const { data: doc } = await supabase
    .from("person_documents")
    .select("id, person_id, sensitivity, storage_bucket, storage_path")
    .eq("id", documentId)
    .maybeSingle();
  if (!doc) return { error: "not_found" };

  if (doc.sensitivity === "high" && !(await canAccessHigh(supabase, role, agentId, doc.person_id))) {
    return { error: "forbidden" };
  }

  await supabase.from("person_doc_log").insert({
    organization_id: orgId,
    document_id: doc.id,
    person_id: doc.person_id,
    actor_agent_id: agentId,
    action: "view",
  });

  const { data: signed } = await admin.storage.from(doc.storage_bucket).createSignedUrl(doc.storage_path, 60);
  if (!signed?.signedUrl) return { error: "sign_failed" };
  return { url: signed.signedUrl };
}

/** Delete a document (bytes + row), logged. SSN cards obey the Option B gate. */
export async function deletePersonDocument(formData: FormData) {
  const supabase = createSupabaseServer();
  const { orgId, agentId, role } = await getOrgContext(supabase);
  if (!agentId || !orgId) redirect("/dashboard/login");
  const admin = createAdminClient();
  if (!admin) return;

  const id = str(formData.get("id"));
  if (!id) return;
  const { data: doc } = await supabase
    .from("person_documents")
    .select("id, person_id, sensitivity, storage_bucket, storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!doc) return;
  if (doc.sensitivity === "high" && !(await canAccessHigh(supabase, role, agentId, doc.person_id))) return;

  // Log the delete FIRST (document_id is set null when the row goes).
  await supabase.from("person_doc_log").insert({
    organization_id: orgId,
    document_id: doc.id,
    person_id: doc.person_id,
    actor_agent_id: agentId,
    action: "delete",
  });
  await admin.storage.from(doc.storage_bucket).remove([doc.storage_path]);
  await supabase.from("person_documents").delete().eq("id", id); // RLS enforces write permission
  revalidatePath("/dashboard/contacts");
}
