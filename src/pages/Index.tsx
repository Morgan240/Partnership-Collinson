import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ScreensSection from "@/components/sections/ScreensSection";
import CTASection from "@/components/sections/CTASection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import IntegrationSection from "@/components/sections/IntegrationSection";
import LanguagesSection from "@/components/sections/LanguagesSection";
import FlightIntelligenceSection from "@/components/sections/FlightIntelligenceSection";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <HowItWorksSection />
      <ScreensSection />
      <CTASection />
      <FeaturesSection />
      <IntegrationSection />
      <LanguagesSection />
      <FlightIntelligenceSection />
      <Footer />
    </main>
  );
};

export default Index;
