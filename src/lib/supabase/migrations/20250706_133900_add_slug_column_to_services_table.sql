-- This command adds a new 'slug' column to your 'services' table.
-- TEXT is used for flexibility in length.
-- The UNIQUE constraint ensures that no two services can have the same URL slug.
ALTER TABLE public.services
ADD COLUMN slug TEXT UNIQUE;