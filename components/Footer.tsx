'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`${isDark ? 'bg-[#0d0d0d] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'} border-t`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-bold text-lg mb-4`}>Photo Magnet Celebrations</h3>
            <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} text-sm mb-4`}>
              Create lasting memories with premium photo magnets. Perfect for every celebration!
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#f0f0f0] hover:bg-[#2a2a2a] hover:border-[#3a3a3a]' : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 hover:border-gray-300'} border rounded-md flex items-center justify-center transition-all`}
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#f0f0f0] hover:bg-[#2a2a2a] hover:border-[#3a3a3a]' : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 hover:border-gray-300'} border rounded-md flex items-center justify-center transition-all`}
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-bold text-lg mb-4`}>Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products/square" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Square Magnets
                </Link>
              </li>
              <li>
                <Link href="/products/rectangle" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Rectangle Magnets
                </Link>
              </li>
              <li>
                <Link href="/checkout" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-bold text-lg mb-4`}>Our Products</h3>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              <li>Square Photo Magnets</li>
              <li>Rectangle Photo Magnets</li>
              <li>Magnets with Stand</li>
              <li>Custom Sizes Available</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-bold text-lg mb-4`}>Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className={`flex items-start gap-2 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                <Phone size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'}`} />
                <span>+91 733-077-5225</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                <Mail size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'}`} />
                <span>sashipavan111111@gmail.com</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                <MapPin size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'}`} />
                <span>Hyderabad, Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'} border-t`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} text-sm text-center md:text-left`}>
              © {new Date().getFullYear()} Photo Magnet Celebrations. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Privacy Policy
              </Link>
              <Link href="/terms" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Terms of Service
              </Link>
              <Link href="/refund" className={`${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0]' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
