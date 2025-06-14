
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, settings = {}, conversationId } = await req.json()

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
      conversationId
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
        stream: false, // We'll implement streaming in a future update
        user: conversationId // For rate limiting and monitoring
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

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
          settings_used: {
            model,
            temperature,
            max_tokens
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

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
