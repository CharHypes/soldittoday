"use client";

import { useState } from "react";
import { saveTransactionFull } from "@/app/dashboard/actions";
import { ALL_DOCS, ACTION_ITEMS } from "@/lib/dealChecklist";

type Tx = {
  id: string;
  address: string | null; city: string | null; state: string | null; zip: string | null;
  county?: string | null; occupancy?: string | null;
  price: number | string | null; status: string | null;
  target_close_date: string | null; mls_number: string | null; photo_url: string | null;
  acceptance_date?: string | null; emd_amount?: number | string | null; emd_held_by?: string | null;
  emd_received_date?: string | null; deal_type?: string | null; office?: string | null;
  year_built?: number | null; seller_name?: string | null; waiting_on?: string | null;
  referred_by?: string | null; lead_source?: string | null; skyslope_email?: string | null;
  dpa_program?: string | null; dpa_amount?: number | string | null;
  inspection_period_days?: number | null; inspection_deadline?: string | null;
  appraisal_date?: string | null; financing_contingency_date?: string | null;
  referral_how?: string | null; referral_amount?: number | string | null;
};

type KC = { role: string; name: string; company: string | null; email: string | null; phone: string | null; address: string | null; personId: string | null };
type FileNeeds = { docs: string[]; actions: string[] };

const Chev =() => <svg className="ic chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Plus = () => <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 12, height: 12 }}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>;

