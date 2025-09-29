
-- First, let's check if the admin user exists and update the password hash
-- This will ensure we have the correct bcrypt hash for 'Vinay@789'

-- Delete any existing admin user with this email to start fresh
DELETE FROM public.admin_users WHERE email = 'vinaycb7819@gmail.com';

-- Insert the admin user with a fresh bcrypt hash
-- Password: Vinay@789
-- Hash generated with bcrypt cost factor 10
INSERT INTO public.admin_users (email, password_hash, full_name)
VALUES (
  'vinaycb7819@gmail.com',
  '$2a$10$vI8aWY3wrHVxOHr.NfzNBeNp7zUzKqU5L6.HgOGmVjK2QpWJqtGZS',
  'Vinay Admin'
);
