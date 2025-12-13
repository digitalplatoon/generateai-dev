-- Add admin moderation policies to posts table

-- Admins can view all posts for moderation
CREATE POLICY "Admins can view all posts" 
ON public.posts 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any post (e.g., to unpublish inappropriate content)
CREATE POLICY "Admins can update any post" 
ON public.posts 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete any post (to remove policy violations)
CREATE POLICY "Admins can delete any post" 
ON public.posts 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));