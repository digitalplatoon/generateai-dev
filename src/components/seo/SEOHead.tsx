
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "GenerateAI.dev - Your AI Copilot for Code Generation & Deployment",
  description = "Master LLMs, RAG Systems & AI Agents with Curated Roadmaps and Interactive Playgrounds. Your complete AI development resource hub.",
  keywords = "AI development, LLM, RAG systems, AI agents, machine learning, artificial intelligence, developer tools, code generation",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url = "https://generateai.dev",
  type = "website",
  schema,
  canonical
}) => {
  const fullTitle = title.includes('GenerateAI.dev') ? title : `${title} | GenerateAI.dev`;
  const currentUrl = canonical || `${url}${window.location.pathname}`;

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

      {/* Google Site Verification: Replace content with your verification code from Google Search Console */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_SITE_VERIFICATION_CODE" />

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
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
