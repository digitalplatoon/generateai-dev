
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
        title="GenerateAI.dev - AI Copilot for Developers | Code Generation Platform"
        description="Master AI code generation, LLM development & RAG systems with interactive tutorials. Build AI agents, learn prompt engineering, and deploy production-ready AI applications. Free AI code generator tools & comprehensive learning paths for developers."
        keywords="AI code generation, AI code generator, AI copilot for developers, AI coding assistant, LLM tutorial, RAG systems tutorial, AI agent development, generative AI for coding, automated code generation, AI development platform, prompt engineering, machine learning roadmap, AI powered code generation, build AI agents, LLM training guide"
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
