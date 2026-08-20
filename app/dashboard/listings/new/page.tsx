import type { Metadata } from "next";
import DashHeader from "@/components/dash/DashHeader";
import { createListing } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Add Listing | Sold It Today",
  robots: { index: false, follow: false },
};

const inp =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const lbl = "block text-sm text-dusty";

export default function NewListing() {
  return (
    <main className="min-h-screen bg-mulberry-radial">
      <DashHeader />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <a href="/dashboard" className="text-sm text-dusty hover:text-pearl">
          &larr; Back to listings
        </a>
        <h1 className="mt-3 text-2xl font-semibold text-pearl">Add Listing</h1>

        <form action={createListing} className="mt-8 space-y-5">
          <label className={lbl}>
            Address
            <input name="address" required placeholder="1457 Indian Trail" className={`mt-1.5 ${inp}`} />
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className={`${lbl} col-span-2`}>City<input name="city" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>State<input name="state" defaultValue="MI" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>ZIP<input name="zip" className={`mt-1.5 ${inp}`} /></label>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <label className={lbl}>List Price<input name="price" inputMode="numeric" placeholder="539900" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>MLS #<input name="mls_number" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>
              Status
              <select name="status" defaultValue="Active" className={`mt-1.5 ${inp}`}>
                <option>Active</option><option>Pending</option><option>Sold</option><option>Withdrawn</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <label className={lbl}>Beds<input name="beds" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Baths<input name="baths" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Sq Ft<input name="sqft" inputMode="numeric" className={`mt-1.5 ${inp}`} /></label>
            <label className={lbl}>Listed<input type="date" name="list_date" className={`mt-1.5 ${inp}`} /></label>
          </div>
          <label className={lbl}>
            Listing photo URL <span className="text-dusty/60">(optional)</span>
            <input name="photo_url" placeholder="https://... (or leave blank; IDX fills it later)" className={`mt-1.5 ${inp}`} />
          </label>

          <div className="rounded-xl2 border border-dusty/15 bg-plum/40 p-5">
            <p className="text-sm font-semibold text-pearl">Seller</p>
            <p className="mt-1 text-xs text-dusty">Their portal is created automatically. Use the seller&rsquo;s real email when you&rsquo;re ready to share it.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className={lbl}>Name<input name="client_name" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Email<input name="client_email" type="email" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Phone<input name="client_phone" className={`mt-1.5 ${inp}`} /></label>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-aurora">Create Listing</button>
            <a href="/dashboard" className="btn-outline">Cancel</a>
          </div>
        </form>
      </div>
    </main>
  );
}
