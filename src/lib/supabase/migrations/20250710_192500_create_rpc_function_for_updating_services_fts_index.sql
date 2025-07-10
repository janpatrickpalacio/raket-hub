-- This script creates a database function that can be called from your application
-- to re-index all services for a specific user. This is useful when a user
-- updates their profile information (like username, name, or location).

CREATE OR REPLACE FUNCTION public.reindex_user_services(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.services s
  SET fts = 
      setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(cat.name, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(sub.name, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(u.username, '')), 'C') ||
      setweight(to_tsvector('english', coalesce(u.first_name, '')), 'C') ||
      setweight(to_tsvector('english', coalesce(u.last_name, '')), 'C') ||
      setweight(to_tsvector('english', coalesce(c.name, '')), 'C') ||
      setweight(to_tsvector('english', coalesce(p.name, '')), 'C') ||
      setweight(to_tsvector('english', coalesce(s.description, '')), 'D')
  FROM 
      public.users u
  LEFT JOIN 
      public.cities c ON u.city_id = c.id
  LEFT JOIN 
      public.provinces p ON c.province_id = p.id,
      public.subcategories sub,
      public.categories cat
  WHERE 
      s.raketero_id = p_user_id
  AND
      u.id = p_user_id
  AND 
      s.subcategory_id = sub.id 
  AND 
      sub.category_id = cat.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;