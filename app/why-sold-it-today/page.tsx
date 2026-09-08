import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import WhyWorkWithUs from "@/components/WhyWorkWithUs";
import CrossLinks from "@/components/CrossLinks";
import { brandValues } from "@/lib/data";

export const metadata: Metadata = {
  title: "Why Sold It Today | SOLD IT TODAY",
  description:
    "Why buyers and sellers across Michigan choose Sold It Today: clear guidance, strong negotiation, creative problem-solving, and a measurable track record ... 20+ years and hundreds of closings.",
  alternates: { canonical: "https://www.soldittoday.com/why-sold-it-today" },
};

export default function WhySoldItTodayPage() {
  return (
    <PageShell
      eyebrow="Why Sold It Today"
      title="Guidance you feel, results you can measure"
      description="We lead with education instead of pressure, back it with 20+ years and hundreds of closings, and treat every decision as yours to make ... fully informed."
    >
      {/* Measurable track record (reused across the site). */}
      <WhyWorkWithUs />

      {/* What the team is built around ... our brand pillars. */}
      <section className="relative overflow-hidden bg-plum py-20 md:py-28">
        <div className="aurora-bloom opacity-60" />
        <div className="container-lux relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow text-auroraMauve">What we&rsquo;re built around</span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tightest text-pearl md:text-4xl">
              The standards behind every transaction
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl2 border border-dusty/12 bg-dusty/10 sm:grid-cols-2 lg:grid-cols-4">
            {brandValues.map((value, i) => (
              <div key={value.title} className="bg-plum/60 p-7 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tracking-widest text-auroraMauve/70">
                    0{i + 1}
                  </span>
                  <span className="h-px flex-1 bg-dusty/15" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-pearl">{value.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="/#contact" className="btn-aurora group">
              Let&rsquo;s talk real estate
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </section>

      <CrossLinks />
    </PageShell>
  );
}
