-- Creates a function that inserts a new row into the public.users table
-- every time a new user is created in the auth.users table.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, first_name, last_name)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', -- Extracts 'first_name' from metadata
    new.raw_user_meta_data->>'last_name'  -- Extracts 'last_name' from metadata
  );
  return new;
end;
$$ language plpgsql security definer;

-- Creates a trigger that calls the handle_new_user function
-- after a new user is inserted into the auth.users table.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

