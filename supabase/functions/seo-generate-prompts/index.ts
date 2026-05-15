import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://generateai.dev',
  'https://www.generateai.dev',
  'https://generateai-dev.lovable.app',
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

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Authenticate user and verify project ownership
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    const { scanRunId } = await req.json();
    if (!scanRunId) throw new Error('scanRunId is required');

    // Get scan and verify ownership
    const { data: scan } = await supabase.from('seo_scan_runs').select('*, seo_projects(*)').eq('id', scanRunId).single();
    if (!scan) throw new Error('Scan not found');

    // Check ownership or admin role
    const isOwner = scan.seo_projects?.user_id === user.id;
    const { data: isAdmin } = await supabase.rpc('has_role', { user_id: user.id, role: 'admin' });
    if (!isOwner && !isAdmin) throw new Error('Access denied');

    const { data: issues } = await supabase.from('seo_psi_results').select('id').eq('scan_run_id', scanRunId);
    
    if (!issues?.length) throw new Error('No results for this scan');

    const issueIds = issues.map(i => i.id);
    const { data: allIssues } = await supabase.from('seo_issues').select('*').in('psi_result_id', issueIds);

    const p0 = allIssues?.filter(i => i.priority === 'P0') || [];
    const p1 = allIssues?.filter(i => i.priority === 'P1') || [];
    const p2 = allIssues?.filter(i => i.priority === 'P2') || [];

    const domain = scan?.seo_projects?.domain || 'Unknown';

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const generatePrompt = async (type: string, systemPrompt: string) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Domain: ${domain}\n\nP0 Issues:\n${p0.map(i => `- ${i.title}: ${i.description}`).join('\n')}\n\nP1 Issues:\n${p1.map(i => `- ${i.title}`).join('\n')}\n\nP2 Issues:\n${p2.map(i => `- ${i.title}`).join('\n')}` }
            ],
          }),
          signal: controller.signal,
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } finally {
        clearTimeout(timeout);
      }
    };

    const lovablePrompt = await generatePrompt('lovable_fix', 'You are an expert at writing prompts for Lovable AI editor. Generate a detailed, actionable prompt that can be pasted into Lovable to fix the SEO and performance issues listed. Focus on P0 issues first. Be specific about what files to modify and what changes to make.');
    
    const developerPrompt = await generatePrompt('developer_fix', 'You are a senior web developer. Generate a technical implementation guide with code examples to fix the SEO and performance issues listed. Include specific file paths, code changes, and best practices.');
    
    const seoPrompt = await generatePrompt('content_seo', 'You are an SEO specialist. Generate content optimization recommendations based on the issues found. Include meta tag suggestions, heading structure improvements, and content enhancement ideas.');

    const prompts = [];
    for (const [type, content] of [['lovable_fix', lovablePrompt], ['developer_fix', developerPrompt], ['content_seo', seoPrompt]]) {
      const { data } = await supabase.from('seo_generated_prompts').insert({
        scan_run_id: scanRunId,
        prompt_type: type,
        prompt_content: content,
        issues_addressed: allIssues?.map(i => i.id) || [],
      }).select().single();
      if (data) prompts.push(data);
    }

    return new Response(JSON.stringify({ prompts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Internal error in seo-generate-prompts:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
