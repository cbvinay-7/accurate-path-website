
-- First, let's check if the admin user exists and update the password hash
-- This will ensure we have the correct bcrypt hash for ''

-- Delete any existing admin user with this email to start fresh
DELETE FROM public.admin_users WHERE email = '';

-- Insert the admin user with a fresh bcrypt hash
-- Password: 
-- Hash generated with bcrypt cost factor 10
INSERT INTO public.admin_users (email, password_hash, full_name)
VALUES (
  '',
  '',
  ''
);
