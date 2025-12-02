import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const userLinks = [
    { to: '/user/dashboard', label: 'Dashboard' },
    { to: '/user/schedule', label: 'Schedule Pickup' },
    { to: '/user/rewards', label: 'Rewards' },
    { to: '/user/profile', label: 'Profile' },
  ];

  const collectorLinks = [
    { to: '/collector/dashboard', label: 'Dashboard' },
    { to: '/collector/pickups', label: 'Pickups' },
    { to: '/collector/wallet', label: 'Wallet' },
    { to: '/collector/profile', label: 'Profile' },
  ];

  const links = userType === 'user' ? userLinks : userType === 'collector' ? collectorLinks : [];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? (userType === 'user' ? '/user/dashboard' : '/collector/dashboard') : '/'} className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              clean<span className="text-green-600">Earth</span>
            </span>
          </Link>

          {user && (
            <>
              <nav className="hidden md:flex space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </>
          )}
        </div>

        {mobileMenuOpen && user && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-green-600 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-green-600 font-medium py-2 text-left"
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
