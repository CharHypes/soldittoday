"use client";

import { useState } from "react";
import { createPerson } from "@/app/dashboard/contacts/actions";

/**
 * Add a contact as a POP-OUT over the contacts list (never a page), per the
 * back-office design system. Posts to createPerson.
 */
export default function AddContactButton({
  label = "+ New Contact",
  triggerClassName = "btn-mauve text-sm",
}: { label?: string; triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div className="bo-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="bo-modal" style={{ maxWidth: 720 }}>
            <div className="bo-modal-head">
              <div className="bo-modal-title">Add contact</div>
              <div className="bo-modal-actions">
                <button type="button" className="bo-close" onClick={close} aria-label="Close">&times;</button>
              </div>
            </div>

            <form action={createPerson}>
              <div className="bo-section">
                <div className="bo-section-title">Who are they?</div>
                <div className="bo-form-grid">
                  <div className="bo-field"><label>First name</label><input name="first_name" /></div>
                  <div className="bo-field"><label>Last name</label><input name="last_name" /></div>
                  <div className="bo-field"><label>Type</label>
                    <select name="type" defaultValue="lead">
                      <option value="lead">Lead</option>
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="past_client">Past client</option>
                      <option value="lender">Lender</option>
                      <option value="title">Title</option>
                      <option value="insurance">Insurance</option>
                      <option value="agent">Agent</option>
                      <option value="investor">Investor</option>
                      <option value="vendor">Vendor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="bo-field bo-full"><label>Company <span className="bo-aside">(for a business contact)</span></label><input name="company" /></div>
                  <div className="bo-field"><label>Email</label><input name="email" type="email" /></div>
                  <div className="bo-field"><label>Phone</label><input name="phone" /></div>
                  <div className="bo-field bo-full"><label>Address</label><input name="address" placeholder="123 Main St, City, MI" /></div>
                </div>
              </div>

              <div className="bo-modal-foot">
                <button type="button" className="bo-btn" onClick={close}>Cancel</button>
                <button type="submit" className="bo-save">Save contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
