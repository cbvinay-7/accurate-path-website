import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200 text-blue-800 px-6 py-3 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Your Pathway to Professional Success</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-scale-in">
            Unlock Your
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-pulse"> Career Potential</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in delay-300">
            The ultimate tool designed specifically for students eager to embark on their professional journeys. 
            Get real-time job listings, AI-powered resume building, and expert mentorship.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-in-right delay-500">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
              Watch Demo
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center animate-fade-in delay-700 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Target className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Job Listings</h3>
              <p className="text-gray-600">Stay ahead with instant access to the latest opportunities</p>
            </div>
            
            <div className="text-center animate-fade-in delay-1000 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Sparkles className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Resume Builder</h3>
              <p className="text-gray-600">Create resumes that match job descriptions perfectly</p>
            </div>
            
            <div className="text-center animate-fade-in delay-1300 group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Mentorship</h3>
              <p className="text-gray-600">Get personalized guidance from industry professionals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
