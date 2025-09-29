
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, FileText, Briefcase, Clock, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
}

const AIJobAgent = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [currentResume, setCurrentResume] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const { toast } = useToast();

  // Mock job data - in a real app, this would come from a job API
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$80k - $120k',
      type: 'Full-time',
      posted: '2 days ago',
      description: 'We are looking for a skilled Frontend Developer to join our team...',
      requirements: ['React', 'TypeScript', 'CSS', 'JavaScript']
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90k - $140k',
      type: 'Full-time',
      posted: '1 day ago',
      description: 'Join our growing team as a Full Stack Engineer...',
      requirements: ['Node.js', 'React', 'MongoDB', 'AWS']
    },
    {
      id: '3',
      title: 'Junior Software Developer',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$60k - $80k',
      type: 'Full-time',
      posted: '3 days ago',
      description: 'Great opportunity for recent graduates...',
      requirements: ['Python', 'Git', 'SQL', 'Problem Solving']
    }
  ];

  const callAIAgent = async (action: string, additionalData: any = {}) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-job-agent', {
        body: {
          action,
          jobDescription,
          currentResume,
          ...additionalData
        }
      });

      if (error) throw error;

      setAiResponse(data.response);
    } catch (error) {
      console.error('AI Agent Error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = () => {
    // In a real app, this would call a job search API
    const filtered = mockJobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setJobs(filtered.length > 0 ? filtered : mockJobs);
  };

  React.useEffect(() => {
    setJobs(mockJobs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Job Agent</h2>
          <p className="text-gray-600">Find jobs and optimize your resume with AI assistance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Live Jobs</TabsTrigger>
          <TabsTrigger value="analyzer">Job Analyzer</TabsTrigger>
          <TabsTrigger value="optimizer">Resume Optimizer</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Job Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={searchJobs}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.posted}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary">{req}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setJobDescription(job.description + '\n\nRequirements: ' + job.requirements.join(', '));
                            setActiveTab('analyzer');
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze with AI
                        </Button>
                        <Button>Apply Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Description Analyzer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={() => callAIAgent('analyze-job')}
                disabled={loading || !jobDescription.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Job
                  </>
                )}
              </Button>

              {aiResponse && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">{aiResponse}</div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Optimizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <Textarea
                  placeholder="Paste the job description you're applying for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Resume Summary
                </label>
                <Textarea
                  placeholder="Paste your current resume content or summary..."
                  value={currentResume}
                  onChange={(e) => setCurrentResume(e.target.value)}
                  rows={6}
                />
              </div>
              
              <Button 
                onClick={() => callAIAgent('optimize-resume')}
                disabled={loading || !jobDescription.trim() || !currentResume.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Optimize Resume
                  </>
                )}
              </Button>

              {aiResponse && (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-sm">{aiResponse}</div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIJobAgent;
