-- Add restrictive policies for user_subscriptions table
-- Subscriptions should ONLY be managed by backend edge functions using service role
-- Users should never be able to directly insert, update, or delete their subscriptions

-- Policy: Block all user INSERT operations (service role bypasses RLS)
CREATE POLICY "Subscriptions managed by system only - no user inserts"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy: Block all user UPDATE operations (service role bypasses RLS)
CREATE POLICY "Subscriptions managed by system only - no user updates"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (false);

-- Policy: Block all user DELETE operations (service role bypasses RLS)
CREATE POLICY "Subscriptions managed by system only - no user deletes"
ON public.user_subscriptions
FOR DELETE
TO authenticated
USING (false);