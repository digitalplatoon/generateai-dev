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

function validateDomainSafety(domain: string): void {
  let domainUrl: URL;
  try {
    domainUrl = new URL(domain);
  } catch {
    throw new Error('Invalid domain URL format');
  }

  if (!['http:', 'https:'].includes(domainUrl.protocol)) {
    throw new Error('Invalid protocol: only http/https allowed');
  }

  const hostname = domainUrl.hostname.toLowerCase();

  const BLOCKED_PATTERNS = [
    /^localhost$/i,
    /^127\./,
    /^0\.0\.0\.0$/,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^169\.254\./,
    /^fc00:/,
    /^fe80:/,
    /^\[::1\]$/,
  ];

  if (BLOCKED_PATTERNS.some(pattern => pattern.test(hostname))) {
    throw new Error('Cannot fetch from internal/private IP addresses');
  }

  if (!hostname.includes('.')) {
    throw new Error('Domain must be a valid public hostname');
  }
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

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    const { projectId } = await req.json();
    if (!projectId) throw new Error('projectId is required');

    // Verify ownership or admin
    const { data: project, error: projectError } = await supabase
      .from('seo_projects')
      .select('domain, user_id')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    const isOwner = project.user_id === user.id;
    const { data: isAdmin } = await supabase.rpc('has_role', { user_id: user.id, role: 'admin' });
    if (!isOwner && !isAdmin) throw new Error('Access denied');

    const domain = project.domain.replace(/\/$/, '');
    
    // Validate domain to prevent SSRF
    validateDomainSafety(domain);
    
    const urls: string[] = [];

    // Try sitemap.xml with timeout
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const sitemapUrl = `${domain}/sitemap.xml`;
      const response = await fetch(sitemapUrl, { 
        headers: { 'User-Agent': 'SEO-Copilot/1.0' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      
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
    console.error('Internal error in seo-discover-urls:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
