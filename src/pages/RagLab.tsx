
import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Database, FileText, Zap, Code, Play, Settings, Upload, Download } from 'lucide-react';

const RagLab = () => {
  const [selectedDataset, setSelectedDataset] = useState("sample");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  return (
    <>
      <SEOHead
        title="RAG Lab - Build Retrieval Augmented Generation Systems | GenerateAI.dev"
        description="Interactive RAG (Retrieval-Augmented Generation) laboratory. Build RAG systems, experiment with vector databases, and learn RAG implementation. Complete RAG tutorial with code examples, architecture guides & best practices."
        keywords="RAG systems tutorial, retrieval augmented generation, RAG implementation, build RAG system, RAG pipeline tutorial, RAG for developers, RAG system architecture, vector database tutorial, semantic search, RAG best practices, RAG development, LLM RAG integration"
        canonical="https://generateai.dev/rag-lab"
      />
      <div className="pt-20 bg-gradient-to-br from-navy via-navy/95 to-black">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-gradient">RAG Lab</span>
          </h1>
          <p className="text-xl text-light-gray max-w-2xl mx-auto">
            Experiment with Retrieval-Augmented Generation systems and vector databases
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">10K+</div>
              <div className="text-sm text-light-gray">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">5</div>
              <div className="text-sm text-light-gray">Vector DBs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal">99.2%</div>
              <div className="text-sm text-light-gray">Accuracy</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="playground" className="w-full">
          <TabsList className="mb-6 bg-navy/50 border border-white/20">
            <TabsTrigger value="playground" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Playground
            </TabsTrigger>
            <TabsTrigger value="datasets" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Datasets
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-teal" />
                    Query Interface
                  </CardTitle>
                  <CardDescription className="text-light-gray">
                    Ask questions about your documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Your Question</label>
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="What is the main topic of the document?"
                      className="bg-navy/50 border-white/20 text-white"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                    <Search className="w-4 h-4 mr-2" />
                    Search & Generate
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal" />
                    Results
                  </CardTitle>
                  <CardDescription className="text-light-gray">
                    Generated responses with source citations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-navy/50 rounded-lg p-4 border border-white/10 h-64">
                    <div className="text-center text-light-gray">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Submit a query to see RAG results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="datasets">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Sample Dataset</CardTitle>
                  <CardDescription className="text-light-gray">
                    Demo documents for testing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-light-gray">
                    <div>• 1,000 documents</div>
                    <div>• AI research papers</div>
                    <div>• Pre-processed vectors</div>
                  </div>
                  <Button className="w-full mt-4 border-white/20 text-white hover:bg-white/10" variant="outline">
                    Load Dataset
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models">
            <div className="text-center py-12">
              <h3 className="text-2xl font-display font-bold text-white mb-4">Coming Soon</h3>
              <p className="text-light-gray">Model comparison and fine-tuning tools</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <h3 className="text-2xl font-display font-bold text-white mb-4">Coming Soon</h3>
              <p className="text-light-gray">Performance analytics and insights</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default RagLab;
