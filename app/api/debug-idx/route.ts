import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic ... query the IDX feed directly by MLS#, street number,
 * or ZIP to confirm coverage/matching for a specific home. REMOVE after use.
 */
const SPARK_BASE = process.env.IDX_FEED_URL || "https://replication.sparkapi.com/v1";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = process.env.IDX_FEED_TOKEN;
  if (process.env.IDX_FEED_ENABLED !== "true" || !token) {
    return NextResponse.json({ error: "feed off" }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const mls = searchParams.get("mls");
  const sn = searchParams.get("sn");
  const zip = searchParams.get("zip");
  const status = searchParams.get("status"); // "any" to drop the Active filter

  const esc = (s: string) => s.replace(/'/g, "''");
  const clauses: string[] = [];
  if (status !== "any") clauses.push("MlsStatus Eq 'Active'");
  if (mls) clauses.push(`ListingId Eq '${esc(mls)}'`);
  else if (sn) clauses.push(`StreetNumber Eq '${esc(sn)}'`);
  else if (zip) clauses.push(`PostalCode Eq '${esc(zip)}'`);
  else return NextResponse.json({ error: "pass ?mls= or ?sn= or ?zip= (optional &status=any)" }, { status: 400 });

  const filter = clauses.join(" And ");
  const url = `${SPARK_BASE}/listings?_filter=${encodeURIComponent(filter)}&_pagination=1&_limit=200`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = json?.D?.Results ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = results.map((r: any) => {
      const f = r.StandardFields ?? {};
      return {
        mls: f.ListingId,
        status: f.MlsStatus,
        streetNumber: f.StreetNumber,
        streetName: f.StreetName,
        suffix: f.StreetSuffix,
        city: f.City,
        zip: f.PostalCode,
        addr: f.UnparsedAddress,
        display: f.InternetAddressDisplayYN,
        office: f.ListOfficeName,
      };
    });
    return NextResponse.json({
      filter,
      httpStatus: res.status,
      total: json?.D?.Pagination?.TotalRows ?? results.length,
      count: rows.length,
      rows,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
