import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Heart, Copy, Star, Plus, Zap, Download, Share, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/seo/SEOHead';

const PromptLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const { toast } = useToast();

  const categories = ["All", "Code Generation", "Content Writing", "Data Analysis", "Creative", "Business", "Education", "Marketing"];
  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "recent", label: "Most Recent" },
    { value: "rating", label: "Highest Rated" },
    { value: "trending", label: "Trending" }
  ];

  const prompts = [
    {
      title: "React Component Generator",
      description: "Generate clean, functional React components with TypeScript",
      category: "Code Generation",
      prompt: "Create a React component that accepts props for title, description, and onClick handler. Use TypeScript interfaces and modern React patterns.",
      author: "AI Developer",
      likes: 145,
      rating: 4.8,
      tags: ["react", "typescript", "component"],
      isBookmarked: false,
      downloads: 234,
      createdAt: "2024-01-15"
    },
    {
      title: "API Documentation Writer",
      description: "Generate comprehensive API documentation from code",
      category: "Code Generation",
      prompt: "Generate detailed API documentation for the following endpoints including request/response examples, error codes, and authentication requirements...",
      author: "DevOps Pro",
      likes: 98,
      rating: 4.6,
      tags: ["api", "documentation", "rest"],
      isBookmarked: true,
      downloads: 156,
      createdAt: "2024-01-12"
    },
    {
      title: "Blog Post Outline Creator",
      description: "Create engaging blog post outlines for any topic",
      category: "Content Writing",
      prompt: "Create a detailed blog post outline about [TOPIC] including introduction, main points, subheadings, and conclusion. Target audience: [AUDIENCE]",
      author: "Content Creator",
      likes: 203,
      rating: 4.9,
      tags: ["blog", "content", "writing"],
      isBookmarked: false,
      downloads: 312,
      createdAt: "2024-01-18"
    },
    {
      title: "Data Visualization Suggester",
      description: "Suggest the best visualization types for your data",
      category: "Data Analysis",
      prompt: "Based on this dataset structure and business goals, suggest the most effective visualizations and explain why each would be appropriate...",
      author: "Data Scientist",
      likes: 87,
      rating: 4.7,
      tags: ["data", "visualization", "charts"],
      isBookmarked: false,
      downloads: 189,
      createdAt: "2024-01-10"
    },
    {
      title: "Creative Story Starter",
      description: "Generate unique story beginnings and plot ideas",
      category: "Creative",
      prompt: "Generate a creative story beginning with the following elements: genre [GENRE], setting [SETTING], main character [CHARACTER]. Include an interesting hook.",
      author: "Creative Writer",
      likes: 156,
      rating: 4.5,
      tags: ["story", "creative", "writing"],
      isBookmarked: true,
      downloads: 267,
      createdAt: "2024-01-14"
    },
    {
      title: "Business Plan Generator",
      description: "Create structured business plans and strategies",
      category: "Business",
      prompt: "Create a comprehensive business plan for a [BUSINESS_TYPE] startup including executive summary, market analysis, financial projections...",
      author: "Business Analyst",
      likes: 234,
      rating: 4.8,
      tags: ["business", "strategy", "planning"],
      isBookmarked: false,
      downloads: 445,
      createdAt: "2024-01-16"
    },
    {
      title: "Social Media Campaign",
      description: "Design effective social media marketing campaigns",
      category: "Marketing",
      prompt: "Create a 30-day social media campaign for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include post ideas, hashtags, and engagement strategies.",
      author: "Marketing Expert",
      likes: 178,
      rating: 4.6,
      tags: ["social media", "marketing", "campaign"],
      isBookmarked: false,
      downloads: 298,
      createdAt: "2024-01-13"
    },
    {
      title: "Educational Quiz Creator",
      description: "Generate interactive quizzes for any subject",
      category: "Education",
      prompt: "Create a 10-question quiz about [SUBJECT] for [GRADE_LEVEL] students. Include multiple choice, true/false, and short answer questions.",
      author: "Educator",
      likes: 112,
      rating: 4.7,
      tags: ["education", "quiz", "assessment"],
      isBookmarked: true,
      downloads: 201,
      createdAt: "2024-01-11"
    }
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch(sortBy) {
      case "popular": return b.likes - a.likes;
      case "recent": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "rating": return b.rating - a.rating;
      case "trending": return b.downloads - a.downloads;
      default: return 0;
    }
  });

  const handleCopyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Prompt copied!",
      description: `"${title}" has been copied to your clipboard.`,
    });
  };

  const handleBookmark = (index: number) => {
    toast({
      title: "Bookmark updated!",
      description: "Prompt has been added to your bookmarks.",
    });
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this prompt: ${title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="pt-20 bg-gradient-to-br from-navy via-navy/95 to-black">
      <SEOHead
        title="Prompt Library - 2,400+ Battle-Tested AI Prompts | GenerateAI.dev"
        description="Access 2,400+ production-ready AI prompts for Python debugging, SQL generation, API documentation, code review, and more. Used by 15,600+ developers. Browse and deploy instantly."
        keywords="AI prompts, prompt library, prompt engineering, AI prompt templates, code generation prompts, debugging prompts, SQL prompts"
        canonical="https://generateai.dev/prompts"
      />
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-gradient">Prompt Library</span>
          </h1>
          <p className="text-xl text-light-gray max-w-2xl mx-auto">
            Discover, share, and optimize AI prompts for every use case
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">{prompts.length}+</div>
              <div className="text-sm text-light-gray">Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">50K+</div>
              <div className="text-sm text-light-gray">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">4.7</div>
              <div className="text-sm text-light-gray">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-gray w-4 h-4" />
              <Input
                placeholder="Search prompts, tags, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-navy/50 border-white/20 text-white"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-navy/50 border border-white/20 rounded text-white text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-navy">
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="border-teal/30 text-teal hover:bg-teal/10">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Prompt
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className={selectedCategory === category 
                  ? "bg-teal text-navy hover:bg-teal/80" 
                  : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompt Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPrompts.map((prompt, index) => (
            <Card key={index} className="glass border-white/20 hover-glow transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                    {prompt.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(index)}
                      className="p-1 h-auto"
                    >
                      <Bookmark className={`w-4 h-4 ${prompt.isBookmarked ? 'fill-teal text-teal' : 'text-light-gray'}`} />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-light-gray">{prompt.likes}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl font-display text-white">
                  {prompt.title}
                </CardTitle>
                <CardDescription className="text-light-gray">
                  {prompt.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-navy/50 rounded-lg p-3 mb-4 border border-white/10">
                  <p className="text-sm text-light-gray font-mono line-clamp-3">
                    {prompt.prompt}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {prompt.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs border-teal/30 text-teal">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-light-gray">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{prompt.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{prompt.downloads}</span>
                  </div>
                  <span>by {prompt.author}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCopyPrompt(prompt.prompt, prompt.title)}
                    className="flex-1 border-teal/30 text-teal hover:bg-teal/10"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare(prompt.title)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                    <Zap className="w-4 h-4 mr-1" />
                    Try It
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Features */}
        <div className="glass rounded-2xl p-8">
          <h3 className="text-2xl font-display font-bold mb-6 text-center">
            Join the Prompt Community
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
              <div className="w-16 h-16 bg-gradient-to-br from-teal to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Plus className="text-2xl text-navy w-8 h-8" />
              </div>
              <h4 className="font-display font-semibold mb-2">Share Your Prompts</h4>
              <p className="text-sm text-light-gray">Contribute to the community and help others</p>
            </div>
            <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="text-2xl text-white w-8 h-8" />
              </div>
              <h4 className="font-display font-semibold mb-2">Rate & Review</h4>
              <p className="text-sm text-light-gray">Help improve prompt quality through feedback</p>
            </div>
            <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="text-2xl text-white w-8 h-8" />
              </div>
              <h4 className="font-display font-semibold mb-2">AI-Powered Optimization</h4>
              <p className="text-sm text-light-gray">Get suggestions to improve your prompts</p>
            </div>
            <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Download className="text-2xl text-white w-8 h-8" />
              </div>
              <h4 className="font-display font-semibold mb-2">Export & Integration</h4>
              <p className="text-sm text-light-gray">Download prompts in multiple formats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptLibrary;
