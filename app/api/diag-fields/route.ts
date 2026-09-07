import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic ... lists the StandardFields a MichRIC/Spark listing
 * returns, so we can build the sqft breakdown / deep details / schools / history
 * on real field names. Returns field names + populated values for ONE listing
 * (IDX data already public on the site). Remove after schema discovery.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query param required" });
  const base = process.env.IDX_FEED_URL || "https://replication.sparkapi.com/v1";
  const token = process.env.IDX_FEED_TOKEN;
  if (!token) return NextResponse.json({ error: "feed not configured" });
  try {
    const res = await fetch(
      `${base}/listings/${encodeURIComponent(id)}?_expand=Photos`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ error: `spark ${res.status}` });
    const json = await res.json();
    const f = json?.D?.Results?.[0]?.StandardFields ?? {};
    const allKeys = Object.keys(f).sort();
    const populated: Record<string, unknown> = {};
    for (const k of allKeys) {
      const v = f[k];
      if (v === null || v === "" || (Array.isArray(v) && v.length === 0)) continue;
      populated[k] = Array.isArray(v) ? `[array:${v.length}]` : v;
    }
    return NextResponse.json({ totalKeys: allKeys.length, populatedCount: Object.keys(populated).length, populated, allKeys });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
