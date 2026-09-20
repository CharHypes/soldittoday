import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getListingByMlsNumber } from "@/lib/idx";

/**
 * Scheduled bulk IDX photo refresh (Vercel Cron).
 *
 * For every listing that has an MLS number, resolve its stable Spark ListingKey
 * and current primary photo from the IDX feed and cache them onto our own row.
 * This is the ONLY place that touches the feed in bulk ... the app never calls
 * IDX per render; pages read listings.photo_url from our DB.
 *
 * Security: gated by CRON_SECRET (Vercel Cron sends it as a Bearer token). The
 * route refuses to run unless the secret is configured and matches, and it needs
 * the Supabase service-role key to write across all orgs. Until both are set in
 * the environment it is an inert, safe no-op (503).
 *
 * Photo-overwrite policy: listing_key is always refreshed; photo_url is only
 * (re)written when it is empty or already an IDX (sparkplatform) URL ... a
 * manually pasted photo is never clobbered.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Service role key not configured" }, { status: 503 });
  }

  const { data: listings, error } = await admin
    .from("listings")
    .select("id, mls_number, photo_url")
    .not("mls_number", "is", null)
    .limit(200);
  if (error) {
    return NextResponse.json({ ok: false, error: "Query failed" }, { status: 500 });
  }

  let checked = 0;
  let updated = 0;
  let unmatched = 0;
  for (const l of listings ?? []) {
    checked++;
    const match = await getListingByMlsNumber(String(l.mls_number));
    if (!match) {
      unmatched++;
      continue;
    }
    const patch: { listing_key: string; photo_url?: string } = { listing_key: match.id };
    const isIdxOrEmpty = !l.photo_url || String(l.photo_url).includes("sparkplatform.com");
    if (match.photoUrl && isIdxOrEmpty) patch.photo_url = match.photoUrl;

    const { error: upErr } = await admin.from("listings").update(patch).eq("id", l.id);
    if (!upErr) updated++;
  }

  return NextResponse.json({ ok: true, checked, updated, unmatched, at: new Date().toISOString() });
}
