
-- Create a function to search for similar chunks using vector similarity
CREATE OR REPLACE FUNCTION search_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  document_id uuid,
  chunk_index int,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rag_chunks.document_id,
    rag_chunks.chunk_index,
    rag_chunks.content,
    1 - (rag_chunks.embedding <=> query_embedding) as similarity
  FROM rag_chunks
  JOIN rag_documents ON rag_chunks.document_id = rag_documents.id
  WHERE rag_documents.user_id = auth.uid()
    AND rag_documents.status = 'processed'
    AND 1 - (rag_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY rag_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
