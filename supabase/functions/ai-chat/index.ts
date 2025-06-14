
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const checkRateLimit = (userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit) {
    rateLimitMap.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (now - userLimit.timestamp > windowMs) {
    rateLimitMap.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
};

// Input validation
const validateChatInput = (message: string): boolean => {
  if (!message || typeof message !== 'string') return false;
  if (message.length < 1 || message.length > 1000) return false;
  if (message.trim().length === 0) return false;
  
  // Check for potentially malicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(message));
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .substring(0, 1000); // Ensure max length
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Extract user ID from JWT (basic implementation)
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    if (!userId) {
      throw new Error('Invalid user ID');
    }

    // Rate limiting
    if (!checkRateLimit(userId, 10, 60000)) { // 10 requests per minute per user
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait before making another request.',
          success: false 
        }),
        {
          status: 429,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
        },
      )
    }

    const { message, history = [] }: ChatRequest = await req.json()

    // Validate input
    if (!validateChatInput(message)) {
      throw new Error('Invalid message format or content');
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedHistory = history
      .slice(-5) // Limit history to last 5 messages
      .map(msg => ({
        role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
        content: sanitizeInput(msg.content || '')
      }))
      .filter(msg => msg.content.length > 0);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Build the conversation history with system prompt
    const messages = [
      {
        role: 'system',
        content: 'You are an AI assistant specialized in helping developers learn and build with generative AI. You provide practical advice, code examples, and explanations about AI development, machine learning, and building AI-powered applications. Keep responses concise and helpful. Do not execute code or access external systems.'
      },
      ...sanitizedHistory,
      {
        role: 'user',
        content: sanitizedMessage
      }
    ]

    // Call OpenAI API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 800, // Reduced token limit
          temperature: 0.7,
          frequency_penalty: 0.5,
          presence_penalty: 0.3,
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
      }

      const data = await response.json()
      const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

      // Sanitize AI response
      const sanitizedResponse = sanitizeInput(aiMessage);

      return new Response(
        JSON.stringify({ 
          message: sanitizedResponse,
          success: true 
        }),
        {
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
        },
      )
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in ai-chat function:', error)
    
    // Don't expose internal error details
    const safeErrorMessage = error.message.includes('Rate limit') 
      ? error.message 
      : 'An error occurred while processing your request';
    
    return new Response(
      JSON.stringify({ 
        error: safeErrorMessage,
        success: false 
      }),
      {
        status: error.message.includes('Rate limit') ? 429 : 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      },
    )
  }
})
