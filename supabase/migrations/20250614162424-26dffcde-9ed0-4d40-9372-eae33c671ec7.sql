
-- Create tables for user experience improvements

-- User progress tracking table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_path_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, learning_path_id, module_id)
);

-- Bookmarks and favorites table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('learning_path', 'prompt', 'document', 'agent')),
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- User onboarding progress
CREATE TABLE IF NOT EXISTS public.user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, step_id)
);

-- Enhanced user preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  learning_pace TEXT DEFAULT 'normal' CHECK (learning_pace IN ('slow', 'normal', 'fast')),
  notifications_enabled BOOLEAN DEFAULT true,
  preferred_role TEXT DEFAULT 'Beginner',
  preferred_tech_stack TEXT DEFAULT 'Python',
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for user_bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.user_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON public.user_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.user_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for user_onboarding
CREATE POLICY "Users can view their own onboarding" ON public.user_onboarding
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding" ON public.user_onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_path ON public.user_progress(user_id, learning_path_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_type ON public.user_bookmarks(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON public.user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Add triggers for updated_at
CREATE TRIGGER handle_updated_at_user_progress BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_preferences BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
