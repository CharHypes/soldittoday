import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mulberry Aurora palette. Each token resolves to a CSS variable
        // defined per theme in globals.css, so `bg-plum` means "page
        // background" in both themes rather than a fixed hex.
        plum: "rgb(var(--plum) / <alpha-value>)", // Page background
        bruised: "rgb(var(--bruised) / <alpha-value>)", // Elevated surface
        truffle: "rgb(var(--truffle) / <alpha-value>)",
        smoked: "rgb(var(--smoked) / <alpha-value>)",
        pearl: "rgb(var(--pearl) / <alpha-value>)", // Primary text
        dusty: "rgb(var(--dusty) / <alpha-value>)", // Muted text / hairlines
        wine: "rgb(var(--wine) / <alpha-value>)",
        ivory: "rgb(var(--ivory) / <alpha-value>)",
        champagne: "rgb(var(--champagne) / <alpha-value>)",
        stone: "rgb(var(--stone) / <alpha-value>)",
        // Aurora accent — a softly lifted mulberry/mauve used only for glow,
        // never a flat fill. Kept muted on purpose (no neon).
        aurora: "rgb(var(--aurora) / <alpha-value>)",
        auroraMauve: "rgb(var(--aurora-mauve) / <alpha-value>)",
        // Always-dark text for the cream band that stays light in both themes.
        ink: "rgb(var(--ink) / <alpha-value>)",
        inkAccent: "rgb(var(--ink-accent) / <alpha-value>)",
        bodySoft: "rgb(var(--body-soft) / <alpha-value>)",
        // Rose gold sampled from the logo — accents and rims, not body text.
        gold: "rgb(var(--gold) / <alpha-value>)",
        // Readable gold for text; --gold alone is too pale on light backgrounds.
        goldInk: "rgb(var(--gold-ink) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      /*
       * Tailwind's opacity scale has no 12, 18 or 28, so slash modifiers using
       * them were never generated — 37 borders across the site silently fell
       * back to the preflight default grey instead of the brand colour. Adding
       * the steps fixes them all without touching the markup.
       */
      opacity: {
        12: "0.12",
        18: "0.18",
        28: "0.28",
      },
      letterSpacing: {
        tightest: "-0.05em",
        widest: "0.25em",
      },
      maxWidth: {
        container: "1280px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 24px 60px -24px rgb(0 0 0 / var(--shadow-strength))",
        card: "0 18px 50px -28px rgb(0 0 0 / calc(var(--shadow-strength) + 0.1))",
        glow: "0 0 0 1px rgb(var(--ring-accent) / 0.22)",
        // Mulberry Aurora — soft, backlit luxury glow (no neon). The 1px ring
        // carries the metal: mauve on dark, rose gold on light.
        aurora:
          "0 0 0 1px rgb(var(--ring-accent) / 0.32), 0 10px 40px -12px rgb(var(--aurora) / 0.55), 0 0 60px -18px rgb(var(--aurora) / 0.45)",
        "aurora-strong":
          "0 0 0 1px rgb(var(--ring-accent) / 0.5), 0 14px 50px -10px rgb(var(--aurora) / 0.7), 0 0 80px -16px rgb(var(--aurora-mauve) / 0.55)",
      },
      backgroundImage: {
        // Theme-aware: stops resolve through the palette variables, so these
        // read as deep mulberry on dark and a soft blush wash on light.
        "mulberry-radial":
          "radial-gradient(120% 120% at 50% 0%, rgb(var(--grad-1)) 0%, rgb(var(--grad-2)) 38%, rgb(var(--grad-3)) 100%)",
        "mulberry-soft":
          "linear-gradient(135deg, rgb(var(--grad-2)) 0%, rgb(var(--grad-1)) 50%, rgb(var(--grad-3)) 100%)",
        "wine-sheen":
          "linear-gradient(135deg, rgb(var(--wine)) 0%, rgb(var(--sheen-mid)) 50%, rgb(var(--wine)) 100%)",
        // Aurora bloom — abstract soft light used behind sections/cards.
        "aurora-bloom":
          "radial-gradient(60% 80% at 20% 10%, rgb(var(--bloom-1)) 0%, transparent 60%), radial-gradient(50% 70% at 85% 30%, rgb(var(--bloom-2)) 0%, transparent 65%), radial-gradient(70% 90% at 50% 110%, rgb(var(--bloom-3)) 0%, transparent 70%)",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // Slow, breathing aurora glow for ambient blooms.
        "aurora-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(3%, -4%, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 32s linear infinite",
        "aurora-pulse": "aurora-pulse 9s ease-in-out infinite",
        "aurora-drift": "aurora-drift 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
