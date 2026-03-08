import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

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

const MALICIOUS_PATTERNS = [
  /(?:prompt|instruction|system)[\s\S]*(?:ignore|forget|disregard)/i,
  /(?:jailbreak|bypass|override|hack)/i,
  /(?:pretend|roleplay|act as)[\s\S]*(?:admin|root|system)/i,
  /(?:script|javascript|html|sql|injection)/i,
  /(?:execute|eval|run)[\s\S]*(?:code|command)/i,
];

const SUSPICIOUS_KEYWORDS = [
  'ignore previous instructions',
  'forget everything',
  'new instructions',
  'system override',
  'admin mode',
  'developer mode',
  'debug mode',
  'bypass safety',
];

function detectMaliciousInput(content: string): { isMalicious: boolean; reason?: string } {
  const lowerContent = content.toLowerCase();
  
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (lowerContent.includes(keyword)) {
      return { isMalicious: true, reason: `Suspicious keyword detected: ${keyword}` };
    }
  }
  
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      return { isMalicious: true, reason: `Malicious pattern detected` };
    }
  }
  
  const words = content.split(/\s+/);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  
  if (wordCount > 50 && uniqueWords / wordCount < 0.3) {
    return { isMalicious: true, reason: 'Potential prompt stuffing detected' };
  }
  
  if (content.length > 10000) {
    return { isMalicious: true, reason: 'Input too long' };
  }
  
  return { isMalicious: false };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Authenticated request from user:', user.id)

    const { messages, settings = {}, conversationId, stream = true } = await req.json()

    if (messages && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.role === 'user') {
        const filterResult = detectMaliciousInput(latestMessage.content);
        if (filterResult.isMalicious) {
          console.log('Malicious input detected:', filterResult.reason);
          return new Response(
            JSON.stringify({
              error: 'Content policy violation detected',
              details: 'Your message contains content that violates our usage policies.',
              timestamp: new Date().toISOString()
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const {
      model = 'gpt-4o-mini',
      temperature = 0.7,
      max_tokens = 1000,
      stop_sequences = [],
      custom_instructions = '',
      do_not_train = true
    } = settings

    const openaiMessages = []
    
    if (custom_instructions) {
      openaiMessages.push({ role: 'system', content: custom_instructions })
    }

    openaiMessages.push(...messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    })))

    console.log('Sending request to OpenAI:', {
      model, temperature, max_tokens,
      messageCount: openaiMessages.length,
      conversationId, streaming: stream
    })

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          ...(do_not_train && { 'OpenAI-Beta': 'assistants=v1' })
        },
        body: JSON.stringify({
          model, messages: openaiMessages, temperature, max_tokens,
          stop: stop_sequences.length > 0 ? stop_sequences : undefined,
          stream, user: conversationId
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json()
        console.error('OpenAI API error:', errorData)
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
      }

      if (stream) {
        clearTimeout(timeout);
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        
        const readable = new ReadableStream({
          async start(controller) {
            const reader = response.body?.getReader();
            if (!reader) { controller.close(); return; }

            let buffer = '';
            let fullContent = '';

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                      const finalChunk = {
                        type: 'done', content: fullContent,
                        metadata: {
                          timestamp: new Date().toISOString(),
                          conversation_id: conversationId,
                          settings_used: { model, temperature, max_tokens }
                        }
                      };
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
                      controller.close();
                      return;
                    }

                    try {
                      const parsed = JSON.parse(data);
                      const content = parsed.choices?.[0]?.delta?.content;
                      if (content) {
                        fullContent += content;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content, delta: content })}\n\n`));
                      }
                    } catch (e) { /* skip invalid JSON */ }
                  }
                }
              }
            } catch (error) {
              console.error('Streaming error:', error);
              controller.error(error);
            }
          }
        });

        return new Response(readable, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } else {
        const data = await response.json()
        
        console.log('OpenAI response:', { model: data.model, usage: data.usage, conversationId })

        return new Response(
          JSON.stringify({
            content: data.choices[0].message.content,
            model: data.model, usage: data.usage,
            metadata: {
              timestamp: new Date().toISOString(),
              conversation_id: conversationId,
              settings_used: { model, temperature, max_tokens }
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } finally {
      clearTimeout(timeout);
    }

  } catch (error) {
    console.error('AI chat error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error', timestamp: new Date().toISOString() }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
