
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Book, Search, Code, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  const docSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of GenerateAI.dev platform",
      icon: Book,
      links: [
        { title: "Quick Start Guide", href: "#quickstart" },
        { title: "Installation", href: "#installation" },
        { title: "First Steps", href: "#first-steps" },
        { title: "Basic Concepts", href: "#concepts" }
      ]
    },
    {
      title: "Learning Paths",
      description: "Structured courses for AI development",
      icon: FileText,
      links: [
        { title: "Prompt Engineering", href: "#prompt-engineering" },
        { title: "RAG Systems", href: "#rag-systems" },
        { title: "AI Agents", href: "#ai-agents" },
        { title: "Fine-tuning", href: "#fine-tuning" }
      ]
    },
    {
      title: "Tools & Features",
      description: "Comprehensive guide to platform features",
      icon: Code,
      links: [
        { title: "Prompt Library", href: "#prompt-library" },
        { title: "RAG Lab", href: "#rag-lab" },
        { title: "Agent Playground", href: "#agent-playground" },
        { title: "Code Generation", href: "#code-generation" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-navy">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Documentation
          </h1>
          <p className="text-xl text-light-gray mb-8 max-w-3xl mx-auto">
            Everything you need to master AI development with our comprehensive guides, tutorials, and references.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {docSections.map((section, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <section.icon className="w-6 h-6 text-teal mr-3" />
                  <h3 className="text-xl font-display font-semibold text-white">
                    {section.title}
                  </h3>
                </div>
                <p className="text-light-gray mb-6">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="flex items-center text-light-gray hover:text-teal transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6 bg-white/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
            Popular Guides
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Building Your First Chatbot",
              "Prompt Engineering Best Practices",
              "Setting Up RAG Pipelines",
              "Deploying AI Agents"
            ].map((guide, index) => (
              <Link
                key={index}
                to="#"
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-teal transition-colors"
              >
                <h4 className="font-semibold text-white mb-2">{guide}</h4>
                <p className="text-light-gray text-sm">Step-by-step tutorial</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Documentation;
