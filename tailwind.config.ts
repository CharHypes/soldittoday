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
      },
      backgroundImage: {
        "mulberry-radial":
          "radial-gradient(120% 120% at 50% 0%, #3D2530 0%, #2A1F25 38%, #1A1518 100%)",
        "mulberry-soft":
          "linear-gradient(135deg, #2A1F25 0%, #3D2530 50%, #1A1518 100%)",
        "wine-sheen":
          "linear-gradient(135deg, #3D2530 0%, #5a3343 50%, #3D2530 100%)",
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
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
