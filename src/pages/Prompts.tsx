import { useState, useMemo } from 'react';
import { Search, Star, Copy, Check, Filter, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/seo/SEOHead';
import { toast } from 'sonner';
import promptsData from '@/data/promptsData.json';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  uses: number;
  rating: number;
  template: string;
  sampleOutput: string;
}

const Prompts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const categories = ['all', 'debugging', 'database', 'documentation', 'frontend', 
                      'backend', 'testing', 'devops', 'utilities'];

  const filteredPrompts = useMemo(() => {
    let results = promptsData.prompts as Prompt[];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'all') {
      results = results.filter(prompt => prompt.category === selectedCategory);
    }

    results = [...results].sort((a, b) => {
      if (sortBy === 'popular') return b.uses - a.uses;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    return results;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleCopy = async (promptId: string, template: string) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedId(promptId);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  const toggleExpand = (promptId: string) => {
    setExpandedPrompt(expandedPrompt === promptId ? null : promptId);
  };

  return (
    <>
      <SEOHead
        title="Community Prompt Library - 2,400+ AI Prompts | GenerateAI.dev"
        description="Access battle-tested AI prompts for coding, debugging, documentation, and more. Used by 15,600+ developers in production."
        keywords="AI prompts, coding prompts, developer prompts, ChatGPT prompts"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Community Prompt Library
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {promptsData.prompts.length}+ battle-tested prompts used by 15,600+ developers in production
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search prompts... (e.g., 'SQL generator', 'debug Python')"
                className="pl-12 pr-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="pb-8 px-6">
          <div className="container mx-auto">
            {/* Sort Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                onClick={() => setSortBy('popular')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Most Popular
              </Button>
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                onClick={() => setSortBy('recent')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Most Recent
              </Button>
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                onClick={() => setSortBy('rating')}
              >
                <Award className="mr-2 h-4 w-4" />
                Highest Rated
              </Button>
            </div>
            
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Categories' : `#${category}`}
                </Badge>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredPrompts.length} of {promptsData.prompts.length} prompts
            </div>
          </div>
        </section>

        {/* Prompts Grid */}
        <section className="pb-16 px-6">
          <div className="container mx-auto">
            {filteredPrompts.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-xl mb-4">No prompts found matching "{searchQuery}"</p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map(prompt => (
                  <Card key={prompt.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>👥 {prompt.uses.toLocaleString()}</span>
                          <span className="flex items-center">
                            <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                            {prompt.rating}
                          </span>
                        </div>
                      </div>
                      <CardDescription>{prompt.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {prompt.tags.map(tag => (
                          <Badge key={tag} variant="secondary">#{tag}</Badge>
                        ))}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        by <strong>{prompt.author}</strong>
                      </div>
                      
                      {/* Expandable Details */}
                      {expandedPrompt === prompt.id && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Prompt Template</h4>
                            <pre className="bg-secondary p-3 rounded text-xs overflow-x-auto">
                              {prompt.template}
                            </pre>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Sample Output</h4>
                            <pre className="bg-secondary p-3 rounded text-xs overflow-x-auto">
                              {prompt.sampleOutput}
                            </pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleCopy(prompt.id, prompt.template)}
                      >
                        {copiedId === prompt.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleExpand(prompt.id)}
                      >
                        {expandedPrompt === prompt.id ? 'Hide' : 'View'} Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Prompts;
