-- Create a function to update is_raketero status of a user
CREATE OR REPLACE FUNCTION public.update_is_raketero_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the 'is_raketero' field in the users table to true
  -- for the user who just created the new service.
  UPDATE public.users
  SET is_raketero = true
  WHERE id = NEW.raketero_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Then create the trigger that calls that function everytime a new service is added
CREATE TRIGGER on_new_service_created
  AFTER INSERT ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_is_raketero_status();