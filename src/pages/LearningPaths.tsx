import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Code, FolderOpen, Search, Filter, Play, Clock, Trophy, Users } from 'lucide-react';

const LearningPaths = () => {
  const [selectedRole, setSelectedRole] = useState("Beginner");
  const [selectedTech, setSelectedTech] = useState("Python");
  const [searchTerm, setSearchTerm] = useState("");

  const roleOptions = ["Beginner", "Full-Stack", "ML Engineer", "DevOps", "Data Scientist"];
  const techStack = ["Python", "JavaScript", "Rust", "Enterprise", "React", "Node.js"];

  const learningPaths = {
    "Beginner": {
      "Python": [
        { 
          title: "AI Fundamentals", 
          duration: "2 weeks", 
          modules: 8, 
          badge: "Foundation", 
          description: "Learn the core concepts of artificial intelligence and machine learning",
          difficulty: "Beginner",
          enrolled: 1247,
          rating: 4.8,
          progress: 0
        },
        { 
          title: "Prompt Engineering", 
          duration: "1 week", 
          modules: 5, 
          badge: "Prompting", 
          description: "Master the art of crafting effective prompts for AI models",
          difficulty: "Beginner",
          enrolled: 892,
          rating: 4.9,
          progress: 0
        },
        { 
          title: "Basic RAG Systems", 
          duration: "3 weeks", 
          modules: 12, 
          badge: "RAG Builder", 
          description: "Build your first Retrieval-Augmented Generation system",
          difficulty: "Intermediate",
          enrolled: 634,
          rating: 4.7,
          progress: 0
        }
      ],
      "JavaScript": [
        { 
          title: "Web AI Integration", 
          duration: "2 weeks", 
          modules: 10, 
          badge: "Frontend AI", 
          description: "Integrate AI capabilities into web applications",
          difficulty: "Beginner",
          enrolled: 567,
          rating: 4.6,
          progress: 0
        },
        { 
          title: "Node.js AI APIs", 
          duration: "2.5 weeks", 
          modules: 9, 
          badge: "Backend AI", 
          description: "Create AI-powered backend services with Node.js",
          difficulty: "Intermediate",
          enrolled: 432,
          rating: 4.5,
          progress: 0
        },
        { 
          title: "React AI Components", 
          duration: "1.5 weeks", 
          modules: 7, 
          badge: "Component Master", 
          description: "Build reusable AI components for React",
          difficulty: "Intermediate",
          enrolled: 789,
          rating: 4.8,
          progress: 0
        }
      ]
    },
    "Full-Stack": {
      "Python": [
        { 
          title: "FastAPI + LangChain", 
          duration: "3 weeks", 
          modules: 15, 
          badge: "API Master", 
          description: "Build production-ready AI APIs with FastAPI and LangChain",
          difficulty: "Advanced",
          enrolled: 345,
          rating: 4.9,
          progress: 0
        },
        { 
          title: "Vector Databases", 
          duration: "2 weeks", 
          modules: 8, 
          badge: "Vector Expert", 
          description: "Master vector databases for AI applications",
          difficulty: "Advanced",
          enrolled: 278,
          rating: 4.7,
          progress: 0
        },
        { 
          title: "Production RAG", 
          duration: "4 weeks", 
          modules: 18, 
          badge: "RAG Architect", 
          description: "Deploy scalable RAG systems in production",
          difficulty: "Expert",
          enrolled: 198,
          rating: 4.8,
          progress: 0
        }
      ],
      "JavaScript": [
        { 
          title: "Next.js AI Apps", 
          duration: "3 weeks", 
          modules: 14, 
          badge: "Full-Stack AI", 
          description: "Build full-stack AI applications with Next.js",
          difficulty: "Advanced",
          enrolled: 412,
          rating: 4.6,
          progress: 0
        },
        { 
          title: "Serverless AI", 
          duration: "2 weeks", 
          modules: 9, 
          badge: "Serverless Pro", 
          description: "Deploy AI functions with serverless architecture",
          difficulty: "Advanced",
          enrolled: 234,
          rating: 4.5,
          progress: 0
        },
        { 
          title: "Real-time AI Chat", 
          duration: "2.5 weeks", 
          modules: 11, 
          badge: "Chat Expert", 
          description: "Create real-time AI chat applications",
          difficulty: "Advanced",
          enrolled: 356,
          rating: 4.7,
          progress: 0
        }
      ]
    },
    "ML Engineer": {
      "Python": [
        { 
          title: "Model Fine-tuning", 
          duration: "4 weeks", 
          modules: 20, 
          badge: "Tuning Expert", 
          description: "Fine-tune large language models for specific tasks",
          difficulty: "Expert",
          enrolled: 156,
          rating: 4.9,
          progress: 0
        },
        { 
          title: "Custom Training", 
          duration: "5 weeks", 
          modules: 25, 
          badge: "ML Architect", 
          description: "Train custom AI models from scratch",
          difficulty: "Expert",
          enrolled: 89,
          rating: 4.8,
          progress: 0
        },
        { 
          title: "Model Deployment", 
          duration: "3 weeks", 
          modules: 15, 
          badge: "Deploy Master", 
          description: "Deploy and monitor ML models in production",
          difficulty: "Expert",
          enrolled: 134,
          rating: 4.7,
          progress: 0
        }
      ],
      "Rust": [
        { 
          title: "Rust AI Performance", 
          duration: "4 weeks", 
          modules: 18, 
          badge: "Performance Expert", 
          description: "Build high-performance AI applications with Rust",
          difficulty: "Expert",
          enrolled: 67,
          rating: 4.6,
          progress: 0
        },
        { 
          title: "WASM AI Models", 
          duration: "3 weeks", 
          modules: 12, 
          badge: "WASM Master", 
          description: "Deploy AI models to the browser with WebAssembly",
          difficulty: "Expert",
          enrolled: 45,
          rating: 4.5,
          progress: 0
        },
        { 
          title: "GPU Acceleration", 
          duration: "3.5 weeks", 
          modules: 16, 
          badge: "GPU Specialist", 
          description: "Accelerate AI workloads with GPU computing",
          difficulty: "Expert",
          enrolled: 78,
          rating: 4.8,
          progress: 0
        }
      ]
    }
  };

  const currentPaths = learningPaths[selectedRole]?.[selectedTech] || [];
  const filteredPaths = currentPaths.filter(path => 
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredPaths.map((path, index) => (
              <Card key={index} className="glass border-white/20 hover-glow transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-8 h-8 text-teal" />
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-teal/20 text-teal border-teal/30">
                        {path.badge}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
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
                  <p className="text-sm text-light-gray mb-4">{path.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-light-gray">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{path.enrolled.toLocaleString()} enrolled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span>{path.rating}</span>
                    </div>
                  </div>

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
                      <span>{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2 bg-navy/50" />
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                    <Play className="w-4 h-4 mr-2" />
                    {path.progress > 0 ? 'Continue Learning' : 'Start Learning Path'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Features Section */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-display font-bold mb-6 text-center">
              Track Your Progress & Earn NFT Badges
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-teal to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="text-2xl text-navy w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold mb-2">Interactive Progress</h4>
                <p className="text-sm text-light-gray">Real-time tracking with visual milestones</p>
              </div>
              <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Code className="text-2xl text-white w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold mb-2">Live Code Sandboxes</h4>
                <p className="text-sm text-light-gray">Practice in embedded Replit environments</p>
              </div>
              <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="text-2xl text-white w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold mb-2">NFT Certificates</h4>
                <p className="text-sm text-light-gray">Blockchain-verified achievement badges</p>
              </div>
              <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
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
  );
};

export default LearningPaths;
