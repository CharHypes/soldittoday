import { supabase } from "@/lib/supabase";

/**
 * Public (anon) access to listings PUBLISHED on our own site ... FSBO / standalone
 * homes rendered at /l/<slug>, and non-null override fields overlaid onto the IDX
 * feed at /listing/<id>. Reads go through SECURITY DEFINER functions
 * (get_public_listing, get_listing_override) that only ever return published rows
 * and public-safe columns, so the authenticated tenant wall is never touched.
 */

export type PublicListing = {
  id: string;
  slug: string;
  isFsbo: boolean;
  mlsNumber: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  status: string;
  description: string | null;
  photoUrl: string | null;
  photos: string[];
  listDate: string | null;
  agent: { name: string | null; brand: string | null; phone: string | null; email: string | null };
};

export type ListingOverride = {
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  status?: string;
  description?: string;
  publicSlug?: string;
};

function forceHttps(u: string | null | undefined): string | null {
  if (!u) return null;
  return u.startsWith("http://") ? "https://" + u.slice(7) : u;
}

/** Fetch one published, self-hosted listing by its public slug. Null if none. */
export async function getPublicListing(slug: string): Promise<PublicListing | null> {
  if (!slug) return null;
  try {
    const { data, error } = await supabase.rpc("get_public_listing", { p_slug: slug });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = data;
    if (error || !r || !r.address) return null;
    const photos: string[] = Array.isArray(r.photos)
      ? r.photos.map((p: string) => forceHttps(p)).filter((p: string | null): p is string => Boolean(p))
      : [];
    const primary = forceHttps(r.photo_url) ?? photos[0] ?? null;
    return {
      id: String(r.id),
      slug: String(r.slug),
      isFsbo: Boolean(r.is_fsbo),
      mlsNumber: r.mls_number ?? null,
      address: r.address ?? "",
      city: r.city ?? "",
      state: r.state ?? "MI",
      zip: r.zip ?? "",
      price: r.price ?? null,
      beds: r.beds ?? null,
      baths: r.baths ?? null,
      sqft: r.sqft ?? null,
      status: r.status ?? "Active",
      description: r.description ?? null,
      photoUrl: primary,
      // Ensure the primary photo is first and not duplicated.
      photos: primary ? [primary, ...photos.filter((p) => p !== primary)] : photos,
      listDate: r.list_date ?? null,
      agent: {
        name: r.agent?.name ?? null,
        brand: r.agent?.brand ?? null,
        phone: r.agent?.phone ?? null,
        email: r.agent?.email ?? null,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Fetch override fields for a feed listing by its MLS number. Returns only the
 * fields Charlotte actually set (non-null), or null when there is no published
 * override. Degrades silently so a feed listing always renders even if the
 * function is missing or the DB is briefly unreachable.
 */
export async function getListingOverride(mlsNumber: string | null | undefined): Promise<ListingOverride | null> {
  if (!mlsNumber) return null;
  try {
    const { data, error } = await supabase.rpc("get_listing_override", { p_mls: mlsNumber });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = data;
    if (error || !r || typeof r !== "object" || Object.keys(r).length === 0) return null;
    const out: ListingOverride = {};
    if (r.price != null) out.price = r.price;
    if (r.beds != null) out.beds = r.beds;
    if (r.baths != null) out.baths = r.baths;
    if (r.sqft != null) out.sqft = r.sqft;
    if (r.status != null) out.status = r.status;
    if (r.description != null) out.description = r.description;
    if (r.public_slug != null) out.publicSlug = r.public_slug;
    return out;
  } catch {
    return null;
  }
}

/** Build a clean, human URL slug from an address (+ city for uniqueness help). */
export function slugifyAddress(address: string, city?: string): string {
  const base = [address, city].filter(Boolean).join(" ");
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
