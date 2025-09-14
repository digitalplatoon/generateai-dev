-- Drop the current insecure policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that respects user privacy preferences
CREATE POLICY "Secure profile visibility" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always view their own profile
  auth.uid() = id 
  OR 
  -- Other authenticated users can view profiles based on visibility settings
  (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM public.user_preferences up 
      WHERE up.user_id = profiles.id 
      AND up.profile_visibility = 'public'
    )
  )
  OR
  -- For users without preferences set, default to private (secure by default)
  -- This ensures we don't expose profiles of users who haven't set preferences
  (
    auth.uid() IS NOT NULL 
    AND NOT EXISTS (
      SELECT 1 FROM public.user_preferences up 
      WHERE up.user_id = profiles.id
    ) 
    AND false -- Default to private for users without preferences
  )
);