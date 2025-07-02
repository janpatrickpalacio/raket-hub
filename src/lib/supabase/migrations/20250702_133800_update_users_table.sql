-- 1. Add the new 'username' column with a UNIQUE constraint
ALTER TABLE public.users
ADD COLUMN username VARCHAR(30) UNIQUE;

-- 2. (Optional but Recommended) Add a CHECK constraint to define valid username characters
-- This example allows lowercase letters, numbers, and underscores, and must be at least 3 characters long.
ALTER TABLE public.users
ADD CONSTRAINT username_validation 
CHECK (username ~ '^[a-z0-9_]+$' AND length(username) >= 3);

-- 3. Alter the existing name columns to set their character limits
ALTER TABLE public.users
ALTER COLUMN first_name TYPE VARCHAR(50),
ALTER COLUMN last_name TYPE VARCHAR(50);

-- 4. Alter the 'email' column to set its character limit
ALTER TABLE public.users
ALTER COLUMN email TYPE VARCHAR(254);