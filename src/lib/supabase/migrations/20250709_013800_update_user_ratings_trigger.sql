-- This script creates a function and a trigger to automatically update a user's
-- average rating and total review count whenever a new review is submitted for them.

-- Step 1: Create the function that will perform the calculation and update.
CREATE OR REPLACE FUNCTION public.update_user_ratings()
RETURNS TRIGGER AS $$
DECLARE
    new_average_rating NUMERIC;
    new_total_reviews INT;
BEGIN
    -- Calculate the new total number of reviews for the user being reviewed.
    SELECT COUNT(*)
    INTO new_total_reviews
    FROM public.reviews
    WHERE reviewee_id = NEW.reviewee_id;

    -- Calculate the new average rating for the user being reviewed.
    SELECT AVG(rating)
    INTO new_average_rating
    FROM public.reviews
    WHERE reviewee_id = NEW.reviewee_id;

    -- Update the 'users' table with the new calculated values.
    UPDATE public.users
    SET 
        average_rating = new_average_rating,
        total_reviews = new_total_reviews
    WHERE 
        id = NEW.reviewee_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Step 2: Create the trigger that calls the function after a new review is inserted.
-- This ensures that the user's rating is always up-to-date.
CREATE TRIGGER on_new_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_ratings();