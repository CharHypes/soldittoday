import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DashHeader from "@/components/dash/DashHeader";
import CopyLink from "@/components/dash/CopyLink";
import { createSupabaseServer } from "@/lib/supabase/server";
import { updateListing, addNote, addSnapshot } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Edit Listing | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = "https://www.soldittoday.com";
const inp =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const lbl = "block text-sm text-dusty";
const card = "aurora-ring rounded-xl2 border border-dusty/15 bg-plum/50 p-6";

function longDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function EditListing({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: listing } = await supabase
    .from("listings")
    .select("*, clients(name,email,phone)")
    .eq("id", params.id)
    .maybeSingle();

  if (!listing) redirect("/dashboard");

  const { data: notes } = await supabase
    .from("notes").select("*").eq("listing_id", params.id).order("created_at", { ascending: false });
  const { data: snaps } = await supabase
    .from("engagement_snapshots").select("*").eq("listing_id", params.id)
    .order("period_end", { ascending: false }).limit(1);
  const latest = snaps?.[0];
  const portalUrl = `${SITE}/seller/${listing.portal_token}`;
  const client = listing.clients as { name?: string } | null;

  return (
    <main className="min-h-screen bg-mulberry-radial">
      <DashHeader />
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-dusty hover:text-pearl">&larr; Back to listings</a>
          <a href={portalUrl} target="_blank" rel="noreferrer" className="text-sm text-auroraMauve hover:text-pearl">
            Preview seller portal &rarr;
          </a>
        </div>

        <h1 className="text-2xl font-semibold text-pearl">{listing.address}</h1>

        {/* Seller portal link */}
        <div className={card}>
          <p className="text-sm font-semibold text-pearl">Seller portal link</p>
          <p className="mt-1 text-xs text-dusty">
            Private link{client?.name ? ` for ${client.name}` : ""} ... no login. Share it when you&rsquo;re ready.
          </p>
          <div className="mt-3"><CopyLink url={portalUrl} /></div>
        </div>

        {/* Edit details */}
        <form action={updateListing} className={`${card} space-y-4`}>
          <input type="hidden" name="id" value={listing.id} />
          <p className="text-sm font-semibold text-pearl">Listing details</p>
          <label className={lbl}>Address<input name="address" defaultValue={listing.address ?? ""} className={`mt-1.5 ${inp}`} /></label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className={`${lbl} col-span-2`}>City<input name="city" defaultValue={listing.city ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>State<input name="state" defaultValue={listing.state ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>ZIP<input name="zip" defaultValue={listing.zip ?? ""} className={`mt-1.5 ${inp}`} /></label>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <label className={lbl}>List Price<input name="price" defaultValue={listing.price ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>MLS #<input name="mls_number" defaultValue={listing.mls_number ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>
              Status
              <select name="status" defaultValue={listing.status ?? "Active"} className={`mt-1.5 ${inp}`}>
                <option>Active</option><option>Pending</option><option>Sold</option><option>Withdrawn</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className={lbl}>Beds<input name="beds" defaultValue={listing.beds ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Baths<input name="baths" defaultValue={listing.baths ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Sq Ft<input name="sqft" defaultValue={listing.sqft ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Listed<input type="date" name="list_date" defaultValue={listing.list_date ?? ""} className={`mt-1.5 ${inp}`} /></label>
          </div>
          <button type="submit" className="btn-aurora">Save changes</button>
        </form>

        {/* Stats */}
        <form action={addSnapshot} className={`${card} space-y-4`}>
          <input type="hidden" name="listing_id" value={listing.id} />
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-pearl">Listing stats (ListTrac)</p>
            {latest && (
              <span className="text-xs text-dusty">
                Latest: {latest.total_views?.toLocaleString("en-US")} views · updated {longDate(latest.period_end)}
              </span>
            )}
          </div>
          <p className="text-xs text-dusty">Enter this week&rsquo;s numbers from your ListTrac report. (Phase 2 will read these automatically.)</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className={lbl}>Views<input name="total_views" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Shares<input name="shares" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Favorites<input name="favorites" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Returning %<input name="returning_pct" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className={lbl}>Period start<input type="date" name="period_start" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Period end<input type="date" name="period_end" className={`mt-1.5 ${inp}`} /></label>
          </div>
          <button type="submit" className="btn-aurora">Add stats update</button>
        </form>

        {/* Notes */}
        <div className={card}>
          <p className="text-sm font-semibold text-pearl">Notes for the seller</p>
          <form action={addNote} className="mt-3 space-y-3">
            <input type="hidden" name="listing_id" value={listing.id} />
            <textarea name="body" rows={3} placeholder="Share an update your seller will see on their portal..." className={inp} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-dusty">
                <input type="checkbox" name="client_visible" defaultChecked /> Visible to seller
              </label>
              <button type="submit" className="btn-aurora !px-4 !py-2 text-sm">Add note</button>
            </div>
          </form>
          <div className="mt-5 space-y-3">
            {(notes ?? []).map((n) => (
              <div key={n.id} className="rounded-xl border border-dusty/12 bg-plum/40 p-4">
                <p className="text-sm leading-relaxed text-pearl/90">{n.body}</p>
                <p className="mt-2 text-[11px] text-dusty/70">
                  {longDate(n.created_at)} {n.client_visible ? "" : "· hidden from seller"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
