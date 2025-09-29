
import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gradient-to-r from-blue-200 to-green-200 sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 animate-scale-in">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent hover:from-blue-800 hover:via-purple-800 hover:to-green-800 transition-all duration-500 cursor-pointer transform hover:scale-105">
                CareerAdvance
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8 animate-slide-in-right">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-blue-500">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg"
                placeholder="Search jobs, projects, or mentors..."
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110">
              <Bell className="h-5 w-5" />
            </Button>
            <UserMenu />
            <Button variant="ghost" size="sm" className="md:hidden hover:bg-gray-100 transition-all duration-300">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
