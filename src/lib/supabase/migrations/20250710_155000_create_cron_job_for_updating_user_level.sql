-- This script creates a function to update user levels and schedules it
-- to run automatically every day.

-- =================================================================
--  Step 1: Create the function to update Raketero levels
-- =================================================================
-- This function calculates each Raketero's stats and updates their level
-- based on the criteria for "Rising" and "Top-Rated".

CREATE OR REPLACE FUNCTION public.update_raketero_levels()
RETURNS void AS $$
BEGIN
  WITH raketero_stats AS (
    SELECT
      u.id,
      u.level,
      u.created_at,
      COUNT(o.id) FILTER (WHERE o.status = 'Completed') AS total_orders_completed,
      COALESCE(SUM(o.total_price) FILTER (WHERE o.status = 'Completed'), 0) AS total_earnings
    FROM
      public.users u
    LEFT JOIN
      public.orders o ON u.id = o.raketero_id
    WHERE
      u.is_raketero = true
    GROUP BY
      u.id
  ),
  new_levels AS (
    SELECT
      id,
      CASE
        -- Top-Rated Criteria
        WHEN 
          total_earnings >= 75000 AND 
          total_orders_completed >= 50 AND 
          average_rating >= 4.8 AND
          created_at <= now() - interval '90 days'
        THEN 'Top-Rated'::user_level_enum
        -- Rising Raketero Criteria
        WHEN 
          total_earnings >= 15000 AND 
          total_orders_completed >= 10 AND 
          average_rating >= 4.7 AND
          created_at <= now() - interval '30 days'
        THEN 'Rising'::user_level_enum
        -- Default to New
        ELSE 'New'::user_level_enum
      END AS new_level
    FROM
      raketero_stats
    -- Join with users table to get the average_rating
    JOIN public.users u ON raketero_stats.id = u.id
  )
  UPDATE
    public.users u
  SET
    level = nl.new_level
  FROM
    new_levels nl
  WHERE
    u.id = nl.id AND u.level != nl.new_level;
END;
$$ LANGUAGE plpgsql;


-- =================================================================
--  Step 2: Schedule the function to run daily
-- =================================================================
-- This uses the pg_cron extension, which is available in Supabase.
-- This schedule will run the function every day at midnight (00:00).

-- First, ensure pg_cron is enabled in your Supabase dashboard under Database > Extensions.

SELECT cron.schedule(
  'daily-raketero-level-update', -- A unique name for your cron job
  '0 0 * * *',                   -- Cron syntax for "at midnight, every day"
  'SELECT public.update_raketero_levels()' -- The function to run
);

