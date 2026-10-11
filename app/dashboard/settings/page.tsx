import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";
import DesignPicker from "@/components/dash/DesignPicker";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/context";
import { uploadOrgLogo, removeOrgLogo, updateBranding, updateAvatarStyle } from "@/app/dashboard/settings/actions";
import { avatarBg } from "@/lib/avatarColor";

export const metadata: Metadata = {
  title: "Settings | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const AREAS: { title: string; body: string }[] = [
  { title: "Appearance", body: "Theme and typeface, per person. Mulberry Noir, Blush, Amethyst, Harbor." },
  { title: "Team & access", body: "Add agents and assistants, each with their own login and scoped access." },
  { title: "Integrations", body: "Zapier, MLS/IDX, email, texting and calling, calendar." },
  { title: "Templates", body: "Saved email and text snippets for fast, on-brand outreach." },
  { title: "Security", body: "Two-factor, document retention, and an access log for sensitive files." },
];

const inp = "w-full rounded-xl border border-dusty/25 bg-plum/60 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60";
const DEFAULT_LOGO = "/assets/logos/optimized/sold-it-today-400w.png";

export default async function SettingsPage({ searchParams }: { searchParams: { saved?: string } }) {
  const supabase = createSupabaseServer();
  const { orgId, role } = await getOrgContext(supabase);
  let logoUrl: string | null = null;
  let brandName: string | null = null;
  let tagline: string | null = null;
  let avatarStyle = "colorful";
  if (orgId) {
    const { data: org } = await supabase.from("organizations").select("logo_url, brand_name, tagline, avatar_style").eq("id", orgId).maybeSingle();
    logoUrl = org?.logo_url ?? null;
    brandName = org?.brand_name ?? null;
    tagline = org?.tagline ?? null;
    avatarStyle = (org?.avatar_style as string) ?? "colorful";
  }
  const canEdit = role === "owner" || role === "admin";

  return (
    <main className="min-h-screen bg-agenthub">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <h1 className="font-serif text-3xl font-medium text-pearl">Settings</h1>
        <p className="mt-1 text-sm text-dusty">Make it yours ... branding, appearance, integrations, and who has access.</p>

        {searchParams?.saved && (
          <div className="mt-5 rounded-xl border border-green/30 bg-green/10 px-4 py-2.5 text-sm text-pearl">Saved.</div>
        )}

        {/* ---------------- Branding ---------------- */}
        <section className="mt-7 rounded-xl2 border border-dusty/15 bg-bruised/40 p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-serif text-lg text-pearl">Branding</h2>
            <span className="rounded-full border border-green/30 bg-green/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-green">Live</span>
          </div>
          <p className="mb-4 text-sm text-dusty">
            Upload your logo. We fit the whole thing (never cropped) into your Agent Hub top bar. PNG or SVG, transparent is ideal.
          </p>

          {/* preview on the real dark bar + on a light backing */}
          <div className="flex flex-wrap gap-3">
            {[
              { cap: "Your top bar", bg: "rgb(26,21,24)", capColor: "text-dusty/70" },
              { cap: "On a light surface", bg: "#f7edf2", capColor: "text-[#9a8b93]" },
            ].map((p) => (
              <div key={p.cap} className="min-w-[220px] flex-1 overflow-hidden rounded-xl border border-dusty/15">
                <div className={`border-b border-dusty/10 px-3 py-1.5 text-[10px] uppercase tracking-wider ${p.capColor}`}>{p.cap}</div>
                <div className="flex h-16 items-center px-4" style={{ background: p.bg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl ?? DEFAULT_LOGO} alt="Logo preview" className="h-7 w-auto max-w-[180px] object-contain" />
                </div>
              </div>
            ))}
          </div>

          {canEdit ? (
            <>
              <form action={uploadOrgLogo} className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  required
                  className="text-sm text-dusty file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-plum/60 file:px-3 file:py-2 file:text-pearl hover:file:bg-plum/80"
                />
                <button type="submit" className="btn-mauve text-sm">Upload logo</button>
              </form>
              {logoUrl && (
                <form action={removeOrgLogo} className="mt-2">
                  <button type="submit" className="text-xs text-dusty transition-colors hover:text-pearl">
                    Remove logo (go back to the Sold It Today wordmark)
                  </button>
                </form>
              )}

              <form action={updateBranding} className="mt-6 grid max-w-xl gap-3 sm:grid-cols-2">
                <label className="block text-sm text-dusty">
                  Brand name
                  <input name="brand_name" defaultValue={brandName ?? ""} placeholder="Sold It Today" className={`mt-1.5 ${inp}`} />
                </label>
                <label className="block text-sm text-dusty">
                  Tagline
                  <input name="tagline" defaultValue={tagline ?? ""} placeholder="Making Realty Dreams a Reality" className={`mt-1.5 ${inp}`} />
                </label>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-mauve text-sm">Save brand</button>
                </div>
              </form>

              <div className="mt-7 border-t border-dusty/10 pt-5">
                <h3 className="text-sm font-semibold text-pearl">Contact avatars</h3>
                <p className="mt-1 text-sm text-dusty">One solid mauve, or a fun rotation of muted colors (each contact keeps its own).</p>
                <div className="mt-3 flex -space-x-1.5">
                  {["AB", "KA", "MA", "LB", "PC", "TO"].map((ini, i) => {
                    const bg = avatarStyle === "colorful" ? avatarBg(`seed-${i}-${ini}`, "colorful") : null;
                    return (
                      <span
                        key={i}
                        className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold ring-2 ring-bruised ${bg ? "text-white" : "bg-mauve text-plum"}`}
                        style={bg ? { background: bg } : undefined}
                      >
                        {ini}
                      </span>
                    );
                  })}
                </div>
                <form action={updateAvatarStyle} className="mt-3 inline-flex rounded-xl border border-dusty/15 bg-plum/40 p-1">
                  <button name="avatar_style" value="colorful" className={`rounded-lg px-3 py-1.5 text-sm ${avatarStyle === "colorful" ? "bg-mauve font-semibold text-plum" : "text-dusty hover:text-pearl"}`}>Colorful</button>
                  <button name="avatar_style" value="solid" className={`rounded-lg px-3 py-1.5 text-sm ${avatarStyle === "solid" ? "bg-mauve font-semibold text-plum" : "text-dusty hover:text-pearl"}`}>Solid</button>
                </form>
              </div>
            </>
          ) : (
            <p className="mt-4 text-xs text-dusty/70">Only an owner or admin can change branding.</p>
          )}
        </section>

        {/* ---------------- Workspace design ---------------- */}
        <section className="mt-6 rounded-xl2 border border-dusty/15 bg-bruised/40 p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-serif text-lg text-pearl">Workspace design</h2>
            <span className="rounded-full border border-green/30 bg-green/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-green">Live</span>
          </div>
          <p className="mb-4 text-sm text-dusty">
            Choose how your Agent Hub looks. Sold It Today uses Mulberry Noir; switch to Neutral to preview the clean look we ship to other brokerages.
          </p>
          <DesignPicker />
        </section>

        {/* ---------------- Coming soon ---------------- */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <div key={a.title} className="rounded-xl2 border border-dusty/15 bg-bruised/40 p-5">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-serif text-lg text-pearl">{a.title}</h2>
                <span className="rounded-full border border-dusty/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-dusty/60">Coming soon</span>
              </div>
              <p className="text-sm text-dusty">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
