import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mulberry Noir palette
        plum: "#1A1518", // Plum Charcoal
        bruised: "#2A1F25", // Bruised Plum
        truffle: "#25201F", // Truffle
        smoked: "#3A2E32", // Smoked Mauve
        pearl: "#F5E8E4", // Pearl Cream
        dusty: "#A89AA0", // Dusty Mauve
        wine: "#3D2530", // Wine Velvet
        ivory: "#FAF6F1", // Ivory Linen
        champagne: "#F4E9E4", // Champagne Blush
        stone: "#ECE0DC", // Stone Blush
        // Aurora accent — a softly lifted mulberry/mauve used only for glow,
        // never a flat fill. Kept muted on purpose (no neon).
        aurora: "#7A4A5E", // Soft mulberry
        auroraMauve: "#B89AA4", // Lifted dusty mauve
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
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
        soft: "0 24px 60px -24px rgba(0, 0, 0, 0.55)",
        card: "0 18px 50px -28px rgba(0, 0, 0, 0.65)",
        glow: "0 0 0 1px rgba(168, 154, 160, 0.18)",
        // Mulberry Aurora — soft, backlit luxury glow (no neon).
        aurora:
          "0 0 0 1px rgba(184, 154, 164, 0.22), 0 10px 40px -12px rgba(122, 74, 94, 0.55), 0 0 60px -18px rgba(122, 74, 94, 0.45)",
        "aurora-strong":
          "0 0 0 1px rgba(245, 232, 228, 0.28), 0 14px 50px -10px rgba(122, 74, 94, 0.7), 0 0 80px -16px rgba(184, 154, 164, 0.55)",
      },
      backgroundImage: {
        "mulberry-radial":
          "radial-gradient(120% 120% at 50% 0%, #3D2530 0%, #2A1F25 38%, #1A1518 100%)",
        "mulberry-soft":
          "linear-gradient(135deg, #2A1F25 0%, #3D2530 50%, #1A1518 100%)",
        "wine-sheen":
          "linear-gradient(135deg, #3D2530 0%, #5a3343 50%, #3D2530 100%)",
        // Aurora bloom — abstract soft light used behind sections/cards.
        "aurora-bloom":
          "radial-gradient(60% 80% at 20% 10%, rgba(122, 74, 94, 0.35) 0%, transparent 60%), radial-gradient(50% 70% at 85% 30%, rgba(184, 154, 164, 0.22) 0%, transparent 65%), radial-gradient(70% 90% at 50% 110%, rgba(61, 37, 48, 0.5) 0%, transparent 70%)",
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
