import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { AuthModal } from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { authHelpers } from '@/lib/api';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ 
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  } | undefined>();
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    const token = authHelpers.getToken();
    setIsAuthenticated(!!token);
    
    // In a real app, you'd verify the token and get user data
    // For now, we'll just check if token exists
  }, []);

  const handleLoginSuccess = (userData: any, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    authHelpers.removeToken();
    setUser(undefined);
    setIsAuthenticated(false);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleSearch = (query: string, location: string) => {
    console.log('Search:', { query, location });
    toast({
      title: "Search initiated",
      description: `Searching for "${query}" in ${location || 'all locations'}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated={isAuthenticated}
        user={user ? {
          name: `${user.first_name} ${user.last_name}`,
          role: user.role
        } : undefined}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <main>
        <HeroSection
          onGetStarted={() => setIsAuthModalOpen(true)}
          onSearch={handleSearch}
        />
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Index;