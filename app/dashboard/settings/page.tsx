import type { Metadata } from "next";
import AgentHubHeader from "@/components/dash/AgentHubHeader";

export const metadata: Metadata = {
  title: "Settings | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const AREAS: { title: string; body: string }[] = [
  { title: "Branding", body: "Upload your logo (auto-fit, never cropped) and set your brand look." },
  { title: "Appearance", body: "Theme and typeface, per person. Mulberry Noir, Blush, Amethyst, Harbor." },
  { title: "Team & access", body: "Add agents and assistants, each with their own login and scoped access." },
  { title: "Integrations", body: "Zapier, MLS/IDX, email, texting and calling, calendar." },
  { title: "Templates", body: "Saved email and text snippets for fast, on-brand outreach." },
  { title: "Security", body: "Two-factor, document retention, and an access log for sensitive files." },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-mulberry-radial">
      <AgentHubHeader />
      <div className="mx-auto max-w-6xl px-6 py-9">
        <h1 className="font-serif text-3xl font-medium text-pearl">Settings</h1>
        <p className="mt-1 text-sm text-dusty">Make it yours ... branding, appearance, integrations, and who has access.</p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
