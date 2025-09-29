import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import LandingPage from './components/LandingPage';
import Auth from '@/pages/Auth';
import Index from './pages/Index';
import Account from '@/pages/Account';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLogin from '@/pages/AdminLogin';
import AdminJobs from '@/pages/AdminJobs';
import AdminMentors from '@/pages/AdminMentors';
import AllJobs from '@/pages/AllJobs';
import AllProjects from '@/pages/AllProjects';
import AllMentors from '@/pages/AllMentors';
import AdminProjects from '@/pages/AdminProjects';
import ProjectDetail from '@/pages/ProjectDetail';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* BrowserRouter must wrap any component that uses React Router hooks or components */}
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/index" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/jobs" element={<AllJobs />} />
              <Route path="/projects" element={<AllProjects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/mentors" element={<AllMentors />} />
              <Route path="/account" element={<Account />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/mentors" element={<AdminMentors />} />
              
            </Routes>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
