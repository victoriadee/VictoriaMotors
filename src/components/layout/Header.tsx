import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <Car 
              size={32} 
              className={cn(
                'transition-colors duration-300',
                isScrolled ? 'text-primary-800' : 'text-white'
              )} 
            />
            <span 
              className={cn(
                'text-xl font-heading font-bold transition-colors duration-300',
                isScrolled ? 'text-primary-800' : 'text-white'
              )}
            >
              AutoMarket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/explore" 
              className={cn(
                'transition-colors duration-300 hover:text-accent-500',
                isScrolled ? 'text-secondary-700' : 'text-white'
              )}
            >
              Explore Cars
            </Link>
            <Link 
              to="/sell" 
              className={cn(
                'transition-colors duration-300 hover:text-accent-500',
                isScrolled ? 'text-secondary-700' : 'text-white'
              )}
            >
              Sell Your Car
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className={cn(
                    'flex items-center space-x-1 transition-colors duration-300 group-hover:text-accent-500',
                    isScrolled ? 'text-secondary-700' : 'text-white'
                  )}
                >
                  <span>{user?.name || 'Account'}</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">Dashboard</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">Profile</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={cn(
                    'transition-colors duration-300 hover:text-accent-500',
                    isScrolled ? 'text-secondary-700' : 'text-white'
                  )}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className={cn(
                    'btn px-4 py-2 rounded-md',
                    isScrolled ? 'bg-accent-500 text-white hover:bg-accent-600' : 'bg-white text-primary-800 hover:bg-secondary-100'
                  )}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X 
                size={24} 
                className={isScrolled ? 'text-secondary-800' : 'text-white'} 
              />
            ) : (
              <Menu 
                size={24} 
                className={isScrolled ? 'text-secondary-800' : 'text-white'} 
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md animate-slide-down">
          <nav className="container-custom py-4 flex flex-col space-y-4">
            <Link to="/explore" className="py-2 text-secondary-800 hover:text-accent-500">
              Explore Cars
            </Link>
            <Link to="/sell" className="py-2 text-secondary-800 hover:text-accent-500">
              Sell Your Car
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="py-2 text-secondary-800 hover:text-accent-500">
                  Dashboard
                </Link>
                <Link to="/profile" className="py-2 text-secondary-800 hover:text-accent-500">
                  Profile
                </Link>
                <button 
                  onClick={logout}
                  className="py-2 text-left text-secondary-800 hover:text-accent-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="py-2 text-secondary-800 hover:text-accent-500">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-accent">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;