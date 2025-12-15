-- Enable the vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the rag_chunks table for storing document chunks with embeddings
CREATE TABLE public.rag_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.rag_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  chunk_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for vector similarity search
CREATE INDEX idx_rag_chunks_embedding ON public.rag_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for document lookups
CREATE INDEX idx_rag_chunks_document_id ON public.rag_chunks(document_id);

-- Enable Row Level Security
ALTER TABLE public.rag_chunks ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view chunks of their own documents
CREATE POLICY "Users can view chunks of their documents" 
ON public.rag_chunks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.rag_documents 
    WHERE id = rag_chunks.document_id AND user_id = auth.uid()
  )
);

-- INSERT: Users can insert chunks for their own documents
CREATE POLICY "Users can insert chunks for their documents" 
ON public.rag_chunks 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rag_documents 
    WHERE id = rag_chunks.document_id AND user_id = auth.uid()
  )
);

-- UPDATE: Users can update chunks of their own documents
CREATE POLICY "Users can update chunks of their documents" 
ON public.rag_chunks 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.rag_documents 
    WHERE id = rag_chunks.document_id AND user_id = auth.uid()
  )
);

-- DELETE: Users can delete chunks of their own documents
CREATE POLICY "Users can delete chunks of their documents" 
ON public.rag_chunks 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.rag_documents 
    WHERE id = rag_chunks.document_id AND user_id = auth.uid()
  )
);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION public.search_chunks(
  query_embedding vector(1536),
  match_count INTEGER DEFAULT 5,
  min_similarity FLOAT DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  chunk_number INTEGER,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.id,
    rc.document_id,
    rc.content,
    rc.chunk_number,
    1 - (rc.embedding <=> query_embedding) AS similarity
  FROM rag_chunks rc
  INNER JOIN rag_documents rd ON rd.id = rc.document_id
  WHERE rd.user_id = auth.uid()
    AND 1 - (rc.embedding <=> query_embedding) >= min_similarity
  ORDER BY rc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;