import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import { createPerson } from "@/app/dashboard/contacts/actions";
import { TYPE_LABEL } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "New Contact | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const inp =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const lbl = "block text-sm text-dusty";

export default function NewContact() {
  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <a href="/dashboard/contacts" className="text-sm text-dusty hover:text-pearl">&larr; Back to contacts</a>
        <h1 className="mt-3 font-serif text-3xl font-medium text-pearl">New Contact</h1>
        <p className="mt-1 text-sm text-dusty">
          Start a contact card. You can add their transactions, documents, and notes right after.
        </p>

        <form action={createPerson} className="mt-8 space-y-5">
          <div className="rounded-xl2 border border-dusty/15 bg-plum/40 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={lbl}>First name<input name="first_name" className={`mt-1.5 ${inp}`} autoFocus /></label>
              <label className={lbl}>Last name<input name="last_name" className={`mt-1.5 ${inp}`} /></label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={lbl}>
                Type
                <select name="type" defaultValue="lead" className={`mt-1.5 ${inp}`}>
                  {Object.entries(TYPE_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
              <label className={lbl}>Company (optional)<input name="company" placeholder="e.g. a title company" className={`mt-1.5 ${inp}`} /></label>
            </div>
            <p className="mt-3 text-xs text-dusty/70">
              For a couple, add each person as their own contact and link them as spouses on the card.
            </p>
          </div>

          <div className="rounded-xl2 border border-dusty/15 bg-plum/40 p-5">
            <p className="text-sm font-semibold text-pearl">Contact info</p>
            <div className="mt-4 space-y-4">
              <label className={lbl}>Phone<input name="phone" placeholder="(734) 555-1234" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Email<input name="email" type="email" placeholder="name@email.com" className={`mt-1.5 ${inp}`} /></label>
              <label className={lbl}>Address<input name="address" placeholder="123 Main St, City, MI 48000" className={`mt-1.5 ${inp}`} /></label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-mauve">Create contact</button>
            <a href="/dashboard/contacts" className="rounded-lg px-3 py-2 text-sm text-dusty hover:text-pearl">Cancel</a>
          </div>
        </form>
      </div>
    </main>
  );
}
