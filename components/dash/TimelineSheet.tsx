"use client";

export type TimelineRow = { label: string; date: string };
export type TimelineValues = {
  congrats: string;
  intro: string;
  purchasePrice: string;
  escrow: string;
  addressHtml: string; // may contain <br>
  titleCompany: string;
  rows: TimelineRow[];
};

const CSS = `
.ucts-page{--cream:#f2ebdf;--paper:#fff;--band:#e7ddcc;--band2:#efe7d9;--ink:#2c2430;--plum:#5e2846;--plum2:#7c3d60;--gold:#b48a4e;
  --sans:"Manrope",system-ui,-apple-system,sans-serif;--serif:"Fraunces",Georgia,serif;
  min-height:100vh;background:radial-gradient(60% 50% at 50% 0%,#e8e1f0,#d4ccdf);padding:26px 16px;font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased}
.ucts-bar{max-width:860px;margin:0 auto 16px;display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.ucts-hint{font-size:13px;color:#5b5368}
.ucts-btn{font-family:var(--sans);font-weight:700;font-size:13px;border:0;border-radius:999px;padding:10px 18px;cursor:pointer;background:var(--plum);color:#fff}
.ucts-btn:hover{background:var(--plum2)}
.ucts-back{font-size:13px;color:#5b5368;text-decoration:none}
.ucts-sheet{max-width:860px;margin:0 auto;background:var(--paper);border-radius:6px;overflow:hidden;box-shadow:0 30px 70px rgba(50,25,60,.22);border:1px solid #e7dfd2}
.ucts-head{background:var(--band);padding:30px 40px;text-align:center}
.ucts-head h1{font-family:var(--sans);font-weight:800;letter-spacing:.3em;font-size:30px;margin:0;color:#1d1720;text-indent:.3em}
.ucts-body{display:grid;grid-template-columns:300px 1fr}
@media(max-width:680px){.ucts-body{grid-template-columns:1fr}}
.ucts-left{background:var(--band2);padding:34px 30px;text-align:center}
.ucts-script{font-family:var(--serif);font-style:italic;font-weight:500;font-size:25px;color:var(--plum);margin:0 0 10px;line-height:1.05;white-space:nowrap}
.ucts-intro{font-size:12.5px;line-height:1.6;color:#4f4650;margin:0 auto 18px;max-width:230px}
.ucts-div{height:3px;width:150px;background:#fff;margin:18px auto;border-radius:2px}
.ucts-lbl{font-family:var(--sans);font-weight:800;letter-spacing:.12em;font-size:14px;color:#1d1720;margin:0 0 8px}
.ucts-lbl.accent{color:var(--plum)}
.ucts-val{background:#fff;border-radius:4px;padding:9px 12px;font-weight:700;font-size:16px;color:#2a2230;max-width:210px;margin:0 auto 18px;box-shadow:inset 0 0 0 1px #ece3d4}
.ucts-addr{font-weight:700;font-size:15px;line-height:1.45;color:#2a2230;margin:0 auto 18px;max-width:230px;letter-spacing:.02em}
.ucts-titleco{font-weight:700;font-size:15px;color:#2a2230;margin:0 auto 20px;letter-spacing:.02em}
.ucts-photo{width:176px;height:176px;border-radius:50%;object-fit:cover;object-position:50% 18%;margin:6px auto 12px;display:block;border:5px solid #fff;outline:1px solid #e3d8c6;box-shadow:0 12px 28px rgba(50,25,60,.22)}
.ucts-agent{font-family:var(--sans);font-weight:700;letter-spacing:.12em;font-size:20px;color:#1d1720;margin:4px 0 2px}
.ucts-role{font-family:var(--sans);font-weight:600;letter-spacing:.22em;font-size:11px;color:#6a5f66;margin:0 0 4px}
.ucts-phone{font-family:var(--sans);font-weight:600;letter-spacing:.14em;font-size:15px;color:#2a2230}
.ucts-right{padding:30px 40px 36px}
.ucts-datesband{background:var(--band);border-radius:4px;text-align:center;padding:12px;margin-bottom:18px}
.ucts-datesband span{font-family:var(--sans);font-weight:800;letter-spacing:.2em;font-size:15px;color:var(--plum)}
.ucts-row{display:grid;grid-template-columns:120px 1fr;align-items:center;gap:16px;padding:9px 0}
.ucts-date{background:var(--band2);border-radius:4px;padding:10px 6px;text-align:center;font-weight:800;font-size:15px;color:#1d1720}
.ucts-task{font-family:var(--serif);font-weight:400;font-size:18.5px;color:#2a2230;line-height:1.25}
.ucts-logo{display:block;margin:22px auto 2px;max-width:280px;width:78%}
.ucts-page [contenteditable]{outline:none;border-radius:3px;transition:background .15s}
.ucts-page [contenteditable]:hover{background:rgba(124,61,96,.07)}
.ucts-page [contenteditable]:focus{background:rgba(124,61,96,.1);box-shadow:0 0 0 2px rgba(124,61,96,.35)}
.ucts-page [contenteditable]:empty:before{content:attr(data-ph);color:#b3a7b0;font-weight:500}
@media print{@page{size:letter;margin:0}.ucts-page{background:#fff;padding:0}.ucts-bar{display:none}.ucts-sheet{box-shadow:none;border:0;max-width:none;border-radius:0}.ucts-page [contenteditable]:hover,.ucts-page [contenteditable]:focus{background:none;box-shadow:none}}
`;

