import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [logsResult, progressResult, preferencesResult] = await Promise.all([
      supabase.from("ai_audit_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
      supabase.from("user_progress").select("*").eq("user_id", user.id),
      supabase.from("user_preferences").select("*").eq("user_id", user.id).single(),
    ]);

    const logs = logsResult.data || [];
    const progress = progressResult.data || [];
    const preferences = preferencesResult.data;

    const summary = {
      totalActions: logs.length,
      recentActions: logs.slice(0, 10).map(l => l.action_type),
      successRate: logs.length > 0 ? (logs.filter(l => l.status === "success").length / logs.length * 100).toFixed(1) : 0,
      avgResponseTime: logs.length > 0 ? (logs.reduce((acc, l) => acc + (l.processing_time_ms || 0), 0) / logs.length).toFixed(0) : 0,
      learningProgress: progress.length > 0 ? (progress.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / progress.length).toFixed(0) : 0,
      learningPaths: progress.map(p => ({ path: p.learning_path_id, progress: p.progress_percentage })),
      preferences: preferences ? { pace: preferences.learning_pace, role: preferences.preferred_role } : null,
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are an AI learning assistant analyzing user behavior patterns. Generate 3-5 actionable, personalized insights and recommendations based on the user's activity data. Be specific, encouraging, and helpful. Format your response as a JSON array of objects with 'type' (insight/recommendation/tip), 'title', 'description', and 'priority' (low/medium/high) fields."
            },
            {
              role: "user",
              content: `Analyze this user's behavior and generate personalized insights:\n${JSON.stringify(summary, null, 2)}`
            }
          ],
          tools: [{
            type: "function",
            function: {
              name: "generate_insights",
              description: "Generate personalized insights and recommendations",
              parameters: {
                type: "object",
                properties: {
                  insights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["insight", "recommendation", "tip"] },
                        title: { type: "string" },
                        description: { type: "string" },
                        priority: { type: "string", enum: ["low", "medium", "high"] }
                      },
                      required: ["type", "title", "description", "priority"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["insights"],
                additionalProperties: false
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "generate_insights" } }
        }),
        signal: controller.signal,
      });

      if (!aiResponse.ok) {
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errorText = await aiResponse.text();
        console.error("AI gateway error:", aiResponse.status, errorText);
        return new Response(JSON.stringify({ error: "Failed to generate insights" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      
      if (!toolCall) {
        return new Response(JSON.stringify({ error: "No insights generated" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const insights = JSON.parse(toolCall.function.arguments).insights;

      return new Response(JSON.stringify({ insights }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("Internal error in generate-insights:", error);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
