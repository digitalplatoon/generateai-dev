
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Heart, Copy, Star, Plus, Zap } from 'lucide-react';

const PromptLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Code Generation", "Content Writing", "Data Analysis", "Creative", "Business", "Education"];

  const prompts = [
    {
      title: "React Component Generator",
      description: "Generate clean, functional React components with TypeScript",
      category: "Code Generation",
      prompt: "Create a React component that...",
      author: "AI Developer",
      likes: 145,
      rating: 4.8,
      tags: ["react", "typescript", "component"]
    },
    {
      title: "API Documentation Writer",
      description: "Generate comprehensive API documentation from code",
      category: "Code Generation",
      prompt: "Generate API documentation for the following endpoints...",
      author: "DevOps Pro",
      likes: 98,
      rating: 4.6,
      tags: ["api", "documentation", "rest"]
    },
    {
      title: "Blog Post Outline Creator",
      description: "Create engaging blog post outlines for any topic",
      category: "Content Writing",
      prompt: "Create a detailed blog post outline about...",
      author: "Content Creator",
      likes: 203,
      rating: 4.9,
      tags: ["blog", "content", "writing"]
    },
    {
      title: "Data Visualization Suggester",
      description: "Suggest the best visualization types for your data",
      category: "Data Analysis",
      prompt: "Based on this dataset, suggest the most effective visualizations...",
      author: "Data Scientist",
      likes: 87,
      rating: 4.7,
      tags: ["data", "visualization", "charts"]
    },
    {
      title: "Creative Story Starter",
      description: "Generate unique story beginnings and plot ideas",
      category: "Creative",
      prompt: "Generate a creative story beginning with the following elements...",
      author: "Creative Writer",
      likes: 156,
      rating: 4.5,
      tags: ["story", "creative", "writing"]
    },
    {
      title: "Business Plan Generator",
      description: "Create structured business plans and strategies",
      category: "Business",
      prompt: "Create a business plan for a startup that...",
      author: "Business Analyst",
      likes: 234,
      rating: 4.8,
      tags: ["business", "strategy", "planning"]
    }
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 bg-gradient-to-br from-navy via-navy/95 to-black">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-gradient">Prompt Library</span>
            </h1>
            <p className="text-xl text-light-gray max-w-2xl mx-auto">
              Discover, share, and optimize AI prompts for every use case
            </p>
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
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-light-gray">{prompt.likes}</span>
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
                    <p className="text-sm text-light-gray font-mono">
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

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-light-gray">{prompt.rating}</span>
                    </div>
                    <span className="text-sm text-light-gray">by {prompt.author}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-teal/30 text-teal hover:bg-teal/10">
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
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
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-teal to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h4 className="font-display font-semibold mb-2">Share Your Prompts</h4>
                <p className="text-sm text-light-gray">Contribute to the community and help others</p>
              </div>
              <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <h4 className="font-display font-semibold mb-2">Rate & Review</h4>
                <p className="text-sm text-light-gray">Help improve prompt quality through feedback</p>
              </div>
              <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-display font-semibold mb-2">AI-Powered Optimization</h4>
                <p className="text-sm text-light-gray">Get suggestions to improve your prompts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PromptLibrary;
