
import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FolderOpen, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { adminUser, signOut } = useAdminAuth();

  const managementCards = [
    {
      title: 'Manage Mentors',
      description: 'Add, edit, and manage mentor profiles',
      icon: Users,
      link: '/admin/mentors',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Manage Projects',
      description: 'Upload projects, screenshots, and zip files',
      icon: FolderOpen,
      link: '/admin/projects',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Manage Jobs',
      description: 'Add and update job listings',
      icon: Briefcase,
      link: '/admin/jobs',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Welcome, {adminUser?.full_name || 'Admin (Temporary Access)'}
              </span>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Temporary Access Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Authentication is temporarily bypassed for testing purposes. Remember to restore authentication when the login issue is resolved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Management Dashboard</h2>
          <p className="text-lg text-gray-600">Manage your platform's content and resources</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementCards.map((card) => (
            <Link key={card.title} to={card.link}>
              <Card className={`hover:shadow-lg transition-shadow duration-300 ${card.color}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <card.icon className="h-6 w-6 text-gray-700" />
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
