import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic: tries several Spark API hosts with the configured token
 * and reports which one answers with real listing JSON, plus a field sample so
 * we can confirm MichRIC's mapping. Gated by a query key. Remove after verifying.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CANDIDATE_BASES = [
  "https://sparkapi.com/v1",
  "https://replication.sparkapi.com/v1",
  "https://api.sparkapi.com/v1",
  "https://api.sparkplatform.com/v1",
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("k") !== "sit-diag-2026") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const token = process.env.IDX_FEED_TOKEN;
  if (!token) return NextResponse.json({ enabled: false, note: "IDX_FEED_TOKEN not set" });

  const filter = `MlsStatus Eq 'Active'`;
  const path = `/listings?_filter=${encodeURIComponent(filter)}&_expand=Photos&_limit=1`;

  const attempts: any[] = [];
  let winner: any = null;

  for (const base of CANDIDATE_BASES) {
    try {
      const res = await fetch(base + path, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
      const raw = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(raw);
      } catch {
        attempts.push({ base, status: res.status, ok: false, note: "non-JSON", snippet: raw.slice(0, 120) });
        continue;
      }
      const total = json?.D?.Pagination?.TotalRows ?? null;
      const success = json?.D?.Success ?? null;
      attempts.push({ base, status: res.status, ok: res.ok && success !== false, total, success, messages: json?.D?.Messages ?? null });
      if (res.ok && json?.D?.Results?.length) {
        winner = { base, total, sample: sampleOf(json.D.Results[0]?.StandardFields) };
        break;
      }
    } catch (e) {
      attempts.push({ base, error: String(e) });
    }
  }

  return NextResponse.json({ winner, attempts });
}

function sampleOf(f: any) {
  if (!f) return null;
  return {
    fieldKeys: Object.keys(f).slice(0, 60),
    ListingId: f.ListingId,
    City: f.City,
    StateOrProvince: f.StateOrProvince,
    PostalCode: f.PostalCode,
    ListPrice: f.ListPrice,
    BedsTotal: f.BedsTotal,
    BathsTotal: f.BathsTotal,
    BuildingAreaTotal: f.BuildingAreaTotal,
    MlsStatus: f.MlsStatus,
    PropertyType: f.PropertyType,
    ListOfficeName: f.ListOfficeName,
    PhotosCount: Array.isArray(f.Photos) ? f.Photos.length : 0,
    FirstPhoto: f.Photos?.[0]?.UriLarge || f.Photos?.[0]?.Uri || null,
    UnparsedAddress: f.UnparsedAddress,
    InternetAddressDisplayYN: f.InternetAddressDisplayYN,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
