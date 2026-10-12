"use client";

import { useState } from "react";

export type TimelineRow = { label: string; date: string };
export type TimelineValues = {
  congrats: string;
  intro: string;
  purchasePrice: string;
  escrow: string;
  addressHtml: string; // may contain <br>
  titleCompany: string;
  rows: TimelineRow[];
  photoUrl?: string | null; // home photo for the hero
};

const CSS = `
.ucts{--cream:#f7f0e5;--paper:#fffaf3;--plum:#5e2846;--plum2:#7c3d60;--wine:#8a4a68;
  --rose:#b76e79;--rosegold1:#f0d6bd;--rosegold2:#dba98a;--rosegold3:#c98a9a;--gold:#b48a4e;
  --ink:#2f2630;--ink2:#6a5f66;--line:#ead9c4;
  --sans:"Manrope",system-ui,-apple-system,sans-serif;--serif:"Fraunces",Georgia,serif;
  min-height:100vh;font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased;
  background:
    radial-gradient(70% 45% at 50% 0%, #efe6f1, transparent 70%),
    linear-gradient(160deg,#e9e0ee,#ded3e1 60%,#e6d9d6);
  padding:24px 14px 40px}
.ucts-bar{max-width:620px;margin:0 auto 14px;display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap}
.ucts-bar .sp{flex:1}
.ucts-back{font-size:13px;color:#5b5368;text-decoration:none;margin-right:auto}
.ucts-btn{font-family:var(--sans);font-weight:700;font-size:13px;border:0;border-radius:999px;padding:10px 18px;cursor:pointer;background:var(--plum);color:#fff;display:inline-flex;align-items:center;gap:7px}
.ucts-btn:hover{background:var(--plum2)}
.ucts-btn.ghost{background:#fff;color:var(--plum);border:1px solid #d8c4d0}
.ucts-btn.ok{background:#2f7f61}

/* the card */
.ucts-card{max-width:620px;margin:0 auto;background:var(--paper);border-radius:24px;overflow:hidden;
  box-shadow:0 2px 0 rgba(255,255,255,.6) inset, 0 30px 70px rgba(60,30,60,.26);
  border:1px solid #efe2d2}
/* plum header ... key + title, sized to its content (no empty band) */
.ucts-hero{position:relative;background:linear-gradient(135deg,#6a2d4f,#4e2340);padding:26px 28px 24px;text-align:center}
.ucts-hero-key{height:82px;width:auto;display:block;margin:0 auto 12px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.42))}
.ucts-hero-ey{font-family:var(--sans);font-weight:800;letter-spacing:.3em;font-size:15.5px;text-indent:.3em;color:#f3dfce;display:inline-block}
.ucts-hero:after{content:"";position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:90px;height:3px;border-radius:2px;background:linear-gradient(90deg,var(--rosegold2),var(--gold))}
/* home photo band ... below the banner, above everything else */
.ucts-photo{position:relative;height:190px;background:#2a1f28;overflow:hidden}
.ucts-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 45%;display:block}
.ucts-ey{font-family:var(--sans);font-weight:800;letter-spacing:.34em;font-size:12px;text-indent:.34em;color:#f0dcc9;margin:0}
.ucts-top h1{font-family:var(--serif);font-weight:500;font-size:30px;letter-spacing:.01em;margin:4px 0 0;color:#fff}

.ucts-mid{padding:28px 28px 4px;text-align:center}
.ucts-congrats{font-family:var(--serif);font-style:italic;font-weight:500;font-size:27px;color:var(--plum);margin:0 0 4px;line-height:1.05}
.ucts-addr-h{font-family:var(--serif);font-weight:600;font-size:20px;color:#2a2230;margin:2px 0 0;line-height:1.15}
.ucts-intro{font-size:12.5px;line-height:1.55;color:#5a505a;margin:10px auto 0;max-width:430px}

/* divider with diamond */
.ucts-div{display:flex;align-items:center;gap:12px;max-width:380px;margin:16px auto 16px;color:var(--rosegold3)}
.ucts-div:before,.ucts-div:after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--line),transparent)}
.ucts-div span{width:7px;height:7px;background:linear-gradient(135deg,var(--rosegold2),var(--rose));transform:rotate(45deg);border-radius:1px}

/* facts */
.ucts-facts{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 28px}
.fact{position:relative;background:#fff;border:1px solid #efe3d4;border-radius:14px;padding:12px 14px 12px 18px;overflow:hidden;text-align:left;
  box-shadow:0 6px 16px rgba(90,40,70,.05)}
.fact:before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(var(--rosegold2),var(--rose))}
.fact.span2{grid-column:1 / -1}
.fact .k{font-size:9.5px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:var(--wine);margin-bottom:3px}
.fact .val{font-weight:700;font-size:16px;color:#2e2230;line-height:1.3;word-break:break-word}
.fact.price .val{font-family:var(--serif);font-weight:600;font-size:20px;color:var(--plum)}

/* timeline */
.ucts-dates{padding:22px 28px 6px}
.ucts-dates-h{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px}
.ucts-dates-h span{font-family:var(--sans);font-weight:800;letter-spacing:.22em;font-size:13px;color:var(--plum)}
.ucts-dates-h:before,.ucts-dates-h:after{content:"";height:1px;width:42px;background:linear-gradient(90deg,transparent,var(--gold))}
.ucts-dates-h:after{background:linear-gradient(90deg,var(--gold),transparent)}
.tl-row{display:grid;grid-template-columns:92px 24px 1fr;gap:12px;align-items:stretch}
.date-pill{align-self:center;background:linear-gradient(135deg,#f5ead9,#efe0cd);border:1px solid #e7d6bf;border-radius:11px;text-align:center;padding:9px 6px;font-weight:800;font-size:13px;color:var(--plum);white-space:nowrap;font-variant-numeric:tabular-nums;letter-spacing:0}
.rail{position:relative;display:flex;justify-content:center}
.rail:before{content:"";position:absolute;top:0;bottom:0;width:2px;background:var(--line)}
.tl-row:first-child .rail:before{top:50%}
.tl-row:last-child .rail:before{bottom:50%}
.dot{position:relative;align-self:center;width:13px;height:13px;border-radius:50%;background:linear-gradient(135deg,var(--rosegold2),var(--rose));box-shadow:0 0 0 4px rgba(183,110,121,.16)}
.tl-task{align-self:center;font-family:var(--serif);font-weight:400;font-size:17.5px;color:#2e2230;line-height:1.2;padding:8px 0}

/* agent + footer */
.ucts-foot{margin-top:18px;padding:24px 28px 30px;text-align:center;background:linear-gradient(#fbf5ec,#f3e9db);border-top:1px solid var(--line)}
.ring{width:130px;height:130px;margin:0 auto;border-radius:50%;padding:5px;background:linear-gradient(135deg,var(--rosegold1),var(--rosegold2) 45%,var(--rose));box-shadow:0 12px 28px rgba(90,40,70,.22)}
.ring img{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 18%;border:3px solid #fffaf3;display:block}
.agent-n{font-family:var(--sans);font-weight:800;letter-spacing:.1em;font-size:19px;color:#1f1724;margin:12px 0 2px}
.agent-r{font-family:var(--sans);font-weight:600;letter-spacing:.2em;font-size:10.5px;color:var(--wine);margin:0 0 4px}
.agent-p{font-weight:600;letter-spacing:.1em;font-size:15px;color:#2a2230;text-decoration:none}
.brokerbar{display:flex;align-items:center;gap:12px;max-width:260px;margin:18px auto 12px;color:var(--rosegold3)}
.brokerbar:before,.brokerbar:after{content:"";height:1px;flex:1;background:linear-gradient(90deg,transparent,var(--line),transparent)}
.brokerbar span{width:6px;height:6px;background:var(--rosegold2);transform:rotate(45deg)}
.logo{display:block;margin:0 auto 8px;width:188px;max-width:70%}
.broker{font-family:var(--sans);font-weight:700;letter-spacing:.16em;font-size:11px;color:#5a4f58;margin:0 0 2px}
.broker-addr{font-size:10.5px;letter-spacing:.03em;color:#8a7f88;margin:0}

.ucts [contenteditable]{outline:none;border-radius:4px;transition:background .15s}
.ucts [contenteditable]:hover{background:rgba(124,61,96,.07)}
.ucts [contenteditable]:focus{background:rgba(124,61,96,.1);box-shadow:0 0 0 2px rgba(124,61,96,.3)}
.ucts [contenteditable]:empty:before{content:attr(data-ph);color:#c3b4bd;font-weight:500}

@media(max-width:430px){
  .ucts-facts{grid-template-columns:1fr}
  .ucts-hero{padding:22px 20px 20px}.ucts-hero-key{height:70px}.ucts-hero-ey{font-size:14px}.ucts-photo{height:160px}.ucts-congrats{font-size:23px}.ucts-addr-h{font-size:19px}
  .tl-row{grid-template-columns:84px 20px 1fr;gap:9px}.tl-task{font-size:16px}.date-pill{font-size:12px;padding:8px 5px}
}
@media print{
  @page{size:letter;margin:14mm}
  .ucts{background:#fff;padding:0}
  .ucts-bar{display:none}
  .ucts-card{box-shadow:none;border:1px solid #e7dccb;max-width:none}
  .ucts [contenteditable]:hover,.ucts [contenteditable]:focus{background:none;box-shadow:none}
}
`;

