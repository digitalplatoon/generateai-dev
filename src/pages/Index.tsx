
import SEOHead from "@/components/seo/SEOHead";
import { OrganizationSchema, WebsiteSchema, SoftwareApplicationSchema } from "@/components/seo/StructuredData";
import HeroSection from "@/components/HeroSection";
import LearningPathsSection from "@/components/LearningPathsSection";
import PromptLibrarySection from "@/components/PromptLibrarySection";

const Index = () => {
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [OrganizationSchema, WebsiteSchema, SoftwareApplicationSchema]
  };

  return (
    <>
      <SEOHead
        title="GenerateAI.dev - Your AI Copilot for Code Generation & Deployment"
        description="Master LLMs, RAG Systems & AI Agents with Curated Roadmaps and Interactive Playgrounds. Your complete AI development resource hub."
        keywords="AI development, LLM, RAG systems, AI agents, machine learning, artificial intelligence, developer tools, code generation, prompt engineering"
        schema={combinedSchema}
        canonical="https://generateai.dev/"
      />
      <div className="min-h-screen">
        <HeroSection />
        <LearningPathsSection />
        <PromptLibrarySection />
      </div>
    </>
  );
};

export default Index;
