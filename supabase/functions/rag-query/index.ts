
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { query, numResults = 5, minScore = 0.7 } = await req.json();
    console.log('Processing query:', query);

    // Generate embedding for the query
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const queryEmbedding = await generateEmbedding(query, openaiApiKey);

    // Search for similar chunks using vector similarity
    const { data: chunks, error: searchError } = await supabaseClient.rpc('search_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: minScore,
      match_count: numResults,
    });

    if (searchError) {
      throw new Error(`Search failed: ${searchError.message}`);
    }

    // Get document information for each chunk
    const results = [];
    for (const chunk of chunks || []) {
      const { data: document } = await supabaseClient
        .from('rag_documents')
        .select('name')
        .eq('id', chunk.document_id)
        .single();

      results.push({
        score: chunk.similarity,
        source: document?.name || 'Unknown',
        chunk: chunk.chunk_index + 1,
        content: chunk.content,
      });
    }

    console.log(`Found ${results.length} relevant chunks`);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in RAG query:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}
