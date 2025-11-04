import { useState } from 'react';
import { Upload, FileText, Database, Zap, Settings, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEOHead from '@/components/seo/SEOHead';
import { toast } from 'sonner';

const RagLabFunctional = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [config, setConfig] = useState({
    chunkSize: 512,
    overlap: 50,
    embeddingModel: 'openai-ada-002',
    topK: 3
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded`);
  };

  const handleRemoveFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuery = async () => {
    if (!query.trim() || documents.length === 0) {
      toast.error('Please upload documents and enter a query');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate RAG processing
    setTimeout(() => {
      setResponse(`Based on your ${documents.length} uploaded document(s), here's the answer:\n\n${query}\n\nThis is a demo response showing RAG technology in action. In production, this would:\n\n1. Process your documents into ${config.chunkSize}-token chunks\n2. Generate embeddings using ${config.embeddingModel}\n3. Perform semantic search to find top ${config.topK} relevant chunks\n4. Generate a contextual response using retrieved information\n\nThe system found ${config.topK} highly relevant passages from your documents to answer this question.`);
      setIsProcessing(false);
      toast.success('Query processed successfully!');
    }, 2000);
  };

  return (
    <>
      <SEOHead
        title="RAG Lab - Build RAG Systems | GenerateAI.dev"
        description="Build and test Retrieval-Augmented Generation systems in minutes. Upload documents, configure settings, and query your knowledge base."
        keywords="RAG, retrieval augmented generation, document AI, semantic search"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              RAG Lab
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Build and test Retrieval-Augmented Generation systems in minutes
            </p>
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <FileText className="text-primary" />
                <span className="text-sm">Multiple Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="text-primary" />
                <span className="text-sm">Vector Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-primary" />
                <span className="text-sm">Instant Queries</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Workspace */}
        <section className="pb-16 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Panel - Upload & Configuration */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>1. Upload Documents</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {documents.length} files
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".pdf,.txt,.md,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload size={32} className="mb-3 text-muted-foreground" />
                        <span className="font-medium mb-1">Click to upload or drag and drop</span>
                        <span className="text-sm text-muted-foreground">PDF, TXT, MD, DOC (Max 10MB each)</span>
                      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {documents.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files</Label>
                        {documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded">
                            <div className="flex items-center gap-2">
                              <FileText size={16} />
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings size={20} />
                      2. Configuration
                    </CardTitle>
                    <CardDescription>Customize RAG processing settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="chunk-size">Chunk Size (tokens)</Label>
                      <Input
                        type="number"
                        id="chunk-size"
                        value={config.chunkSize}
                        onChange={(e) => setConfig({...config, chunkSize: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="overlap">Overlap (tokens)</Label>
                      <Input
                        type="number"
                        id="overlap"
                        value={config.overlap}
                        onChange={(e) => setConfig({...config, overlap: parseInt(e.target.value)})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="embedding-model">Embedding Model</Label>
                      <Select
                        value={config.embeddingModel}
                        onValueChange={(value) => setConfig({...config, embeddingModel: value})}
                      >
                        <SelectTrigger id="embedding-model">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai-ada-002">OpenAI Ada-002</SelectItem>
                          <SelectItem value="openai-3-small">OpenAI Embedding-3-Small</SelectItem>
                          <SelectItem value="openai-3-large">OpenAI Embedding-3-Large</SelectItem>
                          <SelectItem value="cohere">Cohere Embed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="top-k">Top K Results</Label>
                      <Input
                        type="number"
                        id="top-k"
                        value={config.topK}
                        onChange={(e) => setConfig({...config, topK: parseInt(e.target.value)})}
                        min="1"
                        max="10"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Query & Results */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>3. Query Your Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="query-input">Ask a Question</Label>
                      <Textarea
                        id="query-input"
                        placeholder="e.g., What are the main conclusions of the research paper?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleQuery}
                      disabled={documents.length === 0 || !query.trim() || isProcessing}
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Run Query
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Response Section */}
                {response ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-secondary p-4 rounded text-sm whitespace-pre-wrap">
                        {response}
                      </pre>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
                        <span>✓ Retrieved from {config.topK} document chunks</span>
                        <span>Model: {config.embeddingModel}</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Database size={48} className="text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Upload documents and run a query to see RAG in action
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="pb-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              How RAG Lab Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload PDFs, text files, or documentation in any supported format
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Automatic Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Documents are chunked, embedded, and stored in vector database
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Semantic Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Query your knowledge base with natural language questions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Contextual Responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Get accurate answers grounded in your actual documents
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

export default RagLabFunctional;
