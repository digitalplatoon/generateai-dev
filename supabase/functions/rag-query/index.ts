
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Allowed origins for CORS - restrict to trusted domains only
const ALLOWED_ORIGINS = [
  'https://generateai.dev',
  'https://www.generateai.dev',
  'https://preview--generateai-dev.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Input validation schema
const querySchema = z.object({
  query: z.string().min(1).max(2000),
  numResults: z.number().int().min(1).max(50).optional().default(5),
  minScore: z.number().min(0).max(1).optional().default(0.7),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
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

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse and validate input
    const body = await req.json();
    const validationResult = querySchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input parameters', details: validationResult.error.issues }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { query, numResults, minScore } = validationResult.data;

    // Check rate limit: 100 queries per minute
    const { data: rateLimitOk } = await supabaseClient.rpc('check_rag_rate_limit', {
      p_user_id: user.id,
      p_endpoint: 'rag-query',
      p_max_requests: 100,
      p_window_minutes: 1,
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing query:', query.substring(0, 100));

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
