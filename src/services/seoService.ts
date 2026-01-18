import { supabase } from '@/integrations/supabase/client';
import type { 
  SeoProject, 
  SeoProjectUrl, 
  SeoScanRun, 
  SeoPsiResult, 
  SeoIssue,
  SeoPromptTemplate,
  SeoGeneratedPrompt,
  SeoProjectFormData,
  SeoUrlFormData 
} from '@/types/seo';

// Projects
export async function getProjects(): Promise<SeoProject[]> {
  const { data, error } = await supabase
    .from('seo_projects')
    .select('*')
    .order('priority_score', { ascending: false })
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as unknown as SeoProject[];
}

export async function getProject(id: string): Promise<SeoProject | null> {
  const { data, error } = await supabase
    .from('seo_projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as unknown as SeoProject;
}

export async function createProject(project: SeoProjectFormData): Promise<SeoProject> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('seo_projects')
    .insert({
      ...project,
      user_id: user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as SeoProject;
}

export async function updateProject(id: string, project: Partial<SeoProjectFormData>): Promise<SeoProject> {
  const { data, error } = await supabase
    .from('seo_projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as SeoProject;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('seo_projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// URLs
export async function getProjectUrls(projectId: string): Promise<SeoProjectUrl[]> {
  const { data, error } = await supabase
    .from('seo_project_urls')
    .select('*')
    .eq('project_id', projectId)
    .order('is_key_url', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as unknown as SeoProjectUrl[];
}

export async function addUrl(projectId: string, urlData: SeoUrlFormData): Promise<SeoProjectUrl> {
  const { data, error } = await supabase
    .from('seo_project_urls')
    .insert({
      project_id: projectId,
      ...urlData,
      discovered_from: 'manual',
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as SeoProjectUrl;
}

export async function updateUrl(id: string, urlData: Partial<SeoUrlFormData>): Promise<SeoProjectUrl> {
  const { data, error } = await supabase
    .from('seo_project_urls')
    .update(urlData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as unknown as SeoProjectUrl;
}

export async function deleteUrl(id: string): Promise<void> {
  const { error } = await supabase
    .from('seo_project_urls')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Scan Runs
export async function getScanRuns(projectId: string): Promise<SeoScanRun[]> {
  const { data, error } = await supabase
    .from('seo_scan_runs')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as unknown as SeoScanRun[];
}

export async function getScanRun(id: string): Promise<SeoScanRun | null> {
  const { data, error } = await supabase
    .from('seo_scan_runs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as unknown as SeoScanRun;
}

// PSI Results
export async function getPsiResults(scanRunId: string): Promise<SeoPsiResult[]> {
  const { data, error } = await supabase
    .from('seo_psi_results')
    .select('*')
    .eq('scan_run_id', scanRunId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return (data || []) as unknown as SeoPsiResult[];
}

export async function getPsiResultsForUrl(urlId: string): Promise<SeoPsiResult[]> {
  const { data, error } = await supabase
    .from('seo_psi_results')
    .select('*')
    .eq('url_id', urlId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as unknown as SeoPsiResult[];
}

// Issues
export async function getIssues(psiResultId: string): Promise<SeoIssue[]> {
  const { data, error } = await supabase
    .from('seo_issues')
    .select('*')
    .eq('psi_result_id', psiResultId)
    .order('priority', { ascending: true });
  
  if (error) throw error;
  return (data || []) as unknown as SeoIssue[];
}

export async function getIssuesForScan(scanRunId: string): Promise<SeoIssue[]> {
  const { data, error } = await supabase
    .from('seo_psi_results')
    .select('id')
    .eq('scan_run_id', scanRunId);
  
  if (error) throw error;
  
  const resultIds = (data || []).map(r => r.id);
  if (resultIds.length === 0) return [];

  const { data: issues, error: issuesError } = await supabase
    .from('seo_issues')
    .select('*')
    .in('psi_result_id', resultIds)
    .order('priority', { ascending: true });
  
  if (issuesError) throw issuesError;
  return (issues || []) as unknown as SeoIssue[];
}

// Prompt Templates
export async function getPromptTemplates(): Promise<SeoPromptTemplate[]> {
  const { data, error } = await supabase
    .from('seo_prompt_templates')
    .select('*')
    .order('is_default', { ascending: false })
    .order('name', { ascending: true });
  
  if (error) throw error;
  return (data || []) as unknown as SeoPromptTemplate[];
}

// Generated Prompts
export async function getGeneratedPrompts(scanRunId: string): Promise<SeoGeneratedPrompt[]> {
  const { data, error } = await supabase
    .from('seo_generated_prompts')
    .select('*')
    .eq('scan_run_id', scanRunId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return (data || []) as unknown as SeoGeneratedPrompt[];
}

// Edge Function Calls
export async function triggerScan(projectId: string, urlIds?: string[]): Promise<{ scanRunId: string }> {
  const { data, error } = await supabase.functions.invoke('seo-scan-project', {
    body: { projectId, urlIds },
  });
  
  if (error) throw error;
  return data;
}

export async function discoverUrls(projectId: string): Promise<{ discovered: number; urls: string[] }> {
  const { data, error } = await supabase.functions.invoke('seo-discover-urls', {
    body: { projectId },
  });
  
  if (error) throw error;
  return data;
}

export async function generatePrompts(scanRunId: string): Promise<{ prompts: SeoGeneratedPrompt[] }> {
  const { data, error } = await supabase.functions.invoke('seo-generate-prompts', {
    body: { scanRunId },
  });
  
  if (error) throw error;
  return data;
}
