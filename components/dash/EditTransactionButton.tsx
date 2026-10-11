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
};

/** Edit a transaction as a POP-OUT over the deal (never a page), per the design system. */
export default function EditTransactionButton({ tx }: { tx: Tx }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const v = (x: unknown) => (x == null ? "" : String(x));

  return (
    <>
      <button type="button" className="bo-btn bo-primary" onClick={() => setOpen(true)}>
        Edit transaction
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
                </div>
              </div>

              <div className="bo-section">
                <div className="bo-section-title">Deal</div>
                <div className="bo-form-grid">
                  <div className="bo-field"><label>Purchase price</label><input name="price" inputMode="numeric" defaultValue={v(tx.price)} /></div>
                  <div className="bo-field"><label>Target close</label><input type="date" name="target_close_date" defaultValue={v(tx.target_close_date)} /></div>
                  <div className="bo-field"><label>Status</label>
                    <select name="status" defaultValue={v(tx.status) || "Under Contract"}>
                      <option>Under Contract</option><option>Pending</option><option>Closed</option><option>Cancelled</option>
                    </select>
                  </div>
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
