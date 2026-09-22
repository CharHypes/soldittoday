"use client";

import Link from "next/link";
import { useState } from "react";
import { updatePerson, addPersonNote, deletePersonNote, savePersonReview, uploadPersonDocument, openPersonDocument, deletePersonDocument } from "@/app/dashboard/contacts/actions";
import { money } from "@/lib/format";
import {
  fullName,
  lastFirst,
  initials,
  typeLabel,
  TYPE_LABEL,
  ROLE_LABEL,
  MARITAL_LABEL,
  formatPhone,
  telHref,
  formatBirthday,
  type Person,
} from "@/lib/contacts";

type NamedRef = { id: string; name: string };
type Rel = { id: string; relation: string; name: string | null; related_person_id: string | null };
type Deal = {
  transaction_id: string;
  role: string;
  txn?: { address: string; status: string | null; price: number | null; target_close_date: string | null } | null;
};

type Note = { id: string; body: string; created_at: string };
type Review = { id: string; status: string; platform: string | null; rating: number | null; quote: string | null; url: string | null };
type Doc = { id: string; kind: string; sensitivity: string; filename: string | null; view_only: boolean; created_at: string };

const DOC_KIND_LABEL: Record<string, string> = {
  drivers_license: "Driver's license", state_id: "State ID", passport: "Passport", resident_card: "Resident card",
  pre_approval: "Pre-approval letter", proof_of_funds: "Proof of funds", income_letter: "Income letter",
  ssn_card: "SSN card", other: "Document",
};

export type ContactCardProps = {
  person: Person;
  referredBy: NamedRef | null;
  theyReferred: NamedRef[];
  rels: Rel[];
  primaryRelName: string | null;
  primaryRelLabel: string | null;
  deals: Deal[];
  notes: Note[];
  review: Review | null;
  documents: Doc[];
};

type Section = "name" | "contact" | "personal" | "referral" | "review" | null;

