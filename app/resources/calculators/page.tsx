import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Home Buying Calculators | SOLD IT TODAY",
  description:
    "Free Southeast Michigan home-buying calculators from SOLD IT TODAY: estimate your monthly mortgage payment, how much house you can afford, and whether to rent or buy.",
};

const CALCS = [
  {
    href: "/resources/mortgage-calculator",
    title: "Mortgage payment",
    blurb: "Your full monthly payment ... principal, interest, taxes, insurance, and PMI.",
    icon: "🧮",
  },
  {
    href: "/resources/affordability-calculator",
    title: "How much can I afford?",
    blurb: "Your comfortable price range from income, debts, and down payment.",
    icon: "🏠",
  },
  {
    href: "/resources/rent-vs-buy-calculator",
    title: "Rent vs. buy",
    blurb: "The year buying pulls ahead of renting ... for how long you'll stay.",
    icon: "⚖️",
  },
];

export default function CalculatorsHubPage() {
  return (
    <PageShell
      eyebrow="Resources"
      title="Home-buying calculators"
      description="Run the numbers before you fall in love with a listing. Quick, private, and free ... no sign-up."
    >
      <section className="relative bg-plum py-16 md:py-24">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CALCS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="aurora-ring group flex flex-col rounded-xl2 border border-dusty/12 bg-bruised/40 p-6 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-auroraMauve/40 bg-plum/40 text-2xl">
                  {c.icon}
                </span>
                <h2 className="mt-4 text-lg font-semibold text-pearl">{c.title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-dusty">{c.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-auroraMauve">
                  Open calculator
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
