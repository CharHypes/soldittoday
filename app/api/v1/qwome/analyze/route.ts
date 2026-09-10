import { NextResponse } from "next/server";
import { analyzeProperties, type QwomeAnalysisInput } from "@/lib/qwome/analysis";
import { normalizePrefs } from "@/lib/qwome/preferences";

/**
 * QWOME™ property-fit analysis ... versioned (v1) partner/client API.
 *
 * This is the normalized intelligence endpoint: give it bare locations plus
 * QWOME preferences and it returns structured property-fit results (per-category
 * distance + status, satisfied counts, and the reserved fit `score`). No listing
 * object, IDX feed, or brokerage context is required ... any client (QWOME.com, a
 * mobile app, a partner site, an MLS integration) can call it the same way.
 *
 *   POST /api/v1/qwome/analyze
 *   body: { properties: [{ id?, location:{lat,lng}, preferences:[...] }] }
 *   ->   { results: QwomeFitResult[] }
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      properties?: Array<{ id?: string; location?: { lat: number; lng: number }; preferences?: unknown }>;
    };
    const inputs: QwomeAnalysisInput[] = (body.properties ?? [])
      .filter((p) => p && p.location && Number.isFinite(p.location.lat) && Number.isFinite(p.location.lng))
      .slice(0, 500)
      .map((p) => ({
        id: p.id,
        location: { lat: p.location!.lat, lng: p.location!.lng },
        preferences: normalizePrefs(p.preferences),
      }));
    if (inputs.length === 0) return NextResponse.json({ results: [] });
    const results = await analyzeProperties(inputs);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
