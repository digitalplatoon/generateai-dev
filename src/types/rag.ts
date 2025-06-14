
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
