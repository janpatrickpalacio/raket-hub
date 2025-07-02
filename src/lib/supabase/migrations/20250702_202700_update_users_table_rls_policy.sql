-- POLICY 1: Allow public read access for all user profiles.
-- This policy allows anyone to view the public data on a user's profile.
-- This is necessary for showing Raketero info on the services page.
CREATE POLICY "User profiles are publicly viewable."
ON public.users FOR SELECT
USING (true);


-- POLICY 2: Allow users to update their own profile.
-- This ensures a user can only make changes to their own record.
CREATE POLICY "Users can update their own profile."
ON public.users FOR UPDATE
USING ( auth.uid() = id );