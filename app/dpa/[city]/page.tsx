import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DpaLanding from "@/components/dpa/DpaLanding";
import { DPA_PROGRAMS, getDpaProgram } from "@/lib/dpaPrograms";

type Params = { city: string };

// Pre-render all six DPA city pages at build time.
export function generateStaticParams(): Params[] {
  return DPA_PROGRAMS.map((p) => ({ city: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const program = getDpaProgram(params.city);
  if (!program) return {};
  const title = `Down Payment Assistance in ${program.city}, MI | Sold It Today`;
  const url = `/dpa/${program.slug}`;
  return {
    title,
    description: program.metaDescription,
    alternates: { canonical: url },
    // Placeholder pages stay out of search until real figures are added.
    robots: program.comingSoon ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description: program.metaDescription,
      type: "website",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: program.metaDescription,
    },
  };
}

export default function DpaCityPage({ params }: { params: Params }) {
  const program = getDpaProgram(params.city);
  if (!program) notFound();
  return <DpaLanding program={program} />;
}
