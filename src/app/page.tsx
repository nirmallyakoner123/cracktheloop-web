import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import PainPoints from "./components/landing/PainPoints";
import HowItWorks from "./components/landing/HowItWorks";
import TrustEthics from "./components/landing/TrustEthics";
import PlatformPicker from "./components/landing/PlatformPicker";
import ProductDemo from "./components/landing/ProductDemo";
import UseCases from "./components/landing/UseCases";
import Comparison from "./components/landing/Comparison";
import Testimonials from "./components/landing/Testimonials";
import ReferralProgram from "./components/landing/ReferralProgram";
import Faq from "./components/landing/Faq";
import CtaFooter from "./components/landing/CtaFooter";
 
export default function Home() {
  return (
    <main className="flex flex-col relative overflow-hidden">
      <Navbar />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <TrustEthics />
      <PlatformPicker />
      <ProductDemo />
      <Testimonials />
      <ReferralProgram />
      <UseCases />
      <Comparison />
      <Faq />
      <CtaFooter />
    </main>
  );
}
