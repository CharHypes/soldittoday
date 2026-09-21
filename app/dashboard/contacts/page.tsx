import type { Metadata } from "next";
import Link from "next/link";
import DashHeader from "@/components/dash/DashHeader";
import { createSupabaseServer } from "@/lib/supabase/server";
import { money } from "@/lib/format";
import {
  fullName,
  lastFirst,
  initials,
  typeLabel,
  ROLE_LABEL,
  RELATION_LABEL,
  MARITAL_LABEL,
  formatPhone,
  telHref,
  formatBirthday,
  type Person,
} from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Contacts | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type ListRow = Pick<Person, "id" | "first_name" | "last_name" | "company" | "display_name" | "type" | "sort_key">;
type Txn = {
  id: string;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  price: number | null;
  status: string | null;
  target_close_date: string | null;
};

function closeDate(d: string | null): string | null {
  if (!d) return null;
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { id?: string; q?: string };
}) {
  const supabase = createSupabaseServer();
  const q = (searchParams.q ?? "").trim();

  let listQuery = supabase
    .from("people")
    .select("id, first_name, last_name, company, display_name, type, sort_key")
    .order("sort_key", { ascending: true });
  if (q) {
    const like = `%${q}%`;
    listQuery = listQuery.or(
      `display_name.ilike.${like},last_name.ilike.${like},first_name.ilike.${like},company.ilike.${like}`
    );
  }
  const { data: listData } = await listQuery;
  const list = (listData ?? []) as ListRow[];

  const selectedId = searchParams.id && list.some((p) => p.id === searchParams.id) ? searchParams.id : list[0]?.id;

  // ---- selected contact detail ----
  let person: Person | null = null;
  let referredBy: ListRow | null = null;
  let theyReferred: ListRow[] = [];
  let rels: { id: string; relation: string; related_name: string | null; related_person_id: string | null; is_primary: boolean }[] = [];
  const relNames = new Map<string, string>();
  let deals: { transaction_id: string; role: string; name_on_deal: string | null; txn?: Txn }[] = [];

  if (selectedId) {
    const { data: p } = await supabase.from("people").select("*").eq("id", selectedId).maybeSingle();
    person = (p as Person) ?? null;

    if (person?.referred_by_person_id) {
      const { data } = await supabase
        .from("people")
        .select("id, first_name, last_name, company, display_name, type, sort_key")
        .eq("id", person.referred_by_person_id)
        .maybeSingle();
      referredBy = (data as ListRow) ?? null;
    }

    const { data: tr } = await supabase
      .from("people")
      .select("id, first_name, last_name, company, display_name, type, sort_key")
      .eq("referred_by_person_id", selectedId);
    theyReferred = (tr ?? []) as ListRow[];

    const { data: r } = await supabase
      .from("person_relationships")
      .select("id, relation, related_name, related_person_id, is_primary")
      .eq("person_id", selectedId)
      .order("is_primary", { ascending: false });
    rels = r ?? [];

    const relIds = rels.map((x) => x.related_person_id).filter((x): x is string => Boolean(x));
    if (relIds.length) {
      const { data } = await supabase.from("people").select("id, first_name, last_name, company, display_name").in("id", relIds);
      (data ?? []).forEach((pp: any) => relNames.set(pp.id, fullName(pp)));
    }

    const { data: tp } = await supabase
      .from("transaction_people")
      .select("transaction_id, role, name_on_deal")
      .eq("person_id", selectedId);
    const txnIds = (tp ?? []).map((x: any) => x.transaction_id);
    let txns: Txn[] = [];
    if (txnIds.length) {
      const { data } = await supabase
        .from("transactions")
        .select("id, address, city, state, zip, price, status, target_close_date")
        .in("id", txnIds);
      txns = (data ?? []) as Txn[];
    }
    deals = (tp ?? []).map((link: any) => ({ ...link, txn: txns.find((t) => t.id === link.transaction_id) }));
  }

  // primary related person for the "with X" header line
  const primaryRel = rels.find((r) => r.is_primary) ?? rels[0];
  const primaryRelName = primaryRel
    ? (primaryRel.related_person_id ? relNames.get(primaryRel.related_person_id) : primaryRel.related_name) ?? null
    : null;

  return (
    <main className="min-h-screen bg-mulberry-radial">
      <DashHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-medium text-pearl">Contacts</h1>
            <p className="mt-1 text-sm text-dusty">
              One record per person ... their details, their transactions, and their documents, together.
            </p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-dusty/20 px-3 py-1 text-[11px] uppercase tracking-wider text-dusty/80 sm:inline">
            {list.length} {list.length === 1 ? "contact" : "contacts"}
          </span>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-[326px_minmax(0,1fr)]">
          {/* ---------- LEFT: list ---------- */}
          <aside className="rounded-xl2 border border-dusty/15 bg-plum/40 p-3">
            <form action="/dashboard/contacts" method="get" className="p-1">
              <label className="relative block">
                <span className="sr-only">Search contacts</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder='Search · try "Carter"'
                  className="w-full rounded-xl border border-dusty/20 bg-plum/60 px-4 py-2.5 text-sm text-pearl placeholder:text-dusty/60 focus:border-auroraMauve/50 focus:outline-none"
                />
              </label>
            </form>

            <div className="mt-1 max-h-[70vh] overflow-y-auto">
              {list.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-dusty">
                  {q ? "No contacts match that search." : "No contacts yet."}
                </p>
              ) : (
                <ContactList list={list} selectedId={selectedId} q={q} />
              )}
            </div>
          </aside>

          {/* ---------- RIGHT: card ---------- */}
          <section className="rounded-xl2 border border-dusty/15 bg-plum/40 p-6 sm:p-8">
            {!person ? (
              <div className="flex h-full min-h-[300px] items-center justify-center text-center text-dusty">
                Select a contact to open their card.
              </div>
            ) : (
              <>
                {/* header */}
                <p className="text-sm text-dusty">
                  <Link href="/dashboard/contacts" className="hover:text-pearl">All contacts</Link>
                  <span className="px-1.5 text-dusty/50">/</span>
                  {typeLabel(person.type)}
                  <span className="px-1.5 text-dusty/50">/</span>
                  <span className="text-pearl/90">{lastFirst(person)}</span>
                </p>

                <div className="mt-4 flex items-start gap-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-wine/50 font-serif text-lg text-pearl ring-2 ring-gold/70 ring-offset-2 ring-offset-plum">
                    {initials(person)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-3xl font-medium text-pearl">{fullName(person)}</h2>
                    <p className="mt-1 text-sm text-dusty">
                      {typeLabel(person.type)}
                      {primaryRelName && (
                        <>
                          {" · with "}
                          <span className="text-auroraMauve">{primaryRelName}</span>
                          {primaryRel?.relation && RELATION_LABEL[primaryRel.relation] ? ` (${RELATION_LABEL[primaryRel.relation].toLowerCase()})` : ""}
                        </>
                      )}
                    </p>
                    {/* contact actions (these work today) */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {telHref(person.phone) && (
                        <a href={`tel:${telHref(person.phone)}`} className="rounded-lg border border-dusty/20 bg-plum/50 px-3.5 py-2 text-sm text-pearl transition-colors hover:border-auroraMauve/50">
                          Call
                        </a>
                      )}
                      {telHref(person.phone) && (
                        <a href={`sms:${telHref(person.phone)}`} className="rounded-lg border border-dusty/20 bg-plum/50 px-3.5 py-2 text-sm text-pearl transition-colors hover:border-auroraMauve/50">
                          Text
                        </a>
                      )}
                      {person.email && (
                        <a href={`mailto:${person.email}`} className="rounded-lg border border-dusty/20 bg-plum/50 px-3.5 py-2 text-sm text-pearl transition-colors hover:border-auroraMauve/50">
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* two-column body */}
                <div className="mt-7 grid gap-5 lg:grid-cols-2">
                  {/* left column: who they are */}
                  <div className="space-y-5">
                    <Box label="Contact info">
                      <Field label="Phone" value={formatPhone(person.phone)} />
                      <Field label="Email" value={person.email} />
                    </Box>

                    <Box label="Personal">
                      <Field label="Birthday" value={formatBirthday(person.birthday)} />
                      <Field label="Marital status" value={person.marital_status ? MARITAL_LABEL[person.marital_status] ?? person.marital_status : null} />
                    </Box>

                    <Box label="Referral">
                      <Field label="Referred by" value={referredBy ? fullName(referredBy) : null} href={referredBy ? `/dashboard/contacts?id=${referredBy.id}` : undefined} />
                      <Field label="Lead source" value={person.lead_source} />
                      {theyReferred.length > 0 && (
                        <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 py-1.5">
                          <span className="text-sm text-dusty">They referred</span>
                          <span className="flex flex-wrap gap-x-2 text-sm text-pearl">
                            {theyReferred.map((t, i) => (
                              <Link key={t.id} href={`/dashboard/contacts?id=${t.id}`} className="text-auroraMauve hover:text-pearl">
                                {fullName(t)}{i < theyReferred.length - 1 ? "," : ""}
                              </Link>
                            ))}
                          </span>
                        </div>
                      )}
                    </Box>

                    {rels.length > 0 && (
                      <Box label={`Relationships (${rels.length})`}>
                        {rels.map((r) => {
                          const nm = r.related_person_id ? relNames.get(r.related_person_id) : r.related_name;
                          return (
                            <Field
                              key={r.id}
                              label={RELATION_LABEL[r.relation] ?? "Related"}
                              value={nm ?? null}
                              href={r.related_person_id ? `/dashboard/contacts?id=${r.related_person_id}` : undefined}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </div>

                  {/* right column: what we do with them */}
                  <div className="space-y-5">
                    <Box label="Transactions">
                      {deals.length === 0 ? (
                        <p className="py-1 text-sm text-dusty">No transactions yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {deals.map((d) => (
                            <li key={d.transaction_id} className="flex gap-3">
                              <div className="grid h-[72px] w-24 shrink-0 place-items-center rounded-lg border border-dusty/15 bg-bruised/60 text-dusty/60">
                                <HouseIcon />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-pearl">{d.txn?.address ?? "Property"}</p>
                                <p className="mt-0.5 text-sm text-dusty">
                                  {ROLE_LABEL[d.role] || typeLabel(person!.type)}
                                  {d.txn?.status ? ` · ${d.txn.status}` : ""}
                                </p>
                                <p className="mt-0.5 text-sm text-dusty">
                                  {[money(d.txn?.price), closeDate(d.txn?.target_close_date ?? null) ? `Closes ${closeDate(d.txn?.target_close_date ?? null)}` : null]
                                    .filter(Boolean)
                                    .join(" · ")}
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
                  </div>
                </div>

                <p className="mt-7 text-center text-xs text-dusty/60">
                  Read-only for now. Editing, documents, reviews, and notes are coming in the next stages.
                </p>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------- pieces ------------------------------- */

function ContactList({ list, selectedId, q }: { list: ListRow[]; selectedId?: string; q: string }) {
  const out: JSX.Element[] = [];
  let letter = "";
  for (const p of list) {
    const first = (p.sort_key ?? lastFirst(p)).slice(0, 1).toUpperCase() || "#";
    if (first !== letter) {
      letter = first;
      out.push(
        <div key={`h-${letter}`} className="sticky top-0 bg-plum/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-dusty/70 backdrop-blur">
          {letter}
        </div>
      );
    }
    const active = p.id === selectedId;
    const href = `/dashboard/contacts?id=${p.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
    out.push(
      <Link
        key={p.id}
        href={href}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
          active ? "bg-bruised/70" : "hover:bg-bruised/40"
        }`}
      >
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-wine/45 text-xs font-semibold text-pearl ${
            active ? "ring-2 ring-gold/80 ring-offset-2 ring-offset-plum" : ""
          }`}
        >
          {initials(p)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium text-pearl">{lastFirst(p)}</span>
          <span className="block truncate text-xs text-dusty">{typeLabel(p.type)}</span>
        </span>
      </Link>
    );
  }
  return <div className="space-y-0.5">{out}</div>;
}

function Box({ label, soon, children }: { label: string; soon?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-dusty/15 bg-bruised/40 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-dusty/80">{label}</h3>
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

function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-7 w-7">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
