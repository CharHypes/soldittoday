import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DashHeader from "@/components/dash/DashHeader";
import CopyLink from "@/components/dash/CopyLink";
import { createSupabaseServer } from "@/lib/supabase/server";
import { updateTransaction, updateMilestones, addBuyerNote } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Edit Buyer | Sold It Today",
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

export default async function EditBuyer({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: tx } = await supabase
    .from("transactions")
    .select("*, clients(name,email,phone)")
    .eq("id", params.id)
    .maybeSingle();
  if (!tx) redirect("/dashboard/buyers");

  const { data: milestones } = await supabase
    .from("milestones").select("*").eq("transaction_id", params.id).order("sort_order", { ascending: true });
  const { data: notes } = await supabase
    .from("notes").select("*").eq("transaction_id", params.id).order("created_at", { ascending: false });

  const portalUrl = `${SITE}/buyer/${tx.portal_token}`;
  const client = tx.clients as { name?: string } | null;

  return (
    <main className="min-h-screen bg-mulberry-radial">
      <DashHeader />
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <a href="/dashboard/buyers" className="text-sm text-dusty hover:text-pearl">&larr; Back to buyers</a>
          <a href={portalUrl} target="_blank" rel="noreferrer" className="text-sm text-auroraMauve hover:text-pearl">
            Preview buyer portal &rarr;
          </a>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-pearl">{tx.address}</h1>
          {client?.name && <p className="text-sm text-dusty">Buyer: {client.name}</p>}
        </div>

        {/* Portal link */}
        <div className={card}>
          <p className="text-sm font-semibold text-pearl">Buyer portal link</p>
          <p className="mt-1 text-xs text-dusty">
            Private link{client?.name ? ` for ${client.name}` : ""} ... no login. Share it so they can watch their closing progress.
          </p>
          <div className="mt-3"><CopyLink url={portalUrl} /></div>
        </div>

        {/* Closing tracker */}
        <form action={updateMilestones} className={`${card} space-y-4`}>
          <input type="hidden" name="transaction_id" value={tx.id} />
          <p className="text-sm font-semibold text-pearl">Closing tracker</p>
          <p className="text-xs text-dusty">Update each step as you go ... your buyer sees this live.</p>
          <div className="space-y-3">
            {(milestones ?? []).map((m) => (
              <div key={m.id} className="grid grid-cols-1 items-center gap-3 rounded-xl border border-dusty/12 bg-plum/40 p-3 sm:grid-cols-[1fr_auto_auto]">
                <span className="text-sm text-pearl">{m.sort_order}. {m.label}</span>
                <select name={`status_${m.id}`} defaultValue={m.status} className={`${inp} sm:w-40`}>
                  <option value="upcoming">Upcoming</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <input type="date" name={`date_${m.id}`} defaultValue={m.date ?? ""} className={`${inp} sm:w-44`} />
              </div>
            ))}
          </div>
          <button type="submit" className="btn-aurora">Save tracker</button>
        </form>

        {/* Details */}
        <form action={updateTransaction} className={`${card} space-y-4`}>
          <input type="hidden" name="id" value={tx.id} />
          <p className="text-sm font-semibold text-pearl">Details</p>
          <label className={lbl}>Property address<input name="address" defaultValue={tx.address ?? ""} className={`mt-1.5 ${inp}`} /></label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className={`${lbl} col-span-2`}>City<input name="city" defaultValue={tx.city ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>State<input name="state" defaultValue={tx.state ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>ZIP<input name="zip" defaultValue={tx.zip ?? ""} className={`mt-1.5 ${inp}`} /></label>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <label className={lbl}>Purchase Price<input name="price" defaultValue={tx.price ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Target Close<input type="date" name="target_close_date" defaultValue={tx.target_close_date ?? ""} className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>
              Status
              <select name="status" defaultValue={tx.status ?? "Under Contract"} className={`mt-1.5 ${inp}`}>
                <option>Under Contract</option><option>Pending</option><option>Closed</option><option>Cancelled</option>
              </select>
            </label>
          </div>
          <label className={lbl}>
            House photo URL
            <input name="photo_url" defaultValue={tx.photo_url ?? ""} placeholder="https://... (auto-fills once IDX is live)" className={`mt-1.5 ${inp}`} />
          </label>
          <button type="submit" className="btn-aurora">Save changes</button>
        </form>

        {/* Notes */}
        <div className={card}>
          <p className="text-sm font-semibold text-pearl">Notes for the buyer</p>
          <form action={addBuyerNote} className="mt-3 space-y-3">
            <input type="hidden" name="transaction_id" value={tx.id} />
            <textarea name="body" rows={3} placeholder="Share an update your buyer will see on their portal..." className={inp} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-dusty">
                <input type="checkbox" name="client_visible" defaultChecked /> Visible to buyer
              </label>
              <button type="submit" className="btn-aurora !px-4 !py-2 text-sm">Add note</button>
            </div>
          </form>
          <div className="mt-5 space-y-3">
            {(notes ?? []).map((n) => (
              <div key={n.id} className="rounded-xl border border-dusty/12 bg-plum/40 p-4">
                <p className="text-sm leading-relaxed text-pearl/90">{n.body}</p>
                <p className="mt-2 text-[11px] text-dusty/70">
                  {longDate(n.created_at)} {n.client_visible ? "" : "· hidden from buyer"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
