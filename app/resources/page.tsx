import type { Metadata } from "next";
import PageShell, { ComingSoon } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Resources & Blog | SOLD IT TODAY — Southeast Michigan Real Estate",
  description:
    "Educational real estate resources from SOLD IT TODAY: guidance on down payment assistance, credit improvement, negotiation strategy, and the buying and selling process across Southeast Michigan.",
};

export default function ResourcesPage() {
  return (
    <PageShell
      eyebrow="Resources & Blog"
      title="Real estate, explained clearly"
      description="Practical, honest education to help Southeast Michigan buyers and sellers understand their options and make confident decisions."
    >
      <ComingSoon
        note="Our resource library and blog are in development. The goal is simple: help you understand the process before you make a decision."
        bullets={[
          "Down payment assistance programs and how they work",
          "Credit improvement guidance for future buyers",
          "Negotiation strategy and what really moves a deal",
          "Step-by-step buying and selling walkthroughs",
          "Market updates and real estate strategy for the region",
        ]}
      />
    </PageShell>
  );
}
