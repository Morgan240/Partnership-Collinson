import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ScreensSection from "@/components/sections/ScreensSection";
import FlightIntelligenceSection from "@/components/sections/FlightIntelligenceSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ResultsSection from "@/components/sections/ResultsSection";
import OperationalModelSection from "@/components/sections/OperationalModelSection";
import IntegrationSection from "@/components/sections/IntegrationSection";
import LanguagesSection from "@/components/sections/LanguagesSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <HowItWorksSection />
      <ScreensSection />
      <FlightIntelligenceSection />
      <FeaturesSection />
      <ResultsSection />
      <OperationalModelSection />
      <IntegrationSection />
      <LanguagesSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
