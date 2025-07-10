-- This script sets up a more advanced PostgreSQL Full-Text Search on the 'services' table.
-- It now includes the category, subcategory, and Raketero's username for more relevant results.

-- Step 1: Add or ensure the 'fts' column exists in the 'services' table.
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS fts tsvector;


-- Step 2: Create a function that will automatically update the 'fts' column.
-- This function now joins with other tables to get the necessary text.
CREATE OR REPLACE FUNCTION public.update_services_fts_column()
RETURNS TRIGGER AS $$
DECLARE
    subcategory_name TEXT;
    category_name TEXT;
    raketero_username TEXT;
BEGIN
    -- Get the subcategory name and its corresponding category name
    SELECT sub.name, cat.name INTO subcategory_name, category_name
    FROM public.subcategories sub
    JOIN public.categories cat ON sub.category_id = cat.id
    WHERE sub.id = NEW.subcategory_id;

    -- Get the Raketero's username
    SELECT username INTO raketero_username
    FROM public.users
    WHERE id = NEW.raketero_id;

    -- Combine all the text into a single tsvector with different weights.
    -- 'A' is the highest weight, 'D' is the lowest.
    NEW.fts :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(category_name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(subcategory_name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(raketero_username, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'D');
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Step 3: Create or replace the trigger to call the function.
DROP TRIGGER IF EXISTS services_fts_trigger ON public.services;
CREATE TRIGGER services_fts_trigger
BEFORE INSERT OR UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_services_fts_column();


-- Step 4 (Important for Performance): Create or recreate the GIN index on the 'fts' column.
DROP INDEX IF EXISTS services_fts_idx;
CREATE INDEX services_fts_idx ON public.services USING GIN (fts);


-- Step 5 (One-time backfill): Update all existing rows to populate the 'fts' column.
-- This is necessary to make your current services searchable with the new logic.
UPDATE public.services s
SET fts = 
    setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(cat.name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(sub.name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(u.username, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(s.description, '')), 'D')
FROM public.subcategories sub, public.categories cat, public.users u
WHERE s.subcategory_id = sub.id AND sub.category_id = cat.id AND s.raketero_id = u.id;