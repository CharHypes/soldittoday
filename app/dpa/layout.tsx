import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "./dpa.css";

/*
 * Layout for the /dpa campaign landing pages. These pages use their own focused
 * conversion design (Fraunces + Manrope, dark palette), separate from the main
 * "Mulberry Aurora" site. Fonts load via next/font (no external CDN at runtime)
 * and are exposed as CSS variables consumed by dpa.css.
 *
 * This layout adds no site chrome (no main nav/footer) on purpose: campaign
 * landing pages stay distraction-free. Each page renders its own brand bar and
 * a compliant footer.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export default function DpaLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${manrope.variable} dpa-root`}>
      {children}
    </div>
  );
}
