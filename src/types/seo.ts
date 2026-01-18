export interface SeoProject {
  id: string;
  user_id: string;
  domain: string;
  name: string;
  tags: string[];
  country: string;
  language: string;
  notes: string | null;
  priority_score: number;
  stack: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface SeoProjectUrl {
  id: string;
  project_id: string;
  url: string;
  is_key_url: boolean;
  discovered_from: string;
  last_scanned_at: string | null;
  created_at: string;
}

export interface SeoScanRun {
  id: string;
  project_id: string;
  triggered_by: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'partial';
  started_at: string | null;
  completed_at: string | null;
  urls_scanned: number;
  urls_failed: number;
  error_message: string | null;
  created_at: string;
}

export interface SeoPsiResult {
  id: string;
  scan_run_id: string;
  url_id: string;
  strategy: 'mobile' | 'desktop';
  performance_score: number | null;
  accessibility_score: number | null;
  best_practices_score: number | null;
  seo_score: number | null;
  fcp_ms: number | null;
  lcp_ms: number | null;
  cls: number | null;
  tbt_ms: number | null;
  speed_index: number | null;
  raw_json: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
}

export interface SeoIssue {
  id: string;
  psi_result_id: string;
  priority: 'P0' | 'P1' | 'P2';
  category: string;
  title: string;
  description: string | null;
  evidence: Record<string, unknown>;
  fix_steps: string[];
  change_vs_previous: {
    direction: 'improved' | 'regressed' | 'new' | 'unchanged';
    delta?: number;
  } | null;
  created_at: string;
}

export interface SeoPromptTemplate {
  id: string;
  name: string;
  type: 'lovable_fix' | 'developer_fix' | 'content_seo';
  template: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeoGeneratedPrompt {
  id: string;
  scan_run_id: string;
  url_id: string | null;
  prompt_type: 'lovable_fix' | 'developer_fix' | 'content_seo';
  prompt_content: string;
  issues_addressed: string[];
  created_at: string;
}

export interface SeoProjectFormData {
  domain: string;
  name: string;
  tags: string[];
  country: string;
  language: string;
  notes: string;
  priority_score: number;
  stack: Record<string, string>;
}

export interface SeoUrlFormData {
  url: string;
  is_key_url: boolean;
}

export interface PsiScores {
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
}

export interface ScanProgress {
  total: number;
  completed: number;
  failed: number;
  current_url?: string;
}
