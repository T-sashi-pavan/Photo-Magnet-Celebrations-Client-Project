'use client';

import { useTheme } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Get cart items from localStorage
    if (typeof window !== 'undefined') {
      const cartItems = (window as any).cartItems || [];
      setCartItemCount(cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0));
    }
  }, []);

  return (
    <>
      <Header cartItemCount={cartItemCount} onCartClick={() => {}} />
      <main className={`min-h-screen ${isDark ? 'bg-[#121212]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
              Contact Us
            </h1>
            <p className={`text-lg ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              Last updated on 11-02-2026 14:44:34
            </p>
          </div>

          {/* Contact Information Card */}
          <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-8 mb-8`}>
            <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mb-8`}>
              You may contact us using the information below:
            </p>

            <div className="space-y-6">
              {/* Merchant Name */}
              <div className="flex items-start gap-4">
                <Building2 className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1 shrink-0`} size={24} />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                    Merchant Legal Entity Name
                  </h3>
                  <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                    PHOTO MAGNET CELEBRATIONS
                  </p>
                </div>
              </div>

              {/* Registered Address */}
              <div className="flex items-start gap-4">
                <MapPin className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1 shrink-0`} size={24} />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                    Registered Address
                  </h3>
                  <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                    Flat No-3C, Anuradha Nilayam, 4/2, Panduranga Nagar,<br />
                    Nagaralu, Industrial Estate,<br />
                    Andhra Pradesh, PIN: 522034
                  </p>
                </div>
              </div>

              {/* Operational Address */}
              <div className="flex items-start gap-4">
                <MapPin className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1 shrink-0`} size={24} />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                    Operational Address
                  </h3>
                  <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                    Flat No-3C, Anuradha Nilayam, 4/2, Panduranga Nagar,<br />
                    Nagaralu, Industrial Estate,<br />
                    Andhra Pradesh, PIN: 522034
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1 shrink-0`} size={24} />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                    Telephone Number
                  </h3>
                  <a 
                    href="tel:+919491620772" 
                    className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
                  >
                    +91 9491620772
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1 shrink-0`} size={24} />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                    Email Address
                  </h3>
                  <a 
                    href="mailto:photomagnetcelebrations@gmail.com" 
                    className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors break-all`}
                  >
                    photomagnetcelebrations@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6`}>
            <h3 className={`font-semibold mb-3 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
              Business Hours
            </h3>
            <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              Monday - Saturday: 9:00 AM - 6:00 PM<br />
              Sunday: Closed
            </p>
            <p className={`mt-4 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-500'}`}>
              For urgent inquiries, please call us or send an email. We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
