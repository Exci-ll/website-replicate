import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LogoTicker from "@/components/LogoTicker";
import FeaturesSection from "@/components/FeaturesSection";
import SearchToolsSection from "@/components/SearchToolsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#eeecda]">
      <Header />
      <main>
        <HeroSection />
        <LogoTicker />
        <FeaturesSection />
        <SearchToolsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
