"use client";

import { useState } from "react";
import CopyLink from "@/components/dash/CopyLink";
import DeleteButton from "@/components/dash/DeleteButton";
import EditTransactionButton from "@/components/dash/EditTransactionButton";
import {
  updateMilestones, uploadBuyerDocument, toggleDocumentShare, deleteDocument,
  addBuyerNote, syncTransactionPhoto, deleteTransaction,
} from "@/app/dashboard/actions";

type KC = { role: string; name: string; company: string | null; email: string | null; phone: string | null; address: string | null; personId: string | null };
type Milestone = { id: string; label: string; sort_order: number; status: string; date: string | null };
type Doc = { id: string; name: string; uploaded_by: string | null; client_visible: boolean | null; created_at: string };
type Note = { id: string; body: string; from_client: boolean | null; client_visible: boolean | null; created_at: string };

type Props = {
  tx: {
    id: string; address: string | null; city: string | null; state: string | null; zip: string | null;
    price: number | string | null; status: string | null; pipeline_stage: string | null;
    target_close_date: string | null; mls_number: string | null; photo_url: string | null; email_token: string | null;
  };
  buyerName: string | null;
  agentName: string | null;
  portalUrl: string;
  dealEmail: string | null;
  keyContacts: KC[];
  milestones: Milestone[];
  documents: Doc[];
  notes: Note[];
  docsEnabled: boolean;
};

const TABS = ["Overview", "Checklist", "Documents", "Tasks", "Email", "Contacts", "Client portal", "Commission", "Log"] as const;
type Tab = (typeof TABS)[number];

const usd = (n: number | string | null) => {
  const v = typeof n === "string" ? parseFloat(n) : n;
  return v == null || Number.isNaN(v) ? "Not set" : "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const fmtDate = (s: string | null) => (s ? new Date(`${s}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not set");
const longDate = (s: string) => new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
const AV = ["#6c5767", "#5a6170", "#6f5a5f", "#4d6368", "#66605a", "#4a4448"];

