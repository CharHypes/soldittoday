import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic: calls the Spark API with the configured access token and
 * returns a trimmed view (status, totals, field keys, one sample) so we can
 * confirm auth works and MichRIC's field names map correctly before flipping
 * /search live. Gated by a query key. Remove after verifying.
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
  const base = process.env.IDX_FEED_URL || "https://api.sparkplatform.com/v1";
  if (!token) return NextResponse.json({ enabled: false, note: "IDX_FEED_TOKEN not set" });

  const city = url.searchParams.get("city");
  const filter = city
    ? `MlsStatus Eq 'Active' And City Eq '${city.replace(/'/g, "''")}'`
    : `MlsStatus Eq 'Active'`;
  const req = `${base}/listings?_filter=${encodeURIComponent(filter)}&_expand=Photos&_limit=2`;

  try {
    const res = await fetch(req, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    const status = res.status;
    const raw = await res.text(); // read once, then try to parse
    let json: any = null;
    try {
      json = JSON.parse(raw);
    } catch {
      return NextResponse.json({ status, note: "non-JSON response", rawSnippet: raw.slice(0, 800), requestUrl: req });
    }
    const first = json?.D?.Results?.[0]?.StandardFields;

    return NextResponse.json({
      status,
      success: json?.D?.Success ?? null,
      total: json?.D?.Pagination?.TotalRows ?? null,
      returned: json?.D?.Results?.length ?? 0,
      fieldKeys: first ? Object.keys(first) : null,
      sample: first
        ? {
            ListingId: first.ListingId,
            City: first.City,
            StateOrProvince: first.StateOrProvince,
            PostalCode: first.PostalCode,
            ListPrice: first.ListPrice,
            BedsTotal: first.BedsTotal,
            BathsTotal: first.BathsTotal,
            BuildingAreaTotal: first.BuildingAreaTotal,
            LivingArea: first.LivingArea,
            MlsStatus: first.MlsStatus,
            PropertyType: first.PropertyType,
            ListOfficeName: first.ListOfficeName,
            ListOfficePhone: first.ListOfficePhone,
            PhotosCount: Array.isArray(first.Photos) ? first.Photos.length : 0,
            FirstPhoto: first.Photos?.[0]?.UriLarge || first.Photos?.[0]?.Uri || null,
            UnparsedAddress: first.UnparsedAddress,
            InternetAddressDisplayYN: first.InternetAddressDisplayYN,
          }
        : null,
      messages: json?.D?.Messages ?? json?.raw ?? null,
    });
  } catch (e) {
    return NextResponse.json({ threw: String(e) });
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
