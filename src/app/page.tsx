import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import RequestEvent from "@/components/RequestEvent";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import TestimonialForm from "@/components/TestimonialForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <TestimonialForm />
        <RequestEvent />
      </main>
      <Footer />
    </>
  );
}
