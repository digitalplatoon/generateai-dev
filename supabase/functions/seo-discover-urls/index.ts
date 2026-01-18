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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { projectId } = await req.json();
    if (!projectId) throw new Error('projectId is required');

    // Get project
    const { data: project, error: projectError } = await supabase
      .from('seo_projects')
      .select('domain')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    const domain = project.domain.replace(/\/$/, '');
    const urls: string[] = [];

    // Try sitemap.xml
    try {
      const sitemapUrl = `${domain}/sitemap.xml`;
      const response = await fetch(sitemapUrl, { headers: { 'User-Agent': 'SEO-Copilot/1.0' } });
      
      if (response.ok) {
        const xml = await response.text();
        const locMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
        for (const match of locMatches) {
          if (match[1] && !match[1].endsWith('.xml')) {
            urls.push(match[1]);
          }
        }
      }
    } catch (e) {
      console.log('Sitemap fetch failed:', e);
    }

    // Insert discovered URLs
    let inserted = 0;
    for (const url of urls.slice(0, 100)) {
      const { error } = await supabase
        .from('seo_project_urls')
        .upsert({
          project_id: projectId,
          url,
          is_key_url: false,
          discovered_from: 'sitemap',
        }, { onConflict: 'project_id,url' });
      
      if (!error) inserted++;
    }

    return new Response(JSON.stringify({ discovered: inserted, urls: urls.slice(0, 100) }), {
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
