import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Code, FolderOpen, Search, Filter, Play, Clock, Trophy, Users } from 'lucide-react';
import { learningPaths, roleOptions, techStack } from '@/data/learningPaths';

const LearningPaths = () => {
  const [selectedRole, setSelectedRole] = useState("Beginner");
  const [selectedTech, setSelectedTech] = useState("Python");
  const [searchTerm, setSearchTerm] = useState("");

  const currentPaths = learningPaths[selectedRole]?.[selectedTech] || [];
  const filteredPaths = currentPaths.filter(path => 
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (path.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-500/20 text-green-300 border-green-400/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "Advanced": return "bg-orange-500/20 text-orange-300 border-orange-400/30";
      case "Expert": return "bg-red-500/20 text-red-300 border-red-400/30";
      default: return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    }
  };

  return (
    <>
      <SEOHead
        title="Learning Paths - Master AI Development | GenerateAI.dev"
        description="Curated AI learning roadmaps for every skill level. Master LLMs, RAG systems, prompt engineering, and AI agent development with interactive labs."
        keywords="AI learning paths, LLM tutorial, RAG tutorial, prompt engineering course, AI development roadmap"
        canonical="https://generateai.dev/paths"
      />
      <div className="pt-20 bg-gradient-to-br from-navy via-navy/95 to-black">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-gradient">Learning Paths</span>
            </h1>
            <p className="text-xl text-light-gray max-w-2xl mx-auto">
              Curated roadmaps to master AI development with interactive labs and NFT badges
            </p>
          </div>

          {/* Search and Filters */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-gray w-4 h-4" />
                <Input
                  placeholder="Search learning paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-navy/50 border-white/20 text-white"
                />
              </div>
              <Button variant="outline" className="border-teal/30 text-teal hover:bg-teal/10">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="font-display font-semibold mb-4 text-teal">Your Role</h3>
                <div className="flex flex-wrap gap-2">
                  {roleOptions.map((role) => (
                    <Button
                      key={role}
                      variant={selectedRole === role ? "default" : "outline"}
                      onClick={() => setSelectedRole(role)}
                      className={selectedRole === role 
                        ? "bg-teal text-navy hover:bg-teal/80" 
                        : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-display font-semibold mb-4 text-teal">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Button
                      key={tech}
                      variant={selectedTech === tech ? "default" : "outline"}
                      onClick={() => setSelectedTech(tech)}
                      className={selectedTech === tech 
                        ? "bg-teal text-navy hover:bg-teal/80" 
                        : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Path Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPaths.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <BookOpen className="w-12 h-12 text-light-gray/40 mx-auto mb-4" />
                <p className="text-light-gray text-lg font-display">No learning paths found</p>
                <p className="text-light-gray/60 text-sm mt-2">
                  {searchTerm ? 'Try a different search term.' : 'Try selecting a different role or tech stack combination.'}
                </p>
              </div>
            ) : (
              filteredPaths.map((path, index) => (
                <Card key={index} className="glass border-white/20 hover-glow transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="w-8 h-8 text-teal" />
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-teal/20 text-teal border-teal/30">
                          {path.badge}
                        </Badge>
                        {path.difficulty && (
                          <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                            {path.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-display text-white">
                      {path.title}
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      {path.duration} • {path.modules} modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {path.description && (
                      <p className="text-sm text-light-gray mb-4">{path.description}</p>
                    )}
                    
                    {(path.enrolled || path.rating) && (
                      <div className="flex items-center justify-between mb-4 text-sm text-light-gray">
                        {path.enrolled && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{path.enrolled.toLocaleString()} enrolled</span>
                          </div>
                        )}
                        {path.rating && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span>{path.rating}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-light-gray">
                        <span className="flex items-center space-x-1">
                          <Code className="w-4 h-4" />
                          <span>Interactive Labs</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FolderOpen className="w-4 h-4" />
                          <span>Projects</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-light-gray mb-1">
                        <span>Progress</span>
                        <span>{path.progress || 0}%</span>
                      </div>
                      <Progress value={path.progress || 0} className="h-2 bg-navy/50" />
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                      <Play className="w-4 h-4 mr-2" />
                      {(path.progress || 0) > 0 ? 'Continue Learning' : 'Start Learning Path'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Enhanced Features Section */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-display font-bold mb-6 text-center">
              Track Your Progress & Earn NFT Badges
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-teal to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="text-2xl text-navy w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold mb-2">Interactive Progress</h4>
                <p className="text-sm text-light-gray">Real-time tracking with visual milestones</p>
              </div>
              <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Code className="text-2xl text-white w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold mb-2">Live Code Sandboxes</h4>
                <p className="text-sm text-light-gray">Practice in embedded Replit environments</p>
              </div>
              <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="text-2xl text-white w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold mb-2">NFT Certificates</h4>
                <p className="text-sm text-light-gray">Blockchain-verified achievement badges</p>
              </div>
              <div className="text-center p-6 bg-muted/40 rounded-xl border border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-2xl text-white w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold mb-2">Community Learning</h4>
                <p className="text-sm text-light-gray">Learn with peers and expert mentors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningPaths;
