"use client";

import { useEffect, useRef, useState } from "react";
import CopyLink from "@/components/dash/CopyLink";
import DeleteButton from "@/components/dash/DeleteButton";
import EditTransactionButton from "@/components/dash/EditTransactionButton";
import CommissionPanel, { type CommissionInit } from "@/components/dash/CommissionPanel";
import {
  updateMilestones, uploadBuyerDocument, toggleDocumentShare, deleteDocument,
  addBuyerNote, syncTransactionPhoto, deleteTransaction,
} from "@/app/dashboard/actions";

type KC = { role: string; name: string; company: string | null; email: string | null; phone: string | null; address: string | null; personId: string | null };
type Milestone = { id: string; label: string; sort_order: number; status: string; date: string | null };
type Doc = { id: string; name: string; uploaded_by: string | null; client_visible: boolean | null; created_at: string };
type Note = { id: string; body: string; from_client: boolean | null; client_visible: boolean | null; created_at: string };

type Tx = {
  id: string; address: string | null; city: string | null; state: string | null; zip: string | null;
  price: number | string | null; status: string | null; pipeline_stage: string | null;
  target_close_date: string | null; mls_number: string | null; photo_url: string | null; email_token: string | null;
  acceptance_date: string | null; emd_amount: number | string | null; emd_held_by: string | null;
  deal_type: string | null; office: string | null; year_built: number | null; seller_name: string | null;
  waiting_on: string | null; referred_by: string | null; lead_source: string | null; skyslope_email: string | null;
  dpa_program: string | null; dpa_amount: number | string | null;
  county: string | null; occupancy: string | null; emd_received_date: string | null;
  inspection_period_days: number | null; inspection_deadline: string | null;
  appraisal_date: string | null; financing_contingency_date: string | null;
  referral_how: string | null; referral_amount: number | string | null;
};

type Props = {
  tx: Tx;
  buyerName: string | null;
  buyerPersonId: string | null;
  agentName: string | null;
  ownerName: string | null;
  portalUrl: string;
  dealEmail: string | null;
  keyContacts: KC[];
  milestones: Milestone[];
  documents: Doc[];
  notes: Note[];
  docsEnabled: boolean;
  isOwner: boolean;
  commission: CommissionInit;
  fileNeeds: { docs: string[]; actions: string[] };
};

const TABS = ["Overview", "Notes", "Checklist", "Documents", "Tasks", "Email generator", "Contacts", "Client portal", "Commission", "Log"] as const;
type Tab = (typeof TABS)[number];

