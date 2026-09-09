import { NextResponse } from "next/server";
import { qwomeNearby, type QwomeCategoryKey } from "@/lib/qwome/engine";

/**
 * QWOME™ proximity service endpoint (brand-agnostic; the future standalone
 * QWOME API would expose this same shape).
 *   POST { points:[{id,lat,lng}], categories?: string[] }
 *   -> { [id]: { hospital?, school?, grocery? } }  (straight-line miles + name)
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
    const result = await qwomeNearby(points, body.categories);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}
