import type { Metadata } from "next";
import DashHeader from "@/components/dash/DashHeader";
import { createBuyer } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Add Buyer | Sold It Today",
  robots: { index: false, follow: false },
};

const inp =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const lbl = "block text-sm text-dusty";

export default function NewBuyer() {
  return (
    <main className="min-h-screen bg-mulberry-radial">
      <DashHeader />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <a href="/dashboard/buyers" className="text-sm text-dusty hover:text-pearl">&larr; Back to buyers</a>
        <h1 className="mt-3 text-2xl font-semibold text-pearl">Add Buyer</h1>
        <p className="mt-1 text-sm text-dusty">Their 7-step closing tracker is created automatically.</p>

        <form action={createBuyer} className="mt-8 space-y-5">
          <div className="rounded-xl2 border border-dusty/15 bg-plum/40 p-5">
            <p className="text-sm font-semibold text-pearl">Buyer</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className={lbl}>Name<input name="client_name" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Email<input name="client_email" type="email" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Phone<input name="client_phone" className={`mt-1.5 ${inp}`} /></label>
            </div>
          </div>

          <label className={lbl}>
            Property address (the home they&rsquo;re buying)
            <input name="address" required placeholder="123 Main St" className={`mt-1.5 ${inp}`} />
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className={`${lbl} col-span-2`}>City<input name="city" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>State<input name="state" defaultValue="MI" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>ZIP<input name="zip" className={`mt-1.5 ${inp}`} /></label>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <label className={lbl}>Purchase Price<input name="price" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Target Close<input type="date" name="target_close_date" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>
              Status
              <select name="status" defaultValue="Under Contract" className={`mt-1.5 ${inp}`}>
                <option>Under Contract</option><option>Pending</option><option>Closed</option><option>Cancelled</option>
              </select>
            </label>
          </div>
          <label className={lbl}>
            House photo URL
            <input name="photo_url" placeholder="https://... (paste a photo link; auto-fills once IDX is live)" className={`mt-1.5 ${inp}`} />
          </label>

          <div className="flex gap-3">
            <button type="submit" className="btn-aurora">Create Buyer</button>
            <a href="/dashboard/buyers" className="btn-outline">Cancel</a>
          </div>
        </form>
      </div>
    </main>
  );
}
