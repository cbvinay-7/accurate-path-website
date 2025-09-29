
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Star, MessageCircle, Search, Filter, Calendar, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AllMentors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isProcessingBooking, setIsProcessingBooking] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch mentors from database
  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ['all-mentors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('all-mentors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentors'
        },
        (payload) => {
          console.log('Mentors table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['all-mentors'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filters = [
    { key: 'all', label: 'All Mentors' },
    { key: 'available', label: 'Available Now' },
    { key: 'software-engineering', label: 'Software Engineering' },
    { key: 'data-science', label: 'Data Science' },
    { key: 'design', label: 'Design' },
    { key: 'product', label: 'Product Management' },
    { key: 'devops', label: 'DevOps' }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    if (selectedFilter !== 'all') {
      const filterMap = {
        'software-engineering': ['JavaScript', 'React', 'System Design', 'Programming'],
        'data-science': ['Python', 'Machine Learning', 'Data Analysis', 'Analytics'],
        'design': ['UI/UX Design', 'Product Strategy', 'Design Systems', 'Design'],
        'product': ['Product Management', 'Strategy', 'Analytics', 'Product'],
        'devops': ['AWS', 'Docker', 'Kubernetes', 'DevOps']
      };
      if (filterMap[selectedFilter]) {
        matchesFilter = mentor.expertise.some(skill => 
          filterMap[selectedFilter].some(filterSkill => 
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        );
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleBookSession = async (mentor: any) => {
    try {
      setIsProcessingBooking(mentor.id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book a mentorship session.",
          variant: "destructive"
        });
        return;
      }

      // Parse price from mentor.price (e.g., "$50/hour" -> 5000 cents)
      const priceMatch = mentor.price.match(/\$(\d+)/);
      const amount = priceMatch ? parseInt(priceMatch[1]) * 100 : 5000; // Default to $50

      const { data, error } = await supabase.functions.invoke('create-mentor-booking', {
        body: { 
          mentorId: mentor.id,
          amount: amount,
          sessionDuration: 60, // 1 hour session
          sessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          notes: "Mentorship session booking"
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Opening payment page in a new tab."
      });
      
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: "Failed to initiate booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingBooking(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading mentors...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/index">
            <Button variant="ghost" className="mb-4 hover:bg-blue-50 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Mentor</h1>
          <p className="text-lg text-gray-600">Connect with industry experts who can guide your career journey</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search mentors by name, expertise, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.key)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Mentor Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.image_url} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                    <p className="text-sm text-gray-600">{mentor.title}</p>
                    <p className="text-sm text-blue-600 font-medium">{mentor.company}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{mentor.rating}</span>
                      <span className="text-gray-500">({mentor.sessions})</span>
                    </div>
                    <Badge variant="default" className="text-xs">
                      Available
                    </Badge>
                  </div>

                  {mentor.bio && (
                    <p className="text-gray-700 text-sm">{mentor.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-semibold text-gray-900">{mentor.price}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleBookSession(mentor)}
                        disabled={isProcessingBooking === mentor.id}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        {isProcessingBooking === mentor.id ? 'Processing...' : 'Book Session'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mentors found matching your criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllMentors;
