-- Create a table to track mentor bookings
CREATE TABLE public.mentor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending', -- pending, paid, cancelled
  session_date TIMESTAMPTZ,
  session_duration INTEGER DEFAULT 60, -- in minutes
  notes TEXT,
  booked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, mentor_id, session_date)
);

-- Enable Row Level Security
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own bookings
CREATE POLICY "Users can view their own bookings" ON public.mentor_bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for inserting bookings (for edge functions)
CREATE POLICY "Allow booking creation" ON public.mentor_bookings
  FOR INSERT
  WITH CHECK (true);

-- Create policy for updating bookings (for edge functions)
CREATE POLICY "Allow booking updates" ON public.mentor_bookings
  FOR UPDATE
  USING (true);