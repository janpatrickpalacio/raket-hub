-- This script adds the 'level' system to your 'users' table.

-- Step 1: Create a new ENUM type for the user levels.
-- This ensures the 'level' can only be one of these predefined values.
CREATE TYPE user_level_enum AS ENUM (
  'New', 
  'Rising', 
  'Top-Rated'
);


-- Step 2: Add the new 'level' column to the 'users' table.
-- We set the default value to 'New' so that every user starts at the base level.
ALTER TABLE public.users
ADD COLUMN level user_level_enum DEFAULT 'New' NOT NULL;
