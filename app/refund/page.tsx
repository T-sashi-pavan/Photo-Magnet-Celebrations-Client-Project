'use client';

import { useTheme } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RefundPage() {
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <RefreshCw className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`} size={40} />
              <h1 className={`text-4xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Cancellation & Refund Policy
              </h1>
            </div>
            <p className={`text-lg ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              Last updated on 11-02-2026 14:55:03
            </p>
          </div>

          {/* Content */}
          <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-8 space-y-6`}>
            {/* Introduction */}
            <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'} leading-relaxed`}>
              <p className="mb-6">
                <strong className={isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}>PHOTO MAGNET CELEBRATIONS</strong> believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
              </p>
            </div>

            {/* Policy Points */}
            <div className={`space-y-6 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>
                  <strong>Cancellations</strong> will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                </p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>
                  PHOTO MAGNET CELEBRATIONS does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                </p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>
                  In case of receipt of <strong>damaged or defective items</strong> please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within <strong className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>Only same day</strong> of receipt of the products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>Only same day</strong> of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
                </p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>
                  In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them. In case of any Refunds approved by the PHOTO MAGNET CELEBRATIONS, it'll take <strong className={`${isDark ? 'text-green-400' : 'text-green-600'}`}>1-2 Days</strong> for the refund to be processed to the end customer.
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className={`mt-8 p-6 rounded-lg ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-blue-50 border-blue-200'} border`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                📢 Important Information
              </h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <li><strong>Cancellation Window:</strong> Immediately after order placement</li>
                <li><strong>Damage Report Window:</strong> Same day of delivery</li>
                <li><strong>Refund Processing Time:</strong> 1-2 Days after approval</li>
                <li><strong>Custom Products:</strong> Photo magnets are custom-made items and may have special cancellation conditions</li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className={`mt-8 pt-6 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Need Help?
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mb-3`}>
                For cancellation requests, refund status, or any concerns regarding this policy, please contact our Customer Service team:
              </p>
              <div className={`flex flex-col gap-2 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <div>
                  📞 Phone: <a href="tel:+919491620772" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}>+91 9491620772</a>
                </div>
                <div>
                  📧 Email: <a href="mailto:photomagnetcelebrations@gmail.com" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}>photomagnetcelebrations@gmail.com</a>
                </div>
                <div className="mt-2">
                  <a href="/contact" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline font-medium`}>
                    View full contact information →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
