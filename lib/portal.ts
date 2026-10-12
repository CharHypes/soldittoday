import { supabase } from "@/lib/supabase";

export type PortalStats = {
  period_start: string | null;
  period_end: string | null;
  total_views: number;
  shares: number;
  favorites: number;
  returning_pct: number | null;
  by_source: { site: string; views: number }[];
  by_city: { city: string; views: number }[];
  source: string;
  captured_at: string;
};

export type PortalData = {
  listing: {
    address: string;
    city: string | null;
    state: string | null;
    zip: string | null;
    price: number | null;
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    status: string;
    mls_number: string | null;
    photo_url: string | null;
    list_date: string | null;
  };
  agent: { name: string; brand: string | null; phone: string | null; email: string | null; avatar_url: string | null };
  client: { name: string | null };
  stats: PortalStats | null;
  notes: { body: string; created_at: string }[];
  documents: { name: string; storage_path: string | null }[];
};

/**
 * Fetch a seller portal by its unguessable token. Reads through a security-definer
 * RPC that only ever returns the single listing matching the token, so no login and
 * no service-role key are needed. Returns null if the token does not match.
 */
export async function getSellerPortal(token: string): Promise<PortalData | null> {
  const { data, error } = await supabase.rpc("get_seller_portal", { p_token: token });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[portal] rpc error:", error.message);
    return null;
  }
  return (data as PortalData | null) ?? null;
}

export type BuyerMilestone = {
  label: string;
  status: "upcoming" | "in_progress" | "done";
  date: string | null;
};

export type BuyerPortalData = {
  transaction: {
    address: string;
    city: string | null;
    state: string | null;
    zip: string | null;
    price: number | null;
    status: string;
    target_close_date: string | null;
    photo_url: string | null;
  };
  agent: { name: string; brand: string | null; phone: string | null; email: string | null; avatar_url: string | null };
  client: { name: string | null };
  milestones: BuyerMilestone[];
  notes: { body: string; created_at: string; from_client: boolean }[];
  documents: { id: string; name: string; uploaded_by: "agent" | "buyer"; created_at: string }[];
};

/** Fetch a buyer portal by its unguessable token (token-only RPC, no login). */
export async function getBuyerPortal(token: string): Promise<BuyerPortalData | null> {
  const { data, error } = await supabase.rpc("get_buyer_portal", { p_token: token });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[portal] buyer rpc error:", error.message);
    return null;
  }
  return (data as BuyerPortalData | null) ?? null;
}

export type BuyerTimelineData = {
  address: string | null; city: string | null; state: string | null; zip: string | null;
  price: number | null; emd_amount: number | null; photo_url: string | null;
  acceptance_date: string | null; emd_received_date: string | null;
  inspection_deadline: string | null; appraisal_date: string | null;
  insurance_date: string | null; walkthrough_date: string | null; target_close_date: string | null;
  client_name: string | null; title_company: string | null;
};

/** Public (token-only) read of the Under Contract Timeline data. */
export async function getBuyerTimeline(token: string): Promise<BuyerTimelineData | null> {
  const { data, error } = await supabase.rpc("get_buyer_timeline", { p_token: token });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[portal] buyer timeline rpc error:", error.message);
    return null;
  }
  return (data as BuyerTimelineData | null) ?? null;
}
