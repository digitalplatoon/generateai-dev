-- Update the security policy to allow admins to view all profiles
DROP POLICY IF EXISTS "Secure profile visibility" ON public.profiles;

-- Create a comprehensive secure policy that handles all cases
CREATE POLICY "Secure profile visibility with admin access" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always view their own profile
  auth.uid() = id 
  OR 
  -- Admins can view all profiles for management purposes
  has_role(auth.uid(), 'admin'::app_role)
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
);