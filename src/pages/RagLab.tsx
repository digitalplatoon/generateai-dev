
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Database, Cpu, Search, Settings, Play, Download, FileText, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RagLab = () => {
  const [selectedEmbedding, setSelectedEmbedding] = useState("OpenAI");
  const [selectedVectorDB, setSelectedVectorDB] = useState("Pinecone");
  const [queryText, setQueryText] = useState("");
  const [chunkSize, setChunkSize] = useState("1000");
  const [overlap, setOverlap] = useState("200");
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const embeddingModels = [
    { name: "OpenAI", description: "High-quality embeddings with 1536 dimensions", price: "$0.0001/1K tokens" },
    { name: "Cohere", description: "Multilingual embeddings for semantic search", price: "$0.0001/1K tokens" },
    { name: "Sentence-BERT", description: "Open-source semantic similarity model", price: "Free" },
    { name: "HuggingFace", description: "Customizable models from model hub", price: "Varies" }
  ];

  const vectorDatabases = [
    { name: "Pinecone", description: "Managed vector database with excellent performance", features: ["Auto-scaling", "Real-time updates", "Metadata filtering"] },
    { name: "Weaviate", description: "Open-source with GraphQL API", features: ["Vector search", "Hybrid search", "Graph relations"] },
    { name: "Chroma", description: "Simple and embeddable for Python", features: ["Local storage", "Memory efficient", "Easy integration"] },
    { name: "Qdrant", description: "High-performance with advanced filtering", features: ["Fast queries", "Payload filtering", "Clustering"] }
  ];

  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "sample-document.pdf", status: "processed", size: "2.4 MB", chunks: 45 },
    { name: "knowledge-base.txt", status: "processing", size: "1.8 MB", chunks: 0 },
    { name: "technical-docs.md", status: "pending", size: "956 KB", chunks: 0 }
  ]);

  const queryResults = [
    {
      score: 0.95,
      source: "sample-document.pdf",
      chunk: 1,
      content: "This section explains the fundamental concepts of retrieval-augmented generation systems and how they combine pre-trained language models with external knowledge bases..."
    },
    {
      score: 0.87,
      source: "knowledge-base.txt",
      chunk: 5,
      content: "Vector embeddings are dense numerical representations of text that capture semantic meaning. They enable efficient similarity search across large document collections..."
    },
    {
      score: 0.82,
      source: "technical-docs.md",
      chunk: 12,
      content: "Implementation best practices include proper chunking strategies, overlap management, and metadata filtering to improve retrieval accuracy and system performance..."
    }
  ];

  const handleFileUpload = () => {
    toast({
      title: "Files uploaded successfully!",
      description: "Your documents are being processed and will be ready shortly.",
    });
    setProcessingProgress(25);
  };

  const handleProcessDocuments = () => {
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Processing complete!",
            description: "All documents have been processed and are ready for querying.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleRunQuery = () => {
    if (!queryText.trim()) {
      toast({
        title: "Please enter a query",
        description: "You need to enter a question to search your knowledge base.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Query executed!",
      description: "Found relevant chunks from your knowledge base.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "processed": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "processing": return <Clock className="w-4 h-4 text-yellow-400" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "processed": return "bg-green-500/20 text-green-300 border-green-400/30";
      case "processing": return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "pending": return "bg-gray-500/20 text-gray-300 border-gray-400/30";
      default: return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 bg-gradient-to-br from-navy via-navy/95 to-black">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-gradient">RAG Lab</span>
            </h1>
            <p className="text-xl text-light-gray max-w-2xl mx-auto">
              Build, test, and deploy Retrieval-Augmented Generation systems with our interactive lab
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">10+</div>
                <div className="text-sm text-light-gray">Vector DBs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">5+</div>
                <div className="text-sm text-light-gray">Embedding Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal">100+</div>
                <div className="text-sm text-light-gray">File Formats</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="mb-6 bg-navy/50 border border-white/20">
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="query" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Query & Test
              </TabsTrigger>
              <TabsTrigger value="deploy" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Deploy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-teal" />
                      Embedding Model
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Choose how your documents will be converted to vectors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {embeddingModels.map((model) => (
                        <div 
                          key={model.name}
                          onClick={() => setSelectedEmbedding(model.name)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedEmbedding === model.name 
                              ? "border-teal bg-teal/10" 
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{model.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {model.price}
                            </Badge>
                          </div>
                          <p className="text-sm text-light-gray">{model.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-teal" />
                      Vector Database
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Select where your vectors will be stored and searched
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {vectorDatabases.map((db) => (
                        <div 
                          key={db.name}
                          onClick={() => setSelectedVectorDB(db.name)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedVectorDB === db.name 
                              ? "border-teal bg-teal/10" 
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          <h4 className="font-semibold text-white mb-2">{db.name}</h4>
                          <p className="text-sm text-light-gray mb-2">{db.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {db.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Upload className="w-5 h-5 text-teal" />
                      Upload Documents
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Add documents to your knowledge base
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-teal mx-auto mb-4" />
                      <p className="text-white mb-2">Drop files here or click to upload</p>
                      <p className="text-sm text-light-gray mb-4">Supports PDF, TXT, DOCX, MD, CSV files</p>
                      <Button 
                        onClick={handleFileUpload}
                        className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                      >
                        Choose Files
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-navy/50 rounded-lg border border-white/10">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-light-gray" />
                            <div>
                              <span className="text-sm text-white">{file.name}</span>
                              <p className="text-xs text-light-gray">
                                {file.size} • {file.chunks > 0 ? `${file.chunks} chunks` : 'Not processed'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(file.status)}
                            <Badge className={getStatusColor(file.status)}>
                              {file.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Processing Settings</CardTitle>
                    <CardDescription className="text-light-gray">
                      Configure how documents are chunked and processed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Chunk Size</label>
                      <Input
                        type="number"
                        value={chunkSize}
                        onChange={(e) => setChunkSize(e.target.value)}
                        className="bg-navy/50 border-white/20 text-white"
                      />
                      <p className="text-xs text-light-gray mt-1">Number of characters per chunk</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Overlap</label>
                      <Input
                        type="number"
                        value={overlap}
                        onChange={(e) => setOverlap(e.target.value)}
                        className="bg-navy/50 border-white/20 text-white"
                      />
                      <p className="text-xs text-light-gray mt-1">Character overlap between chunks</p>
                    </div>
                    
                    {processingProgress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm text-light-gray mb-1">
                          <span>Processing Progress</span>
                          <span>{processingProgress}%</span>
                        </div>
                        <Progress value={processingProgress} className="h-2 bg-navy/50" />
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleProcessDocuments}
                      className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Process Documents
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="query">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Search className="w-5 h-5 text-teal" />
                      Test Your RAG System
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Query your knowledge base and see the results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Query</label>
                      <Textarea
                        placeholder="Ask a question about your documents..."
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        className="bg-navy/50 border-white/20 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Number of Results</label>
                        <Input
                          type="number"
                          defaultValue="5"
                          className="bg-navy/50 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Min Score</label>
                        <Input
                          type="number"
                          defaultValue="0.7"
                          step="0.1"
                          min="0"
                          max="1"
                          className="bg-navy/50 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleRunQuery}
                      className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run Query
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Results</CardTitle>
                    <CardDescription className="text-light-gray">
                      Retrieved chunks and similarity scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {queryResults.map((result, index) => (
                        <div key={index} className="p-3 bg-navy/50 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-teal/20 text-teal border-teal/30">
                              Score: {result.score}
                            </Badge>
                            <span className="text-xs text-light-gray">
                              {result.source} - chunk {result.chunk}
                            </span>
                          </div>
                          <p className="text-sm text-white leading-relaxed">{result.content}</p>
                        </div>
                      ))}
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
                      <Download className="w-5 h-5 text-teal" />
                      Export Your RAG System
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      Get code and configuration files for deployment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                        <Download className="w-4 h-4 mr-2" />
                        Download Python Code
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        <Download className="w-4 h-4 mr-2" />
                        Download Node.js Code
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        <Zap className="w-4 h-4 mr-2" />
                        Export as API
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        <Database className="w-4 h-4 mr-2" />
                        Export Vector Database
                      </Button>
                    </div>
                    <div className="bg-navy/50 rounded-lg p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-2">Deployment Options</h4>
                      <ul className="text-xs text-light-gray space-y-1">
                        <li>• Docker container ready</li>
                        <li>• Serverless function support</li>
                        <li>• API endpoint generation</li>
                        <li>• Cloud deployment guides</li>
                        <li>• Kubernetes manifests</li>
                        <li>• CI/CD pipeline templates</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">System Summary</CardTitle>
                    <CardDescription className="text-light-gray">
                      Overview of your RAG configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-light-gray">Embedding Model:</span>
                        <span className="text-sm text-white">{selectedEmbedding}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-light-gray">Vector Database:</span>
                        <span className="text-sm text-white">{selectedVectorDB}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-light-gray">Documents:</span>
                        <span className="text-sm text-white">{uploadedFiles.length} processed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-light-gray">Total Chunks:</span>
                        <span className="text-sm text-white">
                          {uploadedFiles.reduce((sum, file) => sum + file.chunks, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-light-gray">Chunk Size:</span>
                        <span className="text-sm text-white">{chunkSize} chars</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-light-gray">Overlap:</span>
                        <span className="text-sm text-white">{overlap} chars</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
                      <Download className="w-4 h-4 mr-2" />
                      Save Configuration
                    </Button>
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

export default RagLab;
