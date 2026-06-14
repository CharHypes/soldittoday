import type { Metadata } from "next";
import PageShell, { ComingSoon } from "@/components/PageShell";

export const metadata: Metadata = {
  title:
    "Neighborhood Guides | SOLD IT TODAY — Southeast Michigan Real Estate",
  description:
    "In-depth neighborhood guides for Southeast Michigan and Metro Detroit — helping buyers and sellers understand local communities, lifestyle, schools, and market conditions before they decide.",
};

export default function NeighborhoodGuidesPage() {
  return (
    <PageShell
      eyebrow="Neighborhood Guides"
      title="Get to know Southeast Michigan, block by block"
      description="Honest, in-depth guides to the communities we serve — so you can understand an area fully before making a move."
    >
      <ComingSoon
        note="Our neighborhood guides are being written now. Each will give buyers and sellers a clear, honest picture of a community — not a sales pitch."
        bullets={[
          "Lifestyle, amenities, and local character",
          "Schools, commute, and what daily life looks like",
          "Market conditions, pricing trends, and timing",
          "Who each neighborhood tends to suit best",
        ]}
      />
    </PageShell>
  );
}
