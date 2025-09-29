
-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentors table
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  sessions INTEGER NOT NULL DEFAULT 0,
  price TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  stars INTEGER NOT NULL DEFAULT 0,
  contributors INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  zip_file_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  salary TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-files', 'admin-files', true);

-- Enable RLS for admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin tables (accessible by authenticated admin users)
CREATE POLICY "Admins can manage admin_users" ON public.admin_users FOR ALL TO authenticated USING (true);
CREATE POLICY "Anyone can read mentors" ON public.mentors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage mentors" ON public.mentors FOR ALL TO authenticated USING (true);
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Anyone can read jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL TO authenticated USING (true);

-- Create storage policies for file uploads
CREATE POLICY "Anyone can view files" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'admin-files');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'admin-files');
CREATE POLICY "Authenticated users can update files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'admin-files');
CREATE POLICY "Authenticated users can delete files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'admin-files');
