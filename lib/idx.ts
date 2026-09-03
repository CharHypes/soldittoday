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
  /** Spark record id ... stable, used for the listing detail page URL. */
  id: string;
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

/** Richer shape for the full listing detail page (all photos + extra fields). */
export type ListingDetail = Listing & {
  photos: string[];
  yearBuilt: number | null;
  lotSize: string | null;
  subType: string | null;
  county: string | null;
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
/*
 * Feed = MichRIC IDX data delivered through the Spark API (FBS/flexmls).
 * Auth is a non-expiring Bearer access token. Only two env vars are required:
 *   IDX_FEED_ENABLED = "true"
 *   IDX_FEED_TOKEN   = <Spark access token>   (secret ... server-only)
 * The base URL defaults to Spark's public endpoint; override with IDX_FEED_URL.
 */
// MichRIC IDX is delivered via Spark's Replication API host (confirmed live).
const SPARK_BASE = process.env.IDX_FEED_URL || "https://replication.sparkapi.com/v1";

export const IDX_ENABLED =
  process.env.IDX_FEED_ENABLED === "true" && Boolean(process.env.IDX_FEED_TOKEN);

const RESULT_LIMIT = 24;

/** Spark photo URLs come back as http; force https so they load on our site. */
function https(u: string | null | undefined): string | null {
  return u ? u.replace(/^http:\/\//, "https://") : null;
}

/**
 * Coerce a feed value to a finite number, else null. The feed masks fields the
 * license doesn't permit (or that don't apply, e.g. beds on a vacant lot) as
 * "********"; those must render as "not available", never as literal asterisks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function num(v: any): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function mapStatus(mls: string | undefined): ListingStatus {
  const s = (mls || "").toLowerCase();
  if (s.includes("sold") || s.includes("closed")) return "sold";
  if (s.includes("pending") || s.includes("contract")) return "pending";
  return "active";
}

/** Build a Spark `_filter` expression from the user's search params. */
function buildFilter(params: IdxSearchParams): string {
  const clauses: string[] = ["MlsStatus Eq 'Active'"];
  const loc = params.location?.trim();
  if (loc) {
    if (/^\d{5}$/.test(loc)) clauses.push(`PostalCode Eq '${loc}'`);
    else clauses.push(`City Eq '${loc.replace(/'/g, "''")}'`);
  }
  const min = Number(params.minPrice);
  if (Number.isFinite(min) && min > 0) clauses.push(`ListPrice Ge ${Math.round(min)}`);
  const max = Number(params.maxPrice);
  if (Number.isFinite(max) && max > 0) clauses.push(`ListPrice Le ${Math.round(max)}`);
  const beds = Number(params.beds);
  if (Number.isFinite(beds) && beds > 0) clauses.push(`BedsTotal Ge ${Math.round(beds)}`);
  const baths = Number(params.baths);
  if (Number.isFinite(baths) && baths > 0) clauses.push(`BathsTotal Ge ${Math.round(baths)}`);
  return clauses.join(" And ");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Map one Spark record to our display-only Listing, excluding confidential fields. */
function mapRecord(rec: any): Listing | null {
  const f = rec?.StandardFields ?? {};
  if (!f) return null;

  // Respect a seller's choice to withhold the address from Internet display.
  const showAddress = f.InternetAddressDisplayYN !== false;
  const streetAddress =
    f.UnparsedAddress ||
    [f.StreetNumber, f.StreetDirPrefix, f.StreetName, f.StreetSuffix, f.StreetDirSuffix]
      .filter(Boolean)
      .join(" ")
      .trim();

  const photos: string[] = Array.isArray(f.Photos)
    ? f.Photos.map((p: any) => https(p?.UriLarge || p?.Uri)).filter(Boolean)
    : [];

  return {
    id: String(rec.Id || f.ListingKey || ""),
    mlsNumber: String(f.ListingId || f.ListingKey || rec.Id || ""),
    showAddress,
    address: showAddress ? streetAddress : "",
    city: f.City || "",
    state: f.StateOrProvince || "MI",
    zip: f.PostalCode || "",
    price: num(f.ListPrice) ?? 0,
    beds: num(f.BedsTotal),
    baths: num(f.BathsTotal),
    sqft: num(f.BuildingAreaTotal) ?? num(f.LivingArea),
    propertyType: f.PropertyType || "",
    status: mapStatus(f.MlsStatus),
    photoUrl: photos[0] ?? null,
    description: f.PublicRemarks || "",
    listingBrokerName: f.ListOfficeName || "",
    listingBrokerPhone: f.ListOfficePhone || undefined,
    listDate: f.ListingContractDate || undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function searchListings(
  params: IdxSearchParams
): Promise<IdxSearchResult> {
  if (!IDX_ENABLED) {
    // Feed not connected yet. Return an honest empty result ... never fabricate.
    return { enabled: false, listings: [], total: 0, lastUpdated: null };
  }

  const filter = buildFilter(params);
  const url =
    `${SPARK_BASE}/listings?_filter=${encodeURIComponent(filter)}` +
    `&_expand=Photos&_limit=${RESULT_LIMIT}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.IDX_FEED_TOKEN}`,
        Accept: "application/json",
      },
      // Refresh well within the MichRIC 12-hour freshness rule.
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("[idx] Spark request failed:", res.status, (await res.text()).slice(0, 300));
      return { enabled: true, listings: [], total: 0, lastUpdated: null };
    }

    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = json?.D?.Results ?? [];
    const listings = results
      .map(mapRecord)
      .filter((l): l is Listing => Boolean(l) && Boolean((l as Listing).mlsNumber));
    const total = json?.D?.Pagination?.TotalRows ?? listings.length;

    return {
      enabled: true,
      listings,
      total,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[idx] Spark request threw:", err);
    return { enabled: true, listings: [], total: 0, lastUpdated: null };
  }
}

/**
 * Fetch a single listing by its Spark record id for the detail page ... returns
 * all photos plus a few extra display fields. Null if not found or feed off.
 */
export async function getListing(id: string): Promise<ListingDetail | null> {
  if (!IDX_ENABLED || !id) return null;
  const url = `${SPARK_BASE}/listings/${encodeURIComponent(id)}?_expand=Photos`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.IDX_FEED_TOKEN}`,
        Accept: "application/json",
      },
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = json?.D?.Results?.[0];
    if (!rec) return null;
    const base = mapRecord(rec);
    if (!base) return null;

    const f = rec.StandardFields ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const photos: string[] = Array.isArray(f.Photos)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        f.Photos.map((p: any) => https(p?.UriLarge || p?.Uri)).filter(Boolean)
      : [];
    const lot =
      num(f.LotSizeArea) != null
        ? `${num(f.LotSizeArea)} ${f.LotSizeUnits || "sqft"}`
        : num(f.LotSizeAcres) != null
        ? `${num(f.LotSizeAcres)} acres`
        : null;

    return {
      ...base,
      photos: photos.length ? photos : base.photoUrl ? [base.photoUrl] : [],
      yearBuilt: num(f.YearBuilt),
      lotSize: lot,
      subType: f.PropertySubType || null,
      county: f.CountyOrParish || null,
    };
  } catch {
    return null;
  }
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
