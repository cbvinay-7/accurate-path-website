
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const savedAdmin = localStorage.getItem('admin_user');
    if (savedAdmin) {
      try {
        setAdminUser(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Error parsing saved admin user:', error);
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('=== Admin Sign In Attempt ===');
      console.log('Email:', email);
      console.log('Password length:', password.length);
      
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { email, password }
      });

      console.log('=== Function Response ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        return { 
          error: { 
            message: error.message || 'Authentication service error' 
          } 
        };
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        return { 
          error: { 
            message: data.error 
          } 
        };
      }

      if (data?.success && data?.admin) {
        const user = {
          id: data.admin.id,
          email: data.admin.email,
          full_name: data.admin.full_name
        };

        console.log('=== Authentication Success ===');
        console.log('Admin user:', user);
        
        setAdminUser(user);
        localStorage.setItem('admin_user', JSON.stringify(user));
        return { error: null };
      }

      console.error('Unexpected response format:', data);
      return { 
        error: { 
          message: 'Invalid response from authentication service' 
        } 
      };
      
    } catch (error) {
      console.error('=== Sign In Error ===');
      console.error('Error:', error);
      return { 
        error: { 
          message: 'Network error occurred' 
        } 
      };
    }
  };

  const signOut = async () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
  };

  const value = {
    adminUser,
    loading,
    signIn,
    signOut,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
