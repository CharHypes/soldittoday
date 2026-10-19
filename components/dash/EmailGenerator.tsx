"use client";

import { useMemo, useState } from "react";
import { EMAIL_TEMPLATES, EMAIL_GROUPS, type EmailTemplate, type EmailTo } from "@/lib/dealEmailTemplates";

type Vars = { buyer: string; first_name: string; address: string; closing_date: string; agent: string; office: string };

export default function EmailGenerator({
  vars, recipients, stage,
}: {
  vars: Vars;
  recipients: Partial<Record<EmailTo, string>>;
  stage: string | null;
}) {
  const [fitOnly, setFitOnly] = useState(true);
  const [sel, setSel] = useState<string>(() => {
    const fit = EMAIL_TEMPLATES.find((t) => t.stages?.includes(stage ?? ""));
    return (fit ?? EMAIL_TEMPLATES[0]).id;
  });
  const [copied, setCopied] = useState<string>("");

  const fill = (s: string) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, k: string) => (vars as Record<string, string>)[k] ?? `{{${k}}}`);

  const fits = (t: EmailTemplate) => !t.stages || t.stages.includes(stage ?? "");
  const visible = (t: EmailTemplate) => !fitOnly || fits(t);
  const tmpl = EMAIL_TEMPLATES.find((t) => t.id === sel) ?? EMAIL_TEMPLATES[0];

  const subject = fill(tmpl.subject);
  const body = fill(tmpl.body);
  const to = recipients[tmpl.to] ?? "";

  const copy = async (key: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(""), 1500); } catch {}
  };
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const groups = useMemo(
    () => EMAIL_GROUPS.map((g) => ({ title: g, items: EMAIL_TEMPLATES.filter((t) => t.group === g && visible(t)) })).filter((g) => g.items.length),
    [fitOnly, stage]
  );

  const toLabel: Record<EmailTo, string> = {
    buyer: "Buyer", listing_agent: "Listing agent", lender: "Lender", buyer_title: "Buyer's title", insurance: "Insurance",
  };

  return (
    <>
      <div className="emailgen">
        {/* template list */}
        <div>
          {groups.map((g) => (
            <div className="tmplgroup" key={g.title}>
              <h5>{g.title}</h5>
              {g.items.map((t) => (
                <button key={t.id} type="button" className={`tmplitem${t.id === sel ? " on" : ""}`} onClick={() => setSel(t.id)}>
                  {fits(t) && t.stages && <span className="dot" />}{t.name}
                </button>
              ))}
            </div>
          ))}
          <label className="chk" style={{ marginTop: 2 }}>
            <input type="checkbox" checked={fitOnly} onChange={(e) => setFitOnly(e.target.checked)} /> Only show emails that fit this deal
          </label>
        </div>

        {/* preview */}
        <div>
          <div className="previewline">
            <div><div className="pk">Subject</div><div className="pv">{subject}</div></div>
            <button type="button" className="btn gold" onClick={() => copy("subj", subject)}>{copied === "subj" ? "Copied ✓" : "Copy subject"}</button>
          </div>
          <div className="previewline">
            <div><div className="pk">To · {toLabel[tmpl.to]}</div><div className="pv">{to || <span style={{ color: "var(--d-ink3)" }}>Add this contact in Edit transaction</span>}</div></div>
            <button type="button" className="btn gold" onClick={() => copy("to", to)} disabled={!to}>{copied === "to" ? "Copied ✓" : "Copy to"}</button>
          </div>
          <div className="ebodywrap"><div className="ebody">{body}</div></div>
          <div className="hbtns" style={{ marginTop: 16 }}>
            <a className="btn mauve" href={mailto}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" strokeLinecap="round" /></svg> Open in email
            </a>
            <button type="button" className="btn" onClick={() => copy("body", body)}>{copied === "body" ? "Copied ✓" : "Copy body"}</button>
          </div>
          <div style={{ fontSize: 12, color: "var(--d-ink3)", marginTop: 10 }}>
            Merge fields fill from the deal: <b>{"{{buyer}}"}</b> · <b>{"{{address}}"}</b> · <b>{"{{closing_date}}"}</b> · <b>{"{{agent}}"}</b>
          </div>
        </div>
      </div>

      {/* triggers (roadmap) */}
      <div className="card summary" style={{ marginTop: 22 }}>
        <div className="cardhd" style={{ padding: "0 0 12px" }}><h3>Auto-send triggers</h3><span className="sitchip" style={{ color: "var(--d-ink3)", background: "var(--d-bg2)" }}>Coming soon</span></div>
        <p style={{ fontSize: 13, color: "var(--d-ink2)", margin: "0 0 12px", lineHeight: 1.5 }}>
          Next step: hit a trigger and the matching email fires automatically through Resend, so nobody has to remember to send it. Shown here as the plan.
        </p>
        {[
          ["Under contract", "→ Under Contract Intro to buyer", "on"],
          ["Appraisal ordered", "→ Appraisal update to buyer", "on"],
          ["Clear to close", "→ Clear to Close to buyer", "on"],
          ["7 days to closing", "→ Reminder to lender + title", "off"],
          ["Closed", "→ Congrats + review request", "off"],
        ].map(([t, s, on]) => (
          <div className="trow" key={t}><div><div className="tt">{t}</div><div className="ts">{s}</div></div><span className={`tog ${on}`}>{on === "on" ? "On" : "Off"}</span></div>
        ))}
      </div>
    </>
  );
}
