
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RagDocument {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  status: 'pending' | 'processing' | 'processed' | 'error';
  created_at: string;
  chunk_size: number;
  overlap: number;
  embedding_model: string;
}

export interface QueryResult {
  score: number;
  source: string;
  chunk: number;
  content: string;
}

export const useRagLab = () => {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const uploadDocument = async (file: File, chunkSize: number, overlap: number, embeddingModel: string) => {
    try {
      setIsLoading(true);
      
      // Read file content
      const content = await file.text();
      
      // Insert document record using type assertion for now
      const { data: document, error } = await supabase
        .from('rag_documents' as any)
        .insert({
          name: file.name,
          content,
          file_type: file.type || 'text/plain',
          file_size: file.size,
          chunk_size: chunkSize,
          overlap,
          embedding_model: embeddingModel,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Document uploaded!",
        description: "Processing will begin shortly.",
      });

      // Refresh documents list
      await fetchDocuments();
      
      return document;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const processDocument = async (documentId: string) => {
    try {
      setIsLoading(true);
      setProcessingProgress(0);

      // Start processing progress animation
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('rag-process-document', {
        body: { documentId }
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (error) throw error;

      toast({
        title: "Processing complete!",
        description: `Created ${data.chunks_created} chunks successfully.`,
      });

      // Refresh documents list
      await fetchDocuments();

      setTimeout(() => setProcessingProgress(0), 1000);
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const queryDocuments = async (query: string, numResults: number, minScore: number): Promise<QueryResult[]> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('rag-query', {
        body: { query, numResults, minScore }
      });

      if (error) throw error;

      toast({
        title: "Query executed!",
        description: `Found ${data.results.length} relevant chunks.`,
      });

      return data.results;
    } catch (error) {
      console.error('Query error:', error);
      toast({
        title: "Query failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('rag_documents' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('rag_documents' as any)
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Document deleted",
        description: "Document and all its chunks have been removed.",
      });

      await fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  };

  return {
    documents,
    isLoading,
    processingProgress,
    uploadDocument,
    processDocument,
    queryDocuments,
    fetchDocuments,
    deleteDocument,
  };
};
