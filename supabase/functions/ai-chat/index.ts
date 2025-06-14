
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Advanced content filtering patterns
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
  
  // Check for suspicious keyword patterns
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (lowerContent.includes(keyword)) {
      return { isMalicious: true, reason: `Suspicious keyword detected: ${keyword}` };
    }
  }
  
  // Check for regex patterns
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      return { isMalicious: true, reason: `Malicious pattern detected` };
    }
  }
  
  // Check for excessive repetition (potential prompt stuffing)
  const words = content.split(/\s+/);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  
  if (wordCount > 50 && uniqueWords / wordCount < 0.3) {
    return { isMalicious: true, reason: 'Potential prompt stuffing detected' };
  }
  
  // Check for extremely long inputs (potential DoS)
  if (content.length > 10000) {
    return { isMalicious: true, reason: 'Input too long' };
  }
  
  return { isMalicious: false };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, settings = {}, conversationId, stream = true } = await req.json()

    // Content filtering for the latest user message
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
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }
      }
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Default settings
    const {
      model = 'gpt-4o-mini',
      temperature = 0.7,
      max_tokens = 1000,
      stop_sequences = [],
      custom_instructions = '',
      do_not_train = true
    } = settings

    // Prepare messages for OpenAI
    const openaiMessages = []
    
    // Add custom instructions if provided
    if (custom_instructions) {
      openaiMessages.push({
        role: 'system',
        content: custom_instructions
      })
    }

    // Add conversation messages
    openaiMessages.push(...messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    })))

    console.log('Sending request to OpenAI:', {
      model,
      temperature,
      max_tokens,
      messageCount: openaiMessages.length,
      conversationId,
      streaming: stream
    })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        ...(do_not_train && { 'OpenAI-Beta': 'assistants=v1' })
      },
      body: JSON.stringify({
        model,
        messages: openaiMessages,
        temperature,
        max_tokens,
        stop: stop_sequences.length > 0 ? stop_sequences : undefined,
        stream,
        user: conversationId // For rate limiting and monitoring
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    if (stream) {
      // Handle streaming response
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      const readable = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

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
                    // Send final response with metadata
                    const finalChunk = {
                      type: 'done',
                      content: fullContent,
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
                      const chunk = {
                        type: 'chunk',
                        content,
                        delta: content
                      };
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
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
      // Handle non-streaming response (existing logic)
      const data = await response.json()
      
      console.log('OpenAI response:', {
        model: data.model,
        usage: data.usage,
        conversationId
      })

      return new Response(
        JSON.stringify({
          content: data.choices[0].message.content,
          model: data.model,
          usage: data.usage,
          metadata: {
            timestamp: new Date().toISOString(),
            conversation_id: conversationId,
            settings_used: { model, temperature, max_tokens }
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

  } catch (error) {
    console.error('AI chat error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
