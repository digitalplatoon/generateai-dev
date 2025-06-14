
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LearningPathsSection from "@/components/LearningPathsSection";
import PromptLibrarySection from "@/components/PromptLibrarySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <LearningPathsSection />
      <PromptLibrarySection />
      <Footer />
    </div>
  );
};

export default Index;
