-- POLICY 1: Allow public read access for all active services.
-- This is the most important policy for your "Find Services" page.
-- It allows anyone (even logged-out users) to view services that are marked as active.
CREATE POLICY "Services are publicly viewable"
ON public.services FOR SELECT
USING ( is_active = true );


-- POLICY 2: Allow logged-in users to create new services.
-- This policy allows any user who is authenticated to insert a new row.
-- The `WITH CHECK` clause ensures this rule is enforced.
-- We also add a check to make sure the user inserting the service is the one listed as the raketero.
CREATE POLICY "Users can create their own services"
ON public.services FOR INSERT
WITH CHECK ( auth.uid() = raketero_id );


-- POLICY 3: Allow Raketeros to update their own services.
-- This ensures that a user can only edit a service if their ID matches the 'raketero_id' on that service.
-- This prevents users from editing each other's listings.
CREATE POLICY "Raketeros can update their own services"
ON public.services FOR UPDATE
USING ( auth.uid() = raketero_id );


-- POLICY 4: Allow Raketeros to delete their own services.
-- Similar to the update policy, this ensures a user can only delete a service that they own.
CREATE POLICY "Raketeros can delete their own services"
ON public.services FOR DELETE
USING ( auth.uid() = raketero_id );
