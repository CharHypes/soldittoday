"use client";

import { useState } from "react";
import { createListing } from "@/app/dashboard/actions";

/**
 * Add a listing manually as a POP-OUT over the listings list (never a page),
 * per the back-office design system. Posts to createListing.
 */
export default function AddListingButton({ label = "+ Add manually" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const [sellers, setSellers] = useState<{ id: string }[]>([{ id: "s0" }]);
  const addSeller = () => setSellers((rows) => [...rows, { id: `s${Date.now()}-${rows.length}` }]);
  const removeSeller = (rid: string) => setSellers((rows) => rows.filter((r) => r.id !== rid));

  return (
    <>
      <button type="button" className="bo-btn" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div className="bo-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="bo-modal">
            <div className="bo-modal-head">
              <div className="bo-modal-title">Add listing</div>
              <div className="bo-modal-actions">
                <button type="button" className="bo-close" onClick={close} aria-label="Close">&times;</button>
              </div>
            </div>

            <form action={createListing}>
              {/* PROPERTY */}
              <div className="bo-section">
                <div className="bo-section-title">Property</div>
                <div className="bo-form-grid">
                  <div className="bo-field bo-span2"><label>Address</label><input name="address" required placeholder="1457 Indian Trail" /></div>
                  <div className="bo-field"><label>City</label><input name="city" /></div>
                  <div className="bo-field"><label>State</label><input name="state" defaultValue="MI" /></div>
                  <div className="bo-field"><label>ZIP</label><input name="zip" /></div>
                  <div className="bo-field"><label>MLS #</label><input name="mls_number" placeholder="26039316" /></div>
                  <div className="bo-field"><label>Status</label>
                    <select name="status" defaultValue="Active"><option>Active</option><option>Coming Soon</option><option>Pending</option><option>Closed</option><option>Withdrawn</option></select></div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="bo-section">
                <div className="bo-section-title">Details</div>
                <div className="bo-form-grid bo-cols-4">
                  <div className="bo-field"><label>List price</label><input name="price" inputMode="numeric" placeholder="539900" /></div>
                  <div className="bo-field"><label>Beds</label><input name="beds" inputMode="numeric" /></div>
                  <div className="bo-field"><label>Baths</label><input name="baths" inputMode="numeric" /></div>
                  <div className="bo-field"><label>Sq ft</label><input name="sqft" inputMode="numeric" /></div>
                  <div className="bo-field"><label>Listed</label><input type="date" name="list_date" /></div>
                  <div className="bo-field bo-span2"><label>Photo URL</label><input name="photo_url" placeholder="https://... (or leave blank; IDX fills it later)" /></div>
                </div>
              </div>

              {/* SELLERS (add as many as the listing has) */}
              <div className="bo-section">
                <div className="bo-section-title">Sellers</div>
                {sellers.map((s, i) => (
                  <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
                    <div className="bo-field"><label>{i === 0 ? "Seller" : "Co-seller"}</label><input name={`seller_name_${i}`} placeholder="Full name" /></div>
                    <div className="bo-field"><label>Email</label><input name={`seller_email_${i}`} type="email" /></div>
                    <div className="bo-field"><label>Phone</label><input name={`seller_phone_${i}`} /></div>
                    {sellers.length > 1
                      ? <button type="button" onClick={() => removeSeller(s.id)} aria-label="Remove seller" className="text-dusty transition-colors hover:text-wine" style={{ fontSize: 18, marginBottom: 8 }}>&times;</button>
                      : <span />}
                  </div>
                ))}
                <button type="button" className="bo-add" onClick={addSeller}>+ Add seller</button>
              </div>

              <div className="bo-modal-foot">
                <button type="button" className="bo-btn" onClick={close}>Cancel</button>
                <button type="submit" className="bo-save">Save listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
