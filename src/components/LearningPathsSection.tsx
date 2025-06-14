
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { book-open, code, folder-open, chevron-down } from "lucide-react";

const LearningPathsSection = () => {
  const [selectedRole, setSelectedRole] = useState("Beginner");
  const [selectedTech, setSelectedTech] = useState("Python");

  const roleOptions = ["Beginner", "Full-Stack", "ML Engineer", "DevOps"];
  const techStack = ["Python", "JavaScript", "Rust", "Enterprise"];

  const learningPaths = {
    "Beginner": {
      "Python": [
        { title: "AI Fundamentals", duration: "2 weeks", modules: 8, badge: "Foundation" },
        { title: "Prompt Engineering", duration: "1 week", modules: 5, badge: "Prompting" },
        { title: "Basic RAG Systems", duration: "3 weeks", modules: 12, badge: "RAG Builder" }
      ],
      "JavaScript": [
        { title: "Web AI Integration", duration: "2 weeks", modules: 10, badge: "Frontend AI" },
        { title: "Node.js AI APIs", duration: "2.5 weeks", modules: 9, badge: "Backend AI" },
        { title: "React AI Components", duration: "1.5 weeks", modules: 7, badge: "Component Master" }
      ]
    },
    "Full-Stack": {
      "Python": [
        { title: "FastAPI + LangChain", duration: "3 weeks", modules: 15, badge: "API Master" },
        { title: "Vector Databases", duration: "2 weeks", modules: 8, badge: "Vector Expert" },
        { title: "Production RAG", duration: "4 weeks", modules: 18, badge: "RAG Architect" }
      ],
      "JavaScript": [
        { title: "Next.js AI Apps", duration: "3 weeks", modules: 14, badge: "Full-Stack AI" },
        { title: "Serverless AI", duration: "2 weeks", modules: 9, badge: "Serverless Pro" },
        { title: "Real-time AI Chat", duration: "2.5 weeks", modules: 11, badge: "Chat Expert" }
      ]
    },
    "ML Engineer": {
      "Python": [
        { title: "Model Fine-tuning", duration: "4 weeks", modules: 20, badge: "Tuning Expert" },
        { title: "Custom Training", duration: "5 weeks", modules: 25, badge: "ML Architect" },
        { title: "Model Deployment", duration: "3 weeks", modules: 15, badge: "Deploy Master" }
      ],
      "Rust": [
        { title: "Rust AI Performance", duration: "4 weeks", modules: 18, badge: "Performance Expert" },
        { title: "WASM AI Models", duration: "3 weeks", modules: 12, badge: "WASM Master" },
        { title: "GPU Acceleration", duration: "3.5 weeks", modules: 16, badge: "GPU Specialist" }
      ]
    }
  };

  const currentPaths = learningPaths[selectedRole]?.[selectedTech] || [];

  return (
    <section className="py-20 px-6" id="learning-paths">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Personalized <span className="text-gradient">Learning Paths</span>
          </h2>
          <p className="text-xl text-light-gray max-w-2xl mx-auto">
            Choose your role and tech stack to get a curated roadmap with interactive labs and NFT badges
          </p>
        </div>

        {/* Role & Tech Selector */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
          <div className="glass rounded-xl p-6">
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

          <div className="glass rounded-xl p-6">
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

        {/* Learning Path Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPaths.map((path, index) => (
            <Card key={index} className="glass border-white/20 hover-glow transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <book-open className="w-8 h-8 text-teal" />
                  <Badge variant="secondary" className="bg-teal/20 text-teal border-teal/30">
                    {path.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-display text-white">
                  {path.title}
                </CardTitle>
                <CardDescription className="text-light-gray">
                  {path.duration} • {path.modules} modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-light-gray">
                    <span className="flex items-center space-x-1">
                      <code className="w-4 h-4" />
                      <span>Interactive Labs</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <folder-open className="w-4 h-4" />
                      <span>Projects</span>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-navy/50 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-teal to-blue-400 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
                <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                  Start Learning Path
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Tracker Preview */}
        <div className="mt-16 glass rounded-2xl p-8">
          <h3 className="text-2xl font-display font-bold mb-6 text-center">
            Track Your Progress & Earn NFT Badges
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-teal to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-display font-semibold mb-2">Interactive Progress</h4>
              <p className="text-sm text-light-gray">Real-time tracking with visual milestones</p>
            </div>
            <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-display font-semibold mb-2">Live Code Sandboxes</h4>
              <p className="text-sm text-light-gray">Practice in embedded Replit environments</p>
            </div>
            <div className="text-center p-6 bg-navy/30 rounded-xl border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-display font-semibold mb-2">NFT Certificates</h4>
              <p className="text-sm text-light-gray">Blockchain-verified achievement badges</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPathsSection;