function Val({ cls, text, html, ph, editable }: { cls: string; text?: string; html?: string; ph?: string; editable: boolean }) {
  if (editable) {
    return (
      <div className={cls} contentEditable suppressContentEditableWarning data-ph={ph}
        {...(html ? { dangerouslySetInnerHTML: { __html: html } } : {})}>
        {html ? undefined : text}
      </div>
    );
  }
  return html
    ? <div className={cls} dangerouslySetInnerHTML={{ __html: html }} />
    : <div className={cls}>{text || ph}</div>;
}

export default function TimelineSheet({
  v, backHref, editable = true, shareUrl,
}: {
  v: TimelineValues; backHref?: string; editable?: boolean; shareUrl?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <div className="ucts">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ucts-bar">
        {editable && backHref && <a className="ucts-back" href={backHref}>&larr; Back to deal</a>}
        {editable && shareUrl && (
          <button className={`ucts-btn ghost${copied ? " ok" : ""}`} onClick={copy} type="button">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {copied ? "Link copied" : "Copy shareable link"}
          </button>
        )}
        <button className="ucts-btn" onClick={() => window.print()} type="button">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Save as PDF
        </button>
      </div>

      <div className="ucts-card">
        <div className="ucts-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ucts-hero-key" src="/assets/logos/sold-it-today/Sold-It-Today-key-only-crisp-transparent.png" alt="" />
          <span className="ucts-hero-ey">UNDER CONTRACT TIMELINE</span>
        </div>

        {v.photoUrl && (
          <div className="ucts-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.photoUrl} alt="" />
          </div>
        )}

        <div className="ucts-mid">
          {editable
            ? <p className="ucts-congrats" contentEditable suppressContentEditableWarning>{v.congrats}</p>
            : <p className="ucts-congrats">{v.congrats}</p>}
          <Val cls="ucts-addr-h" html={v.addressHtml} ph="Your new home" editable={editable} />
          {editable
            ? <p className="ucts-intro" contentEditable suppressContentEditableWarning>{v.intro}</p>
            : <p className="ucts-intro">{v.intro}</p>}
        </div>

        <div className="ucts-div"><span /></div>

        <div className="ucts-facts">
          <div className="fact price"><div className="k">Purchase Price</div><Val cls="val" text={v.purchasePrice} ph="$000,000" editable={editable} /></div>
          <div className="fact price"><div className="k">EMD Deposit</div><Val cls="val" text={v.escrow} ph="$0,000" editable={editable} /></div>
          <div className="fact span2"><div className="k">Title Company</div><Val cls="val" text={v.titleCompany} ph="Title company" editable={editable} /></div>
        </div>

        <div className="ucts-dates">
          <div className="ucts-dates-h"><span>IMPORTANT DATES</span></div>
          {v.rows.map((r, i) => (
            <div className="tl-row" key={i}>
              <Val cls="date-pill" text={r.date} ph="00/00/0000" editable={editable} />
              <div className="rail"><span className="dot" /></div>
              <div className="tl-task">{r.label}</div>
            </div>
          ))}
        </div>

        <div className="ucts-foot">
          <div className="ring">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/team/charlotte-hypes-2026.jpg" alt="Charlotte Hypes" />
          </div>
          <p className="agent-n">CHARLOTTE HYPES</p>
          <p className="agent-r">REAL ESTATE AGENT</p>
          <a className="agent-p" href="tel:3135295750">(313) 529-5750</a>

          <div className="brokerbar"><span /></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo" src="/assets/logos/optimized/sold-it-today-600w.png" alt="Sold It Today" />
          <p className="broker">REMERICA UNITED REALTY</p>
          <p className="broker-addr">47720 Grand River Rd, Novi, MI 48374</p>
        </div>
      </div>
    </div>
  );
}
