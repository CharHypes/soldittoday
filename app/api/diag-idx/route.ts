import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic: find Charlotte's MLS agent id + office id (from a known
 * listing), and count her active agent/office listings so we can source the
 * homepage Featured band from HER inventory. Gated by a query key. Remove after.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function q(base: string, token: string, filter: string, limit = 1) {
  const url = `${base}/listings?_filter=${encodeURIComponent(filter)}&_limit=${limit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json: any = await res.json().catch(() => ({}));
  return json?.D ?? {};
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("k") !== "sit-diag-2026") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const token = process.env.IDX_FEED_TOKEN;
  const base = process.env.IDX_FEED_URL || "https://replication.sparkapi.com/v1";
  if (!token) return NextResponse.json({ note: "IDX_FEED_TOKEN not set" });

  const mls = url.searchParams.get("mls") || "26039316";

  try {
    // 1) Look up the known listing to read agent/office identity.
    const d1 = await q(base, token, `ListingId Eq '${mls}'`, 1);
    const f = d1?.Results?.[0]?.StandardFields ?? {};
    const identity = {
      ListAgentMlsId: f.ListAgentMlsId,
      ListAgentFullName: f.ListAgentFullName,
      ListAgentEmail: f.ListAgentEmail,
      ListOfficeMlsId: f.ListOfficeMlsId,
      ListOfficeName: f.ListOfficeName,
      MlsStatus: f.MlsStatus,
      City: f.City,
    };

    // 2) Count her active agent + office listings (if we found the ids).
    let agentActive: any = null;
    let officeActive: any = null;
    let officeSample: any[] = [];
    if (f.ListAgentMlsId) {
      const da = await q(base, token, `ListAgentMlsId Eq '${f.ListAgentMlsId}' And MlsStatus Eq 'Active'`, 5);
      agentActive = da?.Pagination?.TotalRows ?? da?.Results?.length ?? 0;
    }
    if (f.ListOfficeMlsId) {
      const doff = await q(base, token, `ListOfficeMlsId Eq '${f.ListOfficeMlsId}' And MlsStatus Eq 'Active'`, 6);
      officeActive = doff?.Pagination?.TotalRows ?? doff?.Results?.length ?? 0;
      officeSample = (doff?.Results ?? []).map((r: any) => ({
        City: r?.StandardFields?.City,
        ListPrice: r?.StandardFields?.ListPrice,
        Address: r?.StandardFields?.UnparsedAddress,
      }));
    }

    return NextResponse.json({ identity, agentActive, officeActive, officeSample });
  } catch (e) {
    return NextResponse.json({ threw: String(e) });
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
