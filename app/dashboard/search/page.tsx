import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import { searchListings, IDX_DISCLAIMER, AGENT_MLS_ID, type IdxSearchParams, type Listing } from "@/lib/idx";

export const metadata: Metadata = {
  title: "Search MLS | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const money = (n: number | null) =>
  n == null ? "" : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function SearchMls({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const params: IdxSearchParams = {
    location: one(searchParams.location) || undefined,
    minPrice: one(searchParams.minPrice) || undefined,
    maxPrice: one(searchParams.maxPrice) || undefined,
    beds: one(searchParams.beds) || undefined,
    baths: one(searchParams.baths) || undefined,
    garage: one(searchParams.garage) || undefined,
    fireplace: one(searchParams.fireplace) || undefined,
    singleStory: one(searchParams.singleStory) || undefined,
    waterfront: one(searchParams.waterfront) || undefined,
    newConstruction: one(searchParams.newConstruction) || undefined,
  };
  const didSearch = Boolean(
    params.location || params.minPrice || params.maxPrice || params.beds || params.baths ||
    params.garage || params.fireplace || params.singleStory || params.waterfront || params.newConstruction
  );

  const res = didSearch ? await searchListings(params) : { enabled: true, listings: [] as Listing[], total: 0, lastUpdated: null };

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-10">
        <h1 className="font-serif text-3xl font-medium text-pearl">Search the MLS</h1>
        <p className="mt-1 text-sm text-dusty">Active listings across the MLS ... find homes to send your buyers.</p>

        {/* search form */}
        <form method="get" className="mt-6 rounded-xl2 border border-dusty/15 bg-bruised/40 p-5">
          <div className="bo-form-grid">
            <div className="bo-field bo-span2"><label>City, ZIP, or address</label><input name="location" defaultValue={params.location ?? ""} placeholder="Novi, 48167, or 742 Birchwood" /></div>
            <div className="bo-field"><label>Min price</label><input name="minPrice" inputMode="numeric" defaultValue={params.minPrice ?? ""} placeholder="200000" /></div>
            <div className="bo-field"><label>Max price</label><input name="maxPrice" inputMode="numeric" defaultValue={params.maxPrice ?? ""} placeholder="300000" /></div>
            <div className="bo-field"><label>Beds (min)</label>
              <select name="beds" defaultValue={params.beds ?? ""}><option value="">Any</option>{[1,2,3,4,5].map((n)=><option key={n} value={n}>{n}+</option>)}</select></div>
            <div className="bo-field"><label>Baths (min)</label>
              <select name="baths" defaultValue={params.baths ?? ""}><option value="">Any</option>{[1,2,3,4].map((n)=><option key={n} value={n}>{n}+</option>)}</select></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-dusty">
            {([["garage","Garage"],["fireplace","Fireplace"],["singleStory","Single story"],["waterfront","Waterfront"],["newConstruction","New construction"]] as const).map(([k,lab])=>(
              <label key={k} className="flex items-center gap-2"><input type="checkbox" name={k} value="1" defaultChecked={params[k]==="1"} /> {lab}</label>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="bo-btn bo-primary">Search active listings</button>
            <a href="/dashboard/search" className="bo-btn">Reset</a>
          </div>
        </form>

        {/* results */}
        {didSearch && !res.enabled && (
          <div className="mt-8 rounded-xl2 border border-dusty/15 bg-bruised/40 p-10 text-center text-dusty">
            The MLS feed isn&rsquo;t connected yet. Once the IDX credentials are in place, searches return live listings here.
          </div>
        )}

        {didSearch && res.enabled && res.listings.length === 0 && (
          <div className="mt-8 rounded-xl2 border border-dusty/15 bg-bruised/40 p-10 text-center text-dusty">
            No active listings match that search. Try widening the price range or area.
          </div>
        )}

        {res.listings.length > 0 && (
          <>
            <p className="mt-7 text-sm text-dusty">
              Showing {res.listings.length}{res.total > res.listings.length ? ` of ${res.total}` : ""} active {res.total === 1 ? "listing" : "listings"}
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {res.listings.map((l) => {
                const mine = l.listAgentMlsId && l.listAgentMlsId === AGENT_MLS_ID;
                return (
                  <article key={l.id} className="overflow-hidden rounded-xl2 border border-dusty/15 bg-bruised/40">
                    <div className="relative h-44 bg-plum/60">
                      {l.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.photoUrl} alt={l.showAddress ? l.address : "Listing"} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center text-dusty/50">No photo</div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-[#2f9e6e] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Active</span>
                      {mine && <span className="absolute right-3 top-3 rounded-full bg-mauve px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-plum">Yours</span>}
                    </div>
                    <div className="p-4">
                      <p className="font-serif text-lg text-pearl">{money(l.price)}</p>
                      <p className="mt-0.5 text-[13.5px] text-pearl">{l.showAddress ? l.address : "Address withheld"}</p>
                      <p className="text-[12px] text-dusty">{[l.city, l.state].filter(Boolean).join(", ")} {l.zip}</p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-dusty">
                        {l.beds != null && <span>{l.beds} bd</span>}
                        {l.baths != null && <span>{l.baths} ba</span>}
                        {l.sqft != null && <span>{l.sqft.toLocaleString()} sqft</span>}
                        {l.propertyType && <span>{l.propertyType}</span>}
                      </div>
                      <p className="mt-2 text-[11px] text-dusty/60">MLS# {l.mlsNumber} · Listed by {l.listingBrokerName}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="mt-6 text-[11px] text-dusty/50">
              {IDX_DISCLAIMER}{res.lastUpdated ? ` Updated: ${new Date(res.lastUpdated).toLocaleString("en-US")}.` : ""}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
