import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SavedHomes from "@/components/search/SavedHomes";

/**
 * Saved Homes. Favorites are per-device (localStorage) until real client accounts
 * ship with the CRM ... then this becomes account-backed and cross-device.
 * Noindexed (personal, per-visitor content).
 */
export const metadata: Metadata = {
  title: "Saved Homes | SOLD IT TODAY",
  description: "Your saved homes on SOLD IT TODAY.",
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <PageShell
      eyebrow="Saved Homes"
      title="Your saved homes"
      description="The homes you've hearted, in one place. Save on this device now ... sign in later to keep them across devices."
    >
      <section className="relative bg-plum py-14 md:py-20">
        <div className="container-lux">
          <SavedHomes />
        </div>
      </section>
    </PageShell>
  );
}
