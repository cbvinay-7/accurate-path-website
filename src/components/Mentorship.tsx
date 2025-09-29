import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Custom hook for Razorpay payment
const useRazorpayPayment = () => {
  const { toast } = useToast();

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const initiatePayment = async ({ mentor, amount, user, sessionDate }: any) => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load Razorpay');

      const { data, error } = await supabase.functions.invoke('create-mentor-booking', {
        body: { 
          mentorId: mentor.id,
          amount: amount,
          sessionDuration: 60,
          sessionDate: sessionDate.toISOString(),
          notes: "Mentorship session booking"
        }
      });

      if (error) throw error;

      return new Promise((resolve, reject) => {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'DevHub',
          description: `Mentorship Session with ${mentor.name}`,
          order_id: data.orderId,
          prefill: { email: user.email },
          theme: { color: '#4F46E5' },
          handler: async (response: any) => {
            try {
              const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  type: 'mentor'
                }
              });
              if (verifyError) throw verifyError;
              resolve(response);
            } catch (error) {
              reject(error);
            }
          },
          modal: { ondismiss: () => reject('Payment closed') }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      });
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };

  return { initiatePayment };
};

// Mentor Card Component
const MentorCard = ({ mentor, onBook, isProcessing }: { mentor: any, onBook: (date: Date) => void, isProcessing: boolean }) => {
  const [sessionDate, setSessionDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <Card className="p-6 hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:transform hover:scale-105 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="text-center mb-6 relative z-10">
        <div className="relative inline-block">
          <img 
            src={mentor.image_url || '/default-mentor.png'} 
            alt={mentor.name}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300"
            onError={(e) => (e.currentTarget.src = '/default-mentor.png')}
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">{mentor.name}</h3>
        <p className="text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-300">{mentor.title}</p>
        <p className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">{mentor.company}</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-600 relative z-10">
        <div className="flex items-center hover:text-yellow-600 transition-colors duration-300">
          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
          {mentor.rating}
        </div>
        <div className="flex items-center hover:text-blue-600 transition-colors duration-300">
          <MessageCircle className="h-4 w-4 mr-1" />
          {mentor.sessions} sessions
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center relative z-10">
        {mentor.expertise.slice(0, 3).map((skill: string) => (
          <Badge 
            key={skill} 
            variant="secondary" 
            className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            {skill}
          </Badge>
        ))}
      </div>

      <div className="text-center mb-4 relative z-10">
        <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">{mentor.price}</div>
        <div className="text-gray-600 text-sm">per session</div>
      </div>

      {showDatePicker && (
        <div className="mb-4 relative z-10">
          <DatePicker
            selected={sessionDate}
            onChange={(date: Date) => setSessionDate(date)}
            minDate={new Date()}
            inline
            className="border rounded-lg p-2 w-full"
          />
        </div>
      )}

      <div className="space-y-2 relative z-10">
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => {
            if (sessionDate) {
              onBook(sessionDate);
            } else {
              setShowDatePicker(true);
            }
          }}
          disabled={isProcessing}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : sessionDate ? 'Confirm Booking' : 'Select Date'}
        </Button>
        <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105">
          <MessageCircle className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>
    </Card>
  );
};

// Loading Skeleton Component
const MentorCardSkeleton = () => (
  <Card className="p-6 bg-white/90 border-0 shadow-lg h-96 animate-pulse">
    <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-200"></div>
    <div className="h-6 w-3/4 bg-gray-200 rounded mx-auto mb-2"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto mb-1"></div>
    <div className="h-4 w-1/3 bg-gray-200 rounded mx-auto mb-6"></div>
    
    <div className="flex justify-center gap-4 mb-4">
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </div>
    
    <div className="flex justify-center gap-2 mb-6">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    
    <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
    <div className="h-8 w-full bg-gray-200 rounded"></div>
  </Card>
);

// Main Component
const Mentorship = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isProcessingBooking, setIsProcessingBooking] = useState<string | null>(null);
  const { initiatePayment } = useRazorpayPayment();

  // Fetch mentors from database
  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('rating', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Set up real-time subscription with debounce
  useEffect(() => {
    const debouncedInvalidate = debounce(() => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
    }, 500);

    const channel = supabase
      .channel('mentors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mentors'
        },
        debouncedInvalidate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      debouncedInvalidate.cancel();
    };
  }, [queryClient]);

  const handleBookSession = async (mentor: any, sessionDate: Date) => {
    try {
      setIsProcessingBooking(mentor.id);
      
      // Verify user and role
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book a mentorship session.",
          variant: "destructive"
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'mentee') {
        toast({
          title: "Unauthorized",
          description: "Only mentees can book sessions.",
          variant: "destructive"
        });
        return;
      }

      // Track booking attempt
      await supabase.functions.invoke('track-event', {
        body: { event: 'booking_started', mentor_id: mentor.id }
      });

      // Parse price from mentor.price (e.g., "₹5000/hour" -> 500000 paise)
      const priceMatch = mentor.price.match(/₹(\d+)/);
      const amount = priceMatch ? parseInt(priceMatch[1]) * 100 : 500000; // Default to ₹5000

      await initiatePayment({ mentor, amount, user, sessionDate });

      toast({
        title: "Booking Confirmed!",
        description: "Your mentorship session has been booked successfully."
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to initiate booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingBooking(null);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Career Guidance & Mentorship
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with industry experts who can guide your career journey. Get personalized advice, 
            interview preparation, and insights from professionals at top companies.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center animate-fade-in delay-300 group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Users className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">500+</div>
            <div className="text-gray-600">Expert Mentors</div>
          </div>
          <div className="text-center animate-fade-in delay-500 group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <MessageCircle className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">10k+</div>
            <div className="text-gray-600">Sessions Completed</div>
          </div>
          <div className="text-center animate-fade-in delay-700 group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Star className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            [...Array(3)].map((_, i) => <MentorCardSkeleton key={i} />)
          ) : (
            mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBook={(date) => handleBookSession(mentor, date)}
                isProcessing={isProcessingBooking === mentor.id}
              />
            ))
          )}
        </div>

        <div className="text-center animate-fade-in delay-1000">
          <Link to="/mentors">
            <Button variant="outline" size="lg" className="hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105">
              View All Mentors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Mentorship;