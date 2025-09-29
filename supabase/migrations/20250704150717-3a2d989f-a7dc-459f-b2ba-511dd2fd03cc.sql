
-- Enable real-time for projects table
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.projects;

-- Enable real-time for jobs table  
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.jobs;

-- Enable real-time for mentors table
ALTER TABLE public.mentors REPLICA IDENTITY FULL;  
ALTER publication supabase_realtime ADD TABLE public.mentors;
