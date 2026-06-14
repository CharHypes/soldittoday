import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Team from "@/components/Team";

export const metadata: Metadata = {
  title: "Our Team | SOLD IT TODAY — Southeast Michigan Real Estate",
  description:
    "Meet the SOLD IT TODAY team — a growing Southeast Michigan real estate group led by founder Charlotte Hypes, focused on clear guidance, honest education, and strong negotiation for buyers and sellers across Metro Detroit.",
};

export default function TeamPage() {
  return (
    <PageShell
      eyebrow="Our Team"
      title="The team behind SOLD IT TODAY"
      description="A growing Southeast Michigan real estate team built around clear guidance, honest education, strong negotiation, and deep local knowledge. Led by founder Charlotte Hypes."
    >
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="aurora-bloom opacity-50" />
        <div className="grain-soft" />
        <Team bare />
      </section>
    </PageShell>
  );
}
