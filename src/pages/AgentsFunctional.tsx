import { useState } from 'react';
import { Workflow, Plus, Play, Save, Settings, Trash2, GitBranch, Database, MessageSquare, Code, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEOHead from '@/components/seo/SEOHead';
import { toast } from 'sonner';

interface AgentNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'api';
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

const AgentsFunctional = () => {
  const [nodes, setNodes] = useState<AgentNode[]>([
    {
      id: 'node-1',
      type: 'trigger',
      label: 'HTTP Request',
      config: { method: 'POST', path: '/api/chat' },
      position: { x: 100, y: 100 }
    }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('My AI Agent');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const nodeTypes = [
    { type: 'trigger', icon: Zap, label: 'Trigger', color: 'text-green-500' },
    { type: 'action', icon: Play, label: 'Action', color: 'text-blue-500' },
    { type: 'condition', icon: GitBranch, label: 'Condition', color: 'text-yellow-500' },
    { type: 'api', icon: Database, label: 'API Call', color: 'text-purple-500' }
  ];

  const addNode = (type: string) => {
    const newNode: AgentNode = {
      id: `node-${Date.now()}`,
      type: type as any,
      label: `New ${type}`,
      config: {},
      position: { x: 200, y: 200 + nodes.length * 80 }
    };
    setNodes([...nodes, newNode]);
    toast.success(`${type} node added`);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
    toast.success('Node deleted');
  };

  const runAgent = () => {
    setIsRunning(true);
    setLogs([]);
    
    const newLogs = [
      '✓ Agent started...',
      '✓ Trigger: HTTP Request received',
      '✓ Processing node 1: HTTP Request',
      '✓ Executing action: LLM Query',
      '✓ API Response received (200ms)',
      '✓ Agent completed successfully'
    ];

    newLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === newLogs.length - 1) {
          setIsRunning(false);
          toast.success('Agent execution complete');
        }
      }, index * 500);
    });
  };

  const saveAgent = () => {
    toast.success(`Agent "${agentName}" saved successfully!`);
  };

  return (
    <>
      <SEOHead
        title="AI Agent Builder - Visual Workflow Creation | GenerateAI.dev"
        description="Build powerful AI agents with our visual drag-and-drop workflow builder. No coding required."
        keywords="AI agents, workflow builder, automation, no-code AI"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Header */}
        <section className="pt-24 pb-6 px-6 border-b">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Workflow size={32} className="text-primary" />
                <div>
                  <Input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="text-2xl font-bold border-none p-0 h-auto"
                  />
                  <p className="text-sm text-muted-foreground">Drag-and-drop agent builder</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={saveAgent}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button onClick={runAgent} disabled={isRunning || nodes.length === 0}>
                  <Play className="mr-2 h-4 w-4" /> {isRunning ? 'Running...' : 'Run Agent'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace */}
        <section className="py-6 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Sidebar - Node Palette */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Nodes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {nodeTypes.map(({ type, icon: Icon, label, color }) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addNode(type)}
                    >
                      <Icon className={`mr-2 h-4 w-4 ${color}`} />
                      {label}
                    </Button>
                  ))}

                  <div className="pt-6 border-t">
                    <h4 className="font-semibold mb-2">Templates</h4>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Customer Support Bot
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Database className="mr-2 h-4 w-4" />
                      Data Processing Pipeline
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Code className="mr-2 h-4 w-4" />
                      Code Review Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Center Canvas */}
              <div className="lg:col-span-2">
                <Card className="h-[600px]">
                  <CardContent className="p-6 h-full">
                    {nodes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Workflow size={64} className="text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Start Building Your Agent</h3>
                        <p className="text-muted-foreground">Add nodes from the left panel to create your workflow</p>
                      </div>
                    ) : (
                      <div className="space-y-4 overflow-y-auto h-full">
                        {nodes.map(node => (
                          <Card
                            key={node.id}
                            className={`cursor-pointer ${selectedNode === node.id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedNode(node.id)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-secondary px-2 py-1 rounded">{node.type}</span>
                                  <CardTitle className="text-base">{node.label}</CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNode(node.id);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    (() => {
                      const node = nodes.find(n => n.id === selectedNode);
                      if (!node) return null;

                      return (
                        <div className="space-y-4">
                          <div>
                            <Label>Node Label</Label>
                            <Input
                              value={node.label}
                              onChange={(e) => {
                                setNodes(nodes.map(n => 
                                  n.id === selectedNode ? {...n, label: e.target.value} : n
                                ));
                              }}
                            />
                          </div>

                          {node.type === 'trigger' && (
                            <div>
                              <Label>Trigger Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="HTTP Request" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="http">HTTP Request</SelectItem>
                                  <SelectItem value="cron">Schedule (Cron)</SelectItem>
                                  <SelectItem value="webhook">Webhook</SelectItem>
                                  <SelectItem value="queue">Message Queue</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {node.type === 'action' && (
                            <>
                              <div>
                                <Label>Action Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="LLM Query" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="llm">LLM Query</SelectItem>
                                    <SelectItem value="db">Database Query</SelectItem>
                                    <SelectItem value="email">Send Email</SelectItem>
                                    <SelectItem value="http">HTTP Request</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Prompt Template</Label>
                                <Textarea rows={4} placeholder="Enter your prompt..." />
                              </div>
                            </>
                          )}

                          {node.type === 'api' && (
                            <>
                              <div>
                                <Label>API Endpoint</Label>
                                <Input placeholder="https://api.example.com/endpoint" />
                              </div>
                              <div>
                                <Label>Method</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="GET" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="get">GET</SelectItem>
                                    <SelectItem value="post">POST</SelectItem>
                                    <SelectItem value="put">PUT</SelectItem>
                                    <SelectItem value="delete">DELETE</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Settings size={48} className="text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Select a node to configure</p>
                    </div>
                  )}

                  {/* Execution Logs */}
                  {logs.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-2">Execution Log</h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto bg-secondary p-3 rounded text-xs">
                        {logs.map((log, index) => (
                          <div key={index}>{log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Build Powerful AI Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Workflow size={32} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Visual Workflow Builder</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag-and-drop interface for building complex agent workflows
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Database size={32} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Connect Any API</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrate with external APIs, databases, and services
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Play size={32} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Test & Debug</h3>
                  <p className="text-sm text-muted-foreground">
                    Run and test your agents in real-time with detailed logs
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Zap size={32} className="mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Deploy Instantly</h3>
                  <p className="text-sm text-muted-foreground">
                    One-click deployment to production with monitoring
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AgentsFunctional;
