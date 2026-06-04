import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import TrustBar from "./components/landing/TrustBar";
import BentoFeatures from "./components/landing/BentoFeatures";
import DemoTeaser from "./components/landing/DemoTeaser";
import HowItWorks from "./components/landing/HowItWorks";
import UseCases from "./components/landing/UseCases";
import Comparison from "./components/landing/Comparison";
import Testimonials from "./components/landing/Testimonials";
import Faq from "./components/landing/Faq";
import CtaFooter from "./components/landing/CtaFooter";

export default function Home() {
  return (
    <main className="flex flex-col relative overflow-hidden">
      <Navbar />
      <Hero />
      <TrustBar />
      <BentoFeatures />
      <DemoTeaser />
      <HowItWorks />
      <UseCases />
      <Comparison />
      <Testimonials />
      <Faq />
      <CtaFooter />
    </main>
  );
}
