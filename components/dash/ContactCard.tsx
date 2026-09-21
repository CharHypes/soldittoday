"use client";

import Link from "next/link";
import { useState } from "react";
import { updatePerson } from "@/app/dashboard/contacts/actions";
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

export type ContactCardProps = {
  person: Person;
  referredBy: NamedRef | null;
  theyReferred: NamedRef[];
  rels: Rel[];
  primaryRelName: string | null;
  primaryRelLabel: string | null;
  deals: Deal[];
};

type Section = "name" | "contact" | "personal" | "referral" | null;

export default function ContactCard(props: ContactCardProps) {
  const { person, referredBy, theyReferred, rels, primaryRelName, primaryRelLabel, deals } = props;
  const [editing, setEditing] = useState<Section>(null);

  async function save(fd: FormData) {
    await updatePerson(fd);
    setEditing(null);
  }

  const phone = telHref(person.phone);

  return (
    <section className="rounded-xl2 border border-dusty/15 bg-bruised p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-8">
      {/* breadcrumb */}
      <p className="text-sm text-dusty">
        <Link href="/dashboard/contacts" className="hover:text-pearl">All contacts</Link>
        <span className="px-1.5 text-dusty/50">/</span>
        {typeLabel(person.type)}
        <span className="px-1.5 text-dusty/50">/</span>
        <span className="text-pearl/90">{lastFirst(person)}</span>
      </p>

      {/* header */}
      <div className="mt-4 flex items-start gap-5">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-mauve font-serif text-lg font-semibold text-plum ring-2 ring-gold ring-offset-2 ring-offset-plum">
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
                      <span className="text-auroraMauve">{primaryRelName}</span>
                      {primaryRelLabel ? ` (${primaryRelLabel.toLowerCase()})` : ""}
                    </>
                  )}
                </p>
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
                <SaveCancel onCancel={() => setEditing(null)} />
              </form>
            ) : (
              <>
                <Field label="Phone" value={formatPhone(person.phone)} />
                <Field label="Email" value={person.email} />
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
                        <Link key={t.id} href={`/dashboard/contacts?id=${t.id}`} className="text-auroraMauve hover:text-pearl">
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
                    <div className="grid h-[72px] w-24 shrink-0 place-items-center rounded-lg border border-dusty/15 bg-bruised/60 text-dusty/60">
                      <HouseIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-pearl">{d.txn?.address ?? "Property"}</p>
                      <p className="mt-0.5 text-sm text-dusty">
                        {ROLE_LABEL[d.role] || typeLabel(person.type)}
                        {d.txn?.status ? ` · ${d.txn.status}` : ""}
                      </p>
                      <p className="mt-0.5 text-sm text-dusty">
                        {[money(d.txn?.price), closeDate(d.txn?.target_close_date ?? null)].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Box>

          <Box label="Documents on file" soon="Secure upload coming next">
            <p className="py-1 text-sm text-dusty">
              The private document vault (IDs, pre-approvals, SSN cards for DPA) is the next stage.
            </p>
          </Box>

          <Box label="Reviews" soon="Coming soon">
            <p className="py-1 text-sm text-dusty">Track the review you asked for and where it landed (Google, Zillow).</p>
          </Box>

          <Box label="Notes" soon="Coming soon">
            <p className="py-1 text-sm text-dusty">Private notes about this contact will live here.</p>
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

function Box({
  label, onEdit, addHref, addLabel, soon, children,
}: {
  label: string; onEdit?: () => void; addHref?: string; addLabel?: string; soon?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl2 border border-dusty/15 bg-raise p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-dusty/80">{label}</h3>
        {onEdit && <EditLink onClick={onEdit} />}
        {addHref && (
          <Link href={addHref} className="flex items-center gap-1 text-xs font-medium text-auroraMauve hover:text-pearl">
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
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 py-1.5">
      <span className="text-sm text-dusty">{label}</span>
      {value ? (
        href ? (
          <Link href={href} className="text-sm text-auroraMauve hover:text-pearl">{value}</Link>
        ) : (
          <span className="text-sm text-pearl">{value}</span>
        )
      ) : (
        <span className="text-sm text-dusty/50">...</span>
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
    <button type="button" onClick={onClick} className="flex items-center gap-1 text-xs font-medium text-auroraMauve transition-colors hover:text-pearl">
      <PencilIcon /> Edit
    </button>
  );
}

function ActionBtn({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const cls =
    "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors";
  if (href) {
    return (
      <a href={href} className={`${cls} border-dusty/40 bg-raise text-pearl hover:border-gold/70`}>
        {icon} {label}
      </a>
    );
  }
  return (
    <span className={`${cls} cursor-default border-dusty/30 bg-raise/70 text-dusty`} title={`Add a ${label.toLowerCase()} detail first`}>
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
