
-- Update the existing admin user with new credentials
-- Email: vinaycb7819@gmail.com
-- Password: Vinay@789
UPDATE public.admin_users 
SET 
  email = 'vinaycb7819@gmail.com',
  password_hash = '$2a$10$vI8aWY3wrHVxOHr.NfzNBeNp7zUzKqU5L6.HgOGmVjK2QpWJqtGZS', -- This is bcrypt hash for 'Vinay@789'
  full_name = 'Vinay Admin',
  updated_at = now()
WHERE email = 'admin@example.com';

-- If no existing admin user, insert the new one
INSERT INTO public.admin_users (email, password_hash, full_name)
SELECT 'vinaycb7819@gmail.com', '$2a$10$vI8aWY3wrHVxOHr.NfzNBeNp7zUzKqU5L6.HgOGmVjK2QpWJqtGZS', 'Vinay Admin'
WHERE NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'vinaycb7819@gmail.com');
