import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase, Users, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

interface HeroSectionProps {
  onGetStarted?: () => void;
  onSearch?: (query: string, location: string) => void;
}

export const HeroSection = ({ onGetStarted, onSearch }: HeroSectionProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('query') as string;
    const location = formData.get('location') as string;
    onSearch?.(query, location);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-gray-900/90" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find Your
              <span className="block text-transparent bg-gradient-to-r  text-white  from-green-400 white-400 bg-clip-text">
                Dream Career
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90 sm:text-xl">
              Connect with <span className="font-semibold text-green-300">top employers</span> across Ethiopia and discover opportunities that match your skills and ambitions. Your next career move starts here.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg shadow-purple-900/30 sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-300" />
                <Input
                  name="query"
                  placeholder="Job title, skills, or company"
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-green-400/50 transition-colors"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-300" />
                <Input
                  name="location"
                  placeholder="City or region"
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-green-400/50 transition-colors"
                />
              </div>
              <Button 
                type="submit" 
                variant="default"
                size="lg"
                className="h-12 px-8 font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 shadow-lg shadow-green-500/20"
              >
                Search Jobs
              </Button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              variant="default"
              size="xl"
              onClick={onGetStarted}
              className="text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-0 shadow-lg shadow-indigo-500/20"
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="text-lg border-green-400/50 text-green-100 hover:bg-green-500/10 hover:border-green-400/70 hover:text-white"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-8 pt-16 sm:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">10,000+</p>
                <p className="text-sm text-cyan-100/80">Active Jobs</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">50,000+</p>
                <p className="text-sm text-purple-100/80">Job Seekers</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2 group">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent">95%</p>
                <p className="text-sm text-green-100/80">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};