import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Star, Eye, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Projects = () => {
  const queryClient = useQueryClient();

  // Fetch projects from database
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('stars', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Projects table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleViewProject = (project: any) => {
    // Navigate to project detail page
    window.location.href = `/projects/${project.id}`;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">Ready-to-Download Projects</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance your portfolio with our curated collection of projects. Each project comes with complete source code, 
            documentation, and step-by-step guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.id} 
              className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg animate-fade-in group`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop&crop=entropy&auto=format'} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant="secondary"
                    className="bg-white/95 backdrop-blur-sm text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {project.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10 group-hover:text-indigo-700 transition-colors duration-300">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3 relative z-10 group-hover:text-gray-700 transition-colors duration-300">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500 relative z-10">
                  <div className="flex items-center hover:text-indigo-600 transition-colors duration-300">
                    <Download className="h-4 w-4 mr-1" />
                    {Math.floor(Math.random() * 2000)} downloads
                  </div>
                  <div className="flex items-center hover:text-yellow-600 transition-colors duration-300">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                    {project.stars}
                  </div>
                </div>
                
                <div className="flex gap-2 relative z-10">
                  <Button 
                    onClick={() => handleViewProject(project)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Project
                  </Button>
                  {project.demo_url && (
                    <Button variant="outline" size="sm" className="hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:scale-110">
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-110">
                      <Code className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in delay-1000">
          <Link to="/projects">
            <Button variant="outline" size="lg" className="border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              Explore All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
