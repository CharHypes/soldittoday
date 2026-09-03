import { NextResponse } from "next/server";
import { searchListings, AGENT_MLS_ID, OFFICE_MLS_ID, IDX_ENABLED } from "@/lib/idx";

/**
 * TEMPORARY: runs the real searchListings() code path for Charlotte's agent /
 * office / a local city, to see what actually comes back. Gated by a key.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("k") !== "sit-diag-2026") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const mine = await searchListings({ agentId: AGENT_MLS_ID });
  const office = await searchListings({ officeId: OFFICE_MLS_ID });

  const shape = (r: Awaited<ReturnType<typeof searchListings>>) => ({
    enabled: r.enabled,
    count: r.listings.length,
    sample: r.listings.slice(0, 3).map((l) => ({
      city: l.city,
      price: l.price,
      addr: l.address,
      agent: l.listAgentMlsId,
      broker: l.listingBrokerName,
    })),
  });

  return NextResponse.json({
    IDX_ENABLED,
    AGENT_MLS_ID,
    OFFICE_MLS_ID,
    mine: shape(mine),
    office: shape(office),
  });
}
