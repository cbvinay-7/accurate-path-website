
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 animate-fade-in">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-4 hover:from-blue-300 hover:via-purple-300 hover:to-green-300 transition-all duration-300 cursor-pointer">
              CareerAdvance
            </h3>
            <p className="text-gray-300 mb-6 max-w-md hover:text-gray-200 transition-colors duration-300">
              Unlock your career potential with the ultimate tool designed for students eager to embark on their professional journeys.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-blue-600/20 transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-blue-500/20 transition-all duration-300 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-blue-700/20 transition-all duration-300 hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-pink-600/20 transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in delay-300">
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Job Listings</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Resume Builder</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Projects</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Mentorship</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Resources</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-fade-in delay-500">
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center hover:text-white transition-colors duration-300 group">
                <Mail className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors duration-300" />
                <span className="text-sm">support@careeradvance.com</span>
              </div>
              <div className="flex items-center hover:text-white transition-colors duration-300 group">
                <Phone className="h-4 w-4 mr-2 group-hover:text-green-400 transition-colors duration-300" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center hover:text-white transition-colors duration-300 group">
                <MapPin className="h-4 w-4 mr-2 group-hover:text-purple-400 transition-colors duration-300" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700 opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center animate-fade-in delay-700">
          <div className="text-gray-400 text-sm mb-4 md:mb-0 hover:text-gray-300 transition-colors duration-300">
            © 2024 CareerAdvance. All rights reserved.
          </div>
          <div className="flex space-x-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition-all duration-300 hover:translate-y-1">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-all duration-300 hover:translate-y-1">Terms of Service</a>
            <a href="#" className="hover:text-white transition-all duration-300 hover:translate-y-1">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
