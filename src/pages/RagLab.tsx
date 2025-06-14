
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Database, Cpu, Search, Settings, Play, Download } from 'lucide-react';

const RagLab = () => {
  const [selectedEmbedding, setSelectedEmbedding] = useState("OpenAI");
  const [selectedVectorDB, setSelectedVectorDB] = useState("Pinecone");
  const [queryText, setQueryText] = useState("");

  const embeddingModels = ["OpenAI", "Cohere", "Sentence-BERT", "HuggingFace"];
  const vectorDatabases = ["Pinecone", "Weaviate", "Chroma", "Qdrant"];

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
                    <div className="grid grid-cols-2 gap-2">
                      {embeddingModels.map((model) => (
                        <Button
                          key={model}
                          variant={selectedEmbedding === model ? "default" : "outline"}
                          onClick={() => setSelectedEmbedding(model)}
                          className={selectedEmbedding === model 
                            ? "bg-teal text-navy hover:bg-teal/80" 
                            : "border-white/20 text-white hover:bg-white/10"
                          }
                        >
                          {model}
                        </Button>
                      ))}
                    </div>
                    <div className="bg-navy/50 rounded-lg p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-2">Model Details</h4>
                      <p className="text-xs text-light-gray">
                        {selectedEmbedding === "OpenAI" && "High-quality embeddings with 1536 dimensions. Best for general use cases."}
                        {selectedEmbedding === "Cohere" && "Multilingual embeddings optimized for semantic search and retrieval."}
                        {selectedEmbedding === "Sentence-BERT" && "Open-source model optimized for semantic similarity tasks."}
                        {selectedEmbedding === "HuggingFace" && "Customizable models from the HuggingFace model hub."}
                      </p>
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
                    <div className="grid grid-cols-2 gap-2">
                      {vectorDatabases.map((db) => (
                        <Button
                          key={db}
                          variant={selectedVectorDB === db ? "default" : "outline"}
                          onClick={() => setSelectedVectorDB(db)}
                          className={selectedVectorDB === db 
                            ? "bg-teal text-navy hover:bg-teal/80" 
                            : "border-white/20 text-white hover:bg-white/10"
                          }
                        >
                          {db}
                        </Button>
                      ))}
                    </div>
                    <div className="bg-navy/50 rounded-lg p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-2">Database Features</h4>
                      <p className="text-xs text-light-gray">
                        {selectedVectorDB === "Pinecone" && "Managed vector database with excellent performance and scaling."}
                        {selectedVectorDB === "Weaviate" && "Open-source vector database with GraphQL API and rich filtering."}
                        {selectedVectorDB === "Chroma" && "Simple, fast, and embeddable vector database for Python."}
                        {selectedVectorDB === "Qdrant" && "High-performance vector search engine with advanced filtering."}
                      </p>
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
                      <p className="text-sm text-light-gray">Supports PDF, TXT, DOCX, MD files</p>
                      <Button className="mt-4 bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                        Choose Files
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-navy/50 rounded-lg border border-white/10">
                        <span className="text-sm text-white">sample-document.pdf</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Processed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-navy/50 rounded-lg border border-white/10">
                        <span className="text-sm text-white">knowledge-base.txt</span>
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">Processing</Badge>
                      </div>
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
                        defaultValue="1000"
                        className="bg-navy/50 border-white/20 text-white"
                      />
                      <p className="text-xs text-light-gray mt-1">Number of characters per chunk</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Overlap</label>
                      <Input
                        type="number"
                        defaultValue="200"
                        className="bg-navy/50 border-white/20 text-white"
                      />
                      <p className="text-xs text-light-gray mt-1">Character overlap between chunks</p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
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
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Number of Results</label>
                      <Input
                        type="number"
                        defaultValue="5"
                        className="bg-navy/50 border-white/20 text-white"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
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
                    <div className="space-y-3">
                      <div className="p-3 bg-navy/50 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-teal/20 text-teal border-teal/30">Score: 0.95</Badge>
                          <span className="text-xs text-light-gray">document.pdf - chunk 1</span>
                        </div>
                        <p className="text-sm text-white">This is a sample retrieved chunk that matches your query...</p>
                      </div>
                      <div className="p-3 bg-navy/50 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-teal/20 text-teal border-teal/30">Score: 0.87</Badge>
                          <span className="text-xs text-light-gray">knowledge.txt - chunk 5</span>
                        </div>
                        <p className="text-sm text-white">Another relevant chunk from your knowledge base...</p>
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
                        Download Python Code
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Download Node.js Code
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Export as API
                      </Button>
                    </div>
                    <div className="bg-navy/50 rounded-lg p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-2">Deployment Options</h4>
                      <ul className="text-xs text-light-gray space-y-1">
                        <li>• Docker container ready</li>
                        <li>• Serverless function support</li>
                        <li>• API endpoint generation</li>
                        <li>• Cloud deployment guides</li>
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
                        <span className="text-sm text-white">2 processed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-light-gray">Total Chunks:</span>
                        <span className="text-sm text-white">156</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
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
