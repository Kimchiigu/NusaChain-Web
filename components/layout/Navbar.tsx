'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Menu, 
  X, 
  User, 
  LogOut,
  Search,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <Image
                src="/assets/nusachain-logo-icon.png"
                alt="Loading..."
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              NusaChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/auditor"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Web3 Auditor
            </Link>
            <Link
              href="/extension"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Extension
            </Link>
            <Link
              href="/analytics"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Analytics
            </Link>
            <Link
              href="/contracts"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Contract Analysis
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-gray-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                href="/auditor"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Web3 Auditor
              </Link>
              <Link
                href="/extension"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Extension
              </Link>
              <Link
                href="/analytics"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Analytics
              </Link>
              <Link
                href="/contracts"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                Contract Analysis
              </Link>

              {user ? (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Link href="/auth/signin" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}