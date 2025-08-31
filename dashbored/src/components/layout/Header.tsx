import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Search
} from 'lucide-react';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    role: string;
  };
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ isAuthenticated = false, user, onLogin, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            HireHub Ethiopia
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/jobs" 
            className="px-6  py-3 text-sm font-medium rounded-md border border-green-400/50 text-green-100 hover:bg-green-500/10 hover:border-green-400/70 hover:text-white transition-colors"
          >
            Find Jobs
          </Link>
          <Link 
            to="/frealancers" 
            className="px-6 py-3 text-sm font-medium rounded-md border border-green-400/50 text-green-100 hover:bg-green-500/10 hover:border-green-400/70 hover:text-white transition-colors"
          >
            Freelancers
          </Link>
         
         
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={onLogin}>
                Sign In
              </Button>
              <Button variant="premium" onClick={onLogin}>
                Get Started
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-3">
            <Link 
              to="/jobs"
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-md border border-green-400/50 text-green-100 hover:bg-green-500/10 hover:border-green-400/70 hover:text-white transition-colors mb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link 
              to="/frealancers"
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-md border border-green-400/50 text-green-100 hover:bg-green-500/10 hover:border-green-400/70 hover:text-white transition-colors mb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Freelancers
            </Link>
            
           
            
            {!isAuthenticated ? (
              <div className="pt-3 border-t space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={onLogin}>
                  Sign In
                </Button>
                <Button variant="premium" className="w-full" onClick={onLogin}>
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center space-x-3 p-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};