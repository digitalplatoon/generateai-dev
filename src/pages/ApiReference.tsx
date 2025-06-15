
import SEOHead from "@/components/seo/SEOHead";
import { Code, Terminal, Key, Database } from "lucide-react";

const ApiReference = () => {
  const apiDocumentationSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "GenerateAI.dev API Reference",
    "description": "Complete reference for the GenerateAI.dev API. Build powerful integrations with our RESTful endpoints.",
    "author": {
      "@type": "Organization",
      "name": "GenerateAI.dev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GenerateAI.dev"
    },
    "datePublished": "2024-06-14",
    "dateModified": "2024-06-14"
  };

  const apiSections = [
    {
      title: "Authentication",
      description: "Secure API access with JWT tokens",
      icon: Key,
      endpoints: [
        { method: "POST", path: "/auth/login", description: "User authentication" },
        { method: "POST", path: "/auth/refresh", description: "Refresh access token" },
        { method: "POST", path: "/auth/logout", description: "Invalidate session" }
      ]
    },
    {
      title: "AI Chat",
      description: "Interactive AI conversation endpoints",
      icon: Terminal,
      endpoints: [
        { method: "POST", path: "/api/chat", description: "Send message to AI" },
        { method: "GET", path: "/api/chat/history", description: "Get chat history" },
        { method: "DELETE", path: "/api/chat/clear", description: "Clear chat history" }
      ]
    },
    {
      title: "Prompts",
      description: "Manage and execute prompts",
      icon: Code,
      endpoints: [
        { method: "GET", path: "/api/prompts", description: "List all prompts" },
        { method: "POST", path: "/api/prompts", description: "Create new prompt" },
        { method: "PUT", path: "/api/prompts/:id", description: "Update prompt" },
        { method: "DELETE", path: "/api/prompts/:id", description: "Delete prompt" }
      ]
    },
    {
      title: "RAG Operations",
      description: "Retrieval-Augmented Generation endpoints",
      icon: Database,
      endpoints: [
        { method: "POST", path: "/api/rag/upload", description: "Upload documents" },
        { method: "POST", path: "/api/rag/query", description: "Query knowledge base" },
        { method: "GET", path: "/api/rag/documents", description: "List documents" },
        { method: "DELETE", path: "/api/rag/documents/:id", description: "Delete document" }
      ]
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "text-green-400";
      case "POST": return "text-blue-400";
      case "PUT": return "text-yellow-400";
      case "DELETE": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <>
      <SEOHead
        title="API Reference - GenerateAI.dev"
        description="Complete reference for the GenerateAI.dev API. Build powerful integrations with our RESTful endpoints for AI chat, prompts, and RAG operations."
        keywords="API reference, REST API, AI API, developer documentation, authentication, endpoints"
        schema={apiDocumentationSchema}
        canonical="https://generateai.dev/api"
      />
      <div className="min-h-screen bg-navy">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              API Reference
            </h1>
            <p className="text-xl text-light-gray mb-8 max-w-3xl mx-auto">
              Complete reference for the GenerateAI.dev API. Build powerful integrations with our RESTful endpoints.
            </p>
            
            {/* Base URL */}
            <div className="bg-white/5 rounded-lg p-4 max-w-2xl mx-auto border border-white/10">
              <p className="text-light-gray mb-2">Base URL</p>
              <code className="text-teal font-mono">https://api.generateai.dev/v1</code>
            </div>
          </div>
        </section>

        {/* API Sections */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            {apiSections.map((section, index) => (
              <div key={index} className="mb-12">
                <div className="flex items-center mb-6">
                  <section.icon className="w-6 h-6 text-teal mr-3" />
                  <h2 className="text-2xl font-display font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-light-gray mb-6">{section.description}</p>
                
                <div className="space-y-4">
                  {section.endpoints.map((endpoint, endpointIndex) => (
                    <div
                      key={endpointIndex}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className={`font-mono font-bold mr-3 ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-white font-mono">{endpoint.path}</code>
                        </div>
                      </div>
                      <p className="text-light-gray text-sm">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Authentication Example */}
        <section className="py-16 px-6 bg-white/5">
          <div className="container mx-auto">
            <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
              Authentication Example
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6 border border-white/10">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`curl -X POST https://api.generateai.dev/v1/api/chat \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Hello, AI assistant!",
    "context": "general"
  }'`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ApiReference;
