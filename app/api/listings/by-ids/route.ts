import { NextResponse } from "next/server";
import { getListingsByIds } from "@/lib/idx";

/**
 * POST { ids: string[] } -> Listing[] summaries, for the Saved Homes page.
 * (Favorites are per-device in localStorage until real accounts ship.)
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { ids?: string[] };
    const ids = (body.ids ?? []).filter((x) => typeof x === "string").slice(0, 50);
    if (ids.length === 0) return NextResponse.json({ listings: [] });
    const listings = await getListingsByIds(ids);
    return NextResponse.json({ listings });
  } catch {
    return NextResponse.json({ listings: [] });
  }
}
