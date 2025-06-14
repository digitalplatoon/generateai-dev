
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Code, Play, Settings, Monitor, GitBranch, Cpu } from 'lucide-react';

const AgentPlayground = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("Customer Support");

  const agentTemplates = [
    { name: "Customer Support", icon: "🎧", description: "Handle customer inquiries and support tickets" },
    { name: "Data Analyst", icon: "📊", description: "Analyze data and generate insights" },
    { name: "Code Reviewer", icon: "🔍", description: "Review code and suggest improvements" },
    { name: "Content Creator", icon: "✍️", description: "Generate and optimize content" },
    { name: "Research Assistant", icon: "🔬", description: "Gather and summarize research" },
    { name: "Sales Assistant", icon: "💼", description: "Qualify leads and manage sales processes" }
  ];

  const integrations = [
    { name: "OpenAI", status: "connected", type: "LLM" },
    { name: "Slack", status: "available", type: "Communication" },
    { name: "GitHub", status: "connected", type: "Development" },
    { name: "Google Sheets", status: "available", type: "Data" },
    { name: "Zapier", status: "available", type: "Automation" },
    { name: "Discord", status: "available", type: "Communication" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 bg-gradient-to-br from-navy via-navy/95 to-black">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-gradient">Agent Playground</span>
            </h1>
            <p className="text-xl text-light-gray max-w-2xl mx-auto">
              Build, test, and deploy AI agents with our visual workflow builder
            </p>
          </div>

          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="mb-6 bg-navy/50 border border-white/20">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="builder" className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Test
              </TabsTrigger>
              <TabsTrigger value="deploy" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Deploy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-4">Choose an Agent Template</h2>
                <p className="text-light-gray mb-6">Start with a pre-built agent template and customize it to your needs</p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agentTemplates.map((template, index) => (
                    <Card 
                      key={index} 
                      className={`glass border-white/20 hover-glow transition-all duration-300 hover:scale-105 cursor-pointer ${
                        selectedTemplate === template.name ? 'border-teal/50 bg-teal/10' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template.name)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{template.icon}</span>
                          <CardTitle className="text-xl font-display text-white">
                            {template.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-light-gray">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          className={`w-full ${
                            selectedTemplate === template.name 
                              ? 'bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold'
                              : 'border-white/20 text-white hover:bg-white/10'
                          }`}
                          variant={selectedTemplate === template.name ? "default" : "outline"}
                        >
                          {selectedTemplate === template.name ? 'Selected' : 'Select Template'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Button className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                    Start with {selectedTemplate}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="builder">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="glass border-white/20 h-96">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-teal" />
                        Visual Workflow Builder
                      </CardTitle>
                      <CardDescription className="text-light-gray">
                        Drag and drop components to build your agent workflow
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-full">
                      <div className="border-2 border-dashed border-white/20 rounded-lg h-full flex items-center justify-center">
                        <div className="text-center">
                          <GitBranch className="w-16 h-16 text-teal mx-auto mb-4" />
                          <p className="text-white mb-2">Visual Builder Coming Soon</p>
                          <p className="text-sm text-light-gray">Drag and drop interface for building agent workflows</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="glass border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-teal" />
                        Agent Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Agent Name</label>
                        <Input
                          defaultValue={selectedTemplate}
                          className="bg-navy/50 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Model</label>
                        <select className="w-full p-2 bg-navy/50 border border-white/20 rounded text-white">
                          <option>GPT-4</option>
                          <option>GPT-3.5 Turbo</option>
                          <option>Claude</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Temperature</label>
                        <Input
                          type="number"
                          defaultValue="0.7"
                          step="0.1"
                          min="0"
                          max="2"
                          className="bg-navy/50 border-white/20 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-teal" />
                        Components
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {['Input', 'LLM Call', 'Function', 'Condition', 'Output'].map((component) => (
                          <div key={component} className="p-2 bg-navy/50 rounded border border-white/10 text-sm text-white cursor-pointer hover:bg-white/10">
                            {component}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Play className="w-5 h-5 text-teal" />
                      Test Your Agent
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Chat with your agent to test its responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-navy/50 rounded-lg p-4 border border-white/10 h-64 overflow-y-auto">
                      <div className="space-y-3">
                        <div className="flex justify-end">
                          <div className="bg-teal/20 text-teal px-3 py-2 rounded-lg text-sm max-w-xs">
                            Hello, can you help me with my order?
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm max-w-xs">
                            Of course! I'd be happy to help you with your order. Could you please provide me with your order number?
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        className="bg-navy/50 border-white/20 text-white"
                      />
                      <Button className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-teal" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Monitor your agent's performance and responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Response Time</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          1.2s avg
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Success Rate</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          98.5%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Total Interactions</span>
                        <span className="text-sm text-white">1,247</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Tokens Used</span>
                        <span className="text-sm text-white">45,692</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="deploy">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-teal" />
                      Deploy Your Agent
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Choose how you want to deploy your agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                        Deploy as API
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Deploy to Slack
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Deploy to Discord
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Deploy as Web Widget
                      </Button>
                    </div>
                    <div className="bg-navy/50 rounded-lg p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-2">Deployment Features</h4>
                      <ul className="text-xs text-light-gray space-y-1">
                        <li>• Auto-scaling infrastructure</li>
                        <li>• Real-time monitoring</li>
                        <li>• Usage analytics</li>
                        <li>• Custom domains</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Integrations</CardTitle>
                    <CardDescription className="text-light-gray">
                      Connect your agent to external services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {integrations.map((integration, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-navy/50 rounded-lg border border-white/10">
                          <div>
                            <span className="text-sm font-medium text-white">{integration.name}</span>
                            <p className="text-xs text-light-gray">{integration.type}</p>
                          </div>
                          <Badge 
                            className={
                              integration.status === 'connected' 
                                ? 'bg-green-500/20 text-green-300 border-green-400/30'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                            }
                          >
                            {integration.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgentPlayground;
