
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative pt-20 px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto text-center relative z-10 max-w-6xl">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up-fast leading-tight">
          Build Production-Ready{' '}
          <span className="text-gradient animate-glow">
            AI Agents
          </span>
          <br />
          in Minutes, Not Months
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-light-gray mb-8 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
          Master LLMs, RAG Systems & AI Agents with curated roadmaps, battle-tested prompts, and drag-and-drop tools. No PhD required.
        </p>

        {/* Social Proof Bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-light-gray animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center gap-2">
            <span className="text-teal">✓</span>
            <span>Trusted by 15,600+ developers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal">✓</span>
            <span>2,400+ production-ready prompts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal">✓</span>
            <span>890+ active contributors</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="flex flex-col items-center gap-2">
            <Button size="lg" className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold text-lg px-8 py-6 hover-glow">
              🚀 Start Building Free
            </Button>
            <span className="text-xs text-light-gray">No credit card • 100 free prompts</span>
          </div>
          <Button size="lg" variant="outline" className="border-teal/30 text-teal hover:bg-teal/10 text-lg px-8 py-6 hover-glow">
            ▶️ Watch Demo (2 min)
          </Button>
        </div>

        {/* Hero Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto animate-slide-up" style={{animationDelay: '0.5s'}}>
          <div className="glass rounded-xl p-6 text-center hover-glow transition-all duration-300">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-display font-semibold mb-2">Deploy in 5 Minutes</h3>
            <p className="text-sm text-light-gray">From idea to live API endpoint in one click</p>
          </div>
          
          <div className="glass rounded-xl p-6 text-center hover-glow transition-all duration-300">
            <div className="text-4xl mb-3">🧩</div>
            <h3 className="font-display font-semibold mb-2">No-Code + Code Options</h3>
            <p className="text-sm text-light-gray">Drag-and-drop or customize with full code access</p>
          </div>
          
          <div className="glass rounded-xl p-6 text-center hover-glow transition-all duration-300">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-display font-semibold mb-2">Production-Ready</h3>
            <p className="text-sm text-light-gray">Battle-tested templates used in real startups</p>
          </div>
          
          <div className="glass rounded-xl p-6 text-center hover-glow transition-all duration-300">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-display font-semibold mb-2">Free to Start</h3>
            <p className="text-sm text-light-gray">100 prompts/month forever, no credit card</p>
          </div>
        </div>

        {/* Code Preview Window */}
        <div className="max-w-4xl mx-auto mt-16 animate-slide-up" style={{animationDelay: '0.7s'}}>
          <div className="glass rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-navy/80 px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-sm text-light-gray font-mono">AI Agent Builder</span>
            </div>
            <div className="p-8 bg-navy/50">
              <pre className="text-left text-sm md:text-base text-light-gray font-mono">
                <code>
                  <span className="text-purple-400">// Build AI agent in 3 lines</span>{'\n'}
                  <span className="text-blue-400">const</span> <span className="text-white">agent</span> = <span className="text-blue-400">new</span> <span className="text-yellow-400">RAGAgent</span>{'({'}{'\n'}
                  {'  '}<span className="text-white">prompt:</span> <span className="text-green-400">"Customer support bot"</span>,{'\n'}
                  {'  '}<span className="text-white">knowledge:</span> <span className="text-yellow-400">uploadDocs</span>(),{'\n'}
                  {'  '}<span className="text-white">deploy:</span> <span className="text-green-400">"production"</span>{'\n'}
                  {'});'}{'\n\n'}
                  <span className="text-white">agent.</span><span className="text-yellow-400">deploy</span>() <span className="text-purple-400">// ✅ Live in 30 seconds</span>
                </code>
              </pre>
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
