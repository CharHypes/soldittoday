/**
 * Reusable encouragement for renters/first-time buyers who assume buying takes a
 * fortune. Cross-links to DPA + contact. Team voice. Drop on calculator and
 * buyer-facing pages.
 */
export default function FirstTimeBuyerCallout() {
  const points = [
    "As little as 3–3.5% down with FHA and first-time conventional loans",
    "Down payment assistance ... some Metro Detroit programs up to $25,000",
    "$0-down options for those who qualify (VA and USDA rural)",
    "First-time buyer programs + the Michigan First-Time Home Buyer Savings Account",
  ];
  return (
    <div className="aurora-ring rounded-xl2 border border-auroraMauve/25 bg-wine-sheen p-6 shadow-aurora md:p-8">
      <div className="max-w-3xl">
        <p className="eyebrow text-auroraMauve">First-time buyers</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tightest text-pearl">
          Think you need a fortune to buy? You probably don&rsquo;t.
        </h2>
        <p className="mt-3 leading-relaxed text-dusty">
          Most people overestimate the cash it takes to get into a home. There are real ways to buy with far less up
          front ... and helping you find the right one is what we do.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-pearl/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-auroraMauve" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/dpa" className="btn-aurora group">
            See down payment assistance
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
          </a>
          <a href="/#contact" className="btn-outline">Talk with our team</a>
        </div>
      </div>
    </div>
  );
}
