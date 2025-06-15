import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, Zap, Code, Play, Settings, Monitor, GitBranch, Cpu, MessageSquare, Users, BarChart3, Workflow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AgentPlayground = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("Customer Support");
  const [agentName, setAgentName] = useState("Customer Support");
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  const [temperature, setTemperature] = useState(0.7);
  const [chatMessages, setChatMessages] = useState([
    { role: "user", content: "Hello, can you help me with my order?" },
    { role: "assistant", content: "Of course! I'd be happy to help you with your order. Could you please provide me with your order number?" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const agentTemplates = [
    { 
      name: "Customer Support", 
      icon: "🎧", 
      description: "Handle customer inquiries and support tickets",
      complexity: "Beginner",
      estimatedTime: "5 min"
    },
    { 
      name: "Data Analyst", 
      icon: "📊", 
      description: "Analyze data and generate insights",
      complexity: "Intermediate",
      estimatedTime: "10 min"
    },
    { 
      name: "Code Reviewer", 
      icon: "🔍", 
      description: "Review code and suggest improvements",
      complexity: "Advanced",
      estimatedTime: "15 min"
    },
    { 
      name: "Content Creator", 
      icon: "✍️", 
      description: "Generate and optimize content",
      complexity: "Beginner",
      estimatedTime: "5 min"
    },
    { 
      name: "Research Assistant", 
      icon: "🔬", 
      description: "Gather and summarize research",
      complexity: "Intermediate",
      estimatedTime: "10 min"
    },
    { 
      name: "Sales Assistant", 
      icon: "💼", 
      description: "Qualify leads and manage sales processes",
      complexity: "Advanced",
      estimatedTime: "15 min"
    }
  ];

  const integrations = [
    { name: "OpenAI", status: "connected", type: "LLM", description: "GPT models for text generation" },
    { name: "Slack", status: "available", type: "Communication", description: "Team collaboration platform" },
    { name: "GitHub", status: "connected", type: "Development", description: "Code repository management" },
    { name: "Google Sheets", status: "available", type: "Data", description: "Spreadsheet data processing" },
    { name: "Zapier", status: "available", type: "Automation", description: "Workflow automation" },
    { name: "Discord", status: "available", type: "Communication", description: "Community chat platform" }
  ];

  const workflowComponents = [
    { name: "Input", description: "Receive user input", icon: MessageSquare },
    { name: "LLM Call", description: "Process with language model", icon: Bot },
    { name: "Function", description: "Execute custom logic", icon: Code },
    { name: "Condition", description: "Branch based on criteria", icon: GitBranch },
    { name: "Output", description: "Return response", icon: Zap }
  ];

  const performanceMetrics = {
    responseTime: "1.2s",
    successRate: "98.5%",
    totalInteractions: 1247,
    tokensUsed: 45692,
    averageRating: 4.8,
    activeUsers: 156
  };

  const getComplexityColor = (complexity: string) => {
    switch(complexity) {
      case "Beginner": return "bg-green-500/20 text-green-300 border-green-400/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "Advanced": return "bg-red-500/20 text-red-300 border-red-400/30";
      default: return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { role: "user", content: newMessage }]);
    setNewMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I understand your question. Let me help you with that. Based on your request, I can provide you with the information you need." 
      }]);
    }, 1000);
  };

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    setAgentName(templateName);
    toast({
      title: "Template selected!",
      description: `${templateName} template is now ready for customization.`,
    });
  };

  const handleDeploy = (platform: string) => {
    toast({
      title: `Deploying to ${platform}`,
      description: "Your agent is being deployed. You'll receive a notification when it's ready.",
    });
  };

  return (
    <div className="pt-20 bg-gradient-to-br from-navy via-navy/95 to-black">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-gradient">Agent Playground</span>
          </h1>
          <p className="text-xl text-light-gray max-w-2xl mx-auto">
            Build, test, and deploy AI agents with our visual workflow builder
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">50+</div>
              <div className="text-sm text-light-gray">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">20+</div>
              <div className="text-sm text-light-gray">Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">1K+</div>
              <div className="text-sm text-light-gray">Deployed Agents</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="mb-6 bg-navy/50 border border-white/20">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
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
                    onClick={() => handleTemplateSelect(template.name)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <CardTitle className="text-xl font-display text-white">
                              {template.name}
                            </CardTitle>
                          </div>
                        </div>
                        <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>
                      <CardDescription className="text-light-gray">
                        {template.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-sm text-light-gray">
                        <span>⏱️ {template.estimatedTime}</span>
                      </div>
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
                      <Workflow className="w-5 h-5 text-teal" />
                      Visual Workflow Builder
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Drag and drop components to build your agent workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-full">
                    <div className="border-2 border-dashed border-white/20 rounded-lg h-full flex items-center justify-center">
                      <div className="text-center">
                        <Workflow className="w-16 h-16 text-teal mx-auto mb-4" />
                        <p className="text-white mb-2">Visual Builder Interface</p>
                        <p className="text-sm text-light-gray">Drag components from the right panel to build your workflow</p>
                        <Button className="mt-4 bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                          Open Builder
                        </Button>
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
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="bg-navy/50 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Model</label>
                      <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-2 bg-navy/50 border border-white/20 rounded text-white"
                      >
                        <option value="GPT-4">GPT-4</option>
                        <option value="GPT-3.5 Turbo">GPT-3.5 Turbo</option>
                        <option value="Claude">Claude</option>
                        <option value="Gemini">Gemini</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Temperature: {temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full"
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
                      {workflowComponents.map((component) => (
                        <div 
                          key={component.name} 
                          className="flex items-center gap-3 p-3 bg-navy/50 rounded border border-white/10 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <component.icon className="w-4 h-4 text-teal" />
                          <div>
                            <div className="font-medium">{component.name}</div>
                            <div className="text-xs text-light-gray">{component.description}</div>
                          </div>
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
                    <MessageSquare className="w-5 h-5 text-teal" />
                    Test Your Agent
                  </CardTitle>
                  <CardDescription className="text-light-gray">
                    Chat with your agent to test its responses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-navy/50 rounded-lg p-4 border border-white/10 h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {chatMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.role === 'user' 
                              ? 'bg-teal/20 text-teal' 
                              : 'bg-white/10 text-white'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-navy/50 border-white/20 text-white"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-light-gray">
                    Monitor your agent's performance and responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-navy/50 rounded-lg border border-white/10">
                        <div className="text-lg font-bold text-teal">{performanceMetrics.responseTime}</div>
                        <div className="text-xs text-light-gray">Avg Response Time</div>
                      </div>
                      <div className="text-center p-3 bg-navy/50 rounded-lg border border-white/10">
                        <div className="text-lg font-bold text-green-300">{performanceMetrics.successRate}</div>
                        <div className="text-xs text-light-gray">Success Rate</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Total Interactions</span>
                        <span className="text-sm text-white">{performanceMetrics.totalInteractions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Tokens Used</span>
                        <span className="text-sm text-white">{performanceMetrics.tokensUsed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Average Rating</span>
                        <span className="text-sm text-white">{performanceMetrics.averageRating}/5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-light-gray">Active Users</span>
                        <span className="text-sm text-white">{performanceMetrics.activeUsers}</span>
                      </div>
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
                    <Button 
                      onClick={() => handleDeploy("API")}
                      className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Deploy as API
                    </Button>
                    <Button 
                      onClick={() => handleDeploy("Slack")}
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Deploy to Slack
                    </Button>
                    <Button 
                      onClick={() => handleDeploy("Discord")}
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Deploy to Discord
                    </Button>
                    <Button 
                      onClick={() => handleDeploy("Web Widget")}
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
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
                      <li>• SSL certificates</li>
                      <li>• Load balancing</li>
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
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">{integration.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {integration.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-light-gray">{integration.description}</p>
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
                  <Button className="w-full mt-4 border-white/20 text-white hover:bg-white/10" variant="outline">
                    Browse More Integrations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentPlayground;
