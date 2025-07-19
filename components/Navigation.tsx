'use client';

import { Button } from "@/components/ui/button";
import { Map, User, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on every route change
    const checkToken = () => {
      try {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        // Handle case where localStorage is not available
        console.error('Error accessing localStorage:', error);
        setIsLoggedIn(false);
      }
    };
    
    // Run on mount and when pathname changes
    checkToken();
    
    // Create a custom event for auth changes
    const authChangeEvent = new Event('authChange');
    
    // Listen for route changes
    window.addEventListener('popstate', checkToken);
    
    // Listen for storage changes (other tabs)
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        checkToken();
      }
    });
    
    // Listen for custom auth change events
    window.addEventListener('authChange', checkToken);
    
    return () => {
      window.removeEventListener('popstate', checkToken);
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('authChange', checkToken);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    
    // Dispatch a custom event to notify other components about the auth change
    window.dispatchEvent(new Event('authChange'));
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CareerMap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/careers" className="text-white/90 hover:text-white transition-colors">
              Careers
            </Link>
            <Link href="/about" className="text-white/90 hover:text-white transition-colors">
              About
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-white/90 hover:text-white transition-colors">
                  My Roadmaps
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link href="/signin">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link href="/careers" className="text-white/90 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/about" className="text-white/90 hover:text-white transition-colors">
                About
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-white/90 hover:text-white transition-colors">
                    My Roadmaps
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 self-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20 self-start" asChild>
                  <Link href="/signin">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
