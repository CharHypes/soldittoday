"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

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

export async function signOut() {
  const supabase = createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/dashboard/login");
}
