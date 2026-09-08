import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Services from "@/components/Services";
import Listings from "@/components/Listings";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Homepage ... intentionally focused on search, trust, current listings, and
 * conversion. Deeper content lives on its dedicated pages:
 *   - fuller company/team + "why us" -> /why-sold-it-today, /team, /meet-charlotte (About nav)
 *   - detailed services -> /buyers, /sellers, /first-time-buyers, /investment, /relocation, /fsbo (Services nav)
 *   - communities / area content -> /communities, /neighborhood-guides (Communities nav)
 * The homepage keeps only concise teasers (Services "What we do", About intro).
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        {/* Show homes, then how we help, then a concise who-we-are teaser. */}
        <Listings />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
