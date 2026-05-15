
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

const processDocumentSchema = z.object({
  documentId: z.string().uuid(),
});

const MAX_FILE_SIZE = 5242880;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Store documentId at top scope for error handler
  let parsedDocumentId: string | null = null;

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
    const validationResult = processDocumentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid document ID format', details: validationResult.error.issues }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { documentId } = validationResult.data;
    parsedDocumentId = documentId;

    const { data: rateLimitOk } = await supabaseClient.rpc('check_rag_rate_limit', {
      p_user_id: user.id,
      p_endpoint: 'rag-process-document',
      p_max_requests: 10,
      p_window_minutes: 60,
    });

    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Maximum 10 document uploads per hour.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log('Processing document:', documentId);

    const { data: document, error: docError } = await supabaseClient
      .from('rag_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) {
      throw new Error(`Failed to fetch document: ${docError.message}`);
    }

    if (document.file_size > MAX_FILE_SIZE) {
      await supabaseClient
        .from('rag_documents')
        .update({ status: 'error' })
        .eq('id', documentId);
      
      throw new Error('Document exceeds maximum size of 5MB');
    }

    await supabaseClient
      .from('rag_documents')
      .update({ status: 'processing' })
      .eq('id', documentId);

    const chunks = chunkText(document.content, document.chunk_size, document.overlap);
    console.log(`Created ${chunks.length} chunks`);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const chunkData = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);
      
      const embedding = await generateEmbedding(chunks[i], openaiApiKey);
      
      chunkData.push({
        document_id: documentId,
        chunk_number: i,
        content: chunks[i],
        embedding: embedding,
      });
    }

    const { error: chunksError } = await supabaseClient
      .from('rag_chunks')
      .insert(chunkData);

    if (chunksError) {
      throw new Error(`Failed to store chunks: ${chunksError.message}`);
    }

    await supabaseClient
      .from('rag_documents')
      .update({ status: 'processed' })
      .eq('id', documentId);

    console.log(`Successfully processed document ${documentId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        chunks_created: chunks.length,
        message: 'Document processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);

    // Update document status to error using the stored documentId
    if (parsedDocumentId) {
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
        
        await supabaseClient
          .from('rag_documents')
          .update({ status: 'error' })
          .eq('id', parsedDocumentId);
      } catch (updateError) {
        console.error('Failed to update document status to error:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ error: 'An internal error occurred while processing your document.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    
    if (end === text.length) break;
    start = end - overlap;
  }

  return chunks;
}

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
