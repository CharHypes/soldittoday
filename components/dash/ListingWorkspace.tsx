"use client";

import { useEffect, useRef, useState } from "react";
import {
  updateListing, addSnapshot, syncListingPhoto, deleteListing,
  toggleListingFileNeed, toggleListingFileNeedCustom, uploadListingDocument, toggleDocumentShare, deleteDocument,
  updateListingMilestones, seedListingMilestones,
} from "@/app/dashboard/actions";
import { visibleItems, type ChkItem, type CustomItem, type FileNeeds } from "@/lib/dealChecklist";
import { avatarClass } from "@/lib/avatarColor";
import CommissionPanel, { type CommissionInit } from "@/components/dash/CommissionPanel";
import TasksPanel, { type Task } from "@/components/dash/TasksPanel";
import EmailGenerator from "@/components/dash/EmailGenerator";
import { type EmailTo } from "@/lib/dealEmailTemplates";
import DeleteButton from "@/components/dash/DeleteButton";
import SellerNoteComposer from "@/components/dash/SellerNoteComposer";
import ListTracImport from "@/components/dash/ListTracImport";
import CopyLink from "@/components/dash/CopyLink";

/* The listing workspace mirrors the buyer DealWorkspace layout exactly: it
   renders inside the `.dealws` scope (app/dashboard/deal.css) so a listing opens
   to the same transaction layout a buyer deal does ... the house photo in the
   header thumbnail, the status pill, the meta strip, the same tab bar, and the
   two-column Overview. Seller-side Checklist / Tasks / Commission / Email / Log
   backends come in a fast follow (Stage 2). */

type KC = { role: string; name: string; company: string | null; email: string | null; phone: string | null; address: string | null; personId: string | null };
type Milestone = { id: string; label: string; sort_order: number; status: string; date: string | null };
type Snapshot = {
  total_views: number | null; shares: number | null; favorites: number | null; returning_pct: number | null;
  period_start: string | null; period_end: string | null;
};
type NoteRow = { id: string; body: string; client_visible: boolean | null; created_at: string };
type DocRow = { id: string; name: string; created_at: string; uploaded_by: string | null; client_visible: boolean | null };
type Listing = {
  id: string; address: string | null; city: string | null; state: string | null; zip: string | null;
  price: number | null; beds: number | null; baths: number | null; sqft: number | null;
  status: string | null; list_date: string | null; mls_number: string | null; photo_url: string | null;
  email_token: string | null; created_at: string | null;
};

type Props = {
  listing: Listing;
  sellerName: string | null;
  agentName: string | null;
  ownerName: string | null;
  isOwner: boolean;
  keyContacts: KC[];
  notes: NoteRow[];
  snapshots: Snapshot[];
  documents: DocRow[];
  milestones: Milestone[];
  tasks: Task[];
  fileNeeds: FileNeeds;
  docsEnabled: boolean;
  avatarStyle: string;
  commission: CommissionInit;
  portalUrl: string;
  listingEmail: string | null;
  aiEnabled: boolean;
};

const TABS = ["Overview", "Notes", "Checklist", "Documents", "Tasks", "Email generator", "Activity", "Contacts", "Client portal", "Commission", "Log"] as const;
type Tab = (typeof TABS)[number];

const usd = (n: number | string | null) => {
  const v = typeof n === "string" ? parseFloat(n) : n;
  return v == null || Number.isNaN(v as number) ? null : "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const dt = (s: string | null) => (s ? new Date(`${s}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null);
const longDate = (s: string | null) => {
  if (!s) return "";
  const d = new Date(s + (s.length <= 10 ? "T00:00:00" : ""));
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const num = (n: number | null | undefined) => (n == null ? null : n.toLocaleString("en-US"));
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
const prettyRole = (r: string) => r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const daysOnMarket = (s: string | null) => {
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86_400_000));
};
const NS = <span style={{ color: "var(--d-ink3)" }}>Not set</span>;

