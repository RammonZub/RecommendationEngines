'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import LoginModal from './LoginModal';

export default function HeaderNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsMenuOpen(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-gray-800 font-semibold text-xl tracking-tight">Restaurant Recommender App</h1>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              
              {isAuthenticated ? (
                <div className="relative ml-3">
                  <button
                    onClick={toggleMenu}
                    className="flex items-center text-gray-700 hover:text-[#006B5A] px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <span className="mr-2">{user?.name}</span>
                    <FaUserCircle className="h-5 w-5" />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-10">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={openLoginModal}
                    className="text-gray-700 hover:text-[#006B5A] px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </button>
                  <Link 
                    href="/signup" 
                    className="bg-[#006B5A] text-white hover:bg-[#005a4a] px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#006B5A] focus:outline-none"
              >
                {isMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/"
                className="block text-gray-700 hover:text-[#006B5A] px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/#top-restaurants"
                className="block text-gray-700 hover:text-[#006B5A] px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Top Restaurants
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/profile"
                    className="block text-gray-700 hover:text-[#006B5A] px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block text-gray-700 hover:text-[#006B5A] px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openLoginModal}
                    className="block w-full text-left text-gray-700 hover:text-[#006B5A] px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </button>
                  <Link 
                    href="/signup"
                    className="block bg-[#006B5A] text-white hover:bg-[#005a4a] px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
} 