const usd = (n: number | string | null) => {
  const v = typeof n === "string" ? parseFloat(n) : n;
  return v == null || Number.isNaN(v as number) ? null : "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const dt = (s: string | null) => (s ? new Date(`${s}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null);
const longDate = (s: string) => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
const prettyRole = (r: string) => r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const AV = ["#6c5767", "#5a6170", "#6f5a5f", "#4d6368", "#66605a", "#4a4448"];
const NS = <span style={{ color: "var(--ink3)" }}>Not set</span>;

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

export default function DealWorkspace(p: Props) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const inp = "inp";
  const done = p.milestones.filter((m) => m.status === "done").length;
  const total = p.milestones.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const current = p.milestones.find((m) => m.status === "in_progress") ?? p.milestones.filter((m) => m.status === "done").slice(-1)[0];
  const nextStep = (() => { const i = p.milestones.findIndex((m) => m.id === current?.id); return i >= 0 ? p.milestones[i + 1] : undefined; })();

  const typeLabel = p.tx.deal_type || "Purchase";
  const cityLine = [p.tx.city, [p.tx.state, p.tx.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const sideline = ["Buyer side", typeLabel, cityLine, dt(p.tx.target_close_date) ? `Closes ${dt(p.tx.target_close_date)}` : null].filter(Boolean).join(" · ");
  const emd = usd(p.tx.emd_amount);

  // Shared props for every Edit-transaction pop-out (prefills the people too).
  const buyerC = p.keyContacts.find((c) => /(^|_)buyer$/i.test(c.role) && !/co/i.test(c.role));
  const editExtras = {
    contacts: p.keyContacts,
    buyer: { name: p.buyerName, phone: buyerC?.phone ?? null, email: buyerC?.email ?? null },
    fileNeeds: p.fileNeeds,
  };

  return (
    <div className="dealws">
      {/* breadcrumb */}
      <p className="crumb"><a>Transactions</a> / Buyer / {p.tx.address || "Deal"}</p>

      {/* header */}
      <div className="dhead">
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className="hthumb">
            {p.tx.photo_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.tx.photo_url} alt={p.tx.address ?? "home"} />
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} style={{ width: 30, height: 30 }}><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>}
          </div>
          <div>
            <h1 className="dtitle">
              <span className="hc">{p.tx.address || p.buyerName || "Deal"}
                {p.tx.address && <Copy className="hcbtn" text={[p.tx.address, cityLine].filter(Boolean).join(", ")} />}
              </span>
              <span className={`pill ${p.tx.pipeline_stage === "closed" ? "active" : "under"}`}>{p.tx.status || "Under Contract"}</span>
            </h1>
            <div className="sideline">{sideline}</div>
          </div>
        </div>
        <div className="hbtns">
          <EditTransactionButton tx={p.tx} {...editExtras} triggerClassName="btn mauve" triggerLabel="Edit transaction" />
          <div className="menu" ref={menuRef}>
            <button type="button" className="btn" onClick={() => setMenu((v) => !v)}>Transaction actions
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {menu && (
              <div className="menu-pop">
                {p.tx.mls_number && (
                  <form action={syncTransactionPhoto}><input type="hidden" name="id" value={p.tx.id} />
                    <button type="submit"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg> {p.tx.photo_url ? "Refresh MLS photo" : "Sync MLS photo"}</button>
                  </form>
                )}
                <a href={p.portalUrl} target="_blank" rel="noreferrer"><button type="button"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg> Preview client portal</button></a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* meta strip */}
      <div className="metastrip">
        <span className="ms"><b>Waiting on</b> <span className="wait">{p.tx.waiting_on || "Nothing"}</span></span>
        <span className="ms"><b>Referred by</b> {p.tx.referred_by || NS}</span>
        <span className="ms"><b>Lead source</b> {p.tx.lead_source || NS}</span>
        <span className="ms"><b>Est. closing</b> {dt(p.tx.target_close_date) || NS}</span>
      </div>

      {/* tabs */}
      <div className="tabrow">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t}{t === "Commission" && <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ width: 13, height: 13, marginLeft: 2 }}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>}
          </button>
        ))}
      </div>

      {/* ============ OVERVIEW ============ */}
      {tab === "Overview" && (
        <div className="panel">
          <div className="grid2">
            {/* left */}
            <div>
              <div className="card summary">
                <div className="cardhd" style={{ padding: "0 0 14px" }}><h3>Transaction details</h3>
                  <EditTransactionButton tx={p.tx} {...editExtras} triggerClassName="iconedit" triggerLabel={<PencilIcon />} />
                </div>
                <div className="sgrid">
                  <Field k="Agent on file" link v={p.agentName} />
                  <Field k="MLS #" v={p.tx.mls_number} />
                  <Field k="Purchase price" v={usd(p.tx.price)} />
                  <Field k="Closing date" v={dt(p.tx.target_close_date)} />

                  <Field k="Acceptance date" v={dt(p.tx.acceptance_date)} />
                  <Field k="EMD · held by" v={emd ? `${emd}${p.tx.emd_held_by ? ` · ${p.tx.emd_held_by}` : ""}` : (p.tx.emd_held_by || null)} />
                  <Field k="Status" v={p.tx.status} />
                  <Field k="Type" v={typeLabel} />

                  <Field k="Buyer" link v={p.buyerName} />
                  <Field k="Seller" v={p.tx.seller_name} />
                  <Field k="Office" v={p.tx.office || "Hypes Team"} />
                  <Field k="Year built" v={p.tx.year_built ? String(p.tx.year_built) : null} />
                  <Field k="DPA" v={p.tx.dpa_program} />
                  <Field k="DPA amount" v={usd(p.tx.dpa_amount)} />
                </div>

                <div className="emails">
                  <div className="efield">
                    <div className="k">Deal inbox · email docs here</div>
                    {p.dealEmail
                      ? <div className="eval"><a href={`mailto:${p.dealEmail}`}>{p.dealEmail}</a><Copy text={p.dealEmail} /></div>
                      : <div className="eval muted"><span style={{ color: "var(--ink3)" }}>Generated when the deal is saved</span></div>}
                  </div>
                  <div className="efield">
                    <div className="k">SkySlope · forward to broker</div>
                    {p.tx.skyslope_email
                      ? <div className="eval muted"><a href={`mailto:${p.tx.skyslope_email}`}>{p.tx.skyslope_email}</a><Copy text={p.tx.skyslope_email} /></div>
                      : <div className="eval muted"><span style={{ color: "var(--ink3)" }}>Add in Edit transaction</span></div>}
                  </div>
                </div>
              </div>

              {/* notes */}
              <div className="card" style={{ marginTop: 18 }}>
                <div className="cardhd"><h3>Notes</h3><button type="button" className="addlink" style={{ padding: "4px 8px" }} onClick={() => setTab("Notes")}>View all{p.notes.length ? ` (${p.notes.length})` : ""}</button></div>
                <div className="cardbody">
                  {p.notes.length === 0 && <p className="emptynote">No notes yet.</p>}
                  {p.notes.slice(0, 3).map((n) => (
                    <div key={n.id} className="note">{n.body}<div className="meta">{n.from_client ? "From buyer" : "You"} · {longDate(n.created_at)}</div></div>
                  ))}
                </div>
              </div>
            </div>

            {/* right */}
            <div>
              {p.isOwner && (
                <div className="card">
                  <div className="cardhd"><h3>Assigned to</h3>
                    <span className="ownertag"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 11, height: 11 }}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg> You see commission</span>
                  </div>
                  <div className="cardbody">
                    <div className="person"><span className="av" style={{ background: "#4d6368", color: "#fff" }}>{initials(p.ownerName || "Owner")}</span>
                      <div><div className="role">Owner · {p.tx.office || "Hypes Team"}</div><div className="nm">{p.ownerName || "Owner"} <span style={{ color: "var(--ink3)", fontWeight: 400 }}>· full access</span></div></div>
                    </div>
                    {p.agentName && p.agentName !== p.ownerName && (
                      <div className="person"><span className="av" style={{ background: "#6f5a5f", color: "#fff" }}>{initials(p.agentName)}</span>
                        <div><div className="role">Agent on file · showing agent</div><div className="nm">{p.agentName} <span style={{ color: "var(--ink3)", fontWeight: 400 }}>· no commission access</span></div></div>
                      </div>
                    )}
                    <div className="assign"><button type="button" className="addlink"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg> Assign another agent</button></div>
                  </div>
                </div>
              )}

              <div className="card" style={{ marginTop: p.isOwner ? 18 : 0 }}>
                <div className="cardhd"><h3>Key contacts</h3>
                  <EditTransactionButton tx={p.tx} {...editExtras} triggerClassName="iconedit" triggerLabel={<PencilIcon />} />
                </div>
                <div className="cardbody">
                  {p.keyContacts.length === 0 && <p className="emptynote">No contacts linked yet. Add them in Edit transaction.</p>}
                  {p.keyContacts.map((c, i) => <Party key={i} c={c} i={i} />)}
                </div>
              </div>

              <div className="card" style={{ marginTop: 18 }}>
                <div className="cardhd"><h3>Closing progress</h3><span className="clmeta"><b>{done}</b> of {total}</span></div>
                <div className="cardbody">
                  <div className="prog"><span style={{ width: `${pct}%` }} /></div>
                  {current && <div style={{ marginTop: 8, fontSize: 13, color: "var(--ink3)" }}>Current step: <b style={{ color: "var(--ink2)" }}>{current.label}</b>{nextStep ? ` · next: ${nextStep.label.toLowerCase()}` : ""}</div>}
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
            <div className="cardhd"><h3>Notes</h3><span className="clmeta">{p.notes.length} on this file</span></div>
            <div className="cardbody">
              <form action={addBuyerNote} style={{ marginBottom: 14 }}>
                <input type="hidden" name="transaction_id" value={p.tx.id} />
                <textarea name="body" rows={3} className={inp} placeholder="Share an update your buyer will see on their portal..." />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink3)" }}><input type="checkbox" name="client_visible" defaultChecked /> Visible to buyer</label>
                  <button type="submit" className="btn mauve">Add note</button>
                </div>
              </form>
              {p.notes.map((n) => (
                <div key={n.id} className="note">{n.body}<div className="meta">{n.from_client ? "From buyer" : "You"} · {longDate(n.created_at)}{!n.from_client && !n.client_visible ? " · hidden from buyer" : ""}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ CHECKLIST ============ */}
      {tab === "Checklist" && (
        <div className="panel">
          <form action={updateMilestones} className="card">
            <input type="hidden" name="transaction_id" value={p.tx.id} />
            <div className="cardhd"><h3>Closing checklist</h3><span className="clmeta"><b>{done}</b> of {total} done</span></div>
            <div className="cardbody">
              <p className="emptynote" style={{ marginBottom: 12 }}>Update each step as you go ... your buyer sees it live on their portal.</p>
              {p.milestones.map((m) => (
                <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                  <span style={{ fontSize: 14 }}>{m.sort_order}. {m.label}</span>
                  <select name={`status_${m.id}`} defaultValue={m.status} className={inp} style={{ width: 150 }}>
                    <option value="upcoming">Upcoming</option><option value="in_progress">In progress</option><option value="done">Done</option>
                  </select>
                  <input type="date" name={`date_${m.id}`} defaultValue={m.date ?? ""} className={inp} style={{ width: 170 }} />
                </div>
              ))}
              <button type="submit" className="btn mauve" style={{ marginTop: 14 }}>Save checklist</button>
            </div>
          </form>
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
                <form action={uploadBuyerDocument} style={{ marginBottom: 14 }}>
                  <input type="hidden" name="transaction_id" value={p.tx.id} />
                  <input type="file" name="file" required className="emptynote" />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink3)" }}><input type="checkbox" name="client_visible" /> Share with buyer right away</label>
                    <button type="submit" className="btn mauve">Upload</button>
                  </div>
                </form>
              )}
              {p.documents.length === 0 && <p className="emptynote">No documents yet.</p>}
              {p.documents.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 0", borderTop: "1px solid var(--line)" }}>
                  <div style={{ minWidth: 0 }}>
                    <a href={`/api/dash/documents/${d.id}`} target="_blank" rel="noreferrer" style={{ color: "var(--ink)", fontWeight: 500, fontSize: 14, textDecoration: "none" }}>{d.name}</a>
                    <div className="meta" style={{ fontSize: 11, color: "var(--ink3)", marginTop: 3 }}>{d.uploaded_by === "buyer" ? "From buyer" : "You"} · {longDate(d.created_at)}{d.uploaded_by === "agent" ? (d.client_visible ? " · shared" : " · private") : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                    {d.uploaded_by === "agent" && (
                      <form action={toggleDocumentShare}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="transaction_id" value={p.tx.id} /><input type="hidden" name="share" value={d.client_visible ? "0" : "1"} /><button type="submit" className="addlink" style={{ border: 0, padding: 0 }}>{d.client_visible ? "Unshare" : "Share"}</button></form>
                    )}
                    <form action={deleteDocument}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="transaction_id" value={p.tx.id} /><button type="submit" className="addlink" style={{ border: 0, padding: 0, color: "var(--red)" }}>Delete</button></form>
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
            <div className="cardhd"><h3>People on this deal</h3>
              <EditTransactionButton tx={p.tx} {...editExtras} triggerClassName="iconedit" triggerLabel={<PencilIcon />} />
            </div>
            <div className="cardbody">
              {p.keyContacts.length === 0 && <p className="emptynote">No contacts linked yet.</p>}
              {p.keyContacts.map((c, i) => <Party key={i} c={c} i={i} />)}
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
              <p className="emptynote" style={{ marginBottom: 10 }}>Private link{p.buyerName ? ` for ${p.buyerName}` : ""} ... no login. They watch their closing progress live.</p>
              <CopyLink url={p.portalUrl} />
              <div style={{ marginTop: 10 }}><a href={p.portalUrl} target="_blank" rel="noreferrer" className="addlink" style={{ border: 0, padding: 0 }}>Preview as client →</a></div>
            </div>
          </div>
        </div>
      )}

      {/* ============ LOG ============ */}
      {tab === "Log" && (
        <div className="panel">
          <div className="card">
            <div className="cardhd"><h3>Notes &amp; activity</h3></div>
            <div className="cardbody">
              {p.notes.map((n) => (
                <div key={n.id} className="note">{n.body}<div className="meta">{n.from_client ? "From buyer" : "You"} · {longDate(n.created_at)}</div></div>
              ))}
              {p.notes.length === 0 && <p className="emptynote">No activity yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ============ COMMISSION ============ */}
      {tab === "Commission" && (
        <div className="panel">
          {p.isOwner
            ? <CommissionPanel txId={p.tx.id} address={p.tx.address} init={p.commission} />
            : <div className="card"><div className="cardhd"><h3>Commission · owner only</h3></div><div className="cardbody"><p className="emptynote">Commission figures on this deal are visible to the workspace owner only.</p></div></div>}
        </div>
      )}

      {/* ============ COMING SOON ============ */}
      {(tab === "Tasks" || tab === "Email generator") && (
        <div className="panel">
          <div className="card"><div className="cardhd"><h3>{tab}</h3></div>
            <div className="cardbody"><p className="emptynote">{tab === "Email generator" ? "The per-deal email generator (templates + Resend send + auto-triggers) is the next build here." : "Tasks for this deal are the next build here."}</p></div>
          </div>
        </div>
      )}

      {/* danger */}
      <div className="foot-danger">
        <div><div className="t">Delete this deal</div><div className="s">Removes the transaction and its checklist, notes, and documents. Can&rsquo;t be undone.</div></div>
        <DeleteButton action={deleteTransaction} id={p.tx.id} label="Delete deal" confirmText={`Delete ${p.tx.address ?? "this deal"}? This removes the transaction and its notes and documents, and can't be undone.`} />
      </div>
    </div>
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

function Party({ c, i }: { c: KC; i: number }) {
  return (
    <div className="party">
      <div className="avstack"><span className="av" style={{ background: AV[i % AV.length], color: "#fff" }}>{initials(c.name)}</span></div>
      <div className="pbody">
        <div className="prole">{prettyRole(c.role)}</div>
        <div className="pname">
          <span className="hc">{c.personId ? <a href={`/dashboard/contacts?id=${c.personId}`} style={{ color: "inherit", textDecoration: "none" }}>{c.name}</a> : c.name}</span>
        </div>
        {c.company && <div className="pcompany">{c.company}</div>}
        {(c.phone || c.email) && (
          <div className="pline">
            {c.phone && <a href={`tel:${c.phone}`}>{c.phone}</a>}
            {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
          </div>
        )}
        {c.address && <div className="paddr">{c.address}</div>}
      </div>
    </div>
  );
}
