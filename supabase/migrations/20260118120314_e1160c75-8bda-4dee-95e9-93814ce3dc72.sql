-- Create seo_projects table
CREATE TABLE public.seo_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  country TEXT DEFAULT 'US',
  language TEXT DEFAULT 'en',
  notes TEXT,
  priority_score INTEGER DEFAULT 3 CHECK (priority_score >= 1 AND priority_score <= 5),
  stack JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, domain)
);

-- Create seo_project_urls table
CREATE TABLE public.seo_project_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_key_url BOOLEAN DEFAULT false,
  discovered_from TEXT DEFAULT 'manual',
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, url)
);

-- Create seo_scan_runs table
CREATE TABLE public.seo_scan_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  triggered_by TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  urls_scanned INTEGER DEFAULT 0,
  urls_failed INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create seo_psi_results table
CREATE TABLE public.seo_psi_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_run_id UUID NOT NULL REFERENCES public.seo_scan_runs(id) ON DELETE CASCADE,
  url_id UUID NOT NULL REFERENCES public.seo_project_urls(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL CHECK (strategy IN ('mobile', 'desktop')),
  performance_score NUMERIC,
  accessibility_score NUMERIC,
  best_practices_score NUMERIC,
  seo_score NUMERIC,
  fcp_ms NUMERIC,
  lcp_ms NUMERIC,
  cls NUMERIC,
  tbt_ms NUMERIC,
  speed_index NUMERIC,
  raw_json JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create seo_issues table
CREATE TABLE public.seo_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psi_result_id UUID NOT NULL REFERENCES public.seo_psi_results(id) ON DELETE CASCADE,
  priority TEXT NOT NULL CHECK (priority IN ('P0', 'P1', 'P2')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  evidence JSONB DEFAULT '{}',
  fix_steps TEXT[] DEFAULT '{}',
  change_vs_previous JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create seo_prompt_templates table
CREATE TABLE public.seo_prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lovable_fix', 'developer_fix', 'content_seo')),
  template TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create seo_generated_prompts table
CREATE TABLE public.seo_generated_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_run_id UUID NOT NULL REFERENCES public.seo_scan_runs(id) ON DELETE CASCADE,
  url_id UUID REFERENCES public.seo_project_urls(id) ON DELETE SET NULL,
  prompt_type TEXT NOT NULL CHECK (prompt_type IN ('lovable_fix', 'developer_fix', 'content_seo')),
  prompt_content TEXT NOT NULL,
  issues_addressed UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_project_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_scan_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_psi_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_generated_prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seo_projects
CREATE POLICY "Users can view their own projects" ON public.seo_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all projects" ON public.seo_projects
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own projects" ON public.seo_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.seo_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.seo_projects
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all projects" ON public.seo_projects
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for seo_project_urls (via project ownership)
CREATE POLICY "Users can view URLs of their projects" ON public.seo_project_urls
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.seo_projects WHERE id = project_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all URLs" ON public.seo_project_urls
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage URLs of their projects" ON public.seo_project_urls
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.seo_projects WHERE id = project_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all URLs" ON public.seo_project_urls
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for seo_scan_runs
CREATE POLICY "Users can view scans of their projects" ON public.seo_scan_runs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.seo_projects WHERE id = project_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all scans" ON public.seo_scan_runs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage scans of their projects" ON public.seo_scan_runs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.seo_projects WHERE id = project_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all scans" ON public.seo_scan_runs
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for seo_psi_results
CREATE POLICY "Users can view PSI results of their projects" ON public.seo_psi_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seo_scan_runs sr
      JOIN public.seo_projects p ON sr.project_id = p.id
      WHERE sr.id = scan_run_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all PSI results" ON public.seo_psi_results
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage PSI results" ON public.seo_psi_results
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for seo_issues
CREATE POLICY "Users can view issues of their projects" ON public.seo_issues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seo_psi_results pr
      JOIN public.seo_scan_runs sr ON pr.scan_run_id = sr.id
      JOIN public.seo_projects p ON sr.project_id = p.id
      WHERE pr.id = psi_result_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all issues" ON public.seo_issues
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage issues" ON public.seo_issues
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for seo_prompt_templates
CREATE POLICY "Anyone can view templates" ON public.seo_prompt_templates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage templates" ON public.seo_prompt_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for seo_generated_prompts
CREATE POLICY "Users can view prompts of their projects" ON public.seo_generated_prompts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seo_scan_runs sr
      JOIN public.seo_projects p ON sr.project_id = p.id
      WHERE sr.id = scan_run_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all prompts" ON public.seo_generated_prompts
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage prompts" ON public.seo_generated_prompts
  FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_seo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_seo_projects_updated_at
  BEFORE UPDATE ON public.seo_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_seo_updated_at();

CREATE TRIGGER update_seo_prompt_templates_updated_at
  BEFORE UPDATE ON public.seo_prompt_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_seo_updated_at();

-- Insert default prompt templates
INSERT INTO public.seo_prompt_templates (name, type, template, is_default) VALUES
('Lovable Fix Prompt', 'lovable_fix', 'Fix the following performance and SEO issues for {{domain}}:

{{#issues}}
## {{priority}}: {{title}}
**Category:** {{category}}
**Description:** {{description}}
**Fix Steps:**
{{#fix_steps}}
- {{.}}
{{/fix_steps}}

{{/issues}}

Focus on P0 issues first, then P1, then P2. Implement the fixes without breaking existing functionality.', true),

('Developer Fix Prompt', 'developer_fix', '# Technical SEO Audit Fix Guide for {{domain}}

## Overview
- **Performance Score:** {{performance_score}}/100
- **SEO Score:** {{seo_score}}/100
- **Accessibility Score:** {{accessibility_score}}/100

## Critical Issues (P0)
{{#p0_issues}}
### {{title}}
**Impact:** {{description}}
**Technical Solution:**
```
{{#fix_steps}}
{{.}}
{{/fix_steps}}
```
**Evidence:** {{evidence}}

{{/p0_issues}}

## High Priority Issues (P1)
{{#p1_issues}}
### {{title}}
{{description}}
**Steps:**
{{#fix_steps}}
1. {{.}}
{{/fix_steps}}

{{/p1_issues}}

## Medium Priority Issues (P2)
{{#p2_issues}}
- **{{title}}**: {{description}}
{{/p2_issues}}', true),

('Content/SEO Prompt', 'content_seo', 'Optimize the content and SEO for {{url}}:

## Current Issues:
{{#seo_issues}}
- {{title}}: {{description}}
{{/seo_issues}}

## Recommendations:
1. Generate optimized meta title (under 60 characters)
2. Generate optimized meta description (under 160 characters)
3. Suggest improved heading structure (H1, H2, H3)
4. Identify missing alt text for images
5. Suggest internal linking opportunities
6. Recommend content improvements for target keywords

Current scores:
- SEO: {{seo_score}}/100
- Accessibility: {{accessibility_score}}/100', true);