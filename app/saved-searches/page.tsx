import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SavedSearchesList from "@/components/search/SavedSearchesList";

/**
 * Saved Searches. Per-device (localStorage) until real client accounts ship,
 * then account-backed + cross-device. Noindexed (personal content).
 */
export const metadata: Metadata = {
  title: "Saved Searches | SOLD IT TODAY",
  description: "Your saved home searches on SOLD IT TODAY.",
  robots: { index: false, follow: true },
};

export default function SavedSearchesPage() {
  return (
    <PageShell
      eyebrow="Saved Searches"
      title="Your saved searches"
      description="Jump back into any search you've saved. Kept on this device now ... sign in later to keep them across devices."
    >
      <section className="relative bg-plum py-14 md:py-20">
        <div className="container-lux">
          <SavedSearchesList />
        </div>
      </section>
    </PageShell>
  );
}
