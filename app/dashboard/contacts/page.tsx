import type { Metadata } from "next";
import Link from "next/link";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import ContactCard from "@/components/dash/ContactCard";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fullName, lastFirst, initials, typeLabel, RELATION_LABEL, type Person } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Contacts | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type ListRow = Pick<Person, "id" | "first_name" | "last_name" | "company" | "display_name" | "type" | "sort_key">;
type Txn = { id: string; address: string; status: string | null; price: number | null; target_close_date: string | null };

export default async function ContactsPage({ searchParams }: { searchParams: { id?: string; q?: string } }) {
  const supabase = createSupabaseServer();
  const q = (searchParams.q ?? "").trim();

  let listQuery = supabase
    .from("people")
    .select("id, first_name, last_name, company, display_name, type, sort_key")
    .order("sort_key", { ascending: true });
  if (q) {
    const like = `%${q}%`;
    listQuery = listQuery.or(`display_name.ilike.${like},last_name.ilike.${like},first_name.ilike.${like},company.ilike.${like}`);
  }
  const { data: listData } = await listQuery;
  const list = (listData ?? []) as ListRow[];

  // "with X (spouse)" third line for the list rows
  const withLine = new Map<string, string>();
  if (list.length) {
    const ids = list.map((p) => p.id);
    const { data: primaryRels } = await supabase
      .from("person_relationships")
      .select("person_id, relation, related_name, related_person_id")
      .in("person_id", ids)
      .eq("is_primary", true);
    const relIds = (primaryRels ?? []).map((r: any) => r.related_person_id).filter(Boolean);
    const names = new Map<string, string>();
    if (relIds.length) {
      const { data } = await supabase.from("people").select("id, first_name, last_name, company, display_name").in("id", relIds);
      (data ?? []).forEach((pp: any) => names.set(pp.id, fullName(pp)));
    }
    (primaryRels ?? []).forEach((r: any) => {
      const nm = r.related_person_id ? names.get(r.related_person_id) : r.related_name;
      if (nm) withLine.set(r.person_id, `with ${nm} (${(RELATION_LABEL[r.relation] ?? "related").toLowerCase()})`);
    });
  }

  const selectedId = searchParams.id && list.some((p) => p.id === searchParams.id) ? searchParams.id : list[0]?.id;

  // ---- selected detail ----
  let person: Person | null = null;
  let referredBy: { id: string; name: string } | null = null;
  let theyReferred: { id: string; name: string }[] = [];
  let rels: { id: string; relation: string; name: string | null; related_person_id: string | null }[] = [];
  let primaryRelName: string | null = null;
  let primaryRelLabel: string | null = null;
  let deals: { transaction_id: string; role: string; txn?: Txn | null }[] = [];

  if (selectedId) {
    const { data: p } = await supabase.from("people").select("*").eq("id", selectedId).maybeSingle();
    person = (p as Person) ?? null;

    if (person?.referred_by_person_id) {
      const { data } = await supabase
        .from("people")
        .select("id, first_name, last_name, company, display_name")
        .eq("id", person.referred_by_person_id)
        .maybeSingle();
      if (data) referredBy = { id: (data as any).id, name: fullName(data as any) };
    }

    const { data: tr } = await supabase
      .from("people")
      .select("id, first_name, last_name, company, display_name")
      .eq("referred_by_person_id", selectedId);
    theyReferred = (tr ?? []).map((t: any) => ({ id: t.id, name: fullName(t) }));

    const { data: r } = await supabase
      .from("person_relationships")
      .select("id, relation, related_name, related_person_id, is_primary")
      .eq("person_id", selectedId)
      .order("is_primary", { ascending: false });
    const rrows = r ?? [];
    const rIds = rrows.map((x: any) => x.related_person_id).filter(Boolean);
    const rNames = new Map<string, string>();
    if (rIds.length) {
      const { data } = await supabase.from("people").select("id, first_name, last_name, company, display_name").in("id", rIds);
      (data ?? []).forEach((pp: any) => rNames.set(pp.id, fullName(pp)));
    }
    rels = rrows.map((x: any) => ({
      id: x.id,
      relation: x.relation,
      related_person_id: x.related_person_id,
      name: x.related_person_id ? rNames.get(x.related_person_id) ?? null : x.related_name ?? null,
    }));
    const primary = rrows.find((x: any) => x.is_primary) ?? rrows[0];
    if (primary) {
      primaryRelName = primary.related_person_id ? rNames.get(primary.related_person_id) ?? null : primary.related_name ?? null;
      primaryRelLabel = RELATION_LABEL[primary.relation] ?? null;
    }

    const { data: tp } = await supabase.from("transaction_people").select("transaction_id, role").eq("person_id", selectedId);
    const txnIds = (tp ?? []).map((x: any) => x.transaction_id);
    let txns: Txn[] = [];
    if (txnIds.length) {
      const { data } = await supabase.from("transactions").select("id, address, status, price, target_close_date").in("id", txnIds);
      txns = (data ?? []) as Txn[];
    }
    deals = (tp ?? []).map((link: any) => ({ ...link, txn: txns.find((t) => t.id === link.transaction_id) ?? null }));
  }

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
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
          {/* LEFT list */}
          <aside className="h-fit rounded-xl2 border border-dusty/15 bg-bruised p-3">
            <form action="/dashboard/contacts" method="get" className="p-1">
              <input
                name="q"
                defaultValue={q}
                placeholder='Search · try "Arnout"'
                className="w-full rounded-xl border border-dusty/20 bg-plum/60 px-4 py-2.5 text-sm text-pearl placeholder:text-dusty/60 focus:border-auroraMauve/50 focus:outline-none"
              />
            </form>
            <div className="mt-1 max-h-[72vh] overflow-y-auto">
              {list.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-dusty">{q ? "No contacts match that search." : "No contacts yet."}</p>
              ) : (
                <ContactList list={list} selectedId={selectedId} q={q} withLine={withLine} />
              )}
            </div>
          </aside>

          {/* RIGHT card */}
          {person ? (
            <ContactCard
              person={person}
              referredBy={referredBy}
              theyReferred={theyReferred}
              rels={rels}
              primaryRelName={primaryRelName}
              primaryRelLabel={primaryRelLabel}
              deals={deals}
            />
          ) : (
            <section className="grid min-h-[300px] place-items-center rounded-xl2 border border-dusty/15 bg-bruised text-dusty">
              Select a contact to open their card.
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function ContactList({
  list, selectedId, q, withLine,
}: { list: ListRow[]; selectedId?: string; q: string; withLine: Map<string, string> }) {
  const out: JSX.Element[] = [];
  let letter = "";
  for (const p of list) {
    const first = (p.sort_key ?? lastFirst(p)).slice(0, 1).toUpperCase() || "#";
    if (first !== letter) {
      letter = first;
      out.push(
        <div key={`h-${letter}`} className="sticky top-0 bg-bruised/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-auroraMauve backdrop-blur">
          {letter}
        </div>
      );
    }
    const active = p.id === selectedId;
    const href = `/dashboard/contacts?id=${p.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
    const w = withLine.get(p.id);
    out.push(
      <Link
        key={p.id}
        href={href}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${active ? "bg-raise" : "hover:bg-raise/50"}`}
      >
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-auroraMauve text-xs font-semibold text-plum ${
            active ? "ring-2 ring-gold ring-offset-2 ring-offset-plum" : ""
          }`}
        >
          {initials(p)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium text-pearl">{lastFirst(p)}</span>
          <span className="block truncate text-xs text-dusty">{typeLabel(p.type)}</span>
          {w && <span className="block truncate text-xs text-auroraMauve">{w}</span>}
        </span>
      </Link>
    );
  }
  return <div className="space-y-0.5">{out}</div>;
}
