import Header from '@/components/Header';
import JobListings from '@/components/JobListings';
import ResumeBuilder from '@/components/ResumeBuilder';
import Projects from '@/components/Projects';
import Mentorship from '@/components/Mentorship';
import AIJobAgent from '@/components/AIJobAgent';
import ProfileCompletionCard from '@/components/ProfileCompletionCard';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileCompletionCard />
        <AIJobAgent />
      </div>
      <JobListings />
      <ResumeBuilder />
      <Projects />
      <Mentorship />
      <Footer />
    </div>
  );
};

export default Index;