export default function DealWorkspace(p: Props) {
  const [tab, setTab] = useState<Tab>("Overview");
  const inp = "w-full rounded-md border border-dusty/20 bg-plum/50 px-2.5 py-1.5 text-sm text-pearl outline-none focus:border-auroraMauve/60";
  const done = p.milestones.filter((m) => m.status === "done").length;
  const total = p.milestones.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const current = p.milestones.find((m) => m.status === "in_progress") ?? p.milestones.filter((m) => m.status === "done").slice(-1)[0];

  return (
    <div>
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="bo-record-title">{p.tx.address || p.buyerName || "Deal"}</h1>
          <p className="bo-record-sub">
            Buyer side · {p.buyerName || "No buyer linked"}
            {p.tx.target_close_date ? ` · Closes ${fmtDate(p.tx.target_close_date)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <EditTransactionButton tx={{ ...p.tx }} />
          <a href={p.portalUrl} target="_blank" rel="noreferrer" className="bo-btn">Preview portal</a>
        </div>
      </div>

      {/* tab bar */}
      <div className="mt-5 flex flex-wrap gap-1 border-b border-dusty/12">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3.5 py-2.5 text-[13.5px] ${tab === t ? "border-auroraMauve font-semibold text-pearl" : "border-transparent text-dusty hover:text-pearl"}`}
          >
            {t === "Commission" ? <>Commission <span className="text-dusty/60">🔒</span></> : t}
          </button>
        ))}
      </div>

      <div className="py-6">
        {/* ---------------- OVERVIEW ---------------- */}
        {tab === "Overview" && (
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5">
              {/* details */}
              <div className="bo-card">
                <div className="bo-card-title">Transaction details<EditTransactionButton tx={{ ...p.tx }} /></div>
                <div className="bo-pairs">
                  <div className="bo-pair"><div className="bo-label">Agent on file</div><div className="bo-value">{p.agentName || "Not set"}</div></div>
                  <div className="bo-pair"><div className="bo-label">MLS #</div><div className="bo-value">{p.tx.mls_number || "Not set"}</div></div>
                  <div className="bo-pair"><div className="bo-label">Purchase price</div><div className="bo-value">{usd(p.tx.price)}</div></div>
                  <div className="bo-pair"><div className="bo-label">Closing date</div><div className="bo-value">{fmtDate(p.tx.target_close_date)}</div></div>
                  <div className="bo-pair"><div className="bo-label">Status</div><div className="bo-value">{p.tx.status || "Not set"}</div></div>
                  <div className="bo-pair bo-full"><div className="bo-label">Address</div><div className="bo-value">{[p.tx.address, p.tx.city, p.tx.state, p.tx.zip].filter(Boolean).join(", ") || "Not set"}</div></div>
                </div>
                {p.dealEmail && (
                  <div className="mt-4 border-t border-dusty/12 pt-3">
                    <div className="bo-label">Deal inbox · email docs here</div>
                    <div className="mt-1.5"><CopyLink url={p.dealEmail} /></div>
                  </div>
                )}
              </div>

              {/* notes preview */}
              <div className="bo-card">
                <div className="bo-card-title">Notes<button onClick={() => setTab("Log")} className="bo-btn" style={{ height: 26 }}>View all</button></div>
                {p.notes.length === 0 && <p className="text-sm text-dusty/70">No notes yet.</p>}
                {p.notes.slice(0, 3).map((n) => (
                  <div key={n.id} className="border-t border-dusty/10 py-2.5 first:border-0 first:pt-0">
                    <p className="whitespace-pre-line text-[13px] text-pearl/90">{n.body}</p>
                    <p className="mt-1 text-[10.5px] text-dusty/70">{n.from_client ? "From buyer" : "You"} · {longDate(n.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* key contacts */}
              <div className="bo-card">
                <div className="bo-card-title">Key contacts</div>
                {p.keyContacts.length === 0 && <p className="text-sm text-dusty/70">No contacts linked yet. Use Edit transaction to add them.</p>}
                {p.keyContacts.map((c, i) => (
                  <div key={i} className="bo-contact">
                    <div className="bo-avatars"><span className="bo-avatar" style={{ background: AV[i % AV.length], color: "#fff" }}>{initials(c.name)}</span></div>
                    <div className="bo-contact-body">
                      <div className="bo-contact-role">{c.role}</div>
                      <div className="bo-contact-name">{c.personId ? <a href={`/dashboard/contacts?id=${c.personId}`}>{c.name}</a> : c.name}</div>
                      {c.company && <div className="bo-contact-co">{c.company}</div>}
                      {(c.phone || c.email) && (
                        <div className="bo-contact-line">
                          {c.phone && <a href={`tel:${c.phone}`}>{c.phone}</a>}
                          {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
                        </div>
                      )}
                      {c.address && <div className="bo-contact-addr">{c.address}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* closing progress */}
              <div className="bo-card">
                <div className="bo-card-title">Closing progress<span className="text-dusty">{done} of {total}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-plum/60"><span className="block h-full bg-gradient-to-r from-wine to-gold" style={{ width: `${pct}%` }} /></div>
                {current && <p className="mt-2 text-[13px] text-dusty">Current step: <b className="text-pearl/90">{current.label}</b></p>}
              </div>

              {/* property photo */}
              <div className="bo-card">
                <div className="bo-card-title">Property photo{p.tx.mls_number && (
                  <form action={syncTransactionPhoto}><input type="hidden" name="id" value={p.tx.id} /><button className="bo-btn" style={{ height: 26 }}>{p.tx.photo_url ? "Refresh MLS" : "Sync MLS"}</button></form>
                )}</div>
                <div className="overflow-hidden rounded-lg border border-dusty/15">
                  {p.tx.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.tx.photo_url} alt={p.tx.address ?? "home"} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center bg-bruised px-4 text-center text-[11px] text-dusty/60">Add an MLS # in Edit to pull the photo.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- CHECKLIST (closing tracker) ---------------- */}
        {tab === "Checklist" && (
          <form action={updateMilestones} className="bo-card space-y-4">
            <input type="hidden" name="transaction_id" value={p.tx.id} />
            <div className="bo-card-title">Closing checklist</div>
            <p className="-mt-2 text-xs text-dusty">Update each step as you go ... your buyer sees it live on their portal.</p>
            <div className="space-y-3">
              {p.milestones.map((m) => (
                <div key={m.id} className="grid grid-cols-1 items-center gap-3 rounded-lg border border-dusty/12 bg-plum/40 p-3 sm:grid-cols-[1fr_auto_auto]">
                  <span className="text-sm text-pearl">{m.sort_order}. {m.label}</span>
                  <select name={`status_${m.id}`} defaultValue={m.status} className={`${inp} sm:w-40`}>
                    <option value="upcoming">Upcoming</option><option value="in_progress">In progress</option><option value="done">Done</option>
                  </select>
                  <input type="date" name={`date_${m.id}`} defaultValue={m.date ?? ""} className={`${inp} sm:w-44`} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-aurora">Save checklist</button>
          </form>
        )}

        {/* ---------------- DOCUMENTS ---------------- */}
        {tab === "Documents" && (
          <div className="bo-card">
            <div className="bo-card-title">Documents</div>
            <p className="-mt-2 text-xs text-dusty">Share files with your buyer, and see what they send you.</p>
            {!p.docsEnabled && <p className="mt-3 rounded-lg border border-gold/30 bg-plum/40 p-3 text-xs text-dusty">Uploads activate once the Supabase service-role key is set in Vercel.</p>}
            {p.docsEnabled && (
              <form action={uploadBuyerDocument} className="mt-3 space-y-3">
                <input type="hidden" name="transaction_id" value={p.tx.id} />
                <input type="file" name="file" required className="block w-full text-sm text-dusty file:mr-3 file:rounded-full file:border-0 file:bg-wine file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pearl" />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-dusty"><input type="checkbox" name="client_visible" /> Share with buyer right away</label>
                  <button type="submit" className="btn-aurora !px-4 !py-2 text-sm">Upload</button>
                </div>
              </form>
            )}
            <div className="mt-5 space-y-2">
              {p.documents.length === 0 && <p className="text-xs text-dusty">No documents yet.</p>}
              {p.documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-dusty/12 bg-plum/40 px-4 py-3">
                  <div className="min-w-0">
                    <a href={`/api/dash/documents/${d.id}`} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium text-pearl hover:text-auroraMauve">{d.name}</a>
                    <p className="text-[11px] text-dusty/70">{d.uploaded_by === "buyer" ? "From buyer" : "You"} · {longDate(d.created_at)}{d.uploaded_by === "agent" ? (d.client_visible ? " · shared" : " · private") : ""}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {d.uploaded_by === "agent" && (
                      <form action={toggleDocumentShare}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="transaction_id" value={p.tx.id} /><input type="hidden" name="share" value={d.client_visible ? "0" : "1"} /><button className="text-xs font-semibold text-auroraMauve hover:text-pearl">{d.client_visible ? "Unshare" : "Share"}</button></form>
                    )}
                    <form action={deleteDocument}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="transaction_id" value={p.tx.id} /><button className="text-xs text-dusty hover:text-red-400">Delete</button></form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- CONTACTS ---------------- */}
        {tab === "Contacts" && (
          <div className="bo-card">
            <div className="bo-card-title">People on this deal</div>
            {p.keyContacts.length === 0 && <p className="text-sm text-dusty/70">No contacts linked yet.</p>}
            {p.keyContacts.map((c, i) => (
              <div key={i} className="bo-contact">
                <div className="bo-avatars"><span className="bo-avatar" style={{ background: AV[i % AV.length], color: "#fff" }}>{initials(c.name)}</span></div>
                <div className="bo-contact-body">
                  <div className="bo-contact-role">{c.role}</div>
                  <div className="bo-contact-name">{c.personId ? <a href={`/dashboard/contacts?id=${c.personId}`}>{c.name}</a> : c.name}</div>
                  {c.company && <div className="bo-contact-co">{c.company}</div>}
                  {(c.phone || c.email) && <div className="bo-contact-line">{c.phone && <a href={`tel:${c.phone}`}>{c.phone}</a>}{c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}</div>}
                  {c.address && <div className="bo-contact-addr">{c.address}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- CLIENT PORTAL ---------------- */}
        {tab === "Client portal" && (
          <div className="bo-card">
            <div className="bo-card-title">Client portal</div>
            <p className="-mt-2 text-xs text-dusty">Private link{p.buyerName ? ` for ${p.buyerName}` : ""} ... no login. They watch their closing progress live.</p>
            <div className="mt-3"><CopyLink url={p.portalUrl} /></div>
            <a href={p.portalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-auroraMauve hover:text-pearl">Preview as client →</a>
          </div>
        )}

        {/* ---------------- LOG (notes as activity) ---------------- */}
        {tab === "Log" && (
          <div className="bo-card">
            <div className="bo-card-title">Notes &amp; activity</div>
            <form action={addBuyerNote} className="mt-1 space-y-3">
              <input type="hidden" name="transaction_id" value={p.tx.id} />
              <textarea name="body" rows={3} placeholder="Share an update your buyer will see on their portal..." className={inp} />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-dusty"><input type="checkbox" name="client_visible" defaultChecked /> Visible to buyer</label>
                <button type="submit" className="btn-aurora !px-4 !py-2 text-sm">Add note</button>
              </div>
            </form>
            <div className="mt-5 space-y-3">
              {p.notes.map((n) => (
                <div key={n.id} className={["rounded-lg border p-4", n.from_client ? "border-auroraMauve/30 bg-wine/20" : "border-dusty/12 bg-plum/40"].join(" ")}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-auroraMauve">{n.from_client ? "From buyer" : "You"}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-pearl/90">{n.body}</p>
                  <p className="mt-2 text-[11px] text-dusty/70">{longDate(n.created_at)}{!n.from_client && !n.client_visible ? " · hidden from buyer" : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- COMING SOON TABS ---------------- */}
        {(tab === "Tasks" || tab === "Email" || tab === "Commission") && (
          <div className="bo-card">
            <div className="bo-card-title">{tab === "Email" ? "Email generator" : tab}{tab === "Commission" ? " · owner only" : ""}</div>
            <p className="text-sm text-dusty/70">
              {tab === "Commission" ? "The owner-only commission calculator (splits, SIT fee, referral, breakdown-for-SkySlope) is the next piece to build here." :
               tab === "Email" ? "The per-deal Email generator (templates + Resend send + auto-triggers) is coming next." :
               "Tasks for this deal are coming next."}
            </p>
          </div>
        )}
      </div>

      {/* delete */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/15 bg-red-500/5 p-4">
        <div>
          <p className="text-sm font-semibold text-pearl">Delete this deal</p>
          <p className="text-xs text-dusty">Removes the transaction and its checklist, notes, and documents. Can&rsquo;t be undone.</p>
        </div>
        <DeleteButton action={deleteTransaction} id={p.tx.id} label="Delete deal" confirmText="Delete this deal and everything on it? This removes the checklist, notes, and documents, and can't be undone." />
      </div>
    </div>
  );
}
