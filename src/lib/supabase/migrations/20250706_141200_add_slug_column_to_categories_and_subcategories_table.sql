-- This script adds a 'slug' column to the categories and subcategories tables
-- and populates it based on the existing 'name' column.

-- Step 1: Add the 'slug' column to the 'categories' table
-- The UNIQUE constraint ensures no two categories can have the same slug.
ALTER TABLE public.categories
ADD COLUMN slug TEXT UNIQUE;

-- Step 2: Update existing rows in 'categories' to populate the new slug column
-- This function converts the name to lowercase, replaces spaces and '&' with hyphens,
-- and removes any other non-alphanumeric characters.
UPDATE public.categories
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));


-- Step 3: Add the 'slug' column to the 'subcategories' table
ALTER TABLE public.subcategories
ADD COLUMN slug TEXT;
-- Note: A unique constraint here might be too restrictive if two different
-- main categories have a subcategory with the same name (e.g., "Coaching").
-- A better approach is a combined unique constraint on (category_id, slug).
ALTER TABLE public.subcategories
ADD CONSTRAINT unique_category_slug UNIQUE (category_id, slug);


-- Step 4: Update existing rows in 'subcategories' to populate the new slug column
UPDATE public.subcategories
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));
