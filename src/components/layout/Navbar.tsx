// Navbar component
'use client'

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/utils/logger';

// Navbar content component (needs Suspense wrapper for useSearchParams)
const NavbarContent = (): React.JSX.Element => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get search query from URL params
  const urlQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(urlQuery);

  // Sync local state with URL params
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const categories = ['Gündem', 'Siyaset', 'Ekonomi', 'Spor', 'Magazin'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // If empty, remove query param
      router.push('/search');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      // Çıkış sonrası ana sayfaya yönlendir
      router.push('/');
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              DikiliHaber
            </Link>
          </div>

          {/* Category Links */}
          <div className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Haber ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-3 top-2.5 text-gray-400 hover:text-primary transition-colors"
                aria-label="Ara"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>

            {/* Auth Section */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden md:block text-sm">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Paneli
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Çıkış Yap
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/auth/login"
                      className="text-gray-700 hover:text-primary transition-colors text-sm font-medium"
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Navbar component with Suspense wrapper
const Navbar = (): React.JSX.Element => {
  return (
    <Suspense fallback={
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              DikiliHaber
            </Link>
            <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </nav>
    }>
      <NavbarContent />
    </Suspense>
  );
};

export default Navbar;