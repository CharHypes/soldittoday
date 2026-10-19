"use client";

import { useEffect, useRef, useState } from "react";
import CopyLink from "@/components/dash/CopyLink";
import DeleteButton from "@/components/dash/DeleteButton";
import EditTransactionButton from "@/components/dash/EditTransactionButton";
import CommissionPanel, { type CommissionInit } from "@/components/dash/CommissionPanel";
import {
  updateMilestones, uploadBuyerDocument, toggleDocumentShare, deleteDocument,
  addBuyerNote, syncTransactionPhoto, deleteTransaction, toggleFileNeed, toggleFileNeedCustom, updateDealField,
} from "@/app/dashboard/actions";
import { visibleItems, type ChkItem, type ChkGroup, type FileNeeds, type CustomItem } from "@/lib/dealChecklist";
import EmailGenerator from "@/components/dash/EmailGenerator";
import { type EmailTo } from "@/lib/dealEmailTemplates";
import TasksPanel, { type Task } from "@/components/dash/TasksPanel";

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
  created_at: string | null; stage_changed_at: string | null;
  county: string | null; occupancy: string | null; emd_received_date: string | null;
  inspection_period_days: number | null; inspection_deadline: string | null;
  appraisal_date: string | null; financing_contingency_date: string | null;
  insurance_date: string | null; walkthrough_date: string | null;
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
  fileNeeds: FileNeeds;
  tasks: Task[];
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
const prettyStage = (s: string) => ({ lead: "Lead", buyer: "Active Buyer", under_contract: "Under Contract", closed: "Closed", archived: "Archived" }[s] ?? prettyRole(s));
const AV = ["#6c5767", "#5a6170", "#6f5a5f", "#4d6368", "#66605a", "#4a4448"];
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
  const chk = visibleItems("buyer", p.tx.pipeline_stage);
  const customDocs = p.fileNeeds.custom.filter((c) => c.group === "docs");
  const customActs = p.fileNeeds.custom.filter((c) => c.group === "actions");
  const docsDone = chk.docs.filter((d) => p.fileNeeds.docs.includes(d.key)).length + customDocs.filter((c) => c.done).length;
  const actsDone = chk.actions.filter((a) => p.fileNeeds.actions.includes(a.key)).length + customActs.filter((c) => c.done).length;
  const chkTotal = chk.docs.length + chk.actions.length + p.fileNeeds.custom.length;

  // Activity log ... derived from everything that has a timestamp on this file.
  type Act = { when: string; kind: string; text: string; detail?: string; dateOnly?: boolean };
  const activity: Act[] = [];
  if (p.tx.created_at) activity.push({ when: p.tx.created_at, kind: "created", text: "Deal created" });
  if (p.tx.stage_changed_at && p.tx.pipeline_stage) activity.push({ when: p.tx.stage_changed_at, kind: "stage", text: `Moved to ${prettyStage(p.tx.pipeline_stage)}` });
  p.notes.forEach((n) => activity.push({ when: n.created_at, kind: "note", text: n.from_client ? "Buyer added a note" : "You added a note", detail: n.body }));
  p.documents.forEach((d) => activity.push({ when: d.created_at, kind: "doc", text: d.uploaded_by === "buyer" ? "Buyer added a document" : "You added a document", detail: d.name }));
  p.tasks.forEach((t) => {
    activity.push({ when: t.created_at, kind: "task", text: "Task added", detail: t.title });
    if (t.done && t.done_at) activity.push({ when: t.done_at, kind: "done", text: "Task completed", detail: t.title });
  });
  p.milestones.forEach((m) => { if (m.status === "done" && m.date) activity.push({ when: `${m.date}T12:00:00`, kind: "done", text: "Step completed", detail: m.label, dateOnly: true }); });
  activity.sort((a, b) => (a.when < b.when ? 1 : -1));
  const fmtWhen = (it: Act) => {
    const d = new Date(it.when);
    if (Number.isNaN(d.getTime())) return "";
    const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return it.dateOnly ? date : `${date} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  };

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
    stage: p.tx.pipeline_stage,
  };

  // Email generator inputs.
  const findC = (re: RegExp) => p.keyContacts.find((c) => re.test(c.role));
  const emailVars = {
    buyer: p.buyerName || "there",
    first_name: (p.buyerName || "there").split(/[\s&]+/)[0],
    address: p.tx.address || "your home",
    closing_date: dt(p.tx.target_close_date) || "your target date",
    agent: p.agentName || "Your agent",
    office: p.tx.office || "The Sold It Today Team",
  };
  const emailRecipients: Partial<Record<EmailTo, string>> = {
    buyer: buyerC?.email ?? "",
    listing_agent: findC(/listing|^agent$|list.?agent/i)?.email ?? "",
    lender: findC(/lender|loan/i)?.email ?? "",
    buyer_title: findC(/buyer.?title|^title$/i)?.email ?? "",
    insurance: findC(/insur/i)?.email ?? "",
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
                <a href={`/dashboard/buyers/${p.tx.id}/timeline`} target="_blank" rel="noreferrer"><button type="button"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg> Under-contract timeline</button></a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* meta strip ... hover shows a dotted underline, click to edit in place */}
      <div className="metastrip">
        <span className="ms"><b>Waiting on</b> <InlineEdit txId={p.tx.id} field="waiting" value={p.fileNeeds.waiting.join(", ")} display={p.fileNeeds.waiting.length ? p.fileNeeds.waiting.join(", ") : "Nothing"} className="wait" placeholder="Appraisal, insurance binder..." /></span>
        <span className="ms"><b>Referred by</b> <InlineEdit txId={p.tx.id} field="referred_by" value={p.tx.referred_by ?? ""} display={p.tx.referred_by || "Not set"} placeholder="Name · brokerage" /></span>
        <span className="ms"><b>Lead source</b> <InlineEdit txId={p.tx.id} field="lead_source" value={p.tx.lead_source ?? ""} display={p.tx.lead_source || "Not set"} placeholder="Agent referral" /></span>
        <span className="ms"><b>Est. closing</b> <InlineEdit txId={p.tx.id} field="target_close_date" type="date" value={p.tx.target_close_date ?? ""} display={dt(p.tx.target_close_date) || "Not set"} /></span>
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
                      : <div className="eval muted"><span style={{ color: "var(--d-ink3)" }}>Generated when the deal is saved</span></div>}
                  </div>
                  <div className="efield">
                    <div className="k">SkySlope · forward to broker</div>
                    {p.tx.skyslope_email
                      ? <div className="eval muted"><a href={`mailto:${p.tx.skyslope_email}`}>{p.tx.skyslope_email}</a><Copy text={p.tx.skyslope_email} /></div>
                      : <div className="eval muted"><span style={{ color: "var(--d-ink3)" }}>Add in Edit transaction</span></div>}
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
                      <div><div className="role">Owner · {p.tx.office || "Hypes Team"}</div><div className="nm">{p.ownerName || "Owner"} <span style={{ color: "var(--d-ink3)", fontWeight: 400 }}>· full access</span></div></div>
                    </div>
                    {p.agentName && p.agentName !== p.ownerName && (
                      <div className="person"><span className="av" style={{ background: "#6f5a5f", color: "#fff" }}>{initials(p.agentName)}</span>
                        <div><div className="role">Agent on file · showing agent</div><div className="nm">{p.agentName} <span style={{ color: "var(--d-ink3)", fontWeight: 400 }}>· no commission access</span></div></div>
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
                  {current && <div style={{ marginTop: 8, fontSize: 13, color: "var(--d-ink3)" }}>Current step: <b style={{ color: "var(--d-ink2)" }}>{current.label}</b>{nextStep ? ` · next: ${nextStep.label.toLowerCase()}` : ""}</div>}
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
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--d-ink3)" }}><input type="checkbox" name="client_visible" defaultChecked /> Visible to buyer</label>
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

      {/* ============ CHECKLIST (file needs ... in sync with Edit) ============ */}
      {tab === "Checklist" && (
        <div className="panel">
          <div className="clhead">
            <div className="clmeta">Checklist · <b>{docsDone + actsDone} of {chkTotal} complete</b></div>
          </div>

          <div className="group">
            <h2>Documents needed / received</h2>
            <div className="cl">
              {chk.docs.map((it) => <ChkRow key={it.key} txId={p.tx.id} group="docs" item={it} checked={p.fileNeeds.docs.includes(it.key)} />)}
              {customDocs.map((c) => <CustomRow key={c.id} txId={p.tx.id} item={c} />)}
              {chk.docs.length === 0 && customDocs.length === 0 && <div style={{ padding: "12px 16px" }} className="emptynote">No documents yet ... add them in Edit transaction.</div>}
            </div>
          </div>

          <div className="group">
            <h2>Follow-up / action items</h2>
            <div className="cl">
              {chk.actions.map((it) => <ChkRow key={it.key} txId={p.tx.id} group="actions" item={it} checked={p.fileNeeds.actions.includes(it.key)} />)}
              {customActs.map((c) => <CustomRow key={c.id} txId={p.tx.id} item={c} />)}
            </div>
          </div>

          <div className="group">
            <h2>Closing steps · shown on the buyer portal</h2>
            <form action={updateMilestones} className="cl">
              <input type="hidden" name="transaction_id" value={p.tx.id} />
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
          </div>
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
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--d-ink3)" }}><input type="checkbox" name="client_visible" /> Share with buyer right away</label>
                    <button type="submit" className="btn mauve">Upload</button>
                  </div>
                </form>
              )}
              {p.documents.length === 0 && <p className="emptynote">No documents yet.</p>}
              {p.documents.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 0", borderTop: "1px solid var(--d-line)" }}>
                  <div style={{ minWidth: 0 }}>
                    <a href={`/api/dash/documents/${d.id}`} target="_blank" rel="noreferrer" style={{ color: "var(--d-ink)", fontWeight: 500, fontSize: 14, textDecoration: "none" }}>{d.name}</a>
                    <div className="meta" style={{ fontSize: 11, color: "var(--d-ink3)", marginTop: 3 }}>{d.uploaded_by === "buyer" ? "From buyer" : "You"} · {longDate(d.created_at)}{d.uploaded_by === "agent" ? (d.client_visible ? " · shared" : " · private") : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                    {d.uploaded_by === "agent" && (
                      <form action={toggleDocumentShare}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="transaction_id" value={p.tx.id} /><input type="hidden" name="share" value={d.client_visible ? "0" : "1"} /><button type="submit" className="addlink" style={{ border: 0, padding: 0 }}>{d.client_visible ? "Unshare" : "Share"}</button></form>
                    )}
                    <form action={deleteDocument}><input type="hidden" name="id" value={d.id} /><input type="hidden" name="transaction_id" value={p.tx.id} /><button type="submit" className="addlink" style={{ border: 0, padding: 0, color: "var(--d-red)" }}>Delete</button></form>
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

      {/* ============ LOG (activity timeline) ============ */}
      {tab === "Log" && (
        <div className="panel">
          <div className="card">
            <div className="cardhd"><h3>Activity</h3><span className="clmeta">everything on this file</span></div>
            <div className="cardbody">
              <form action={addBuyerNote} style={{ marginBottom: 16 }}>
                <input type="hidden" name="transaction_id" value={p.tx.id} />
                <textarea name="body" rows={2} className={inp} placeholder="Log a note..." />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--d-ink3)" }}><input type="checkbox" name="client_visible" /> Share with buyer</label>
                  <button type="submit" className="btn mauve">Add note</button>
                </div>
              </form>
              <div className="logfeed">
                {activity.length === 0 && <p className="emptynote">Nothing logged yet.</p>}
                {activity.map((it, i) => (
                  <div className="logitem" key={i}>
                    <span className={`logdot ${it.kind}`} />
                    <div>
                      <div className="logtext">{it.text}</div>
                      {it.detail && <div className="logdetail">{it.detail}</div>}
                      <div className="logtime">{fmtWhen(it)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="foot-danger">
            <div><div className="t">Delete this deal</div><div className="s">Removes the transaction and its checklist, notes, and documents. Can&rsquo;t be undone.</div></div>
            <DeleteButton action={deleteTransaction} id={p.tx.id} label="Delete deal" confirmText={`Delete ${p.tx.address ?? "this deal"}? This removes the transaction and its notes and documents, and can't be undone.`} />
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

      {/* ============ EMAIL GENERATOR ============ */}
      {tab === "Email generator" && (
        <div className="panel">
          <EmailGenerator vars={emailVars} recipients={emailRecipients} stage={p.tx.pipeline_stage} />
        </div>
      )}

      {/* ============ TASKS ============ */}
      {tab === "Tasks" && <TasksPanel txId={p.tx.id} tasks={p.tasks} />}
    </div>
  );
}

