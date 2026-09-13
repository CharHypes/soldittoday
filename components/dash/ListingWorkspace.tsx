"use client";

import { useState } from "react";
import { updateListing, addSnapshot } from "@/app/dashboard/actions";
import SellerNoteComposer from "@/components/dash/SellerNoteComposer";
import ListTracImport from "@/components/dash/ListTracImport";
import CopyLink from "@/components/dash/CopyLink";

/* Shared styles (match the rest of the dashboard) */
const inp =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const lbl = "block text-sm text-dusty";
const card = "aurora-ring rounded-xl2 border border-dusty/15 bg-plum/50 p-6";

type Snapshot = {
  total_views: number | null;
  shares: number | null;
  favorites: number | null;
  returning_pct: number | null;
  period_start: string | null;
  period_end: string | null;
};
type NoteRow = { id: string; body: string; client_visible: boolean; created_at: string };
type DocRow = { id: string; name: string; created_at: string; uploaded_by: string; client_visible: boolean };
type Listing = {
  id: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  status: string | null;
  list_date: string | null;
  mls_number: string | null;
  photo_url: string | null;
};

const TABS = ["Overview", "Seller", "Activity", "Notes", "Documents", "Portal"] as const;
type Tab = (typeof TABS)[number];

function money(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function longDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function num(n: number | null | undefined): string {
  return n == null ? "—" : n.toLocaleString("en-US");
}

export default function ListingWorkspace({
  listing,
  client,
  notes,
  snapshots,
  documents,
  portalUrl,
  aiEnabled,
}: {
  listing: Listing;
  client: { name?: string | null; email?: string | null; phone?: string | null } | null;
  notes: NoteRow[];
  snapshots: Snapshot[];
  documents: DocRow[];
  portalUrl: string;
  aiEnabled: boolean;
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const latest = snapshots[0];
  const facts = [
    listing.beds != null ? `${num(listing.beds)} bd` : null,
    listing.baths != null ? `${num(listing.baths)} ba` : null,
    listing.sqft != null ? `${num(listing.sqft)} sqft` : null,
  ].filter(Boolean).join("  ·  ");
  const location = [listing.city, listing.state].filter(Boolean).join(", ") + (listing.zip ? ` ${listing.zip}` : "");

  const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border border-dusty/12 bg-plum/40 px-4 py-3">
      <div className="text-lg font-semibold text-pearl">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-dusty/70">{label}</div>
    </div>
  );

  return (
    <div>
      {/* Tab bar */}
      <div role="tablist" aria-label="Listing workspace sections" className="flex flex-wrap gap-1 border-b border-dusty/15">
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`panel-${t}`}
              id={`tab-${t}`}
              onClick={() => setTab(t)}
              className={`-mb-px cursor-pointer rounded-t-lg px-4 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-auroraMauve/60 ${
                active
                  ? "border-b-2 border-auroraMauve text-pearl"
                  : "border-b-2 border-transparent text-dusty hover:text-pearl"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-6">
        {/* ---------------- OVERVIEW ---------------- */}
        {tab === "Overview" && (
          <div role="tabpanel" id="panel-Overview" aria-labelledby="tab-Overview" className="space-y-6">
            <div className={`${card} sm:flex sm:gap-6`}>
              {/* Primary photo (or placeholder until IDX photo sync lands) */}
              <div className="sm:w-64 shrink-0">
                {listing.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.photo_url} alt={listing.address ?? "Listing"} className="h-44 w-full rounded-xl object-cover" />
                ) : (
                  <div className="flex h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-dusty/25 bg-plum/40 text-center">
                    <span className="text-sm text-dusty">No photo yet</span>
                    <span className="mt-1 text-[11px] text-dusty/60">IDX photo sync coming</span>
                  </div>
                )}
              </div>
              <div className="mt-4 min-w-0 flex-1 sm:mt-0">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-pearl">{listing.address}</h2>
                  <span className="shrink-0 rounded-full bg-wine/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pearl">
                    {listing.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-dusty">{location}</p>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-2xl font-semibold text-pearl">{money(listing.price)}</span>
                  {listing.mls_number && <span className="text-xs text-dusty/70">MLS# {listing.mls_number}</span>}
                </div>
                {facts && <p className="mt-2 text-sm text-dusty">{facts}</p>}
                <p className="mt-2 text-sm text-dusty">Seller: <span className="text-pearl">{client?.name ?? "Not linked"}</span></p>
              </div>
            </div>

            {/* Quick engagement stats */}
            <div className={card}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-pearl">Engagement at a glance</p>
                {latest?.period_end && <span className="text-xs text-dusty">as of {longDate(latest.period_end)}</span>}
              </div>
              {latest ? (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Online views" value={num(latest.total_views)} />
                  <Stat label="Shares" value={num(latest.shares)} />
                  <Stat label="Favorites" value={num(latest.favorites)} />
                  <Stat label="Returning" value={latest.returning_pct == null ? "—" : `${latest.returning_pct}%`} />
                </div>
              ) : (
                <p className="mt-2 text-sm text-dusty">No stats yet. Add this week&rsquo;s ListTrac numbers in the Activity tab.</p>
              )}
              <button type="button" onClick={() => setTab("Activity")} className="mt-3 text-xs font-semibold text-auroraMauve/80 hover:text-pearl">
                Manage activity &rarr;
              </button>
            </div>

            {/* Portal status */}
            <div className={card}>
              <p className="text-sm font-semibold text-pearl">Seller portal</p>
              <p className="mt-1 text-xs text-dusty">Live · private link (no login). Full link in the Portal tab.</p>
              <button type="button" onClick={() => setTab("Portal")} className="mt-2 text-xs font-semibold text-auroraMauve/80 hover:text-pearl">
                Open portal tab &rarr;
              </button>
            </div>

            {/* Edit listing details (existing functionality) */}
            <form action={updateListing} className={`${card} space-y-4`}>
              <input type="hidden" name="id" value={listing.id} />
              <p className="text-sm font-semibold text-pearl">Edit listing details</p>
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
              <label className={lbl}>
                Listing photo URL
                <input name="photo_url" defaultValue={listing.photo_url ?? ""} placeholder="https://... (paste a photo link; auto-fills once IDX photo sync is live)" className={`mt-1.5 ${inp}`} />
              </label>
              <button type="submit" className="btn-aurora">Save changes</button>
            </form>
          </div>
        )}

        {/* ---------------- SELLER ---------------- */}
        {tab === "Seller" && (
          <div role="tabpanel" id="panel-Seller" aria-labelledby="tab-Seller" className={card}>
            <p className="text-sm font-semibold text-pearl">Seller</p>
            {client?.name ? (
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex gap-3"><dt className="w-20 text-dusty">Name</dt><dd className="text-pearl">{client.name}</dd></div>
                <div className="flex gap-3"><dt className="w-20 text-dusty">Email</dt><dd className="text-pearl">{client.email || "—"}</dd></div>
                <div className="flex gap-3"><dt className="w-20 text-dusty">Phone</dt><dd className="text-pearl">{client.phone || "—"}</dd></div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-dusty">No seller linked to this listing yet.</p>
            )}
            <p className="mt-4 text-[11px] text-dusty/60">Editing seller contacts arrives with the CRM/contacts module.</p>
          </div>
        )}

        {/* ---------------- ACTIVITY ---------------- */}
        {tab === "Activity" && (
          <div role="tabpanel" id="panel-Activity" aria-labelledby="tab-Activity" className="space-y-6">
            {aiEnabled && <ListTracImport listingId={listing.id} address={listing.address ?? ""} />}
            <form action={addSnapshot} className={`${card} space-y-4`}>
              <input type="hidden" name="listing_id" value={listing.id} />
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-pearl">Add stats update (ListTrac)</p>
                {latest && (
                  <span className="text-xs text-dusty">Latest: {num(latest.total_views)} views · {longDate(latest.period_end)}</span>
                )}
              </div>
              <p className="text-xs text-dusty">Enter this week&rsquo;s numbers from your ListTrac report by hand.</p>
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

            {snapshots.length > 0 && (
              <div className={card}>
                <p className="text-sm font-semibold text-pearl">Recent updates</p>
                <div className="mt-3 space-y-2">
                  {snapshots.map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-dusty/12 bg-plum/40 px-4 py-2.5 text-sm">
                      <span className="text-dusty">{s.period_start ? `${longDate(s.period_start)} – ` : ""}{longDate(s.period_end)}</span>
                      <span className="text-pearl">{num(s.total_views)} views · {num(s.shares)} shares · {num(s.favorites)} favorites</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- NOTES ---------------- */}
        {tab === "Notes" && (
          <div role="tabpanel" id="panel-Notes" aria-labelledby="tab-Notes" className={card}>
            <p className="text-sm font-semibold text-pearl">Notes for the seller</p>
            <SellerNoteComposer listingId={listing.id} aiEnabled={aiEnabled} />
            <div className="mt-5 space-y-3">
              {notes.length === 0 && <p className="text-sm text-dusty">No notes yet.</p>}
              {notes.map((n) => (
                <div key={n.id} className="rounded-xl border border-dusty/12 bg-plum/40 p-4">
                  <p className="text-sm leading-relaxed text-pearl/90">{n.body}</p>
                  <p className="mt-2 text-[11px] text-dusty/70">
                    {longDate(n.created_at)} {n.client_visible ? "" : "· hidden from seller"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- DOCUMENTS ---------------- */}
        {tab === "Documents" && (
          <div role="tabpanel" id="panel-Documents" aria-labelledby="tab-Documents" className={card}>
            <p className="text-sm font-semibold text-pearl">Documents</p>
            {documents.length > 0 ? (
              <div className="mt-3 space-y-2">
                {documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-xl border border-dusty/12 bg-plum/40 px-4 py-2.5 text-sm">
                    <span className="text-pearl">{d.name}</span>
                    <span className="text-[11px] text-dusty/70">
                      {longDate(d.created_at)} · {d.uploaded_by}{d.client_visible ? "" : " · private"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-dusty">No documents on this listing yet.</p>
            )}
            <p className="mt-4 text-[11px] text-dusty/60">Uploading + sharing listing documents arrives with the CRM/documents module.</p>
          </div>
        )}

        {/* ---------------- PORTAL ---------------- */}
        {tab === "Portal" && (
          <div role="tabpanel" id="panel-Portal" aria-labelledby="tab-Portal" className={card}>
            <p className="text-sm font-semibold text-pearl">Seller portal link</p>
            <p className="mt-1 text-xs text-dusty">
              Live · private link{client?.name ? ` for ${client.name}` : ""} ... no login. Share it when you&rsquo;re ready.
            </p>
            <div className="mt-3"><CopyLink url={portalUrl} /></div>
            <a href={portalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-auroraMauve hover:text-pearl">
              Preview seller portal &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
