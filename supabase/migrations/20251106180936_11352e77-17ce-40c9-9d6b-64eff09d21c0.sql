-- Create function to delete user account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id_to_delete UUID;
BEGIN
  -- Get the current user's ID
  user_id_to_delete := auth.uid();
  
  -- Check if user is authenticated
  IF user_id_to_delete IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Delete from volunteers table
  DELETE FROM public.volunteers WHERE user_id = user_id_to_delete;
  
  -- Delete from profiles table
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  -- Delete the auth user (this will cascade to other tables)
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;