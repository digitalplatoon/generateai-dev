
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const ALLOWED_ORIGINS = [
  'https://generateai.dev',
  'https://www.generateai.dev',
  'https://preview--generateai-dev.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isLovablePreview = origin.match(/^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.lovable\.app$/);
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) || isLovablePreview ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
}

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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const validationResult = querySchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input parameters', details: validationResult.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query, numResults, minScore } = validationResult.data;

    const { data: rateLimitOk } = await supabaseClient.rpc('check_rag_rate_limit', {
      p_user_id: user.id,
      p_endpoint: 'rag-query',
      p_max_requests: 100,
      p_window_minutes: 1,
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing query:', query.substring(0, 100));

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const queryEmbedding = await generateEmbedding(query, openaiApiKey);

    const { data: chunks, error: searchError } = await supabaseClient.rpc('search_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: minScore,
      match_count: numResults,
    });

    if (searchError) {
      throw new Error(`Search failed: ${searchError.message}`);
    }

    // Batch-fetch document names to avoid N+1 queries
    const documentIds = [...new Set((chunks || []).map((c: any) => c.document_id))];
    const documentMap: Record<string, string> = {};
    
    if (documentIds.length > 0) {
      const { data: documents } = await supabaseClient
        .from('rag_documents')
        .select('id, name')
        .in('id', documentIds);
      
      for (const doc of documents || []) {
        documentMap[doc.id] = doc.name;
      }
    }

    const results = (chunks || []).map((chunk: any) => ({
      score: chunk.similarity,
      source: documentMap[chunk.document_id] || 'Unknown',
      chunk: (chunk.chunk_index ?? chunk.chunk_number ?? 0) + 1,
      content: chunk.content,
    }));

    console.log(`Found ${results.length} relevant chunks`);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Internal error in rag-query:', error);
    return new Response(
      JSON.stringify({ error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
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
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } finally {
    clearTimeout(timeout);
  }
}
