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

const rint = (v: FormDataEntryValue | null): number => Math.round(num(v) ?? 0);
const jsonArr = (v: FormDataEntryValue | null): unknown[] | null => {
  const s = str(v);
  if (!s) return null;
  try {
    const p = JSON.parse(s);
    return Array.isArray(p) ? p : null;
  } catch {
    return null;
  }
};

export async function addSnapshot(formData: FormData) {
  const { supabase } = await agentId();
  const listing_id = str(formData.get("listing_id"));
  if (!listing_id) return;
  const rpct = num(formData.get("returning_pct"));
  const row: Record<string, unknown> = {
    listing_id,
    period_start: str(formData.get("period_start")),
    period_end: str(formData.get("period_end")),
    total_views: rint(formData.get("total_views")),
    shares: rint(formData.get("shares")),
    favorites: rint(formData.get("favorites")),
    returning_pct: rpct == null ? null : Math.round(rpct),
    // Manual form sends no source -> "manual" (unchanged); the ListTrac paste
    // importer sends source "listtrac" + the by_source/by_city breakdowns.
    source: str(formData.get("source")) || "manual",
  };
  const by_source = jsonArr(formData.get("by_source"));
  const by_city = jsonArr(formData.get("by_city"));
  if (by_source) row.by_source = by_source;
  if (by_city) row.by_city = by_city;
  await supabase.from("engagement_snapshots").insert(row);
  revalidatePath(`/dashboard/listings/${listing_id}`);
}

/* -------------------------------------------------------------------------- */
/*  ListTrac email paste -> parsed snapshot (agent reviews before saving)      */
/* -------------------------------------------------------------------------- */

export type ParsedSnapshot = {
  period_start: string | null;
  period_end: string | null;
  total_views: number | null;
  shares: number | null;
  favorites: number | null;
  returning_pct: number | null;
  by_source: { site: string; views: number }[];
  by_city: { city: string; views: number }[];
};
type ParseResult = { ok: true; data: ParsedSnapshot } | { ok: false; error: string };

/**
 * Extract engagement metrics from a pasted ListTrac weekly email into our
 * existing snapshot shape, using Claude (so we never hard-code a specific email
 * layout). Returns the parsed values for the agent to REVIEW/edit; it saves
 * nothing and sends nothing. Auth + AI gated. Optionally scoped to one property
 * address when the email covers several listings.
 */
export async function parseListTracEmail(raw: string, address?: string): Promise<ParseResult> {
  const { id } = await agentId();
  if (!id) return { ok: false, error: "Please sign in again." };
  if (!AI_ENABLED) return { ok: false, error: "AI parsing isn't enabled yet (missing API key)." };
  const text = (raw ?? "").trim();
  if (text.length < 20) return { ok: false, error: "Paste the ListTrac email contents first." };

  const system = [
    "You extract listing-engagement metrics from a pasted ListTrac 'Online Analytics Report' email (from alert@listtrac.com) into strict JSON.",
    "Return ONLY a JSON object ... no prose, no code fences.",
    'Schema (use null when a value is not present; use [] when a breakdown is absent; NEVER invent numbers): {"period_start":"YYYY-MM-DD|null","period_end":"YYYY-MM-DD|null","total_views":int|null,"shares":int|null,"favorites":int|null,"returning_pct":int|null,"by_source":[{"site":string,"views":int}],"by_city":[{"city":string,"views":int}]}',
    "Field mapping: period_start/period_end come from the 'STATS FOR THE PERIOD' date range (e.g. 'Jul 26, 2026 - Aug 30, 2026').",
    "total_views = the large headline 'PROPERTY VIEWS' number for that period. Do NOT use the 'TOTAL' at the bottom of the TOP WEBSITES table ... that is a different (past-30-days) window and will be a different number.",
    "shares = the 'SHARES' number; favorites = the 'FAVORITES' number; returning_pct = the 'X% of visitors ... are returning visitors' percentage as an integer 0-100.",
    "by_source = the TOP WEBSITES rows (website + property views). by_city = the TOP CITIES rows (city + property views). In BOTH tables IGNORE any 'TOTAL' summary row. Numbers may contain commas; return plain integers (1,883 -> 1883).",
    address ? `This report is for a single property; ignore anything not about: ${address}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const out = await draftWithClaude({ system, user: text, temperature: 0, maxTokens: 900 });
  if (!out) return { ok: false, error: "Couldn't reach the parsing service. Please try again." };

  const jsonText = out.slice(out.indexOf("{"), out.lastIndexOf("}") + 1);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "That email didn't parse cleanly. You can enter the numbers manually below." };
  }

  // Strip commas / stray characters so "1,883" -> 1883 even if the model echoes
  // the formatted value.
  const toInt = (v: unknown): number | null => {
    const cleaned = String(v ?? "").replace(/[^0-9.-]/g, "");
    if (!/\d/.test(cleaned)) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? Math.round(n) : null;
  };
  const toDate = (v: unknown): string | null =>
    typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? v.trim() : null;
  const bySite = Array.isArray(parsed.by_source)
    ? (parsed.by_source as Record<string, unknown>[])
        .map((r) => ({ site: String(r?.site ?? "").trim(), views: toInt(r?.views) ?? 0 }))
        .filter((r) => r.site && r.views > 0 && !/^total$/i.test(r.site))
        .slice(0, 12)
    : [];
  const byCity = Array.isArray(parsed.by_city)
    ? (parsed.by_city as Record<string, unknown>[])
        .map((r) => ({ city: String(r?.city ?? "").trim(), views: toInt(r?.views) ?? 0 }))
        .filter((r) => r.city && r.views > 0 && !/^total$/i.test(r.city))
        .slice(0, 12)
    : [];

  return {
    ok: true,
    data: {
      period_start: toDate(parsed.period_start),
      period_end: toDate(parsed.period_end),
      total_views: toInt(parsed.total_views),
      shares: toInt(parsed.shares),
      favorites: toInt(parsed.favorites),
      returning_pct: toInt(parsed.returning_pct),
      by_source: bySite,
      by_city: byCity,
    },
  };
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
