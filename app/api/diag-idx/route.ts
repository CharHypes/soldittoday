import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic: dumps the field keys + feature-relevant values from a
 * real MichRIC listing so we can build search filters that actually map. Gated
 * by a query key. Remove after building Smarter Search.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("k") !== "sit-diag-2026") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const token = process.env.IDX_FEED_TOKEN;
  const base = process.env.IDX_FEED_URL || "https://replication.sparkapi.com/v1";
  if (!token) return NextResponse.json({ note: "IDX_FEED_TOKEN not set" });

  const req = `${base}/listings?_filter=${encodeURIComponent("MlsStatus Eq 'Active'")}&_limit=3`;
  try {
    const res = await fetch(req, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    const json: any = await res.json();
    const results: any[] = json?.D?.Results ?? [];

    // Merge keys across a few records (feature fields are often only present when set).
    const keySet = new Set<string>();
    results.forEach((r) => Object.keys(r?.StandardFields ?? {}).forEach((k) => keySet.add(k)));
    const allKeys = [...keySet].sort();

    const featureLike = allKeys.filter((k) =>
      /garage|basement|fence|fenc|pool|waterfront|water|lot|stor(y|ies)|parking|acre|heating|cooling|fireplace|interior|exterior|appliance|feature|subtype|newconstruction|yearbuilt/i.test(
        k
      )
    );

    const f = results[0]?.StandardFields ?? {};
    const sampleFeatureValues: Record<string, any> = {};
    featureLike.forEach((k) => {
      const v = f[k];
      if (v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)) {
        sampleFeatureValues[k] = v;
      }
    });

    return NextResponse.json({
      totalKeys: allKeys.length,
      featureLikeKeys: featureLike,
      sampleFeatureValues,
    });
  } catch (e) {
    return NextResponse.json({ threw: String(e) });
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
