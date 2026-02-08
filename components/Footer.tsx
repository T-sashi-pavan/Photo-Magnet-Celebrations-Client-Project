import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Photo Magnet Celebrations</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create lasting memories with premium photo magnets. Perfect for every celebration!
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products/square" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Square Magnets
                </Link>
              </li>
              <li>
                <Link href="/products/rectangle" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Rectangle Magnets
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Our Products</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Square Photo Magnets</li>
              <li>Rectangle Photo Magnets</li>
              <li>Magnets with Stand</li>
              <li>Custom Sizes Available</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-600">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-gray-700" />
                <span>+91 733-077-5225</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-gray-700" />
                <span>sashipavan111111@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-700" />
                <span>Hyderabad, Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Photo Magnet Celebrations. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-500 hover:text-gray-900 transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
