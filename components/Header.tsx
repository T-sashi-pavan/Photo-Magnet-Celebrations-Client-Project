'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-1">
              <img 
                src="/logo.jpeg" 
                alt="Photo Magnet Celebrations Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Photo Magnets</h1>
              <p className="text-xs text-amber-100">Celebrate Every Moment</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-amber-100 font-semibold transition-colors">
              Home
            </Link>
            <Link href="/products/square" className="text-white hover:text-amber-100 font-semibold transition-colors">
              Square Magnets
            </Link>
            <Link href="/products/rectangle" className="text-white hover:text-amber-100 font-semibold transition-colors">
              Rectangle Magnets
            </Link>
          </nav>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
