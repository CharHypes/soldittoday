import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY diagnostic (remove after use).
 * Dumps the raw square-footage-related fields the IDX feed sends for one listing,
 * so we can map "total square footage" to the correct field.
 * Guarded by a one-off key so it is not publicly usable.
 */
const KEY = "sqft-peek-7h3x9q";
const SPARK_BASE = process.env.IDX_FEED_URL || "https://replication.sparkapi.com/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("key") !== KEY) {
    return NextResponse.json({ error: "nope" }, { status: 404 });
  }
  const id = searchParams.get("id");
  const mls = searchParams.get("mls");
  if (!id && !mls) {
    return NextResponse.json({ error: "pass ?id=<ListingKey> or ?mls=<ListingId>" }, { status: 400 });
  }

  const token = process.env.IDX_FEED_TOKEN;
  if (!token) return NextResponse.json({ error: "feed token missing" }, { status: 500 });

  const url = id
    ? `${SPARK_BASE}/listings/${encodeURIComponent(id)}?_expand=Photos`
    : `${SPARK_BASE}/listings?_filter=${encodeURIComponent(`ListingId Eq '${String(mls).replace(/'/g, "''")}'`)}&_limit=1`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "feed not ok", status: res.status }, { status: 502 });
    }
    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = json?.D?.Results?.[0];
    if (!rec) return NextResponse.json({ error: "not found" }, { status: 404 });
    const f = rec.StandardFields || {};

    // Any field whose NAME hints at area / square footage / grade / finished.
    const rx = /area|sqft|square|grade|living|building|finished|basement|total/i;
    const matched: Record<string, unknown> = {};
    for (const k of Object.keys(f)) {
      if (rx.test(k)) matched[k] = f[k];
    }

    return NextResponse.json({
      id: rec.Id,
      listingId: f.ListingId,
      address: f.UnparsedAddress,
      city: f.City,
      currentlyMappedSqft: f.BuildingAreaTotal ?? f.LivingArea ?? null,
      areaRelatedFields: matched,
      allFieldNames: Object.keys(f).sort(),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
