"use client";

import { useState } from "react";
import { updateTransaction } from "@/app/dashboard/actions";

type Tx = {
  id: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  price: number | string | null;
  status: string | null;
  target_close_date: string | null;
  mls_number: string | null;
  photo_url: string | null;
  acceptance_date?: string | null;
  emd_amount?: number | string | null;
  emd_held_by?: string | null;
  deal_type?: string | null;
  office?: string | null;
  year_built?: number | null;
  seller_name?: string | null;
  waiting_on?: string | null;
  referred_by?: string | null;
  lead_source?: string | null;
  skyslope_email?: string | null;
  dpa_program?: string | null;
  dpa_amount?: number | string | null;
};

/** Edit a transaction as a POP-OUT over the deal (never a page), per the design system. */
export default function EditTransactionButton({
  tx,
  triggerClassName = "bo-btn bo-primary",
  triggerLabel = "Edit transaction",
}: {
  tx: Tx;
  triggerClassName?: string;
  triggerLabel?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const v = (x: unknown) => (x == null ? "" : String(x));

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)} title="Edit transaction">
        {triggerLabel}
      </button>

      {open && (
        <div className="bo-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="bo-modal">
            <div className="bo-modal-head">
              <div className="bo-modal-title">Edit transaction</div>
              <div className="bo-modal-actions">
                <button type="button" className="bo-close" onClick={close} aria-label="Close">&times;</button>
              </div>
            </div>

            <form action={updateTransaction}>
              <input type="hidden" name="id" value={tx.id} />

              <div className="bo-section">
                <div className="bo-section-title">Property</div>
                <div className="bo-form-grid">
                  <div className="bo-field bo-span2"><label>Address</label><input name="address" defaultValue={v(tx.address)} /></div>
                  <div className="bo-field"><label>City</label><input name="city" defaultValue={v(tx.city)} /></div>
                  <div className="bo-field"><label>State</label><input name="state" defaultValue={v(tx.state)} /></div>
                  <div className="bo-field"><label>ZIP</label><input name="zip" defaultValue={v(tx.zip)} /></div>
                  <div className="bo-field"><label>MLS #</label><input name="mls_number" defaultValue={v(tx.mls_number)} placeholder="26039316" /></div>
                  <div className="bo-field"><label>Year built</label><input name="year_built" inputMode="numeric" defaultValue={v(tx.year_built)} placeholder="1998" /></div>
                </div>
              </div>

              <div className="bo-section">
                <div className="bo-section-title">Deal</div>
                <div className="bo-form-grid">
                  <div className="bo-field"><label>Type</label>
                    <select name="deal_type" defaultValue={v(tx.deal_type) || "Purchase"}>
                      <option>Purchase</option><option>Sale</option><option>Lease</option>
                    </select>
                  </div>
                  <div className="bo-field"><label>Purchase price</label><input name="price" inputMode="numeric" defaultValue={v(tx.price)} /></div>
                  <div className="bo-field"><label>Status</label>
                    <select name="status" defaultValue={v(tx.status) || "Under Contract"}>
                      <option>Under Contract</option><option>Pending Sale · Buy side</option><option>Pending</option><option>Closed</option><option>Cancelled</option>
                    </select>
                  </div>
                  <div className="bo-field"><label>Acceptance date</label><input type="date" name="acceptance_date" defaultValue={v(tx.acceptance_date)} /></div>
                  <div className="bo-field"><label>Closing date</label><input type="date" name="target_close_date" defaultValue={v(tx.target_close_date)} /></div>
                  <div className="bo-field"><label>Waiting on</label><input name="waiting_on" defaultValue={v(tx.waiting_on)} placeholder="Appraisal" /></div>
                  <div className="bo-field"><label>Office</label><input name="office" defaultValue={v(tx.office)} placeholder="Hypes Team" /></div>
                </div>
              </div>

              <div className="bo-section">
                <div className="bo-section-title">Earnest money</div>
                <div className="bo-form-grid">
                  <div className="bo-field"><label>EMD amount</label><input name="emd_amount" inputMode="numeric" defaultValue={v(tx.emd_amount)} placeholder="1000" /></div>
                  <div className="bo-field"><label>EMD held by</label><input name="emd_held_by" defaultValue={v(tx.emd_held_by)} placeholder="Trinity Title" /></div>
                </div>
              </div>

              <div className="bo-section">
                <div className="bo-section-title">Parties</div>
                <div className="bo-form-grid">
                  <div className="bo-field bo-span2"><label>Seller (other side) <span className="bo-aside">display</span></label><input name="seller_name" defaultValue={v(tx.seller_name)} placeholder="The Delgado Family" /></div>
                </div>
              </div>

              <div className="bo-section">
                <div className="bo-section-title">Assistance &amp; source</div>
                <div className="bo-form-grid">
                  <div className="bo-field"><label>DPA program</label>
                    <select name="dpa_program" defaultValue={v(tx.dpa_program)}>
                      <option value="">None</option><option>MSHDA</option><option>National Faith Homebuyers</option><option>Other</option>
                    </select>
                  </div>
                  <div className="bo-field"><label>DPA amount</label><input name="dpa_amount" inputMode="numeric" defaultValue={v(tx.dpa_amount)} placeholder="10000" /></div>
                  <div className="bo-field"><label>Lead source</label><input name="lead_source" defaultValue={v(tx.lead_source)} placeholder="Agent referral" /></div>
                  <div className="bo-field"><label>Referred by</label><input name="referred_by" defaultValue={v(tx.referred_by)} placeholder="Micki Sanders · National Realty" /></div>
                </div>
              </div>

              <div className="bo-section">
                <div className="bo-section-title">Routing</div>
                <div className="bo-form-grid">
                  <div className="bo-field bo-span2"><label>SkySlope · forward to broker <span className="bo-aside">optional</span></label><input name="skyslope_email" defaultValue={v(tx.skyslope_email)} placeholder="BirchwoodLn742@skyslope.com" /></div>
                  <div className="bo-field bo-full"><label>House photo URL <span className="bo-aside">optional</span></label><input name="photo_url" defaultValue={v(tx.photo_url)} placeholder="https://..." /></div>
                </div>
              </div>

              <div className="bo-modal-foot">
                <button type="button" className="bo-btn" onClick={close}>Cancel</button>
                <button type="submit" className="bo-save">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
