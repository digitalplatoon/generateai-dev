import { useState, useMemo } from 'react';
import { useConversations } from '@/hooks/useConversations';
import promptsData from '@/data/promptsData.json';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'prompt' | 'learning-path' | 'conversation';
  category?: string;
  link: string;
}

const learningPaths = [
  { id: 'frontend-basics', title: 'React Fundamentals', description: 'Master React basics and component architecture', category: 'Frontend', role: 'frontend' },
  { id: 'frontend-advanced', title: 'Advanced TypeScript', description: 'Type-safe development patterns', category: 'Frontend', role: 'frontend' },
  { id: 'backend-basics', title: 'Node.js Essentials', description: 'Server-side JavaScript fundamentals', category: 'Backend', role: 'backend' },
  { id: 'backend-advanced', title: 'API Design Patterns', description: 'RESTful and GraphQL best practices', category: 'Backend', role: 'backend' },
  { id: 'ml-basics', title: 'ML Fundamentals', description: 'Machine learning core concepts', category: 'ML', role: 'ml-engineer' },
  { id: 'ml-advanced', title: 'Deep Learning', description: 'Neural networks and advanced architectures', category: 'ML', role: 'ml-engineer' },
  { id: 'devops-basics', title: 'Docker & Containers', description: 'Containerization fundamentals', category: 'DevOps', role: 'devops' },
  { id: 'devops-advanced', title: 'Kubernetes Mastery', description: 'Container orchestration at scale', category: 'DevOps', role: 'devops' },
];

export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const { conversations } = useConversations();

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search prompts
    promptsData.prompts.forEach((prompt) => {
      if (
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.description.toLowerCase().includes(searchTerm) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ) {
        allResults.push({
          id: prompt.id,
          title: prompt.title,
          description: prompt.description,
          type: 'prompt',
          category: prompt.category,
          link: '/prompts',
        });
      }
    });

    // Search learning paths
    learningPaths.forEach((path) => {
      if (
        path.title.toLowerCase().includes(searchTerm) ||
        path.description.toLowerCase().includes(searchTerm) ||
        path.category.toLowerCase().includes(searchTerm)
      ) {
        allResults.push({
          id: path.id,
          title: path.title,
          description: path.description,
          type: 'learning-path',
          category: path.category,
          link: '/paths',
        });
      }
    });

    // Search conversations
    conversations.forEach((conv) => {
      if (conv.title.toLowerCase().includes(searchTerm)) {
        allResults.push({
          id: conv.id,
          title: conv.title,
          description: `Conversation from ${new Date(conv.created_at).toLocaleDateString()}`,
          type: 'conversation',
          link: '/enhanced-ai',
        });
      }
    });

    return allResults.slice(0, 10); // Limit to 10 results
  }, [query, conversations]);

  return {
    query,
    setQuery,
    results,
  };
};
