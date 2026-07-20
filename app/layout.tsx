import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOLD IT TODAY | Charlotte Hypes — Southeast Michigan Real Estate",
  description:
    "Real estate guidance with clarity, strategy, and results. Charlotte Hypes and SOLD IT TODAY serve Southeast Michigan and Metro Detroit buyers and sellers with experience, honesty, and strong local market knowledge.",
  keywords: [
    "Southeast Michigan real estate",
    "Metro Detroit realtor",
    "Charlotte Hypes",
    "SOLD IT TODAY",
    "Downriver homes",
    "Remerica United Realty",
  ],
  openGraph: {
    title: "SOLD IT TODAY | Charlotte Hypes — Southeast Michigan Real Estate",
    description:
      "Luxury feel, practical guidance, real results. Serving Southeast Michigan buyers and sellers.",
    type: "website",
  },
};

/*
 * Resolves the theme before first paint: a saved choice wins, otherwise the
 * visitor's OS preference. Must stay a blocking inline script — deferring it
 * would let the wrong theme paint first and flash.
 */
const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('sit-theme');
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