export default function ContactCard(props: ContactCardProps) {
  const { person, referredBy, theyReferred, rels, primaryRelName, primaryRelLabel, deals, notes, review, documents } = props;
  const [editing, setEditing] = useState<Section>(null);

  async function save(fd: FormData) {
    await updatePerson(fd);
    setEditing(null);
  }
  const save2 = (action: (fd: FormData) => Promise<void>) => async (fd: FormData) => {
    await action(fd);
    setEditing(null);
  };

  const phone = telHref(person.phone);
  const spouseRel = rels.find((r) => r.relation === "spouse");
  // Homeiversary = the close date of their most recent CLOSED purchase.
  const homeiversary = (() => {
    const closed = deals
      .filter((d) => (d.role === "buyer" || d.role === "co_buyer") && d.txn?.status && /clos/i.test(d.txn.status) && d.txn?.target_close_date)
      .map((d) => d.txn!.target_close_date as string)
      .sort();
    return closed.length ? closed[closed.length - 1] : null;
  })();
  const fmtDate = (d: string | null) => (d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null);

  return (
    <section className="rounded-xl2 border border-dusty/15 bg-bruised p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-8">
      {/* breadcrumb */}
      <p className="text-[11.5px] tracking-wide text-ink3">
        <Link href="/dashboard/contacts" className="hover:text-pearl">All contacts</Link>
        <span className="px-1.5 text-ink3/60">/</span>
        {typeLabel(person.type)}
        <span className="px-1.5 text-ink3/60">/</span>
        <span className="text-dusty">{lastFirst(person)}</span>
      </p>

      {/* header */}
      <div className="mt-4 flex items-start gap-5">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-mauve font-serif text-lg font-semibold text-plum ring-2 ring-[#e4bc90] ring-offset-2 ring-offset-plum">
          {initials(person)}
        </div>
        <div className="min-w-0 flex-1">
          {editing === "name" ? (
            <form action={save} className="space-y-2">
              <input type="hidden" name="id" value={person.id} />
              <div className="flex flex-wrap gap-2">
                <input name="first_name" defaultValue={person.first_name ?? ""} placeholder="First name" className={inp} />
                <input name="last_name" defaultValue={person.last_name ?? ""} placeholder="Last name" className={inp} />
              </div>
              <input name="display_name" defaultValue={person.display_name ?? ""} placeholder="Display name (optional)" className={`${inp} w-full`} />
              <div className="flex flex-wrap items-center gap-2">
                <select name="type" defaultValue={person.type} className={inp}>
                  {Object.entries(TYPE_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <SaveCancel onCancel={() => setEditing(null)} />
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-serif text-3xl font-medium text-pearl">{fullName(person)}</h2>
                <p className="mt-1 text-sm text-dusty">
                  {typeLabel(person.type)}
                  {primaryRelName && (
                    <>
                      {" · with "}
                      <span className="text-mauve">{primaryRelName}</span>
                      {primaryRelLabel ? ` (${primaryRelLabel.toLowerCase()})` : ""}
                    </>
                  )}
                </p>
                {review?.status === "left" && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" /> Review left
                  </span>
                )}
              </div>
              <EditLink onClick={() => setEditing("name")} />
            </div>
          )}

          {/* Call / Text / Email ... always present */}
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionBtn icon={<PhoneIcon />} label="Call" href={phone ? `tel:${phone}` : undefined} />
            <ActionBtn icon={<ChatIcon />} label="Text" href={phone ? `sms:${phone}` : undefined} />
            <ActionBtn icon={<MailIcon />} label="Email" href={person.email ? `mailto:${person.email}` : undefined} />
          </div>
        </div>
      </div>

      {/* body */}
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {/* LEFT: who they are */}
        <div className="space-y-5">
          <Box label="Contact info" onEdit={() => setEditing("contact")}>
            {editing === "contact" ? (
              <form action={save} className="space-y-3 pt-1">
                <input type="hidden" name="id" value={person.id} />
                <LabeledInput name="phone" label="Phone" defaultValue={person.phone} placeholder="(734) 555-1234" />
                <LabeledInput name="email" label="Email" defaultValue={person.email} placeholder="name@email.com" type="email" />
                <LabeledInput name="address" label="Address" defaultValue={person.address} placeholder="123 Main St, City, MI 48000" />
                <SaveCancel onCancel={() => setEditing(null)} />
              </form>
            ) : (
              <>
                <Field label="Phone" value={formatPhone(person.phone)} />
                <Field label="Email" value={person.email} />
                <Field label="Address" value={person.address} />
              </>
            )}
          </Box>

          <Box label="Personal" onEdit={() => setEditing("personal")}>
            {editing === "personal" ? (
              <form action={save} className="space-y-3 pt-1">
                <input type="hidden" name="id" value={person.id} />
                <LabeledInput name="birthday" label="Birthday" defaultValue={person.birthday} type="date" />
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-sm text-dusty">Marital status</span>
                  <select name="marital_status" defaultValue={person.marital_status ?? ""} className={`${inp} w-full`}>
                    <option value="">...</option>
                    {Object.entries(MARITAL_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <SaveCancel onCancel={() => setEditing(null)} />
              </form>
            ) : (
              <>
                <Field label="Birthday" value={formatBirthday(person.birthday)} />
                <Field label="Marital status" value={person.marital_status ? MARITAL_LABEL[person.marital_status] ?? person.marital_status : null} />
                <Field label="Spouse" value={spouseRel?.name ?? null} href={spouseRel?.related_person_id ? `/dashboard/contacts?id=${spouseRel.related_person_id}` : undefined} />
                <Field label="Homeiversary" value={fmtDate(homeiversary)} />
              </>
            )}
          </Box>

          <Box label="Referral" onEdit={() => setEditing("referral")}>
            {editing === "referral" ? (
              <form action={save} className="space-y-3 pt-1">
                <input type="hidden" name="id" value={person.id} />
                <LabeledInput name="lead_source" label="Lead source" defaultValue={person.lead_source} placeholder="Repeat client, Zillow, referral..." />
                <SaveCancel onCancel={() => setEditing(null)} />
              </form>
            ) : (
              <>
                <Field label="Referred by" value={referredBy?.name ?? null} href={referredBy ? `/dashboard/contacts?id=${referredBy.id}` : undefined} />
                <Field label="Lead source" value={person.lead_source} />
                {theyReferred.length > 0 && (
                  <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 py-1.5">
                    <span className="text-sm text-dusty">They referred</span>
                    <span className="flex flex-wrap gap-x-2 text-sm text-pearl">
                      {theyReferred.map((t, i) => (
                        <Link key={t.id} href={`/dashboard/contacts?id=${t.id}`} className="text-mauve hover:text-pearl">
                          {t.name}{i < theyReferred.length - 1 ? "," : ""}
                        </Link>
                      ))}
                    </span>
                  </div>
                )}
              </>
            )}
          </Box>

          {rels.length > 0 && (
            <Box label={`Relationships (${rels.length})`}>
              {rels.map((r) => (
                <Field
                  key={r.id}
                  label={relationLabel(r.relation)}
                  value={r.name}
                  href={r.related_person_id ? `/dashboard/contacts?id=${r.related_person_id}` : undefined}
                />
              ))}
            </Box>
          )}
        </div>

        {/* RIGHT: what we do with them */}
        <div className="space-y-5">
          <Box label="Transactions" addHref="/dashboard/buyers/new" addLabel="Add">
            {deals.length === 0 ? (
              <p className="py-1 text-sm text-dusty">No transactions yet.</p>
            ) : (
              <ul className="space-y-3 pt-1">
                {deals.map((d) => (
                  <li key={d.transaction_id} className="flex gap-3">
                    <div className="grid h-[76px] w-[108px] shrink-0 place-items-center rounded-[10px] border border-dusty/15 bg-bruised text-dusty/60">
                      <HouseIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-[#dcc4cb]">{d.txn?.address ?? "Property"}</p>
                      <p className="mt-0.5 text-[12px] text-dusty">
                        {[ROLE_LABEL[d.role] || typeLabel(person.type), money(d.txn?.price), closeDate(d.txn?.target_close_date ?? null)].filter(Boolean).join(" · ")}
                      </p>
                      {d.txn?.status && <StatusPill status={d.txn.status} />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Box>

          <Box label="Documents on file">
            {documents.length > 0 && (
              <ul className="space-y-1.5 pb-2 pt-1">
                {documents.map((d) => <DocItem key={d.id} doc={d} />)}
              </ul>
            )}
            <form action={uploadPersonDocument} className="grid gap-2 pt-1">
              <input type="hidden" name="person_id" value={person.id} />
              <div className="flex flex-wrap items-center gap-2">
                <select name="kind" defaultValue="other" className={inp}>
                  {Object.entries(DOC_KIND_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <input type="file" name="file" required className="max-w-[160px] text-[12px] text-dusty file:mr-2 file:rounded-md file:border-0 file:bg-raise file:px-2 file:py-1 file:text-[12px] file:text-pearl" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-ink3">Stored privately · every open is logged · SSN cards are masked.</span>
                <button type="submit" className="btn-mauve !px-3.5 !py-1.5 text-[12.5px]">Upload</button>
              </div>
            </form>
          </Box>

          <Box label="Reviews" onEdit={() => setEditing("review")}>
            {editing === "review" ? (
              <form action={save2(savePersonReview)} className="space-y-3 pt-1">
                <input type="hidden" name="person_id" value={person.id} />
                {review && <input type="hidden" name="review_id" value={review.id} />}
                <div className="grid grid-cols-[98px_minmax(0,1fr)] items-center gap-2.5">
                  <label className="text-[13px] text-ink3">Status</label>
                  <select name="status" defaultValue={review?.status ?? "requested"} className={`${inp} w-full`}>
                    <option value="requested">Review requested</option>
                    <option value="left">Review left</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
                <LabeledInput name="platform" label="Platform" defaultValue={review?.platform} placeholder="Google, Zillow, Facebook" />
                <div className="grid grid-cols-[98px_minmax(0,1fr)] items-center gap-2.5">
                  <label className="text-[13px] text-ink3">Stars</label>
                  <select name="rating" defaultValue={review?.rating != null ? String(review.rating) : ""} className={`${inp} w-full`}>
                    <option value="">...</option>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <LabeledInput name="quote" label="Quote" defaultValue={review?.quote} placeholder="What they said" />
                <LabeledInput name="url" label="Link" defaultValue={review?.url} placeholder="https://..." />
                <SaveCancel onCancel={() => setEditing(null)} />
              </form>
            ) : review ? (
              <div className="py-1">
                {review.quote && <p className="text-[13.5px] italic text-pearl">&ldquo;{review.quote}&rdquo;</p>}
                <p className="mt-1 text-[12px] text-dusty">
                  {review.rating ? <span className="text-gold">{"★".repeat(review.rating)}</span> : null}
                  {review.rating && review.platform ? " · " : ""}
                  {review.platform}
                  {review.status !== "left" ? ` · ${review.status === "requested" ? "requested" : "declined"}` : ""}
                </p>
                {review.url && <a href={review.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[12px] text-mauve hover:text-pearl">View review</a>}
              </div>
            ) : (
              <p className="py-1 text-[13px] text-ink3">No review tracked yet. Use Edit to log one.</p>
            )}
          </Box>

          <Box label="Notes">
            {notes.length > 0 && (
              <ul className="space-y-2 pb-2 pt-1">
                {notes.map((n) => (
                  <li key={n.id} className="group flex items-start justify-between gap-2 border-b border-dusty/10 pb-2 last:border-0">
                    <div className="min-w-0">
                      <p className="text-[13px] text-pearl">{n.body}</p>
                      <p className="mt-0.5 text-[11px] text-ink3">{new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <form action={deletePersonNote}>
                      <input type="hidden" name="id" value={n.id} />
                      <button type="submit" title="Delete note" className="text-[11px] text-ink3 opacity-0 transition-opacity hover:text-mauve group-hover:opacity-100">Delete</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <form action={addPersonNote} className="pt-1">
              <input type="hidden" name="person_id" value={person.id} />
              <textarea name="body" required rows={2} placeholder="Add a note..." className={`${inp} w-full resize-y`} />
              <div className="mt-2 flex justify-end">
                <button type="submit" className="btn-mauve !px-3.5 !py-1.5 text-[12.5px]">Add a note</button>
              </div>
            </form>
          </Box>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- pieces ------------------------------- */

const inp =
  "rounded-lg border border-dusty/25 bg-plum/50 px-3 py-2 text-sm text-pearl placeholder:text-dusty/50 focus:border-auroraMauve/60 focus:outline-none";

function relationLabel(r: string): string {
  const m: Record<string, string> = {
    spouse: "Spouse", partner: "Partner", co_buyer: "Co-buyer", co_seller: "Co-seller",
    family: "Family", assistant: "Assistant", attorney: "Attorney", lender: "Lender", other: "Related",
  };
  return m[r] ?? "Related";
}
function closeDate(d: string | null): string | null {
  if (!d) return null;
  return `Closes ${new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function DocItem({ doc }: { doc: Doc }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isHigh = doc.sensitivity === "high";
  const label = DOC_KIND_LABEL[doc.kind] ?? "Document";
  const open = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await openPersonDocument(doc.id);
      if (res.url) window.open(res.url, "_blank", "noopener,noreferrer");
      else setErr(res.error === "forbidden" ? "Not permitted" : "Unavailable");
    } finally {
      setBusy(false);
    }
  };
  return (
    <li className="group flex items-center justify-between gap-2 border-b border-dusty/10 pb-1.5 last:border-0">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-dusty/60">{isHigh ? <LockIcon /> : <DocIcon />}</span>
        <div className="min-w-0">
          <p className="truncate text-[13px] text-pearl">
            {label}
            {isHigh && <span className="ml-1.5 rounded bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">Sensitive</span>}
          </p>
          <p className="truncate text-[11px] text-ink3">
            {isHigh ? "••••••  masked ... open to view" : doc.filename ?? "File"}
            {doc.view_only ? " · view only" : ""}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {err && <span className="text-[10px] text-wine">{err}</span>}
        <button type="button" onClick={open} disabled={busy} className="text-[11px] font-semibold text-mauve hover:text-pearl disabled:opacity-50">{busy ? "..." : "Open"}</button>
        <form action={deletePersonDocument}>
          <input type="hidden" name="id" value={doc.id} />
          <button type="submit" title="Delete document" className="text-[11px] text-ink3 opacity-0 transition-opacity hover:text-mauve group-hover:opacity-100">Delete</button>
        </form>
      </div>
    </li>
  );
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" /></svg>;
}
function DocIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" strokeLinejoin="round" /><path d="M14 3v5h5" strokeLinejoin="round" /></svg>;
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  let cls = "bg-dusty/15 text-dusty";
  if (/active|coming/.test(s)) cls = "bg-green/15 text-green";
  else if (/under contract|pending/.test(s)) cls = "bg-gold/15 text-gold";
  else if (/expired|withdrawn|cancel|fell/.test(s)) cls = "bg-dusty/15 text-dusty/80";
  return (
    <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}

function Box({
  label, onEdit, addHref, addLabel, soon, children,
}: {
  label: string; onEdit?: () => void; addHref?: string; addLabel?: string; soon?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl2 border border-dusty/15 bg-raise p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink3">{label}</h3>
        {onEdit && <EditLink onClick={onEdit} />}
        {addHref && (
          <Link href={addHref} className="flex items-center gap-1 text-xs font-medium text-mauve hover:text-pearl">
            <PlusIcon /> {addLabel ?? "Add"}
          </Link>
        )}
        {soon && <span className="rounded-full border border-dusty/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-dusty/60">{soon}</span>}
      </div>
      <div className="divide-y divide-dusty/10">{children}</div>
    </div>
  );
}

function Field({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  return (
    <div className="grid grid-cols-[98px_minmax(0,1fr)] gap-2.5 py-1">
      <span className="text-[13px] text-ink3">{label}</span>
      {value ? (
        href ? (
          <Link href={href} className="text-[13px] text-mauve hover:text-pearl">{value}</Link>
        ) : (
          <span className="text-[13px] text-pearl">{value}</span>
        )
      ) : (
        <span className="text-[13px] text-ink3/70">...</span>
      )}
    </div>
  );
}

function LabeledInput({
  name, label, defaultValue, placeholder, type = "text",
}: { name: string; label: string; defaultValue?: string | null; placeholder?: string; type?: string }) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-2">
      <label className="text-sm text-dusty">{label}</label>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} className={`${inp} w-full`} />
    </div>
  );
}

function SaveCancel({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <button type="submit" className="btn-mauve text-sm">Save</button>
      <button type="button" onClick={onCancel} className="rounded-lg px-3 py-1.5 text-sm text-dusty hover:text-pearl">Cancel</button>
    </div>
  );
}

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1 text-[11.5px] font-semibold text-mauve transition-colors hover:text-pearl">
      <PencilIcon /> Edit
    </button>
  );
}

function ActionBtn({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const cls =
    "inline-flex items-center gap-2 rounded-[9px] border px-3.5 py-2 text-[12.5px] font-medium transition-colors";
  if (href) {
    return (
      <a href={href} className={`${cls} border-pearl/15 bg-bruised text-pearl hover:border-mauve hover:text-mauve`}>
        {icon} {label}
      </a>
    );
  }
  return (
    <span className={`${cls} cursor-default border-pearl/10 bg-bruised text-dusty`} title={`Add a ${label.toLowerCase()} detail first`}>
      {icon} {label}
    </span>
  );
}

/* icons */
function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ChatIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.3 9.3 0 0 1-3.8-.7L3 21l1.3-4.2A8.4 8.4 0 1 1 21 11.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PencilIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>;
}
function HouseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-7 w-7"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
