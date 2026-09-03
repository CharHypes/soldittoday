import { NextResponse } from "next/server";

/**
 * TEMPORARY: check whether the MichRIC feed returns map coordinates
 * (Latitude/Longitude) ... the prerequisite for the map view. Gated by a key.
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

  const req = `${base}/listings?_filter=${encodeURIComponent("MlsStatus Eq 'Active'")}&_limit=8`;
  const res = await fetch(req, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json: any = await res.json().catch(() => ({}));
  const results: any[] = json?.D?.Results ?? [];

  const rows = results.map((r) => {
    const f = r?.StandardFields ?? {};
    return {
      addr: f.UnparsedAddress,
      lat: f.Latitude,
      lng: f.Longitude,
      hasCoords: f.Latitude != null && f.Longitude != null && f.Latitude !== "" && f.Longitude !== "",
    };
  });
  const withCoords = rows.filter((r) => r.hasCoords).length;

  return NextResponse.json({ sampled: rows.length, withCoords, rows });
}
