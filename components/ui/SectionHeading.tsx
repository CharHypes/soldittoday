import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

/**
 * Editorial section header: small eyebrow label, large headline, optional lede.
 * `light` flips the type colors for the inverted band — cream in dark mode,
 * deep mulberry in light mode. The ink tokens track whichever it is.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={[
        "max-w-2xl",
        isCenter ? "mx-auto text-center" : "",
      ].join(" ")}
    >
      <Reveal>
        <span className={light ? "eyebrow text-inkAccent" : "eyebrow"}>
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={[
            "mt-4 text-3xl font-semibold leading-[1.08] tracking-tightest sm:text-4xl md:text-5xl text-balance",
            light ? "text-ink" : "text-pearl",
          ].join(" ")}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={[
              "mt-5 text-base leading-relaxed md:text-lg",
              light ? "text-ink/75" : "text-dusty",
            ].join(" ")}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
