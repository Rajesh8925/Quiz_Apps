'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, User, LogIn, BookOpen, Plus, History, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Your Quizzes', href: '/dashboard#quizzes', icon: BookOpen },
    { name: 'History', href: '/history', icon: History },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AI Quiz App</span>
          </div>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link 
                href="/signup" 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          )}

          {/* User Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {user ? (
              <>
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isActive(item.href)
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
                >
                  <User className="w-5 h-5" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
