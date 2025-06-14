
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const [currentTool, setCurrentTool] = useState(0);
  
  const toolkits = [
    {
      name: "RAG Configurator",
      description: "Build intelligent retrieval systems",
      preview: "Upload docs → Configure embeddings → Deploy API",
      color: "from-teal to-blue-400"
    },
    {
      name: "Agent Builder",
      description: "Create autonomous AI workflows",
      preview: "Drag nodes → Connect APIs → Monitor execution",
      color: "from-purple-400 to-pink-400"
    },
    {
      name: "Security Scanner",
      description: "Audit AI model vulnerabilities",
      preview: "Scan prompts → Detect risks → Generate reports",
      color: "from-orange-400 to-red-400"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTool((prev) => (prev + 1) % toolkits.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative pt-20 px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
          Your AI Copilot for{' '}
          <span className="text-gradient animate-glow">
            Code Generation
          </span>
          <br />
          & Deployment
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-light-gray mb-8 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
          Master LLMs, RAG Systems & AI Agents with Curated Roadmaps and Interactive Playgrounds
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <Button size="lg" className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold text-lg px-8 py-4 hover-glow">
            Explore Learning Paths
          </Button>
          <Button size="lg" variant="outline" className="border-teal/30 text-teal hover:bg-teal/10 text-lg px-8 py-4 hover-glow">
            Launch Prompt Lab
          </Button>
        </div>

        {/* Dynamic Toolkit Preview */}
        <div className="max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.6s'}}>
          <h3 className="text-lg font-display text-light-gray mb-6">
            Interactive Toolkits
          </h3>
          
          <div className="glass rounded-2xl p-8 hover-glow">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="text-left mb-4 md:mb-0">
                <h4 className={`text-2xl font-display font-bold bg-gradient-to-r ${toolkits[currentTool].color} bg-clip-text text-transparent mb-2`}>
                  {toolkits[currentTool].name}
                </h4>
                <p className="text-light-gray">
                  {toolkits[currentTool].description}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {toolkits.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTool ? 'bg-teal scale-125' : 'bg-white/30'
                    }`}
                    onClick={() => setCurrentTool(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-navy/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-light-gray ml-4">~/ai-toolkit</span>
              </div>
              <div className="text-left">
                <div className="text-teal text-sm font-mono">
                  $ {toolkits[currentTool].preview}
                </div>
                <div className="text-green-400 text-sm font-mono mt-2">
                  ✓ Ready to deploy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-teal" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
