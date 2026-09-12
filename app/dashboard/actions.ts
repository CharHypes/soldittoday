"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createAdminClient, PORTAL_DOCS_BUCKET } from "@/lib/supabase/admin";
import { AI_ENABLED, draftWithClaude } from "@/lib/ai";

const num = (v: FormDataEntryValue | null): number | null => {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const str = (v: FormDataEntryValue | null): string | null => {
  const s = String(v ?? "").trim();
  return s || null;
};

async function agentId() {
  const supabase = createSupabaseServer();
  const { data } = await supabase.from("agents").select("id").maybeSingle();
  return { supabase, id: data?.id as string | undefined };
}

export async function createListing(formData: FormData) {
  const { supabase, id: agent_id } = await agentId();
  if (!agent_id) redirect("/dashboard/login");

  let client_id: string | null = null;
  const clientName = str(formData.get("client_name"));
  if (clientName) {
    const { data: client } = await supabase
      .from("clients")
      .insert({ agent_id, name: clientName, email: str(formData.get("client_email")), phone: str(formData.get("client_phone")), type: "seller" })
      .select("id")
      .single();
    client_id = client?.id ?? null;
  }

  const { data: listing } = await supabase
    .from("listings")
    .insert({
      agent_id,
      client_id,
      address: str(formData.get("address")),
      city: str(formData.get("city")),
      state: str(formData.get("state")),
      zip: str(formData.get("zip")),
      mls_number: str(formData.get("mls_number")),
      price: num(formData.get("price")),
      beds: num(formData.get("beds")),
      baths: num(formData.get("baths")),
      sqft: num(formData.get("sqft")),
      status: str(formData.get("status")) ?? "Active",
      list_date: str(formData.get("list_date")),
      photo_url: str(formData.get("photo_url")),
    })
    .select("id")
    .single();

  revalidatePath("/dashboard");
  redirect(listing?.id ? `/dashboard/listings/${listing.id}` : "/dashboard");
}

export async function updateListing(formData: FormData) {
  const { supabase } = await agentId();
  const id = str(formData.get("id"));
  if (!id) return;
  await supabase
    .from("listings")
    .update({
      address: str(formData.get("address")),
      city: str(formData.get("city")),
      state: str(formData.get("state")),
      zip: str(formData.get("zip")),
      mls_number: str(formData.get("mls_number")),
      price: num(formData.get("price")),
      beds: num(formData.get("beds")),
      baths: num(formData.get("baths")),
      sqft: num(formData.get("sqft")),
      status: str(formData.get("status")) ?? "Active",
      list_date: str(formData.get("list_date")),
      photo_url: str(formData.get("photo_url")),
    })
    .eq("id", id);
  revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath("/dashboard");
}

export async function addNote(formData: FormData) {
  const { supabase } = await agentId();
  const listing_id = str(formData.get("listing_id"));
  const body = str(formData.get("body"));
  if (!listing_id || !body) return;
  await supabase.from("notes").insert({
    listing_id,
    body,
    client_visible: formData.get("client_visible") === "on",
  });
  revalidatePath(`/dashboard/listings/${listing_id}`);
}

export async function addSnapshot(formData: FormData) {
  const { supabase } = await agentId();
  const listing_id = str(formData.get("listing_id"));
  if (!listing_id) return;
  await supabase.from("engagement_snapshots").insert({
    listing_id,
    period_start: str(formData.get("period_start")),
    period_end: str(formData.get("period_end")),
    total_views: num(formData.get("total_views")) ?? 0,
    shares: num(formData.get("shares")) ?? 0,
    favorites: num(formData.get("favorites")) ?? 0,
    returning_pct: num(formData.get("returning_pct")),
    source: "manual",
  });
  revalidatePath(`/dashboard/listings/${listing_id}`);
}

/* -------------------------------------------------------------------------- */
/*  AI ... draft a seller update note from the listing's ListTrac stats         */
/* -------------------------------------------------------------------------- */

type DraftResult = { ok: true; draft: string } | { ok: false; error: string };

const money = (n: number | null | undefined) =>
  n == null ? null : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const topOf = (arr: unknown, key: "site" | "city"): string => {
  if (!Array.isArray(arr)) return "";
  return arr
    .filter((r) => r && typeof r === "object")
    .slice(0, 3)
    .map((r) => `${(r as Record<string, unknown>)[key] ?? "?"}: ${(r as Record<string, unknown>).views ?? 0}`)
    .join(", ");
};

/**
 * Draft a warm, on-brand seller-update note from a listing's latest ListTrac
 * snapshot(s). Returns the draft text for the agent to review/edit before saving
 * as a note; it never posts anything itself. Agent-scoped via RLS (only drafts
 * for the logged-in agent's own listings). Uses ONLY the real stored numbers.
 */
export async function draftSellerUpdate(listingId: string): Promise<DraftResult> {
  if (!AI_ENABLED) return { ok: false, error: "AI drafting isn't enabled yet." };
  const supabase = createSupabaseServer();

  const { data: listing } = await supabase
    .from("listings")
    .select("address,city,state,price,status,list_date,clients(name)")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing) return { ok: false, error: "Listing not found." };

  const { data: snaps } = await supabase
    .from("engagement_snapshots")
    .select("*")
    .eq("listing_id", listingId)
    .order("period_end", { ascending: false })
    .limit(2);
  const latest = snaps?.[0];
  if (!latest) return { ok: false, error: "Add this week's ListTrac stats first, then draft the update." };
  const prev = snaps?.[1];

  const dom =
    listing.list_date != null
      ? Math.max(0, Math.round((Date.now() - new Date(String(listing.list_date) + "T00:00:00").getTime()) / 86_400_000))
      : null;

  const facts = [
    `Property: ${listing.address}${listing.city ? `, ${listing.city}` : ""}${listing.state ? ` ${listing.state}` : ""}.`,
    money(listing.price as number) ? `List price: ${money(listing.price as number)}.` : "",
    `Status: ${listing.status ?? "Active"}.`,
    dom != null ? `Days on market: ${dom}.` : "",
    latest.period_start && latest.period_end ? `Reporting period: ${latest.period_start} to ${latest.period_end}.` : "",
    `Total online views this period: ${latest.total_views ?? 0}.`,
    latest.favorites != null ? `Saved/favorited by: ${latest.favorites}.` : "",
    latest.shares != null ? `Shares: ${latest.shares}.` : "",
    latest.returning_pct != null ? `Returning visitors: ${latest.returning_pct}%.` : "",
    topOf(latest.by_source, "site") ? `Top sites: ${topOf(latest.by_source, "site")}.` : "",
    topOf(latest.by_city, "city") ? `Top viewer cities: ${topOf(latest.by_city, "city")}.` : "",
    prev?.total_views != null ? `Previous period total views: ${prev.total_views}.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const system = [
    "You write short weekly update notes from the Sold It Today real-estate TEAM to a home seller, shown on the seller's private portal.",
    "Voice: first-person plural (we, us, our). NEVER 'I', 'me', or 'my'.",
    "NEVER use em dashes. Use '...' instead where you'd pause.",
    "Use ONLY the numbers and facts provided. Never invent showings, offers, buyer feedback, or any statistic not given. If a trend is stated (previous vs this period), you may note the change honestly.",
    "Tone: warm, encouraging, professional, honest. 2 to 3 short paragraphs, about 90 to 140 words.",
    "Do not greet the seller by name and do not add a sign-off or signature (the portal already shows those). Plain text only, no markdown, no headings, no bullet lists.",
    "Focus on what the numbers mean for them and one light, forward-looking line.",
  ].join(" ");

  const draftRaw = await draftWithClaude({ system, user: `Here are this period's real figures for the listing:\n\n${facts}` });
  if (!draftRaw) return { ok: false, error: "Couldn't reach the drafting service. Please try again." };

  // Belt-and-suspenders on the house style: no em dashes, ever.
  const draft = draftRaw.replace(/\s*[—–]\s*/g, " ... ").trim();
  return { ok: true, draft };
}

/* -------------------------------------------------------------------------- */
/*  Buyers (transactions + closing tracker)                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_MILESTONES = [
  "Under Contract",
  "Earnest Money",
  "Inspection",
  "Appraisal",
  "Financing / Clear to Close",
  "Final Walkthrough",
  "Closing Day",
];

export async function createBuyer(formData: FormData) {
  const { supabase, id: agent_id } = await agentId();
  if (!agent_id) redirect("/dashboard/login");

  let client_id: string | null = null;
  const clientName = str(formData.get("client_name"));
  if (clientName) {
    const { data: client } = await supabase
      .from("clients")
      .insert({ agent_id, name: clientName, email: str(formData.get("client_email")), phone: str(formData.get("client_phone")), type: "buyer" })
      .select("id")
      .single();
    client_id = client?.id ?? null;
  }

  const { data: tx } = await supabase
    .from("transactions")
    .insert({
      agent_id,
      client_id,
      address: str(formData.get("address")),
      city: str(formData.get("city")),
      state: str(formData.get("state")),
      zip: str(formData.get("zip")),
      price: num(formData.get("price")),
      status: str(formData.get("status")) ?? "Under Contract",
      target_close_date: str(formData.get("target_close_date")),
      photo_url: str(formData.get("photo_url")),
    })
    .select("id")
    .single();

  if (tx?.id) {
    await supabase.from("milestones").insert(
      DEFAULT_MILESTONES.map((label, i) => ({
        transaction_id: tx.id,
        label,
        sort_order: i + 1,
        status: i === 0 ? "done" : "upcoming",
      }))
    );
  }

  revalidatePath("/dashboard/buyers");
  redirect(tx?.id ? `/dashboard/buyers/${tx.id}` : "/dashboard/buyers");
}

export async function updateTransaction(formData: FormData) {
  const { supabase } = await agentId();
  const id = str(formData.get("id"));
  if (!id) return;
  await supabase
    .from("transactions")
    .update({
      address: str(formData.get("address")),
      city: str(formData.get("city")),
      state: str(formData.get("state")),
      zip: str(formData.get("zip")),
      price: num(formData.get("price")),
      status: str(formData.get("status")) ?? "Under Contract",
      target_close_date: str(formData.get("target_close_date")),
      photo_url: str(formData.get("photo_url")),
    })
    .eq("id", id);
  revalidatePath(`/dashboard/buyers/${id}`);
  revalidatePath("/dashboard/buyers");
}

export async function updateMilestones(formData: FormData) {
  const { supabase } = await agentId();
  const transaction_id = str(formData.get("transaction_id"));
  if (!transaction_id) return;
  const { data: ms } = await supabase
    .from("milestones")
    .select("id")
    .eq("transaction_id", transaction_id);
  for (const m of ms ?? []) {
    const status = str(formData.get(`status_${m.id}`));
    const date = str(formData.get(`date_${m.id}`));
    await supabase
      .from("milestones")
      .update({ status: status ?? "upcoming", date })
      .eq("id", m.id);
  }
  revalidatePath(`/dashboard/buyers/${transaction_id}`);
}

export async function addBuyerNote(formData: FormData) {
  const { supabase } = await agentId();
  const transaction_id = str(formData.get("transaction_id"));
  const body = str(formData.get("body"));
  if (!transaction_id || !body) return;
  await supabase.from("notes").insert({
    transaction_id,
    body,
    client_visible: formData.get("client_visible") === "on",
  });
  revalidatePath(`/dashboard/buyers/${transaction_id}`);
}

// ============ Documents (agent side) ============

const safeDocName = (name: string): string =>
  (name || "document").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "document";

/** Agent uploads a document to a buyer's file. Optionally shares it immediately. */
export async function uploadBuyerDocument(formData: FormData) {
  const { supabase, id: agent_id } = await agentId();
  if (!agent_id) redirect("/dashboard/login");
  const transaction_id = str(formData.get("transaction_id"));
  const file = formData.get("file");
  if (!transaction_id || !(file instanceof File) || file.size === 0) return;

  const admin = createAdminClient();
  if (!admin) return; // service-role key not configured yet

  // Confirm the agent owns this transaction (RLS-scoped read).
  const { data: tx } = await supabase
    .from("transactions").select("id").eq("id", transaction_id).maybeSingle();
  if (!tx) return;

  const display = safeDocName(file.name);
  const path = `${transaction_id}/${randomUUID()}-${display}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await admin.storage
    .from(PORTAL_DOCS_BUCKET)
    .upload(path, buf, { contentType: file.type || "application/octet-stream", upsert: false });
  if (upErr) return;

  await admin.from("documents").insert({
    transaction_id,
    agent_id,
    name: display,
    storage_path: path,
    content_type: file.type || null,
    size_bytes: file.size,
    uploaded_by: "agent",
    client_visible: formData.get("client_visible") === "on",
  });
  revalidatePath(`/dashboard/buyers/${transaction_id}`);
}

/** Flip whether a document is visible on the buyer's portal. */
export async function toggleDocumentShare(formData: FormData) {
  const { supabase } = await agentId();
  const id = str(formData.get("id"));
  const transaction_id = str(formData.get("transaction_id"));
  const share = str(formData.get("share")) === "1";
  if (!id) return;
  await supabase.from("documents").update({ client_visible: share }).eq("id", id);
  if (transaction_id) revalidatePath(`/dashboard/buyers/${transaction_id}`);
}

/** Permanently delete a document (removes the stored file too). */
export async function deleteDocument(formData: FormData) {
  const { supabase } = await agentId();
  const id = str(formData.get("id"));
  const transaction_id = str(formData.get("transaction_id"));
  if (!id) return;
  const { data: doc } = await supabase
    .from("documents").select("storage_path").eq("id", id).maybeSingle();
  if (doc?.storage_path) {
    const admin = createAdminClient();
    if (admin) await admin.storage.from(PORTAL_DOCS_BUCKET).remove([doc.storage_path]);
  }
  await supabase.from("documents").delete().eq("id", id);
  if (transaction_id) revalidatePath(`/dashboard/buyers/${transaction_id}`);
}

export async function signOut() {
  const supabase = createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/dashboard/login");
}
