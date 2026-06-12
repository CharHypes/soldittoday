"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the app so Framer Motion automatically honors the user's
 * `prefers-reduced-motion` setting (transform animations are dropped for
 * those users) — without branching render output on a client-only hook,
 * which would otherwise cause SSR/CSR hydration mismatches.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
