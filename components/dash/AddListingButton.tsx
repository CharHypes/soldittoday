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

              {/* SELLER */}
              <div className="bo-section">
                <div className="bo-section-title">Seller</div>
                <div className="bo-form-grid">
                  <div className="bo-field"><label>Name</label><input name="client_name" /></div>
                  <div className="bo-field"><label>Email</label><input name="client_email" type="email" /></div>
                  <div className="bo-field"><label>Phone</label><input name="client_phone" /></div>
                </div>
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
