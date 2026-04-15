
import SEOHead from "@/components/seo/SEOHead";
import { OrganizationSchema, WebsiteSchema, SoftwareApplicationSchema } from "@/components/seo/StructuredData";
import HeroSection from "@/components/HeroSection";
import LearningPathsSection from "@/components/LearningPathsSection";
import PromptLibrarySection from "@/components/PromptLibrarySection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [OrganizationSchema, WebsiteSchema, SoftwareApplicationSchema]
  };

  return (
    <>
      <SEOHead
        title="GenerateAI.dev - Build Production-Ready AI Agents in Minutes"
        description="Master LLMs, RAG Systems & AI Agents with curated roadmaps, 2,400+ battle-tested prompts, and drag-and-drop tools. Start building AI applications in minutes, not months. Free to start."
        keywords="AI agents, RAG systems, LLM development, prompt engineering, AI tools, code generation, AI deployment, machine learning, AI builder, no-code AI, production AI, AI agent builder"
        schema={combinedSchema}
        canonical="https://generateai.dev/"
      />
      <div className="min-h-screen">
        <HeroSection />
        <LearningPathsSection />
        <PromptLibrarySection />
        <TestimonialsSection />
      </div>
    </>
  );
};

export default Index;