const E = (props: { className: string; ph?: string; html?: string; text?: string }) => (
  <div
    className={props.className}
    contentEditable
    suppressContentEditableWarning
    data-ph={props.ph}
    {...(props.html ? { dangerouslySetInnerHTML: { __html: props.html } } : {})}
  >
    {props.html ? undefined : props.text}
  </div>
);

export default function TimelineSheet({ v, backHref }: { v: TimelineValues; backHref: string }) {
  return (
    <div className="ucts-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ucts-bar">
        <a className="ucts-back" href={backHref}>&larr; Back to deal</a>
        <span className="ucts-hint">Tap any field to adjust it, then print or save as PDF.</span>
        <button className="ucts-btn" onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      <div className="ucts-sheet">
        <div className="ucts-head"><h1>UNDER CONTRACT TIMELINE</h1></div>
        <div className="ucts-body">
          <div className="ucts-left">
            <p className="ucts-script" contentEditable suppressContentEditableWarning>{v.congrats}</p>
            <p className="ucts-intro" contentEditable suppressContentEditableWarning>{v.intro}</p>

            <div className="ucts-div" />
            <p className="ucts-lbl">PURCHASE PRICE:</p>
            <E className="ucts-val" ph="$000,000" text={v.purchasePrice} />
            <p className="ucts-lbl">EMD DEPOSIT:</p>
            <E className="ucts-val" ph="$0,000" text={v.escrow} />
            <div className="ucts-div" />

            <p className="ucts-lbl accent">ADDRESS:</p>
            <p className="ucts-addr" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: v.addressHtml }} />
            <p className="ucts-lbl accent">TITLE COMPANY:</p>
            <E className="ucts-titleco" ph="Title company" text={v.titleCompany} />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ucts-photo" src="/assets/team/charlotte-hypes-2026.jpg" alt="Charlotte Hypes" />
            <p className="ucts-agent">CHARLOTTE HYPES</p>
            <p className="ucts-role">REAL ESTATE AGENT</p>
            <p className="ucts-phone">(313) 529-5750</p>
          </div>

          <div className="ucts-right">
            <div className="ucts-datesband"><span>IMPORTANT DATES</span></div>
            {v.rows.map((r, i) => (
              <div className="ucts-row" key={i}>
                <E className="ucts-date" ph="00/00/0000" text={r.date} />
                <div className="ucts-task">{r.label}</div>
              </div>
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ucts-logo" src="/assets/logos/optimized/sold-it-today-600w.png" alt="Sold It Today" />
          </div>
        </div>
      </div>
    </div>
  );
}
