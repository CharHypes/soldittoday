import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Team from "@/components/Team";
import MeetCharlotte from "@/components/MeetCharlotte";
import Services from "@/components/Services";
import Listings from "@/components/Listings";
import WhyWorkWithUs from "@/components/WhyWorkWithUs";
import Market from "@/components/Market";
import Testimonials from "@/components/Testimonials";
import PartnersTeaser from "@/components/PartnersTeaser";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        {/* Do first: show homes, then how we help, then who we are. */}
        <Listings />
        <Services />
        <About />
        <WhyWorkWithUs />
        <Market />
        <Testimonials />
        {/* The people, near the bottom */}
        <MeetCharlotte />
        <Team />
        <PartnersTeaser />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
