import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ragService } from '@/services/ragService';
import { RagDocument, QueryResult } from '@/types/rag';

// Re-export QueryResult so it can be imported by components
export { QueryResult } from '@/types/rag';

export const useRagLab = () => {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const uploadDocument = async (file: File, chunkSize: number, overlap: number, embeddingModel: string) => {
    try {
      setIsLoading(true);
      
      const document = await ragService.uploadDocument(file, chunkSize, overlap, embeddingModel);

      toast({
        title: "Document uploaded!",
        description: "Processing will begin shortly.",
      });

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

      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const data = await ragService.processDocument(documentId);

      clearInterval(progressInterval);
      setProcessingProgress(100);

      toast({
        title: "Processing complete!",
        description: `Created ${data.chunks_created} chunks successfully.`,
      });

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

      const results = await ragService.queryDocuments(query, numResults, minScore);

      toast({
        title: "Query executed!",
        description: `Found ${results.length} relevant chunks.`,
      });

      return results;
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
      const documents = await ragService.fetchDocuments();
      setDocuments(documents);
    } catch (error) {
      console.error('Fetch error:', error);
      setDocuments([]);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await ragService.deleteDocument(documentId);

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
