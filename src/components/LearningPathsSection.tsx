
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, FolderOpen } from "lucide-react";
import { learningPaths, roleOptions as allRoles, techStack as allTech } from "@/data/learningPaths";

const LearningPathsSection = () => {
  const [selectedRole, setSelectedRole] = useState("Beginner");
  const [selectedTech, setSelectedTech] = useState("Python");

  const roleOptions = allRoles.slice(0, 4);
  const techStackOptions = allTech.slice(0, 4);

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
              {techStackOptions.map((tech) => (
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
          {currentPaths.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-light-gray text-lg">No learning paths available for this combination yet.</p>
              <p className="text-light-gray/60 text-sm mt-2">Try selecting a different role or tech stack.</p>
            </div>
          ) : (
            currentPaths.map((path, index) => (
              <Card key={index} className="glass border-white/20 hover-glow transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-8 h-8 text-teal" />
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
                        <Code className="w-4 h-4" />
                        <span>Interactive Labs</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FolderOpen className="w-4 h-4" />
                        <span>Projects</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-teal to-blue-400 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                    Start Learning Path
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
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
