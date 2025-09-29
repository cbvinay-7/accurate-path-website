import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Download, Eye } from 'lucide-react';
import ResumeBuilderPage from './ResumeBuilderPage';

const ResumeBuilder = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <ResumeBuilderPage onBack={() => setShowBuilder(false)} />;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">AI-Powered Resume Builder</h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">
              Create professional resumes that stand out. Our AI analyzes job descriptions and optimizes your resume to match exactly what employers are looking for.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Smart Keyword Matching</h4>
                  <p className="text-gray-600">Automatically incorporates relevant keywords from job postings</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Professional Templates</h4>
                  <p className="text-gray-600">Choose from industry-specific, ATS-friendly templates</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Real-time Optimization</h4>
                  <p className="text-gray-600">Get instant suggestions to improve your resume score</p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={() => setShowBuilder(true)}
            >
              Build My Resume
              <FileText className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="lg:pl-8">
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-white shadow-xl">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Your Resume</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  
                  <div className="mt-6">
                    <div className="h-3 bg-blue-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-blue-200 rounded animate-pulse w-4/5 mb-2"></div>
                    <div className="h-3 bg-blue-200 rounded animate-pulse w-3/5"></div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="h-3 bg-green-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-green-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Resume Score</p>
                    <p className="text-2xl font-bold text-green-600">92%</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeBuilder;
