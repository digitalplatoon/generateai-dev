import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { scanRunId } = await req.json();
    if (!scanRunId) throw new Error('scanRunId is required');

    // Get scan and issues
    const { data: scan } = await supabase.from('seo_scan_runs').select('*, seo_projects(*)').eq('id', scanRunId).single();
    const { data: issues } = await supabase.from('seo_psi_results').select('id').eq('scan_run_id', scanRunId);
    
    if (!issues?.length) throw new Error('No results for this scan');

    const issueIds = issues.map(i => i.id);
    const { data: allIssues } = await supabase.from('seo_issues').select('*').in('psi_result_id', issueIds);

    const p0 = allIssues?.filter(i => i.priority === 'P0') || [];
    const p1 = allIssues?.filter(i => i.priority === 'P1') || [];
    const p2 = allIssues?.filter(i => i.priority === 'P2') || [];

    const domain = scan?.seo_projects?.domain || 'Unknown';

    // Generate prompts using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const generatePrompt = async (type: string, systemPrompt: string) => {
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
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    };

    const lovablePrompt = await generatePrompt('lovable_fix', 'You are an expert at writing prompts for Lovable AI editor. Generate a detailed, actionable prompt that can be pasted into Lovable to fix the SEO and performance issues listed. Focus on P0 issues first. Be specific about what files to modify and what changes to make.');
    
    const developerPrompt = await generatePrompt('developer_fix', 'You are a senior web developer. Generate a technical implementation guide with code examples to fix the SEO and performance issues listed. Include specific file paths, code changes, and best practices.');
    
    const seoPrompt = await generatePrompt('content_seo', 'You are an SEO specialist. Generate content optimization recommendations based on the issues found. Include meta tag suggestions, heading structure improvements, and content enhancement ideas.');

    // Save prompts
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
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
