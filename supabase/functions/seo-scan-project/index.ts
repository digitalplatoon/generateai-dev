import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PSI_API_KEY = Deno.env.get('GOOGLE_PSI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { projectId, urlIds } = await req.json();
    if (!projectId) throw new Error('projectId is required');

    // Get URLs to scan
    let query = supabase.from('seo_project_urls').select('*').eq('project_id', projectId);
    if (urlIds?.length) {
      query = query.in('id', urlIds);
    }
    const { data: urls, error: urlsError } = await query;
    if (urlsError) throw urlsError;
    if (!urls?.length) throw new Error('No URLs to scan');

    // Create scan run
    const { data: scanRun, error: scanError } = await supabase
      .from('seo_scan_runs')
      .insert({ project_id: projectId, triggered_by: 'manual', status: 'running', started_at: new Date().toISOString() })
      .select()
      .single();
    if (scanError) throw scanError;

    // Process URLs (simplified - in production use background job)
    let scanned = 0, failed = 0;

    for (const urlRecord of urls.slice(0, 10)) {
      for (const strategy of ['mobile', 'desktop'] as const) {
        try {
          const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(urlRecord.url)}&strategy=${strategy}${PSI_API_KEY ? `&key=${PSI_API_KEY}` : ''}`;
          const response = await fetch(psiUrl);
          const data = await response.json();

          if (data.error) {
            await supabase.from('seo_psi_results').insert({
              scan_run_id: scanRun.id,
              url_id: urlRecord.id,
              strategy,
              error_message: data.error.message,
            });
            failed++;
            continue;
          }

          const lh = data.lighthouseResult;
          const cats = lh?.categories || {};
          const audits = lh?.audits || {};

          await supabase.from('seo_psi_results').insert({
            scan_run_id: scanRun.id,
            url_id: urlRecord.id,
            strategy,
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

          // Extract issues
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
                psi_result_id: psiResult.id,
                priority,
                category: audit.id?.split('-')[0] || 'general',
                title: audit.title,
                description: audit.description,
                fix_steps: [],
              });
            }
          }

          await supabase.from('seo_project_urls').update({ last_scanned_at: new Date().toISOString() }).eq('id', urlRecord.id);
          
          // Rate limit
          await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
          console.error('Scan error:', e);
          failed++;
        }
      }
    }

    // Update scan run
    await supabase.from('seo_scan_runs').update({
      status: failed > 0 && scanned === 0 ? 'failed' : failed > 0 ? 'partial' : 'completed',
      completed_at: new Date().toISOString(),
      urls_scanned: scanned,
      urls_failed: failed,
    }).eq('id', scanRun.id);

    return new Response(JSON.stringify({ scanRunId: scanRun.id }), {
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
