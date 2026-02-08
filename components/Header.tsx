'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shadow-sm p-1 border border-gray-200">
              <img 
                src="/logo.jpeg" 
                alt="Photo Magnet Celebrations Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Photo Magnets</h1>
              <p className="text-xs text-gray-500">Premium Quality Prints</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Home
            </Link>
            <Link href="/products/square" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Square Magnets
            </Link>
            <Link href="/products/rectangle" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Rectangle Magnets
            </Link>
          </nav>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-all shadow-sm hover:shadow-md"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
