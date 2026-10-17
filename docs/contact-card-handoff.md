# Handoff: Butler's contact card, for the Sold It Today CRM

Written 2026-09-19 in the Butler chat, for the Sold It Today website / in-house portal chat.
Charlotte approved this design in Butler and wants the same setup on the real estate side, with one big change:
**Transactions** (with a photo of the home) take the place of Butler's **Loan Files**.

Read with: `SOLD-IT-TODAY-inhouse-portal-spec.md` (the portal/CRM plan) and the org-first SaaS rule
(every table gets `organization_id` before more features).

---

## 1. See the real thing first

- **Live demo (made-up data):** https://butler-demo.contactus-e69.workers.dev ... click **Contacts** at the top, then
  open "Nguyen, Linh" (a borrower with a spouse, two loans, birthday, homeiversary, documents) and "Delgado, Rosa"
  (an agent who referred four clients).
- **Source code:** `AI-Workspace/Butler/New One/index.html` (one file). Look for these names:
  - `openContacts` ... the whole Contacts screen (list on the left, card on the right)
  - `ccHeader` ... the top of the card
  - `renderCard`, `ccSplit` ... the two-column layout (`CC_RIGHT` decides what goes on the right)
  - `personalForContact`, `ccReadEdit`, `fileRow` ... Personal box, read-then-Edit sections, loan file rows
  - `openPersonDocs`, `pdView`, `pdCopyDialog`, `pdKeepDialog` ... the documents window
  - `contactRows`, `_lastFirst`, `_contactSortKey`, `_isRealName` ... the list rules
  - CSS: classes starting `cc2-`, `cc-`, `pdoc-`, `contacts-`
- **Security plan for documents:** `AI-Workspace/Butler/docs/SECURITY_PERSON_DOCS.md`

## 2. The layout

```
 <- All contacts / Clients / Linh Nguyen
 +----------------------------------------------------------------------+
 | (LN)  Linh Nguyen                          [Referral] [Review left]    |
 |       Buyer with Bao Nguyen (spouse)       [Birthday in 9 days]        |
 |       [call] [text] [email]                                            |
 +----------------------------------------------------------------------+
 +-------------------------------+  +-----------------------------------+
 | CONTACT INFO            Edit  |  | TRANSACTIONS                      |
 |  Phone   (555) 110-0004       |  |  [photo of the home]              |
 |  Email   linh@...             |  |  456 Sesame St, Cedar Falls       |
 |  Address 456 Sesame St...     |  |  Buyer side . Under contract      |
 +-------------------------------+  |  Closes Sep 23 . $289,900         |
 | PERSONAL                Edit  |  |  ------------------------------   |
 |  Birthday      September 27   |  |  [photo]  12 Elmo Ln . Closed 2021|
 |  Marital status Married       |  +-----------------------------------+
 |  Spouse        Bao Nguyen     |  | DOCUMENTS ON FILE   2 . 1 expiring|
 |  Homeiversary  Sep 30, 2021   |  |  Driver's license   Expires soon  |
 +-------------------------------+  |  [Open documents]                 |
 | REFERRAL                Edit  |  +-----------------------------------+
 |  Referred by   Rosa Delgado   |  | REVIEWS                     Edit  |
 |  Lead source   Agent referral |  |  Left  Google . 5 stars           |
 |  They referred Tobi Okafor    |  +-----------------------------------+
 +-------------------------------+  | NOTES                             |
 | > RELATIONSHIPS (2)           |  |  + Add note                       |
 +-------------------------------+  +-----------------------------------+
```

- **Header:** "All contacts / <type> / <name>" line, a circle with initials (the spot for a photo later), name, a
  one-line "who they are", colored tags, and Call / Text / Email buttons.
- **Left column (who they are):** Contact info, Personal, Referral, Relationships.
- **Right column (what we do with them):** Transactions, Documents on file, Reviews, Notes.
- One column on a narrow screen. Sections are tidy "label: value" rows; each has an **Edit** link that opens the form
  (forms are never left open).

## 3. What changes for real estate

| Butler (mortgage) | Sold It Today (real estate) |
|---|---|
| Loan Files | **Transactions**, each with a **photo of the home** |
| "Borrower with Bao Nguyen (spouse)" | "Buyer with ..." / "Seller with ..." |
| Type "Borrower" | "Client" types: Buyer, Seller, Buyer and Seller, Past client, Lead |
| Status pill (Clear to Close, Closed...) | Transaction stage (Active, Under contract, Closed, Expired...) |
| "Closes Sep 22" / "Purchase . Sep 2026" | Closing date, price, and which side we represented |

**Each transaction row:** home photo (left, rounded, about 96 x 72), address (bold, clickable), side (buyer /
seller / both), stage pill, closing date or "Closed Mon YYYY", price. Clicking opens the transaction and shows a
**"Back to <name>"** button so you return to this contact.

**Where the home photo comes from, in order:**
1. The listing's first photo, when the property came from the IDX / MLS feed.
2. A photo uploaded to the transaction.
3. A neutral house placeholder (never a blank box).
Check the IDX / MLS rules before storing or showing listing photos inside the CRM: the IDX application has display
and compliance rules, and some MLSs limit how long photos may be kept after a listing closes. Street View images are
a separate paid Google product with their own terms, so they are not the default.

