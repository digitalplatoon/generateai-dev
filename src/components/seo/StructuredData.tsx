import { featuredPost } from '@/data/blogPosts';

export const OrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GenerateAI.dev",
  "url": "https://generateai.dev",
  "logo": "https://generateai.dev/logo.png",
  "description": "The world's leading platform for learning, building, and deploying generative AI applications",
  "foundingDate": "2024",
  "sameAs": [
    "https://twitter.com/generateai_dev",
    "https://github.com/generateai-dev",
    "https://linkedin.com/company/generateai-dev"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://generateai.dev/contact",
    "email": "support@generateai.dev"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
};

export const WebsiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GenerateAI.dev",
  "url": "https://generateai.dev",
  "description": "Master LLMs, RAG Systems & AI Agents with interactive learning paths and production-ready toolkits",
  "publisher": {
    "@type": "Organization",
    "name": "GenerateAI.dev"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://generateai.dev/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const SoftwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "GenerateAI.dev Platform",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "description": "AI development platform with interactive learning paths, RAG lab, and agent playground",
  "url": "https://generateai.dev",
  "author": {
    "@type": "Organization",
    "name": "GenerateAI.dev"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
};

export const CourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "AI Development Learning Paths",
  "description": "Comprehensive learning paths for mastering LLMs, RAG systems, and AI agents",
  "provider": {
    "@type": "Organization",
    "name": "GenerateAI.dev"
  },
  "url": "https://generateai.dev/paths",
  "courseMode": "online",
  "educationalLevel": "intermediate"
};

// BreadcrumbList schema generator
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

type Post = typeof featuredPost;

export const createBlogPostingSchema = (post: Post, url: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.image,
  "url": url,
  "datePublished": new Date(post.date).toISOString(),
  "dateModified": new Date(post.date).toISOString(),
  "author": {
    "@type": "Person",
    "name": post.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "GenerateAI.dev",
    "logo": {
      "@type": "ImageObject",
      "url": "https://generateai.dev/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

// Dynamic OG Image URL generator
export const generateOGImageUrl = (title: string, description?: string): string => {
  const encodedTitle = encodeURIComponent(title.slice(0, 60));
  const encodedDesc = description ? encodeURIComponent(description.slice(0, 100)) : '';
  // Using a simple OG image service pattern - can be replaced with custom endpoint
  return `https://og.generateai.dev/api/og?title=${encodedTitle}&description=${encodedDesc}`;
};
