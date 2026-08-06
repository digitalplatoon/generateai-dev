import { useState, useMemo } from 'react';
import { useConversations } from '@/hooks/useConversations';
import promptsData from '@/data/promptsData.json';
import { learningPaths as learningPathData } from '@/data/learningPaths';
import { featuredPost, blogPosts } from '@/data/blogPosts';

export type SearchResultType = 'prompt' | 'learning-path' | 'page' | 'blog' | 'conversation';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: SearchResultType;
  category?: string;
  link: string;
}

interface PageEntry {
  title: string;
  description: string;
  link: string;
  keywords: string[];
}

const pages: PageEntry[] = [
  { title: 'Home', description: 'Build production-ready AI agents', link: '/', keywords: ['home', 'start'] },
  { title: 'Learning Paths', description: 'Guided AI engineering curricula', link: '/paths', keywords: ['courses', 'learn', 'training'] },
  { title: 'Prompt Library', description: 'Curated, community-tested prompts', link: '/prompts', keywords: ['prompts', 'templates'] },
  { title: 'RAG Lab', description: 'Upload documents and query them with retrieval-augmented generation', link: '/rag-lab', keywords: ['rag', 'retrieval', 'documents', 'embeddings', 'vector'] },
  { title: 'Agents', description: 'Build and run AI agents', link: '/agents', keywords: ['agent', 'tools', 'automation'] },
  { title: 'Enhanced AI Chat', description: 'Streaming AI chat with conversation history', link: '/enhanced-ai', keywords: ['chat', 'assistant', 'ai'] },
  { title: 'Analytics', description: 'Usage insights and engagement metrics', link: '/analytics', keywords: ['metrics', 'insights', 'stats'] },
  { title: 'SEO Projects', description: 'Scan sites and fix SEO issues', link: '/seo-projects', keywords: ['seo', 'audit', 'scan'] },
  { title: 'Dashboard', description: 'Your workspace overview', link: '/dashboard', keywords: ['account', 'profile'] },
  { title: 'Pricing', description: 'Plans and subscription options', link: '/pricing', keywords: ['plans', 'billing', 'cost'] },
  { title: 'Documentation', description: 'Guides and how-tos', link: '/docs', keywords: ['docs', 'guide', 'help'] },
  { title: 'API Reference', description: 'Endpoints and integration details', link: '/api', keywords: ['api', 'endpoints', 'reference'] },
  { title: 'Blog', description: 'Articles on AI development', link: '/blog', keywords: ['articles', 'news'] },
  { title: 'Community', description: 'Connect with other builders', link: '/community', keywords: ['forum', 'discord'] },
  { title: 'Contact', description: 'Get in touch with the team', link: '/contact', keywords: ['support', 'email'] },
];

const flatLearningPaths = Object.entries(learningPathData).flatMap(([role, stacks]) =>
  Object.entries(stacks).flatMap(([stack, paths]) =>
    paths.map((path) => ({
      id: `${role}-${stack}-${path.title}`,
      title: path.title,
      description: path.description || `${path.modules} modules · ${path.duration}`,
      category: `${role} · ${stack}`,
      haystack: [path.title, path.description, path.badge, role, stack, path.difficulty]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    }))
  )
);

const allBlogPosts = [featuredPost, ...blogPosts];

export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const { conversations } = useConversations();

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Pages / features
    pages.forEach((page) => {
      const haystack = `${page.title} ${page.description} ${page.keywords.join(' ')}`.toLowerCase();
      if (haystack.includes(searchTerm)) {
        allResults.push({
          id: `page-${page.link}`,
          title: page.title,
          description: page.description,
          type: 'page',
          link: page.link,
        });
      }
    });

    // Prompts
    promptsData.prompts.forEach((prompt) => {
      if (
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.description.toLowerCase().includes(searchTerm) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      ) {
        allResults.push({
          id: `prompt-${prompt.id}`,
          title: prompt.title,
          description: prompt.description,
          type: 'prompt',
          category: prompt.category,
          link: '/prompts',
        });
      }
    });

    // Learning paths
    flatLearningPaths.forEach((path) => {
      if (path.haystack.includes(searchTerm)) {
        allResults.push({
          id: `path-${path.id}`,
          title: path.title,
          description: path.description,
          type: 'learning-path',
          category: path.category,
          link: '/paths',
        });
      }
    });

    // Blog posts
    allBlogPosts.forEach((post) => {
      const haystack = `${post.title} ${post.excerpt} ${(post.tags || []).join(' ')} ${post.category}`.toLowerCase();
      if (haystack.includes(searchTerm)) {
        allResults.push({
          id: `blog-${post.slug}`,
          title: post.title,
          description: post.excerpt,
          type: 'blog',
          category: post.category,
          link: `/blog/${post.slug}`,
        });
      }
    });

    // Conversations
    conversations.forEach((conv) => {
      if (conv.title.toLowerCase().includes(searchTerm)) {
        allResults.push({
          id: `conv-${conv.id}`,
          title: conv.title,
          description: `Conversation from ${new Date(conv.created_at).toLocaleDateString()}`,
          type: 'conversation',
          link: '/enhanced-ai',
        });
      }
    });

    return allResults.slice(0, 20);
  }, [query, conversations]);

  return {
    query,
    setQuery,
    results,
  };
};
