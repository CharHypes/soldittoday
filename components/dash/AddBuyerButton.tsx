"use client";

import { useState } from "react";
import { createBuyer } from "@/app/dashboard/actions";

/**
 * Add buyer as a POP-OUT over the current screen (never its own page), per the
 * back-office design system. The list stays visible, dimmed, behind it. Captures
 * the lead: buyer(s), source, pre-approval + lender, and an optional home. Posts
 * to createBuyer, which starts the record as a Lead and files everyone into Contacts.
 */
const PERSON_SOURCES = ["Past client", "Sphere / personal", "Agent referral", "Repeat client"];

export default function AddBuyerButton({
  label = "+ Add buyer",
  triggerClassName = "bo-btn bo-primary",
}: { label?: string; triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [coBuyer, setCoBuyer] = useState(false);
  const [preapproved, setPreapproved] = useState(false);
  const [source, setSource] = useState("");

  const close = () => {
    setOpen(false);
    setCoBuyer(false);
    setPreapproved(false);
    setSource("");
  };

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div className="bo-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="bo-modal">
            <div className="bo-modal-head">
              <div className="bo-modal-title">Add buyer</div>
              <div className="bo-modal-actions">
                <button type="button" className="bo-close" onClick={close} aria-label="Close">&times;</button>
              </div>
            </div>

            <form action={createBuyer}>
              {/* BUYERS */}
              <div className="bo-section">
                <div className="bo-section-title">
                  Buyers
                  {!coBuyer && (
                    <button type="button" className="bo-add" onClick={() => setCoBuyer(true)}>+ Add co-buyer</button>
                  )}
                </div>
                <div className="bo-people">
                  <div className="bo-person">
                    <div className="bo-person-head"><span className="bo-person-title">Buyer 1</span><span className="bo-person-role">Primary</span></div>
                    <div className="bo-form-grid bo-cols-4">
                      <div className="bo-field"><label>First name</label><input name="client_first" placeholder="Jordan" /></div>
                      <div className="bo-field"><label>Last name</label><input name="client_last" placeholder="Pine" /></div>
                      <div className="bo-field"><label>Email</label><input name="client_email" type="email" placeholder="jordan@email.com" /></div>
                      <div className="bo-field"><label>Phone</label><input name="client_phone" placeholder="(   )   -    " /></div>
                      <div className="bo-field"><label>Phone type</label>
                        <select name="client_phone_type"><option>Cell</option><option>Home</option><option>Work</option></select></div>
                    </div>
                  </div>

                  {coBuyer && (
                    <div className="bo-person">
                      <div className="bo-person-head">
                        <span className="bo-person-title">Buyer 2</span><span className="bo-person-role">Co-buyer</span>
                        <button type="button" className="bo-person-remove" onClick={() => setCoBuyer(false)} aria-label="Remove">&times;</button>
                      </div>
                      <div className="bo-form-grid bo-cols-4">
                        <div className="bo-field"><label>First name</label><input name="cobuyer_first" /></div>
                        <div className="bo-field"><label>Last name</label><input name="cobuyer_last" /></div>
                        <div className="bo-field"><label>Email</label><input name="cobuyer_email" type="email" /></div>
                        <div className="bo-field"><label>Phone</label><input name="cobuyer_phone" /></div>
                        <div className="bo-field"><label>Relationship</label><input name="cobuyer_relationship" placeholder="Spouse" /></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* HOW THEY CAME IN */}
              <div className="bo-section">
                <div className="bo-section-title">How they came in</div>
                <div className="bo-form-grid">
                  <div className="bo-field"><label>Source</label>
                    <select name="lead_source" value={source} onChange={(e) => setSource(e.target.value)}>
                      <option value="">Select a source...</option>
                      {PERSON_SOURCES.map((s) => <option key={s}>{s}</option>)}
                      <option>Zillow</option><option>Realtor.com</option><option>Online lead</option>
                      <option>Open house</option><option>Social media</option><option>Sign call</option>
                    </select>
                  </div>
                  {PERSON_SOURCES.includes(source) && (
                    <div className="bo-field"><label>Who referred them?</label><input name="referred_by" placeholder="Name" /></div>
                  )}
                </div>
              </div>

              {/* PRE-APPROVAL */}
              <div className="bo-section">
                <div className="bo-section-title">Pre-approval</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "4px 0 6px" }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--bo-muted)" }}>Are they pre-approved?</span>
                  <div className="bo-seg">
                    <button type="button" className={preapproved ? "" : "on"} onClick={() => setPreapproved(false)}>No</button>
                    <button type="button" className={preapproved ? "on" : ""} onClick={() => setPreapproved(true)}>Yes</button>
                  </div>
                </div>
                {preapproved && (
                  <div className="bo-form-grid bo-cols-4" style={{ marginTop: 8 }}>
                    <div className="bo-field"><label>Lender</label><input name="lender_name" placeholder="Lender name" /></div>
                    <div className="bo-field"><label>Lender phone</label><input name="lender_phone" /></div>
                    <div className="bo-field"><label>Lender email</label><input name="lender_email" type="email" /></div>
                    <div className="bo-field"><label>Pre-approval amount</label><input name="preapproval_amount" inputMode="numeric" placeholder="$0.00" /></div>
                  </div>
                )}
              </div>

              {/* OPTIONAL HOME */}
              <div className="bo-section">
                <div className="bo-section-title">A home they&rsquo;re interested in <span className="bo-aside">optional</span></div>
                <div className="bo-form-grid">
                  <div className="bo-field bo-span2"><label>Address</label><input name="address" placeholder="123 Main St" /></div>
                  <div className="bo-field"><label>City</label><input name="city" /></div>
                  <div className="bo-field"><label>State</label><input name="state" defaultValue="MI" /></div>
                  <div className="bo-field"><label>ZIP</label><input name="zip" /></div>
                  <div className="bo-field"><label>MLS #</label><input name="mls_number" placeholder="26039316" /></div>
                </div>
              </div>

              <div className="bo-modal-foot">
                <button type="button" className="bo-btn" onClick={close}>Cancel</button>
                <button type="submit" className="bo-save">Save as lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
