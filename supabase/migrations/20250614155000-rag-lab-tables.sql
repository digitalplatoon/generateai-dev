
-- Create tables for RAG Lab functionality

-- Documents table to store uploaded files and their metadata
CREATE TABLE IF NOT EXISTS public.rag_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  chunk_size INTEGER DEFAULT 1000,
  overlap INTEGER DEFAULT 200,
  embedding_model TEXT DEFAULT 'OpenAI',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Document chunks table to store text chunks and their embeddings
CREATE TABLE IF NOT EXISTS public.rag_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.rag_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI embeddings are 1536 dimensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_chunks ENABLE ROW LEVEL SECURITY;

-- RLS policies for rag_documents
CREATE POLICY "Users can view their own documents" ON public.rag_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON public.rag_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON public.rag_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.rag_documents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for rag_chunks
CREATE POLICY "Users can view chunks of their documents" ON public.rag_chunks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rag_documents 
      WHERE id = rag_chunks.document_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert chunks for their documents" ON public.rag_chunks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rag_documents 
      WHERE id = rag_chunks.document_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rag_documents_user_id ON public.rag_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_rag_chunks_document_id ON public.rag_chunks(document_id);

-- Enable the vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.rag_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
