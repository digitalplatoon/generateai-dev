
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object | object[];
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "GenerateAI.dev - Build Production-Ready AI Agents in Minutes",
  description = "Master LLMs, RAG & AI Agents with curated roadmaps, 2,400+ prompts, and drag-and-drop tools. Start building in minutes. Free to start.",
  keywords = "AI development, LLM, RAG systems, AI agents, machine learning, artificial intelligence, developer tools, code generation",
  image = "https://generateai.dev/og-image.jpg",
  url = "https://generateai.dev",
  type = "website",
  schema,
  canonical
}) => {
  const fullTitle = title.includes('GenerateAI.dev') ? title : `${title} | GenerateAI.dev`;
  const currentUrl = canonical || (typeof window !== 'undefined' ? `${url}${window.location.pathname}` : url);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="GenerateAI.dev" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {/* Google Site Verification - add actual code when available */}

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="GenerateAI.dev" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@generateai_dev" />
      <meta name="twitter:creator" content="@generateai_dev" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#14B8A6" />
      <meta name="application-name" content="GenerateAI.dev" />
      <meta name="apple-mobile-web-app-title" content="GenerateAI.dev" />

      {/* Schema.org JSON-LD */}
      {schema && (Array.isArray(schema) ? (
          schema.map((s, i) => (
            <script key={`schema-${i}`} type="application/ld+json">
              {JSON.stringify(s)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )
      )}
    </Helmet>
  );
};

export default SEOHead;
