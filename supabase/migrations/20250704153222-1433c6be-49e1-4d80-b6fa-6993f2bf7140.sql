
-- Create a table to track project purchases
CREATE TABLE public.project_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending', -- pending, paid, failed
  purchased_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Enable Row Level Security
ALTER TABLE public.project_purchases ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own purchases
CREATE POLICY "Users can view their own purchases" ON public.project_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for inserting purchases (for edge functions)
CREATE POLICY "Allow purchase creation" ON public.project_purchases
  FOR INSERT
  WITH CHECK (true);

-- Create policy for updating purchases (for edge functions)
CREATE POLICY "Allow purchase updates" ON public.project_purchases
  FOR UPDATE
  USING (true);
