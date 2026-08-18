/* -------------------------------------------------------------------------- */
/*  IDX (Broker Reciprocity) data layer for SOLD IT TODAY                       */
/* -------------------------------------------------------------------------- */
/**
 * How this works
 * --------------
 * Listings are licensed through the MichRIC® Data License Agreement (Broker
 * Reciprocity / IDX). Association/MLS = GMAR. Data operator = MichRIC®.
 * Charlotte is the self-Vendor; the live search is built in-house on this site.
 *
 * IMPORTANT: there is NO listing data until MichRIC returns feed credentials
 * after the signed agreement is approved. This module NEVER fabricates listings.
 * `searchListings` returns an honest empty result with `enabled: false` until the
 * feed is wired in the marked section below and enabled via environment variables.
 *
 * Credentials are NEVER hardcoded. They come from Vercel environment variables:
 *   IDX_FEED_ENABLED = "true"
 *   IDX_FEED_URL     = <MichRIC RESO Web API / RETS endpoint>
 *   IDX_FEED_TOKEN   = <access token or basic-auth credential>
 */

/* --- Compliance constants (MichRIC IDX Rules & Regulations) --------------- */

/** Brokerage name must be clearly displayed on every IDX display we control. */
export const BROKERAGE_NAME = "Remerica United Realty";

/** Required on any result displaying listing data (min 10pt). */
export const IDX_DISCLAIMER = "Information Deemed Reliable But Not Guaranteed.";

/** Required immediately after property info (min 10pt, current year). */
export function michRicCopyright(year: number): string {
  return `Copyright ${year} MichRIC, LLC. All rights reserved.`;
}

/* --- Types ---------------------------------------------------------------- */

export type ListingStatus = "active" | "pending" | "sold";

/**
 * Only display-permitted fields. Confidential fields (owner name/phone, showing
 * instructions, agent-only remarks, office/agent IDs, tour date/time, occupant
 * type, etc.) must never be mapped here or displayed.
 */
export type Listing = {
  mlsNumber: string;
  /** A seller may withhold the address from Internet display. Respect this. */
  showAddress: boolean;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  propertyType: string;
  status: ListingStatus;
  photoUrl: string | null;
  description: string;
  /** Attribution required for another broker's listing (MichRIC Rule l). */
  listingBrokerName: string;
  listingBrokerPhone?: string;
  listingBrokerEmail?: string;
  listDate?: string;
};

export type IdxSearchParams = {
  location?: string;
  propertyType?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
};

export type IdxSearchResult = {
  /** Is the live MichRIC feed connected? */
  enabled: boolean;
  listings: Listing[];
  total: number;
  /** ISO timestamp of the feed's last refresh, for the required "Updated:" date. */
  lastUpdated: string | null;
};

/* --- Feed connection ------------------------------------------------------ */

/**
 * Flips to true once the signed agreement is approved and MichRIC returns
 * credentials, set through Vercel env vars. Never hardcode credentials.
 */
export const IDX_ENABLED =
  process.env.IDX_FEED_ENABLED === "true" && Boolean(process.env.IDX_FEED_URL);

export async function searchListings(
  params: IdxSearchParams
): Promise<IdxSearchResult> {
  if (!IDX_ENABLED) {
    // Feed not connected yet. Return an honest empty result ... never fabricate.
    return { enabled: false, listings: [], total: 0, lastUpdated: null };
  }

  /* ┌─ WHEN MichRIC CREDENTIALS ARRIVE, IMPLEMENT THE FETCH HERE ───────────┐
     │ MichRIC delivers via the format they designate (typically RESO Web    │
     │ API). Steps:                                                          │
     │   1. Map `params` to the feed's query (e.g. $filter for price/beds/   │
     │      baths/propertyType, and a location match for city/ZIP/address).  │
     │   2. const res = await fetch(process.env.IDX_FEED_URL! + query, {     │
     │        headers: { Authorization: `Bearer ${process.env.IDX_FEED_TOKEN}` },
     │        next: { revalidate: 3600 }, // refresh well within the 12h rule │
     │      });                                                              │
     │   3. Map provider records -> Listing[], EXCLUDING confidential fields. │
     │   4. Drop expired/withdrawn; respect showAddress === false.           │
     │   5. Set lastUpdated from the feed's timestamp.                       │
     │ Return the mapped result below. Until then, stay empty (no fake data).│
     └───────────────────────────────────────────────────────────────────────┘ */

  // Placeholder until the mapping above is implemented.
  void params;
  return { enabled: false, listings: [], total: 0, lastUpdated: null };
}

/** Format an ISO timestamp as the required "mm/dd/yy" last-update display. */
export function formatUpdated(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}