function ChkRow({ txId, group, item, checked }: { txId: string; group: "docs" | "actions"; item: ChkItem; checked: boolean }) {
  const status = checked
    ? <span className="st done">Completed</span>
    : item.optional ? <span className="st opt">If applicable</span> : <span className="st req">Required</span>;
  return (
    <form action={toggleFileNeed} className="clrow">
      <input type="hidden" name="transaction_id" value={txId} />
      <input type="hidden" name="group" value={group} />
      <input type="hidden" name="key" value={item.key} />
      <input type="checkbox" className="cbx" defaultChecked={checked} onChange={(e) => e.currentTarget.form?.requestSubmit()} aria-label={item.label} />
      <span className={`doc${checked ? " is-done" : ""}`}>{item.label}</span>
      {status}
    </form>
  );
}

function InlineEdit({ txId, field, value, display, type = "text", className = "", placeholder }: {
  txId: string; field: string; value: string; display: string; type?: string; className?: string; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const empty = !value;
  if (!editing) {
    return (
      <span className={`ival ${className}`} style={empty ? { color: "var(--d-ink3)" } : undefined} onClick={() => setEditing(true)} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") setEditing(true); }}>{display}</span>
    );
  }
  return (
    <form action={updateDealField} style={{ display: "inline" }} onSubmit={() => setEditing(false)}>
      <input type="hidden" name="transaction_id" value={txId} />
      <input type="hidden" name="field" value={field} />
      <input
        name="value" type={type} defaultValue={value} placeholder={placeholder} className="iefinput" autoFocus
        onBlur={(e) => e.currentTarget.form?.requestSubmit()}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } if (e.key === "Escape") setEditing(false); }}
      />
    </form>
  );
}

function CustomRow({ txId, item }: { txId: string; item: CustomItem }) {
  return (
    <form action={toggleFileNeedCustom} className="clrow">
      <input type="hidden" name="transaction_id" value={txId} />
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

function Party({ c, i }: { c: KC; i: number }) {
  return (
    <div className="party">
      <div className="avstack"><span className="av" style={{ background: AV[i % AV.length], color: "#fff" }}>{initials(c.name)}</span></div>
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
