
import { supabase } from '@/integrations/supabase/client';
import { RagDocument, QueryResult } from '@/types/rag';

export const ragService = {
  async uploadDocument(file: File, chunkSize: number, overlap: number, embeddingModel: string) {
    const content = await file.text();
    
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
    return document;
  },

  async processDocument(documentId: string) {
    const { data, error } = await supabase.functions.invoke('rag-process-document', {
      body: { documentId }
    });

    if (error) throw error;
    return data;
  },

  async queryDocuments(query: string, numResults: number, minScore: number): Promise<QueryResult[]> {
    const { data, error } = await supabase.functions.invoke('rag-query', {
      body: { query, numResults, minScore }
    });

    if (error) throw error;
    return data.results;
  },

  async fetchDocuments(): Promise<RagDocument[]> {
    const { data, error } = await supabase
      .from('rag_documents' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return [];
    }
    
    if (data && Array.isArray(data)) {
      return data as unknown as RagDocument[];
    }
    
    return [];
  },

  async deleteDocument(documentId: string) {
    const { error } = await supabase
      .from('rag_documents' as any)
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }
};
