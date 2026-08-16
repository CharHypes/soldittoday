import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Keep-awake endpoint.
 *
 * Supabase pauses free-tier projects after about a week of no activity, which
 * silently breaks every form on the site until the database is restored. A
 * scheduled daily hit to this route makes a tiny query so the database never
 * goes idle long enough to pause. See vercel.json for the schedule.
 *
 * If CRON_SECRET is set in the environment, callers must present it, so the
 * endpoint cannot be triggered by random traffic.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    // Lightweight touch: a HEAD count against leads. RLS returns no rows, but
    // the query still reaches the database and counts as activity.
    await supabase.from("leads").select("id", { head: true, count: "exact" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
