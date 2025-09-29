
-- Add new columns to the profiles table for comprehensive student information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS professional_experience JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS declaration TEXT;

-- Create indexes for better performance on JSONB columns
CREATE INDEX IF NOT EXISTS idx_profiles_professional_experience ON public.profiles USING GIN (professional_experience);
CREATE INDEX IF NOT EXISTS idx_profiles_projects ON public.profiles USING GIN (projects);
CREATE INDEX IF NOT EXISTS idx_profiles_certificates ON public.profiles USING GIN (certificates);
CREATE INDEX IF NOT EXISTS idx_profiles_languages ON public.profiles USING GIN (languages);
