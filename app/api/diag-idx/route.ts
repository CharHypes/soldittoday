import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function q(base: string, token: string, filter: string, limit = 25) {
  const url = `${base}/listings?_filter=${encodeURIComponent(filter)}&_limit=${limit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json: any = await res.json().catch(() => ({}));
  return json?.D?.Results ?? [];
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("k") !== "sit-diag-2026") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const token = process.env.IDX_FEED_TOKEN;
  const base = process.env.IDX_FEED_URL || "https://replication.sparkapi.com/v1";
  if (!token) return NextResponse.json({ note: "IDX_FEED_TOKEN not set" });

  // 1) Her listing's agent/office id-ish fields.
  const hers = (await q(base, token, `ListingId Eq '26039316'`, 1))[0]?.StandardFields ?? {};
  const idFields: Record<string, any> = {};
  Object.keys(hers)
    .filter((k) => /^List(Agent|Office)/.test(k) && /Id|Key|MlsId|Number/i.test(k))
    .forEach((k) => (idFields[k] = hers[k]));

  // 2) Test which agent/office field actually filters (all results should be hers).
  const candidates: [string, any][] = [
    ["ListAgentMlsId", hers.ListAgentMlsId],
    ["ListAgentId", hers.ListAgentId],
    ["ListAgentKey", hers.ListAgentKey],
    ["ListAgentKeyNumeric", hers.ListAgentKeyNumeric],
    ["ListOfficeMlsId", hers.ListOfficeMlsId],
    ["ListOfficeId", hers.ListOfficeId],
    ["ListOfficeKey", hers.ListOfficeKey],
  ];
  const tests: any[] = [];
  for (const [field, val] of candidates) {
    if (val === undefined || val === null || val === "") continue;
    const rows = await q(base, token, `${field} Eq '${String(val).replace(/'/g, "''")}' And MlsStatus Eq 'Active'`, 25);
    const agents = rows.map((r: any) => r?.StandardFields?.ListAgentMlsId);
    const allHers = rows.length > 0 && agents.every((a: string) => a === hers.ListAgentMlsId);
    tests.push({ field, value: val, returned: rows.length, allHers, distinctAgents: [...new Set(agents)].slice(0, 4) });
  }

  return NextResponse.json({ herAgent: hers.ListAgentMlsId, herName: hers.ListAgentFullName, idFields, tests });
}
