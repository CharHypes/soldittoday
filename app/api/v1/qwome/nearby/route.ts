import { NextResponse } from "next/server";
import { qwomeNearby, type QwomeCategoryKey } from "@/lib/qwome/engine";
import { resolveProvider } from "@/lib/qwome/regions";

/**
 * QWOME™ proximity service ... versioned (v1) so external partners/clients can
 * depend on a stable contract while QWOME evolves. Brand-agnostic: it accepts a
 * bare list of points and returns nearest-of-each-category distances. It knows
 * nothing about Sold It Today listings, IDX, or auth.
 *
 *   POST /api/v1/qwome/nearby
 *   body: { points: [{ id, lat, lng }], categories?: string[] }
 *   ->   { [id]: { <category>: { miles, name } } }
 *
 * A future multi-tenant deployment resolves a per-tenant PlaceProvider here and
 * passes it to qwomeNearby(); the response shape does not change.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      points?: Array<{ id: string; lat: number; lng: number }>;
      categories?: QwomeCategoryKey[];
    };
    const points = (body.points ?? [])
      .filter(
        (p) =>
          p &&
          typeof p.id === "string" &&
          Number.isFinite(p.lat) &&
          Number.isFinite(p.lng)
      )
      .slice(0, 500);
    if (points.length === 0) return NextResponse.json({});
    // Resolve the region's data provider from the query points (Michigan today).
    const result = await qwomeNearby(points, body.categories, resolveProvider(points));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}
