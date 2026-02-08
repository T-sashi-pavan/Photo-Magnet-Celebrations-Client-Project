'use client';

import { ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 ${isDark ? 'bg-black border-[#1a1a1a]' : 'bg-white border-gray-200'} border-b shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`w-10 h-10 md:w-12 md:h-12 ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'} rounded-md flex items-center justify-center shadow-sm p-1 border`}>
              <img 
                src="/logo.jpeg" 
                alt="Photo Magnet Celebrations Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className={`text-lg md:text-xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Photo Magnets</h1>
              <p className={`text-xs ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} hidden sm:block`}>Premium Quality Prints</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
              Home
            </Link>
            <Link href="/products/square" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
              Square Magnets
            </Link>
            <Link href="/products/rectangle" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
              Rectangle Magnets
            </Link>
          </nav>

          {/* Mobile Menu Button, Theme Toggle & Cart */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 ${isDark ? 'text-[#f0f0f0] hover:bg-[#1a1a1a]' : 'text-gray-700 hover:bg-gray-100'} rounded-md transition-colors`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 ${isDark ? 'text-[#f0f0f0] hover:bg-[#1a1a1a]' : 'text-gray-700 hover:bg-gray-100'} rounded-md transition-colors`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className={`relative p-2 md:p-3 ${isDark ? 'bg-[#f0f0f0] hover:bg-[#dcdcdc] text-[#141414]' : 'bg-gray-900 hover:bg-gray-800 text-white'} rounded-md transition-all shadow-lg`}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-[#f0f0f0] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'} border-t pt-4`}>
            <nav className="flex flex-col gap-3">
              <Link 
                href="/" 
                className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} font-medium transition-colors py-2 px-4 rounded-md`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products/square" 
                className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} font-medium transition-colors py-2 px-4 rounded-md`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Square Magnets
              </Link>
              <Link 
                href="/products/rectangle" 
                className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} font-medium transition-colors py-2 px-4 rounded-md`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rectangle Magnets
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