export default function EditTransactionButton({
  tx, contacts = [], buyer, fileNeeds, triggerClassName = "btn mauve", triggerLabel = "Edit transaction",
}: {
  tx: Tx;
  contacts?: KC[];
  buyer?: { name: string | null; phone: string | null; email: string | null } | null;
  fileNeeds?: FileNeeds | null;
  triggerClassName?: string;
  triggerLabel?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({ needs: true });
  const toggle = (k: string) => setAcc((a) => ({ ...a, [k]: !a[k] }));
  const close = () => setOpen(false);
  const v = (x: unknown) => (x == null ? "" : String(x));
  const fn = fileNeeds ?? { docs: [], actions: [] };
  const find = (re: RegExp) => contacts.find((c) => re.test(c.role));
  const co = find(/co.?buyer/i);
  const la = find(/listing|^agent$|list.?agent/i);
  const lender = find(/lender|loan/i);
  const bt = find(/buyer.?title|^title$/i);
  const st = find(/seller.?title/i);
  const ins = find(/insur/i);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)} title="Edit transaction">
        {triggerLabel}
      </button>

      {open && (
        <div className="editwrap" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="editsheet">
            <div className="edithead">
              <div><div className="eh-title">Edit transaction</div><div className="eh-sub">{tx.address || "Deal"} · Buyer side</div></div>
              <button type="button" className="iconx" onClick={close} aria-label="Close">×</button>
            </div>

            <form action={saveTransactionFull}>
              <input type="hidden" name="id" value={tx.id} />
              <div className="editbody">

                {/* 1 ... File needs & follow-up */}
                <section className={`acc${acc.needs ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("needs")}>File needs &amp; follow-up <Chev /></button>
                  <div className="acc-b">
                    <div className="subcard">
                      <h4>Documents needed / received</h4>
                      <div className="checkgrid">
                        {ALL_DOCS.map((d) => (
                          <label key={d.key} className="chk"><input type="checkbox" name={`doc_${d.key}`} defaultChecked={fn.docs?.includes(d.key)} /> {d.label}</label>
                        ))}
                      </div>
                    </div>
                    <div className="subcard">
                      <h4>Follow-up / action items</h4>
                      <div className="checkgrid">
                        {ACTION_ITEMS.map((a) => (
                          <label key={a.key} className="chk"><input type="checkbox" name={`act_${a.key}`} defaultChecked={fn.actions?.includes(a.key)} /> {a.label}</label>
                        ))}
                      </div>
                    </div>
                    <label className="ci" style={{ display: "block" }}><span className="k">Waiting on</span><input className="inp" name="waiting_on" defaultValue={v(tx.waiting_on)} placeholder="Appraisal" /></label>
                  </div>
                </section>

                {/* 2 ... Parties */}
                <section className={`acc${acc.parties ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("parties")}>Parties <Chev /></button>
                  <div className="acc-b">
                    <div className="subcard">
                      <h4>Buyer</h4>
                      <div className="cigrid4">
                        <label className="ci"><span className="k">Name</span><input className="inp" name="buyer_name" defaultValue={v(buyer?.name)} /></label>
                        <label className="ci"><span className="k">Phone</span><input className="inp" name="buyer_phone" defaultValue={v(buyer?.phone)} /></label>
                        <label className="ci"><span className="k">Email</span><input className="inp" name="buyer_email" defaultValue={v(buyer?.email)} /></label>
                      </div>
                    </div>
                    <div className="subcard">
                      <h4>Co-buyer</h4>
                      <div className="cigrid4">
                        <label className="ci"><span className="k">Name</span><input className="inp" name="cobuyer_name" defaultValue={v(co?.name)} /></label>
                        <label className="ci"><span className="k">Phone</span><input className="inp" name="cobuyer_phone" defaultValue={v(co?.phone)} /></label>
                        <label className="ci"><span className="k">Email</span><input className="inp" name="cobuyer_email" defaultValue={v(co?.email)} /></label>
                      </div>
                    </div>
                    <div className="subcard">
                      <h4>Seller</h4>
                      <div className="cigrid4">
                        <label className="ci" style={{ gridColumn: "span 2" }}><span className="k">Name / entity</span><input className="inp" name="seller_name" defaultValue={v(tx.seller_name)} placeholder="The Delgado Family" /></label>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3 ... Property & MLS */}
                <section className={`acc${acc.property ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("property")}>Property &amp; MLS <Chev /></button>
                  <div className="acc-b">
                    <div className="cigrid4">
                      <label className="ci"><span className="k">MLS #</span><input className="inp" name="mls_number" defaultValue={v(tx.mls_number)} placeholder="26039316" /></label>
                      <label className="ci"><span className="k">Purchase price</span><input className="inp" name="price" inputMode="numeric" defaultValue={v(tx.price)} /></label>
                      <label className="ci"><span className="k">Type</span>
                        <select className="inp" name="deal_type" defaultValue={v(tx.deal_type) || "Purchase"}><option>Purchase</option><option>Sale</option><option>Lease</option></select></label>
                      <label className="ci"><span className="k">Year built</span><input className="inp" name="year_built" inputMode="numeric" defaultValue={v(tx.year_built)} /></label>
                      <label className="ci" style={{ gridColumn: "span 2" }}><span className="k">Address</span><input className="inp" name="address" defaultValue={v(tx.address)} /></label>
                      <label className="ci"><span className="k">City</span><input className="inp" name="city" defaultValue={v(tx.city)} /></label>
                      <label className="ci"><span className="k">State</span><input className="inp" name="state" defaultValue={v(tx.state)} /></label>
                      <label className="ci"><span className="k">Zip</span><input className="inp" name="zip" defaultValue={v(tx.zip)} /></label>
                      <label className="ci"><span className="k">County</span><input className="inp" name="county" defaultValue={v(tx.county)} /></label>
                      <label className="ci"><span className="k">Occupancy</span><input className="inp" name="occupancy" defaultValue={v(tx.occupancy)} placeholder="Primary" /></label>
                      <label className="ci"><span className="k">Status</span>
                        <select className="inp" name="status" defaultValue={v(tx.status) || "Under Contract"}><option>Under Contract</option><option>Pending Sale · Buy side</option><option>Pending</option><option>Closed</option><option>Cancelled</option></select></label>
                      <label className="ci"><span className="k">DPA program</span>
                        <select className="inp" name="dpa_program" defaultValue={v(tx.dpa_program)}><option value="">None</option><option>MSHDA</option><option>National Faith Homebuyers</option><option>Other</option></select></label>
                      <label className="ci"><span className="k">DPA amount</span><input className="inp" name="dpa_amount" inputMode="numeric" defaultValue={v(tx.dpa_amount)} /></label>
                    </div>
                    <p className="helpnote" style={{ margin: "12px 2px 0" }}>Tip: enter the MLS # and sync pulls the photo from the feed.</p>
                  </div>
                </section>

                {/* 4 ... Agents / Contacts */}
                <section className={`acc${acc.contacts ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("contacts")}>Agents / Contacts <Chev /></button>
                  <div className="acc-b">
                    <p className="helpnote">New people here are saved back to your <b>Contacts</b> automatically.</p>
                    <ContactCard title={<>Listing agent <span className="flipnote">(other side)</span></>} p="la" c={la} nameLabel="Agent" companyLabel="Brokerage / office" />
                    <ContactCard title="Lender" p="lender" c={lender} nameLabel="Loan officer" companyLabel="Company" />
                    <ContactCard title="Buyer's title / escrow" p="btitle" c={bt} nameLabel="Contact" companyLabel="Company" companyFirst />
                    <ContactCard title={<>Seller's title / escrow <span className="flipnote">if different</span></>} p="stitle" c={st} nameLabel="Contact" companyLabel="Company" companyFirst />
                    <ContactCard title="Insurance" p="ins" c={ins} nameLabel="Contact" companyLabel="Company" />
                  </div>
                </section>

                {/* 5 ... Dates */}
                <section className={`acc${acc.dates ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("dates")}>Dates <Chev /></button>
                  <div className="acc-b">
                    <div className="cigrid4">
                      <label className="ci"><span className="k">Acceptance</span><input type="date" className="inp" name="acceptance_date" defaultValue={v(tx.acceptance_date)} /></label>
                      <label className="ci"><span className="k">Inspection period (days)</span><input className="inp" name="inspection_period_days" inputMode="numeric" defaultValue={v(tx.inspection_period_days)} /></label>
                      <label className="ci"><span className="k">Inspection deadline</span><input type="date" className="inp" name="inspection_deadline" defaultValue={v(tx.inspection_deadline)} /></label>
                      <label className="ci"><span className="k">Appraisal</span><input type="date" className="inp" name="appraisal_date" defaultValue={v(tx.appraisal_date)} /></label>
                      <label className="ci"><span className="k">Financing contingency</span><input type="date" className="inp" name="financing_contingency_date" defaultValue={v(tx.financing_contingency_date)} /></label>
                      <label className="ci"><span className="k">Closing</span><input type="date" className="inp" name="target_close_date" defaultValue={v(tx.target_close_date)} /></label>
                    </div>
                    <p className="helpnote" style={{ margin: "14px 0 0" }}>We flag the inspection deadline on the deal as it gets close so it never slips by.</p>
                  </div>
                </section>

                {/* 6 ... Earnest money */}
                <section className={`acc${acc.emd ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("emd")}>Earnest money <Chev /></button>
                  <div className="acc-b">
                    <div className="cigrid4">
                      <label className="ci"><span className="k">EMD amount</span><input className="inp" name="emd_amount" inputMode="numeric" defaultValue={v(tx.emd_amount)} /></label>
                      <label className="ci"><span className="k">Held by</span><input className="inp" name="emd_held_by" defaultValue={v(tx.emd_held_by)} placeholder="Trinity Title" /></label>
                      <label className="ci"><span className="k">Date received</span><input type="date" className="inp" name="emd_received_date" defaultValue={v(tx.emd_received_date)} /></label>
                    </div>
                  </div>
                </section>

                {/* 7 ... Referral / Source */}
                <section className={`acc${acc.referral ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("referral")}>Referral / Source <Chev /></button>
                  <div className="acc-b">
                    <div className="cigrid4">
                      <label className="ci"><span className="k">How I got it</span><input className="inp" name="referral_how" defaultValue={v(tx.referral_how)} placeholder="Referral ... another agent" /></label>
                      <label className="ci"><span className="k">Referred by</span><input className="inp" name="referred_by" defaultValue={v(tx.referred_by)} placeholder="Micki Sanders" /></label>
                      <label className="ci"><span className="k">Lead source</span><input className="inp" name="lead_source" defaultValue={v(tx.lead_source)} placeholder="Agent referral" /></label>
                      <label className="ci"><span className="k">Referral amount</span><input className="inp" name="referral_amount" inputMode="numeric" defaultValue={v(tx.referral_amount)} /></label>
                    </div>
                    <label className="ci" style={{ display: "block", marginTop: 12 }}><span className="k">SkySlope · forward to broker <span className="flipnote">optional</span></span><input className="inp" name="skyslope_email" defaultValue={v(tx.skyslope_email)} placeholder="BirchwoodLn742@skyslope.com" /></label>
                    <label className="ci" style={{ display: "block", marginTop: 12 }}><span className="k">House photo URL <span className="flipnote">optional</span></span><input className="inp" name="photo_url" defaultValue={v(tx.photo_url)} placeholder="https://..." /></label>
                  </div>
                </section>

                {/* 8 ... Commission (note only) */}
                <section className={`acc${acc.comm ? " open" : ""}`}>
                  <button type="button" className="acc-h" onClick={() => toggle("comm")}>Commission <Chev /></button>
                  <div className="acc-b">
                    <div className="ownersec">Commission, splits, referral payout and the SIT fee are edited on the <b>Commission tab</b> ... owner-only, so it stays out of your agents&rsquo; view. This panel keeps the deal facts; money lives there.</div>
                  </div>
                </section>

              </div>

              <div className="editfoot">
                <span style={{ fontSize: 12, color: "var(--ink3)" }}>Changes save to the whole file</span>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" className="btn" onClick={close}>Cancel</button>
                  <button type="submit" className="btn mauve">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function ContactCard({ title, p, c, nameLabel, companyLabel, companyFirst }: {
  title: React.ReactNode; p: string; c?: KC; nameLabel: string; companyLabel: string; companyFirst?: boolean;
}) {
  const v = (x: unknown) => (x == null ? "" : String(x));
  const nameField = <label className="ci"><span className="k">{nameLabel}</span><input className="inp" name={`${p}_contact`} defaultValue={v(c?.name)} placeholder="Type or pick a saved contact..." /></label>;
  const companyField = <label className="ci"><span className="k">{companyLabel}</span><input className="inp" name={`${p}_company`} defaultValue={v(c?.company)} placeholder="Company..." /></label>;
  // listing agent + lender use *_name for the person; title/insurance use *_contact. Keep names aligned with the action.
  const nameInput = (p === "la" || p === "lender")
    ? <label className="ci"><span className="k">{nameLabel}</span><input className="inp" name={`${p}_name`} defaultValue={v(c?.name)} placeholder="Type or pick a saved contact..." /></label>
    : nameField;
  return (
    <div className="subcard">
      <h4>{title}</h4>
      <div className="cigrid4">
        {companyFirst ? <>{companyField}{nameInput}</> : <>{nameInput}{companyField}</>}
        <label className="ci"><span className="k">Phone</span><input className="inp" name={`${p}_phone`} defaultValue={v(c?.phone)} /></label>
        <label className="ci"><span className="k">Email</span><input className="inp" name={`${p}_email`} defaultValue={v(c?.email)} /></label>
      </div>
      <label className="ci" style={{ marginTop: 12, display: "block" }}><span className="k">Address</span><input className="inp" name={`${p}_address`} defaultValue={v(c?.address)} /></label>
    </div>
  );
}
