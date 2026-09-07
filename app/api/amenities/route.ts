import { NextResponse } from "next/server";
import { amenitiesForPoints } from "@/lib/amenities";

/**
 * POST { points: [{ id, lat, lng }] } -> { [id]: { hospital?, school?, grocery? } }
 * Powers the "Nearby" distance tiles on listing cards / detail pages. Straight-
 * line miles from free OpenStreetMap data, computed server-side + cached.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      points?: Array<{ id: string; lat: number; lng: number }>;
    };
    const points = (body.points ?? [])
      .filter(
        (p) =>
          p &&
          typeof p.id === "string" &&
          Number.isFinite(p.lat) &&
          Number.isFinite(p.lng)
      )
      .slice(0, 60); // cap per request
    if (points.length === 0) return NextResponse.json({});
    const result = await amenitiesForPoints(points);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}