## 4. The contact list (left side)

- **"Last, First"** (Nguyen, Linh), sorted A to Z by last name, with sticky **A / B / C** dividers.
- Second line: the type ("Buyer", "Realtor . 4 transactions" for agents, just "Title" for title).
- Third line in the accent color when there is a second person: "with Bao Nguyen (spouse)".
- **One row per person** (not one per transaction). A company with no contact person sorts by company name.
- **Only real contacts:** a person's name, or a company name with a phone or email. A phone number typed into a name
  box is not a contact.
- Search also accepts "Nguyen, Linh".

## 5. Documents on file (the part that needs the most care)

Same security model as Butler, see `SECURITY_PERSON_DOCS.md`:
- Separate **private** storage; members can upload, nobody reads files directly.
- Every **view, save, copy and delete** goes through a server function that checks the user is an active member,
  **logs it** (append-only history: who, what, when) and returns a link that expires in **60 seconds**.
- **IDs are view only.** Expired IDs are flagged.
- **Keep period** with a review banner (Butler: 3 years after the last closing, then Charlotte approves deleting).
- **Social Security cards:** Charlotte's own tools never store them; a product sold to others gets a Settings switch.
- Person documents (ID, proof of funds letter, pre-approval letter...) vs transaction documents (purchase agreement,
  disclosures, inspection...) stay separate. "Copy into transaction" makes a real, separate copy.

## 6. Small behaviors that make it feel finished

- Phone numbers always stored and shown as "(734) 555-1234".
- Birthdays shown as "September 27" (no year); a gold tag "Birthday in N days" within 30 days.
- **Homeiversary** = the closing date of their most recent purchase; tag within 30 days. Great for past-client
  touches on the real estate side.
- "They referred" lists the people this contact sent us (clickable).
- Every button has a quick hover explanation (Butler's `#bt-tip`).
- Team voice in anything a client sees: "we / us / our", never "I / me".
- **No em dashes anywhere.** Use "..." instead.

## 7. Data shape (org-first)

- `people` (one record per person) and `transaction_people` (who is buyer / seller / co-buyer on which transaction,
  plus the name as it was on the transaction), both with `organization_id`.
- `person_documents` + append-only `person_doc_log`, private bucket, server function for every read.
- A new name that matches nobody gets a person automatically; a name that matches someone, or a changed name, waits
  in a "Confirm client names" box. Never merge people silently.
- Row level security: active members of that organization only, tested from outside as a stranger.

## 8. Questions to settle with Charlotte before building

1. Client types for the list: Buyer, Seller, Both, Past client, Lead ... anything else (investor, renter)?
2. Transaction stages to show on the pill.
3. Home photo: IDX photo allowed inside the CRM, and for how long after closing?
4. Which documents belong to the person vs the transaction on the real estate side.
5. Keep period for real estate documents.

---

## 9. Drag a document straight out to the shared drive (built in Butler 2026-09-21)

Charlotte's ask: "can't we just drag and drop it into the shared drive" instead of Save, which drops the file in
Downloads and then has to be moved. Worth copying to the real estate side for transaction documents.

**What it does.** Grab a document row in the Documents list and drag it onto a Finder or Explorer window (or a
folder). The real file copies there under its proper name. Dragging onto another folder INSIDE the app still moves
it between folders.

**How it works.**
1. As the Documents tab draws, ask storage for short-lived links for everything on screen, in one call
   (Supabase: `storage.from(bucket).createSignedUrls(paths, 3600)`), and keep them in a `Map` in memory. They are
   never written into the record. A drag cannot wait for a link, so the link has to exist before the drag starts.
2. On `dragstart`, set both drag types:
   - `application/x-<app>-doc` with the storage path, for the app's own folder-to-folder move;
   - `DownloadURL` as `"<mime>:<filename>:<https link>"`, which is what tells Chrome and Edge to write a real file
     at the drop target. Strip `\ / : * ? " < > |` out of the filename first.
   Set `effectAllowed = 'copyMove'`.
3. On `dragend`, if the drop did NOT happen inside the app (track that with a flag set by the app's own drop
   handler) and `dataTransfer.dropEffect !== 'none'`, offer a small bar: "Copied out. Mark saved to shared drive".
   A web page cannot confirm the drop landed, so never tick that by itself.

**Limits worth knowing.**
- Chrome and Edge only. Safari and Firefox ignore `DownloadURL`; keep the Save button for them.
- The link must be a real https URL the browser can fetch by itself (a signed storage link works; a blob URL built
  in the page does not). Anything generated on the fly (Butler's pre-approval letter) stays on Save.
- The link's lifetime is the limit on how long a tab may sit open before a drag stops working; one hour is plenty
  and cheap to re-prime on each render.
- It copies, never moves: nothing leaves the app.

**Butler's code** (`AI-Workspace/Butler/New One/index.html`): `primeDocDragUrls`, `docDragOutData`,
`offerSharedDriveAfterDrag`, and the `dragstart` / `dragend` handlers in `dfDocumentsTab`.