function Copy({ text, className = "cpic" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={`${className}${done ? " done" : ""}`} title="Copy"
      onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1400); } catch {} }}>
      {done
        ? <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ width: 14, height: 14 }}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>}
    </button>
  );
}

const PencilIcon = () => <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 15, height: 15 }}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>;

export default function ListingWorkspace(p: Props) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [menu, setMenu] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const inp = "inp";
  const l = p.listing;
  const dom = daysOnMarket(l.list_date);
  const latest = p.snapshots[0];
  const location = [l.city, [l.state, l.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const statusActive = /active|sold|closed/i.test(l.status || "");
  const bedsBaths = l.beds != null || l.baths != null ? `${l.beds ?? "?"} bd · ${l.baths ?? "?"} ba` : null;
  const sideline = ["Seller side", l.status, location, dt(l.list_date) ? `Listed ${dt(l.list_date)}` : null].filter(Boolean).join(" · ");

  // Checklist (seller-side file needs).
  const chk = visibleItems("listing", null);
  const customDocs = p.fileNeeds.custom.filter((c) => c.group === "docs");
  const customActs = p.fileNeeds.custom.filter((c) => c.group === "actions");
  const docsDone = chk.docs.filter((d) => p.fileNeeds.docs.includes(d.key)).length + customDocs.filter((c) => c.done).length;
  const actsDone = chk.actions.filter((a) => p.fileNeeds.actions.includes(a.key)).length + customActs.filter((c) => c.done).length;
  const chkTotal = chk.docs.length + chk.actions.length + p.fileNeeds.custom.length;

  // Closing steps (seller milestones).
  const msDone = p.milestones.filter((m) => m.status === "done").length;
  const msTotal = p.milestones.length;
  const msPct = msTotal ? Math.round((msDone / msTotal) * 100) : 0;
  const msCurrent = p.milestones.find((m) => m.status === "in_progress") ?? p.milestones.filter((m) => m.status === "done").slice(-1)[0];
  const msNext = (() => { const i = p.milestones.findIndex((m) => m.id === msCurrent?.id); return i >= 0 ? p.milestones[i + 1] : undefined; })();

  // Activity log, derived from everything timestamped on this listing.
  type Act = { when: string; kind: string; text: string; detail?: string };
  const activity: Act[] = [];
  if (l.created_at) activity.push({ when: l.created_at, kind: "created", text: "Listing created" });
  p.notes.forEach((n) => activity.push({ when: n.created_at, kind: "note", text: "You added a note", detail: n.body }));
  p.documents.forEach((d) => activity.push({ when: d.created_at, kind: "doc", text: d.uploaded_by === "seller" ? "Seller added a document" : "You added a document", detail: d.name }));
  p.snapshots.forEach((s) => { if (s.period_end) activity.push({ when: `${s.period_end}T12:00:00`, kind: "stage", text: "Stats update", detail: `${s.total_views ?? 0} views` }); });
  activity.sort((a, b) => (a.when < b.when ? 1 : -1));
  const fmtWhen = (w: string) => { const d = new Date(w); return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };

  // Email generator (seller audience) inputs.
  const sellerC = p.keyContacts.find((c) => /seller/i.test(c.role) && !/co/i.test(c.role)) ?? p.keyContacts.find((c) => /seller/i.test(c.role));
  const findC = (re: RegExp) => p.keyContacts.find((c) => re.test(c.role));
  const emailVars = {
    buyer: p.sellerName || "there",
    seller: p.sellerName || "there",
    first_name: (p.sellerName || "there").split(/[\s&]+/)[0],
    address: l.address || "your home",
    closing_date: "your target date",
    agent: p.agentName || "Your agent",
    office: "The Sold It Today Team",
  };
  const emailRecipients: Partial<Record<EmailTo, string>> = {
    seller: sellerC?.email ?? "",
    buyer_agent: findC(/buyer.?agent|buying|buyer/i)?.email ?? "",
    title: findC(/title|escrow/i)?.email ?? "",
  };

  const openEdit = () => setEditOpen(true);

  return (
    <div className="dealws">
      {/* breadcrumb */}
      <p className="crumb"><a>Listings</a> / Seller / {l.address || "Listing"}</p>

      {/* header */}
      <div className="dhead">
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className="hthumb">
            {l.photo_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={l.photo_url} alt={l.address ?? "home"} />
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} style={{ width: 30, height: 30 }}><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>}
          </div>
          <div>
            <h1 className="dtitle">
              <span className="hc">{l.address || "Listing"}
                {l.address && <Copy className="hcbtn" text={[l.address, location].filter(Boolean).join(", ")} />}
              </span>
              <span className={`pill ${statusActive ? "active" : "under"}`}>{l.status || "Active"}</span>
            </h1>
            <div className="sideline">{sideline}</div>
          </div>
        </div>
        <div className="hbtns">
          <button type="button" className="btn mauve" onClick={openEdit}>Edit listing</button>
          <div className="menu" ref={menuRef}>
            <button type="button" className="btn" onClick={() => setMenu((v) => !v)}>Listing actions
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {menu && (
              <div className="menu-pop">
                {l.mls_number && (
                  <form action={syncListingPhoto}><input type="hidden" name="id" value={l.id} />
                    <button type="submit"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg> {l.photo_url ? "Refresh MLS photo + price" : "Sync MLS photo + price"}</button>
                  </form>
                )}
                <a href={p.portalUrl} target="_blank" rel="noreferrer"><button type="button"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg> Preview seller portal</button></a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* meta strip */}
      <div className="metastrip">
        <span className="ms"><b>Listed</b> {dt(l.list_date) || "Not set"}</span>
        <span className="ms"><b>Days on market</b> {dom != null ? `${dom}` : "Not set"}</span>
        <span className="ms"><b>MLS #</b> {l.mls_number || "Not set"}</span>
        <span className="ms"><b>Beds / baths</b> {bedsBaths || "Not set"}</span>
      </div>

      {/* tabs */}
      <div className="tabrow">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* ============ OVERVIEW ============ */}
      {tab === "Overview" && (
        <div className="panel">
          <div className="grid2">
            {/* left */}
            <div>
              <div className="card summary">
                <div className="cardhd" style={{ padding: "0 0 14px" }}><h3>Listing details</h3>
                  <button type="button" className="iconedit" onClick={openEdit}><PencilIcon /></button>
                </div>
                <div className="sgrid">
                  <Field k="Agent on file" link v={p.agentName} />
                  <Field k="MLS #" v={l.mls_number} />
                  <Field k="List price" v={usd(l.price)} />
                  <Field k="List date" v={dt(l.list_date)} />

                  <Field k="Status" v={l.status} />
                  <Field k="Days on market" v={dom != null ? `${dom} days` : null} />
                  <Field k="Beds / baths" v={bedsBaths} />
                  <Field k="Sq ft" v={num(l.sqft)} />

                  <Field k="Seller" link v={p.sellerName} />
                </div>

                <div className="emails">
                  <div className="efield">
                    <div className="k">Listing inbox · email docs here</div>
                    {p.listingEmail
                      ? <div className="eval"><a href={`mailto:${p.listingEmail}`}>{p.listingEmail}</a><Copy text={p.listingEmail} /></div>
                      : <div className="eval muted"><span style={{ color: "var(--d-ink3)" }}>Generated when the listing is saved</span></div>}
                  </div>
                  <div className="efield">
                    <div className="k">Seller portal</div>
                    <div className="eval"><a href={p.portalUrl} target="_blank" rel="noreferrer">Open live portal</a></div>
                  </div>
                </div>
              </div>

              {/* notes */}
              <div className="card" style={{ marginTop: 18 }}>
                <div className="cardhd"><h3>Notes</h3><button type="button" className="addlink" style={{ padding: "4px 8px" }} onClick={() => setTab("Notes")}>View all{p.notes.length ? ` (${p.notes.length})` : ""}</button></div>
                <div className="cardbody">
                  {p.notes.length === 0 && <p className="emptynote">No notes yet.</p>}
                  {p.notes.slice(0, 3).map((n) => (
                    <div key={n.id} className="note">{n.body}<div className="meta">You · {longDate(n.created_at)}</div></div>
                  ))}
                </div>
              </div>
            </div>

            {/* right */}
            <div>
              <div className="card">
                <div className="cardhd"><h3>Assigned to</h3></div>
                <div className="cardbody">
                  <div className="person"><span className="av" style={{ background: "#4d6368", color: "#fff" }}>{initials(p.ownerName || p.agentName || "Agent")}</span>
                    <div><div className="role">{p.isOwner ? "Owner · Hypes Team" : "Agent · Hypes Team"}</div><div className="nm">{p.ownerName || p.agentName || "Agent"} <span style={{ color: "var(--d-ink3)", fontWeight: 400 }}>· full access</span></div></div>
                  </div>
                  {p.agentName && p.agentName !== p.ownerName && (
                    <div className="person"><span className="av" style={{ background: "#6f5a5f", color: "#fff" }}>{initials(p.agentName)}</span>
                      <div><div className="role">Agent on file · listing agent</div><div className="nm">{p.agentName}</div></div>
                    </div>
                  )}
                  <div className="assign"><button type="button" className="addlink" onClick={openEdit}><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg> Assign another agent</button></div>
                </div>
              </div>

              <div className="card" style={{ marginTop: 18 }}>
                <div className="cardhd"><h3>Key contacts</h3>
                  <button type="button" className="iconedit" onClick={() => setTab("Contacts")}><PencilIcon /></button>
                </div>
                <div className="cardbody">
                  {p.keyContacts.length === 0 && <p className="emptynote">{p.sellerName ? `Seller: ${p.sellerName}` : "No contacts linked yet."}</p>}
                  {p.keyContacts.map((c, i) => <Party key={i} c={c} i={i} avatarStyle={p.avatarStyle} />)}
                </div>
              </div>

              <div className="card" style={{ marginTop: 18 }}>
                <div className="cardhd"><h3>Closing progress</h3><span className="clmeta"><b>{msDone}</b> of {msTotal}</span></div>
                <div className="cardbody">
                  {msTotal === 0 ? (
                    <form action={seedListingMilestones}>
                      <input type="hidden" name="listing_id" value={l.id} />
                      <p className="emptynote" style={{ marginBottom: 10 }}>No closing steps yet.</p>
                      <button type="submit" className="btn mauve">Set up closing steps</button>
                    </form>
                  ) : (
                    <>
                      <div className="prog"><span style={{ width: `${msPct}%` }} /></div>
                      {msCurrent && <div style={{ marginTop: 8, fontSize: 13, color: "var(--d-ink3)" }}>Current step: <b style={{ color: "var(--d-ink2)" }}>{msCurrent.label}</b>{msNext ? ` · next: ${msNext.label.toLowerCase()}` : ""}</div>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ NOTES ============ */}
      {tab === "Notes" && (
        <div className="panel">
          <div className="card">
            <div className="cardhd"><h3>Notes</h3><span className="clmeta">{p.notes.length} on this listing</span></div>
            <div className="cardbody">
              <div style={{ marginBottom: 14 }}><SellerNoteComposer listingId={l.id} aiEnabled={p.aiEnabled} /></div>
              {p.notes.length === 0 && <p className="emptynote">No notes yet.</p>}
              {p.notes.map((n) => (
                <div key={n.id} className="note">{n.body}<div className="meta">You · {longDate(n.created_at)}{n.client_visible ? "" : " · hidden from seller"}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ CHECKLIST ============ */}
      {tab === "Checklist" && (
        <div className="panel">
          <div className="clhead">
            <div className="clmeta">Checklist · <b>{docsDone + actsDone} of {chkTotal} complete</b></div>
          </div>
          <div className="group">
            <h2>Documents needed / received</h2>
            <div className="cl">
              {chk.docs.map((it) => <ChkRow key={it.key} listingId={l.id} group="docs" item={it} checked={p.fileNeeds.docs.includes(it.key)} />)}
              {customDocs.map((c) => <CustomRow key={c.id} listingId={l.id} item={c} />)}
            </div>
          </div>
          <div className="group">
            <h2>Follow-up / action items</h2>
            <div className="cl">
              {chk.actions.map((it) => <ChkRow key={it.key} listingId={l.id} group="actions" item={it} checked={p.fileNeeds.actions.includes(it.key)} />)}
              {customActs.map((c) => <CustomRow key={c.id} listingId={l.id} item={c} />)}
            </div>
          </div>

          <div className="group">
            <h2>Closing steps · shown on the seller portal</h2>
            {p.milestones.length === 0 ? (
              <div className="cl" style={{ padding: "12px 16px" }}>
                <form action={seedListingMilestones}><input type="hidden" name="listing_id" value={l.id} /><button type="submit" className="btn mauve">Set up closing steps</button></form>
              </div>
            ) : (
              <form action={updateListingMilestones} className="cl">
                <input type="hidden" name="listing_id" value={l.id} />
                {p.milestones.map((m) => (
                  <div key={m.id} className="clrow" style={{ gridTemplateColumns: "24px minmax(0,1fr) 150px 160px" }}>
                    <span style={{ color: "var(--d-ink3)", fontSize: 13 }}>{m.sort_order}</span>
                    <span className="doc">{m.label}</span>
                    <select name={`status_${m.id}`} defaultValue={m.status} className={inp}>
                      <option value="upcoming">Upcoming</option><option value="in_progress">In progress</option><option value="done">Done</option>
                    </select>
                    <input type="date" name={`date_${m.id}`} defaultValue={m.date ?? ""} className={inp} />
                  </div>
                ))}
                <div style={{ padding: "12px 16px" }}><button type="submit" className="btn mauve">Save closing steps</button></div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============ ACTIVITY (ListTrac engagement) ============ */}
      {tab === "Activity" && (
        <div className="panel">
          {p.aiEnabled && <div style={{ marginBottom: 18 }}><ListTracImport listingId={l.id} address={l.address ?? ""} /></div>}
          <div className="card">
            <div className="cardhd"><h3>Add stats update · ListTrac</h3>{latest && <span className="clmeta">Latest: {num(latest.total_views)} views · {longDate(latest.period_end)}</span>}</div>
            <div className="cardbody">
              <p className="emptynote" style={{ marginBottom: 12 }}>Enter this week&rsquo;s numbers from your ListTrac report.</p>
              <form action={addSnapshot}>
                <input type="hidden" name="listing_id" value={l.id} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  <label className="field"><div className="k">Views</div><input name="total_views" inputMode="numeric" className={inp} /></label>
                  <label className="field"><div className="k">Shares</div><input name="shares" inputMode="numeric" className={inp} /></label>
                  <label className="field"><div className="k">Favorites</div><input name="favorites" inputMode="numeric" className={inp} /></label>
                  <label className="field"><div className="k">Returning %</div><input name="returning_pct" inputMode="numeric" className={inp} /></label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                  <label className="field"><div className="k">Period start</div><input type="date" name="period_start" className={inp} /></label>
                  <label className="field"><div className="k">Period end</div><input type="date" name="period_end" className={inp} /></label>
                </div>
                <div style={{ marginTop: 12 }}><button type="submit" className="btn mauve">Add stats update</button></div>
              </form>
            </div>
          </div>

          {p.snapshots.length > 0 && (
            <div className="card" style={{ marginTop: 18 }}>
              <div className="cardhd"><h3>Recent updates</h3></div>
              <div className="cardbody">
                {p.snapshots.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 0", borderTop: i ? "1px solid var(--d-line)" : 0 }}>
                    <span style={{ fontSize: 12.5, color: "var(--d-ink3)" }}>{s.period_start ? `${longDate(s.period_start)} – ` : ""}{longDate(s.period_end)}</span>
                    <span style={{ fontSize: 13, color: "var(--d-ink)" }}>{num(s.total_views)} views · {num(s.shares)} shares · {num(s.favorites)} favorites</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ DOCUMENTS ============ */}
      {tab === "Documents" && (
        <div className="panel">
          <div className="card">
            <div className="cardhd"><h3>Documents</h3></div>
            <div className="cardbody">
              {!p.docsEnabled && <p className="emptynote">Uploads activate once the Supabase service-role key is set in Vercel.</p>}
              {p.docsEnabled && (
                <form action={uploadListingDocument} style={{ marginBottom: 14 }}>
                  <input type="hidden" name="listing_id" value={l.id} />
                  <input type="file" name="file" required className="emptynote" />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--d-ink3)" }}><input type="checkbox" name="client_visible" /> Share with seller right away</label>
                    <button type="submit" className="btn mauve">Upload</button>
                  </div>
                </form>
              )}
              {p.listingEmail && <p className="emptynote" style={{ marginBottom: 12 }}>Or email docs to <a href={`mailto:${p.listingEmail}`} style={{ color: "var(--d-mauve)", textDecoration: "none" }}>{p.listingEmail}</a> ... they file here automatically.</p>}
              {p.documents.length === 0 && <p className="emptynote">No documents on this listing yet.</p>}
              {p.documents.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 0", borderTop: "1px solid var(--d-line)" }}>
                  <div style={{ minWidth: 0 }}>
                    <a href={`/api/dash/documents/${d.id}`} target="_blank" rel="noreferrer" style={{ color: "var(--d-ink)", fontWeight: 500, fontSize: 14, textDecoration: "none" }}>{d.name}</a>
                    <div className="meta" style={{ fontSize: 11, color: "var(--d-ink3)", marginTop: 3 }}>{d.uploaded_by === "seller" ? "From seller" : "You"} · {longDate(d.created_at)}{d.uploaded_by === "agent" ? (d.client_visible ? " · shared" : " · private") : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                    {d.uploaded_by === "agent" && (
                      <form action={toggleDocumentShare}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="listing_id" value={l.id} /><input type="hidden" name="share" value={d.client_visible ? "0" : "1"} /><button type="submit" className="addlink" style={{ border: 0, padding: 0 }}>{d.client_visible ? "Unshare" : "Share"}</button></form>
                    )}
                    <form action={deleteDocument}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="listing_id" value={l.id} /><button type="submit" className="addlink" style={{ border: 0, padding: 0, color: "var(--d-red)" }}>Delete</button></form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ CONTACTS ============ */}
      {tab === "Contacts" && (
        <div className="panel">
          <div className="card">
            <div className="cardhd"><h3>People on this listing</h3>
              <button type="button" className="iconedit" onClick={openEdit}><PencilIcon /></button>
            </div>
            <div className="cardbody">
              {p.keyContacts.length === 0 && <p className="emptynote">{p.sellerName ? `Seller: ${p.sellerName} ... link full contact records with the contacts module.` : "No contacts linked yet."}</p>}
              {p.keyContacts.map((c, i) => <Party key={i} c={c} i={i} avatarStyle={p.avatarStyle} />)}
            </div>
          </div>
        </div>
      )}

      {/* ============ CLIENT PORTAL ============ */}
      {tab === "Client portal" && (
        <div className="panel">
          <div className="card">
            <div className="cardhd"><h3>Client portal</h3></div>
            <div className="cardbody">
              <p className="emptynote" style={{ marginBottom: 10 }}>Private link{p.sellerName ? ` for ${p.sellerName}` : ""} ... no login. The seller watches their listing activity live.</p>
              <CopyLink url={p.portalUrl} />
              <div style={{ marginTop: 10 }}><a href={p.portalUrl} target="_blank" rel="noreferrer" className="addlink" style={{ border: 0, padding: 0 }}>Preview as seller →</a></div>
              {p.listingEmail && (
                <div style={{ marginTop: 16, borderTop: "1px solid var(--d-line)", paddingTop: 14 }}>
                  <div className="efield"><div className="k">Email documents to this listing</div>
                    <div className="eval"><a href={`mailto:${p.listingEmail}`}>{p.listingEmail}</a><Copy text={p.listingEmail} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ TASKS ============ */}
      {tab === "Tasks" && <TasksPanel listingId={l.id} tasks={p.tasks} avatarStyle={p.avatarStyle} />}

      {/* ============ EMAIL GENERATOR ============ */}
      {tab === "Email generator" && (
        <div className="panel">
          <EmailGenerator vars={emailVars} recipients={emailRecipients} stage={(l.status ?? "").toLowerCase()} audience="seller" />
        </div>
      )}

      {/* ============ COMMISSION ============ */}
      {tab === "Commission" && (
        <div className="panel">
          {p.isOwner
            ? <CommissionPanel txId={l.id} address={l.address} init={p.commission} scope="listing" />
            : <div className="card"><div className="cardhd"><h3>Commission · owner only</h3></div><div className="cardbody"><p className="emptynote">Commission figures on this listing are visible to the workspace owner only.</p></div></div>}
        </div>
      )}

      {/* ============ LOG ============ */}
      {tab === "Log" && (
        <div className="panel">
          <div className="card">
            <div className="cardhd"><h3>Activity</h3><span className="clmeta">everything on this listing</span></div>
            <div className="cardbody">
              <div className="logfeed">
                {activity.length === 0 && <p className="emptynote">Nothing logged yet.</p>}
                {activity.map((it, i) => (
                  <div className="logitem" key={i}>
                    <span className={`logdot ${it.kind}`} />
                    <div>
                      <div className="logtext">{it.text}</div>
                      {it.detail && <div className="logdetail">{it.detail}</div>}
                      <div className="logtime">{fmtWhen(it.when)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="foot-danger">
            <div><div className="t">Delete this listing</div><div className="s">Removes the listing and its seller link, notes, and documents. Can&rsquo;t be undone.</div></div>
            <DeleteButton action={deleteListing} id={l.id} label="Delete listing" confirmText={`Delete ${l.address ?? "this listing"}? This removes the listing and its notes and documents, and can't be undone.`} />
          </div>
        </div>
      )}

      {/* Edit listing pop-out (over the record) */}
      {editOpen && (
        <div className="bo-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false); }}>
          <div className="bo-modal">
            <div className="bo-modal-head">
              <div className="bo-modal-title">Edit listing</div>
              <div className="bo-modal-actions"><button type="button" className="bo-close" onClick={() => setEditOpen(false)} aria-label="Close">&times;</button></div>
            </div>
            <form action={updateListing}>
              <input type="hidden" name="id" value={l.id} />
              <div className="bo-section">
                <div className="bo-section-title">Property</div>
                <div className="bo-form-grid">
                  <div className="bo-field bo-span2"><label>Address</label><input name="address" defaultValue={l.address ?? ""} /></div>
                  <div className="bo-field"><label>City</label><input name="city" defaultValue={l.city ?? ""} /></div>
                  <div className="bo-field"><label>State</label><input name="state" defaultValue={l.state ?? ""} /></div>
                  <div className="bo-field"><label>ZIP</label><input name="zip" defaultValue={l.zip ?? ""} /></div>
                  <div className="bo-field"><label>MLS #</label><input name="mls_number" defaultValue={l.mls_number ?? ""} /></div>
                  <div className="bo-field"><label>Status</label>
                    <select name="status" defaultValue={l.status ?? "Active"}>
                      <option>Active</option><option>Pending</option><option>Sold</option><option>Withdrawn</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bo-section">
                <div className="bo-section-title">Details</div>
                <div className="bo-form-grid bo-cols-4">
                  <div className="bo-field"><label>List price</label><input name="price" inputMode="numeric" defaultValue={l.price ?? ""} /></div>
                  <div className="bo-field"><label>Beds</label><input name="beds" inputMode="numeric" defaultValue={l.beds ?? ""} /></div>
                  <div className="bo-field"><label>Baths</label><input name="baths" inputMode="numeric" defaultValue={l.baths ?? ""} /></div>
                  <div className="bo-field"><label>Sq ft</label><input name="sqft" inputMode="numeric" defaultValue={l.sqft ?? ""} /></div>
                  <div className="bo-field"><label>Listed</label><input type="date" name="list_date" defaultValue={l.list_date ?? ""} /></div>
                  <div className="bo-field bo-span2"><label>Photo URL</label><input name="photo_url" defaultValue={l.photo_url ?? ""} placeholder="https://..." /></div>
                </div>
              </div>
              <div className="bo-modal-foot">
                <button type="button" className="bo-btn" onClick={() => setEditOpen(false)}>Cancel</button>
                <button type="submit" className="bo-save">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChkRow({ listingId, group, item, checked }: { listingId: string; group: "docs" | "actions"; item: ChkItem; checked: boolean }) {
  const status = checked
    ? <span className="st done">Completed</span>
    : item.optional ? <span className="st opt">If applicable</span> : <span className="st req">Required</span>;
  return (
    <form action={toggleListingFileNeed} className="clrow">
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="group" value={group} />
      <input type="hidden" name="key" value={item.key} />
      <input type="checkbox" className="cbx" defaultChecked={checked} onChange={(e) => e.currentTarget.form?.requestSubmit()} aria-label={item.label} />
      <span className={`doc${checked ? " is-done" : ""}`}>{item.label}</span>
      {status}
    </form>
  );
}

function CustomRow({ listingId, item }: { listingId: string; item: CustomItem }) {
  return (
    <form action={toggleListingFileNeedCustom} className="clrow">
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="item_id" value={item.id} />
      <input type="checkbox" className="cbx" defaultChecked={!!item.done} onChange={(e) => e.currentTarget.form?.requestSubmit()} aria-label={item.label} />
      <span className={`doc${item.done ? " is-done" : ""}`}>{item.label}</span>
      {item.done ? <span className="st done">Completed</span> : <span className="st opt">Custom</span>}
    </form>
  );
}

function Field({ k, v, link }: { k: string; v: React.ReactNode | null; link?: boolean }) {
  return (
    <div className="field">
      <div className="k">{k}</div>
      <div className={`v${link && v ? " link" : ""}`}>{v || NS}</div>
    </div>
  );
}

function Party({ c, avatarStyle }: { c: KC; i: number; avatarStyle: string }) {
  return (
    <div className="party">
      <div className="avstack"><span className={`av ${avatarClass(c.personId ?? c.name, avatarStyle)}`}>{initials(c.name)}</span></div>
      <div className="pbody">
        <div className="prole">{prettyRole(c.role)}</div>
        <div className="pname">
          <span className="hc">{c.personId ? <a href={`/dashboard/contacts?id=${c.personId}`} style={{ color: "inherit", textDecoration: "none" }}>{c.name}</a> : c.name}<Copy className="hcbtn" text={c.name} /></span>
        </div>
        {c.company && <div className="pcompany">{c.company}</div>}
        {(c.phone || c.email) && (
          <div className="pline">
            {c.phone && <span className="hc"><a href={`tel:${c.phone}`}>{c.phone}</a><Copy className="hcbtn" text={c.phone} /></span>}
            {c.email && <span className="hc"><a href={`mailto:${c.email}`}>{c.email}</a><Copy className="hcbtn" text={c.email} /></span>}
          </div>
        )}
        {c.address && <div className="paddr"><span className="hc">{c.address}<Copy className="hcbtn" text={c.address} /></span></div>}
      </div>
    </div>
  );
}
