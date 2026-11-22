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
  const city = searchParams.get("city");
  const street = searchParams.get("street"); // substring of the address, e.g. "13th"
  if (!id && !mls && !city) {
    return NextResponse.json({ error: "pass ?id= or ?mls= or ?city=&street=" }, { status: 400 });
  }

  const token = process.env.IDX_FEED_TOKEN;
  if (!token) return NextResponse.json({ error: "feed token missing" }, { status: 500 });

  // Try several ways to resolve the record; report what each one did.
  const attempts: { label: string; url: string }[] = [];
  if (id) {
    attempts.push({ label: "byPathId", url: `${SPARK_BASE}/listings/${encodeURIComponent(id)}?_expand=Photos` });
    attempts.push({ label: "filterId", url: `${SPARK_BASE}/listings?_filter=${encodeURIComponent(`Id Eq '${String(id).replace(/'/g, "''")}'`)}&_expand=Photos&_limit=1` });
    attempts.push({ label: "filterListingId", url: `${SPARK_BASE}/listings?_filter=${encodeURIComponent(`ListingId Eq '${String(id).replace(/'/g, "''")}'`)}&_expand=Photos&_limit=1` });
  }
  if (mls) {
    attempts.push({ label: "filterMls", url: `${SPARK_BASE}/listings?_filter=${encodeURIComponent(`ListingId Eq '${String(mls).replace(/'/g, "''")}'`)}&_expand=Photos&_limit=1` });
  }
  if (city) {
    attempts.push({ label: "filterCity", url: `${SPARK_BASE}/listings?_filter=${encodeURIComponent(`City Eq '${String(city).replace(/'/g, "''")}'`)}&_expand=Photos&_limit=50`, many: true } as any);
  }

  const tried: { label: string; status: number; ok: boolean; body?: string }[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rec: any = null;
    for (const a of attempts) {
      const res = await fetch(a.url, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        tried.push({ label: a.label, status: res.status, ok: false, body: body.slice(0, 300) });
        continue;
      }
      const json = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any[] = json?.D?.Results ?? [];
      tried.push({ label: a.label, status: res.status, ok: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((a as any).many) {
        const needle = (street || "").toLowerCase();
        const hit = needle
          ? results.find((x) => String(x?.StandardFields?.UnparsedAddress || "").toLowerCase().includes(needle))
          : results[0];
        if (hit) { rec = hit; break; }
        // No street match: fall through, but remember how many we saw.
        tried[tried.length - 1].body = `city returned ${results.length}, none matched "${street}"`;
        continue;
      }
      if (results[0]) { rec = results[0]; break; }
    }
    if (!rec) {
      return NextResponse.json({ error: "no record from any method", tried }, { status: 404 });
    }
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
      resolvedVia: tried,
      areaRelatedFields: matched,
      allFieldNames: Object.keys(f).sort(),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
