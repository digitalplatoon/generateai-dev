import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

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

const scanRequestSchema = z.object({
  projectId: z.string().uuid('Invalid project ID format'),
  urlIds: z.array(z.string().uuid('Invalid URL ID format')).optional(),
});

const PSI_API_KEY = Deno.env.get('GOOGLE_PSI_API_KEY');

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

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await req.json();
    const parseResult = scanRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.error('Validation failed:', parseResult.error.errors);
      return new Response(JSON.stringify({ 
        error: 'Invalid request parameters',
        details: parseResult.error.errors.map(e => e.message)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { projectId, urlIds } = parseResult.data;

    // Verify ownership or admin
    const { data: project, error: projectError } = await supabase
      .from('seo_projects')
      .select('user_id')
      .eq('id', projectId)
      .single();
    if (projectError || !project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const isOwner = project.user_id === user.id;
    const { data: isAdmin } = await supabase.rpc('has_role', { user_id: user.id, role: 'admin' });
    if (!isOwner && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let query = supabase.from('seo_project_urls').select('*').eq('project_id', projectId);
    if (urlIds?.length) {
      query = query.in('id', urlIds);
    }
    const { data: urls, error: urlsError } = await query;
    if (urlsError) throw urlsError;
    if (!urls?.length) throw new Error('No URLs to scan');

    const { data: scanRun, error: scanError } = await supabase
      .from('seo_scan_runs')
      .insert({ project_id: projectId, triggered_by: 'manual', status: 'running', started_at: new Date().toISOString() })
      .select()
      .single();
    if (scanError) throw scanError;

    let scanned = 0, failed = 0;

    for (const urlRecord of urls.slice(0, 10)) {
      for (const strategy of ['mobile', 'desktop'] as const) {
        try {
          const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(urlRecord.url)}&strategy=${strategy}${PSI_API_KEY ? `&key=${PSI_API_KEY}` : ''}`;
          
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);
          
          try {
            const response = await fetch(psiUrl, { signal: controller.signal });
            const data = await response.json();

            if (data.error) {
              await supabase.from('seo_psi_results').insert({
                scan_run_id: scanRun.id, url_id: urlRecord.id, strategy,
                error_message: data.error.message,
              });
              failed++;
              continue;
            }

            const lh = data.lighthouseResult;
            const cats = lh?.categories || {};
            const audits = lh?.audits || {};

            await supabase.from('seo_psi_results').insert({
              scan_run_id: scanRun.id, url_id: urlRecord.id, strategy,
              performance_score: cats.performance?.score ? cats.performance.score * 100 : null,
              accessibility_score: cats.accessibility?.score ? cats.accessibility.score * 100 : null,
              best_practices_score: cats['best-practices']?.score ? cats['best-practices'].score * 100 : null,
              seo_score: cats.seo?.score ? cats.seo.score * 100 : null,
              fcp_ms: audits['first-contentful-paint']?.numericValue,
              lcp_ms: audits['largest-contentful-paint']?.numericValue,
              cls: audits['cumulative-layout-shift']?.numericValue,
              tbt_ms: audits['total-blocking-time']?.numericValue,
              speed_index: audits['speed-index']?.numericValue,
              raw_json: data,
            });
            scanned++;

            const failedAudits = Object.values(audits).filter((a: any) => a.score !== null && a.score < 0.9);
            for (const audit of failedAudits.slice(0, 20) as any[]) {
              const priority = audit.score < 0.5 ? 'P0' : audit.score < 0.75 ? 'P1' : 'P2';
              const { data: psiResult } = await supabase
                .from('seo_psi_results')
                .select('id')
                .eq('scan_run_id', scanRun.id)
                .eq('url_id', urlRecord.id)
                .eq('strategy', strategy)
                .single();

              if (psiResult) {
                await supabase.from('seo_issues').insert({
                  psi_result_id: psiResult.id, priority,
                  category: audit.id?.split('-')[0] || 'general',
                  title: audit.title, description: audit.description,
                  fix_steps: [],
                });
              }
            }

            await supabase.from('seo_project_urls').update({ last_scanned_at: new Date().toISOString() }).eq('id', urlRecord.id);
          } finally {
            clearTimeout(timeout);
          }
          
          await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
          console.error('Scan error:', e);
          failed++;
        }
      }
    }

    await supabase.from('seo_scan_runs').update({
      status: failed > 0 && scanned === 0 ? 'failed' : failed > 0 ? 'partial' : 'completed',
      completed_at: new Date().toISOString(),
      urls_scanned: scanned, urls_failed: failed,
    }).eq('id', scanRun.id);

    return new Response(JSON.stringify({ scanRunId: scanRun.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Internal error in seo-scan-project:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
