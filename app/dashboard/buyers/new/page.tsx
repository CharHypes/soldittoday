import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
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
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <a href="/dashboard/buyers" className="text-sm text-dusty hover:text-pearl">&larr; Back to buyers</a>
        <h1 className="mt-3 text-2xl font-semibold text-pearl">Add buyer</h1>
        <p className="mt-1 text-sm text-dusty">Starts as a <strong className="text-pearl">lead</strong>. Promote them as they get pre-approved and go under contract ... same record the whole way.</p>

        <form action={createBuyer} className="mt-8 space-y-5">
          <div className="rounded-xl2 border border-dusty/15 bg-plum/40 p-5">
            <p className="text-sm font-semibold text-pearl">Who&rsquo;s the buyer?</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className={lbl}>Name<input name="client_name" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Email<input name="client_email" type="email" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Phone<input name="client_phone" className={`mt-1.5 ${inp}`} /></label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={lbl}>
                How did they come in?
                <select name="lead_source" defaultValue="" className={`mt-1.5 ${inp}`}>
                  <option value="">Select a source...</option>
                  <option>Referral</option><option>Past client</option><option>Sphere / personal</option>
                  <option>Zillow</option><option>Online lead</option><option>Open house</option><option>Repeat client</option>
                </select>
              </label>
              <label className={lbl}>Price range / pre-approval<input name="price" inputMode="numeric" placeholder="e.g. 250000" className={`mt-1.5 ${inp}`} /></label>
            </div>
          </div>

          <div className="rounded-xl2 border border-dusty/15 bg-plum/40 p-5">
            <p className="text-sm font-semibold text-pearl">Found a home already? <span className="font-normal text-dusty">(optional ... add it when they do)</span></p>
            <label className={`${lbl} mt-4 block`}>
              Property address
              <input name="address" placeholder="123 Main St" className={`mt-1.5 ${inp}`} />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <label className={`${lbl} col-span-2`}>City<input name="city" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>State<input name="state" defaultValue="MI" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>ZIP<input name="zip" className={`mt-1.5 ${inp}`} /></label>
            </div>
            <label className={`${lbl} mt-4 block`}>
              MLS number <span className="text-dusty/60">(pulls the home photo + details from the MLS)</span>
              <input name="mls_number" placeholder="e.g. 26039316" className={`mt-1.5 ${inp}`} />
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-aurora">Add buyer</button>
            <a href="/dashboard/leads" className="btn-outline">Cancel</a>
          </div>
        </form>
      </div>
    </main>
  );
}
