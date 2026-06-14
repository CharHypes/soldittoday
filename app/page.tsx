import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeSearch from "@/components/search/HomeSearch";
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
        {/* Home Search sits high on the page, directly below the hero */}
        <HomeSearch />
        <About />
        <Team />
        <MeetCharlotte />
        <Services />
        <Listings />
        <WhyWorkWithUs />
        <Market />
        <Testimonials />
        <PartnersTeaser />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
