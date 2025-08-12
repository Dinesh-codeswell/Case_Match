-- Disable email confirmation and set up automatic profile creation

-- First, update the auth settings to disable email confirmation
-- Note: This needs to be done in the Supabase Dashboard under Authentication > Settings
-- Turn OFF "Enable email confirmations"

-- Create or replace the function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    college_name,
    email,
    full_access,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'college_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'full_access')::boolean, true),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', profiles.first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', profiles.last_name),
    college_name = COALESCE(NEW.raw_user_meta_data->>'college_name', profiles.college_name),
    email = NEW.email,
    full_access = COALESCE((NEW.raw_user_meta_data->>'full_access')::boolean, profiles.full_access, true),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure the profiles table has the correct structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_access BOOLEAN DEFAULT true;

-- Update existing profiles to have full access
UPDATE public.profiles 
SET full_access = true 
WHERE full_access IS NULL OR full_access = false;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- Enable RLS (Row Level Security) on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
