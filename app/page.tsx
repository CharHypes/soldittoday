import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Listings from "@/components/Listings";
import WhyWorkWithUs from "@/components/WhyWorkWithUs";
import Market from "@/components/Market";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Listings />
        <WhyWorkWithUs />
        <Market />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
