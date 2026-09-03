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

/** Charlotte's MLS identity (public ids) ... used to feature HER inventory. */
export const AGENT_MLS_ID = "e344564";
export const OFFICE_MLS_ID = "oe314367";

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
  /** Listing agent identity ... to flag Charlotte's own listings. */
  listAgentMlsId?: string;
  listAgentName?: string;
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
  // Feature toggles ("1" when on) ... only MichRIC fields that aren't masked.
  garage?: string;
  ac?: string;
  fireplace?: string;
  singleStory?: string;
  waterfront?: string;
  newConstruction?: string;
  // Internal sourcing (not user-facing) ... feature a specific agent/office.
  agentId?: string;
  officeId?: string;
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
  // Location accepts one OR several comma-separated cities/ZIPs ... any match.
  const loc = params.location?.trim();
  if (loc) {
    const locClauses = loc
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => (/^\d{5}$/.test(p) ? `PostalCode Eq '${p}'` : `City Eq '${p.replace(/'/g, "''")}'`));
    if (locClauses.length === 1) clauses.push(locClauses[0]);
    else if (locClauses.length > 1) clauses.push(`(${locClauses.join(" Or ")})`);
  }
  const min = Number(params.minPrice);
  if (Number.isFinite(min) && min > 0) clauses.push(`ListPrice Ge ${Math.round(min)}`);
  const max = Number(params.maxPrice);
  if (Number.isFinite(max) && max > 0) clauses.push(`ListPrice Le ${Math.round(max)}`);
  const beds = Number(params.beds);
  if (Number.isFinite(beds) && beds > 0) clauses.push(`BedsTotal Ge ${Math.round(beds)}`);
  const baths = Number(params.baths);
  if (Number.isFinite(baths) && baths > 0) clauses.push(`BathsTotal Ge ${Math.round(baths)}`);

  // Feature toggles ... reliable (non-masked) MichRIC boolean/numeric fields.
  if (params.garage === "1") clauses.push("GarageYN Eq true");
  if (params.fireplace === "1") clauses.push("FireplaceYN Eq true");
  if (params.singleStory === "1") clauses.push("Stories Eq 1");
  if (params.waterfront === "1") clauses.push("WaterFrontYN Eq true");
  if (params.newConstruction === "1") clauses.push("NewConstructionYN Eq true");

  if (params.agentId) clauses.push(`ListAgentMlsId Eq '${params.agentId.replace(/'/g, "''")}'`);
  if (params.officeId) clauses.push(`ListOfficeMlsId Eq '${params.officeId.replace(/'/g, "''")}'`);

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
    listingBrokerEmail: f.ListOfficeEmail || undefined,
    listAgentMlsId: f.ListAgentMlsId || undefined,
    listAgentName: f.ListAgentFullName || undefined,
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

/**
 * A short set of active listings for the homepage "Featured Listings" band,
 * scoped to the given cities (Charlotte's Downriver focus). Prefers homes that
 * have a photo so the band always looks full. Empty when the feed is off ...
 * the section then hides itself (never fake data).
 */
/** Photos-first ordering so the band never leads with a photoless card. */
function preferPhotos(list: Listing[]): Listing[] {
  return [...list.filter((l) => l.photoUrl), ...list.filter((l) => !l.photoUrl)];
}

/** Round-robin across cities so no single city dominates; returns up to `n`. */
function diversifyByCity(list: Listing[], n: number): Listing[] {
  const byCity = new Map<string, Listing[]>();
  for (const l of list) {
    const c = (l.city || "").toLowerCase();
    if (!byCity.has(c)) byCity.set(c, []);
    byCity.get(c)!.push(l);
  }
  const out: Listing[] = [];
  let progressed = true;
  while (out.length < n && progressed) {
    progressed = false;
    for (const arr of byCity.values()) {
      const item = arr.shift();
      if (item) {
        out.push(item);
        progressed = true;
        if (out.length >= n) break;
      }
    }
  }
  return out;
}

export async function getFeaturedListings(fallbackCities: string[], limit = 6): Promise<Listing[]> {
  if (!IDX_ENABLED) return [];
  const seen = new Set<string>();
  const out: Listing[] = [];
  const push = (arr: Listing[]) => {
    for (const l of arr) {
      if (out.length >= limit) break;
      if (!l.id || seen.has(l.id)) continue;
      seen.add(l.id);
      out.push(l);
    }
  };

  // 1) Charlotte's own active listings first.
  const mine = await searchListings({ agentId: AGENT_MLS_ID });
  push(preferPhotos(mine.listings));

  // 2) Then her Remerica office's active listings.
  if (out.length < limit) {
    const office = await searchListings({ officeId: OFFICE_MLS_ID });
    push(preferPhotos(office.listings));
  }

  // 3) Fill any remainder with fresh local IDX (deduped + city-diversified).
  if (out.length < limit) {
    const local = await searchListings({ location: fallbackCities.join(", ") });
    push(diversifyByCity(preferPhotos(local.listings), limit - out.length));
  }

  return out;
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
