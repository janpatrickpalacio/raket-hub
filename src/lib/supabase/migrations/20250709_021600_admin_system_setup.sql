-- This script sets up the necessary database structure and security policies
-- for the RaketHub admin system.

-- =================================================================
--  Step 1: Add a 'role' column to the 'users' table
-- =================================================================
-- This column will distinguish regular users from administrators.
-- We use an ENUM to ensure the role can only be one of the predefined values.

CREATE TYPE user_role AS ENUM ('user', 'admin');

ALTER TABLE public.users
ADD COLUMN role user_role DEFAULT 'user' NOT NULL;


-- =================================================================
--  Step 2: Assign the 'admin' role to yourself
-- =================================================================
-- Run this command to grant admin privileges to your own user account.
-- Replace 'your-user-id' with your actual user ID from the auth.users table.

UPDATE public.users
SET role = 'admin'
WHERE id = 'a707f800-cd0b-4171-894c-a32c41190d32';


-- =================================================================
--  Step 3: Create RLS Policies for Admin Actions
-- =================================================================
-- These policies give users with the 'admin' role special permissions
-- that regular users do not have.

-- Policy 1: Allow admins to view ALL services, including inactive ones.
-- This is necessary for the approval queue.
-- We add this policy to the 'services' table.
CREATE POLICY "Admins can view all services."
ON public.services FOR SELECT
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);


-- Policy 2: Allow admins to update any service.
-- This is required to change the 'is_active' status (approve/reject).
CREATE POLICY "Admins can update any service."
ON public.services FOR UPDATE
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);


-- Policy 3: Allow admins to delete any service.
-- This is necessary for rejecting a Raket by removing it.
CREATE POLICY "Admins can delete any service."
ON public.services FOR DELETE
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
