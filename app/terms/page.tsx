'use client';

import { useTheme } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TermsPage() {
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
              <FileText className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`} size={40} />
              <h1 className={`text-4xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Terms & Conditions
              </h1>
            </div>
            <p className={`text-lg ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              Last updated on 11-02-2026 14:46:30
            </p>
          </div>

          {/* Content */}
          <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-8 space-y-6`}>
            {/* Introduction */}
            <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'} leading-relaxed`}>
              <p className="mb-4">
                These Terms and Conditions, along with privacy policy or other terms ("Terms") constitute a binding agreement by and between <strong className={isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}>PHOTO MAGNET CELEBRATIONS</strong>, ("Website Owner" or "we" or "us" or "our") and you ("you" or "your") and relate to your use of our website, goods (as applicable) or services (as applicable) (collectively, "Services").
              </p>
              <p className="mb-4">
                By using our website and availing the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning any reason. It is your responsibility to periodically review these Terms to stay informed of updates.
              </p>
              <p className="font-semibold">
                The use of this website or availing of our Services is subject to the following terms of use:
              </p>
            </div>

            {/* Terms List */}
            <div className={`space-y-4 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>To access and use the Services, you agree to provide true, accurate and complete information to us during and after registration, and you shall be responsible for all acts done through the use of your registered account.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials offered on this website or through the Services, for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>Your use of our Services and the website is solely at your own risk and discretion. You are required to independently assess and ensure that the Services meet your requirements.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>The contents of the Website and the Services are proprietary to Us and you will not have any authority to claim any intellectual property rights, title, or interest in its contents.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>You acknowledge that unauthorized use of the Website or the Services may lead to action against you as per these Terms or applicable laws.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>You agree to pay us the charges associated with availing the Services.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>You agree not to use the website and/or Services for any purpose that is unlawful, illegal or forbidden by these Terms, or Indian or local laws that might apply to you.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>You agree and acknowledge that website and the Services may contain links to other third party websites. On accessing these links, you will be governed by the terms of use, privacy policy and such other policies of such third party websites.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>You understand that upon initiating a transaction for availing the Services you are entering into a legally binding and enforceable contract with the us for the Services.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>You shall be entitled to claim a refund of the payment made by you in case we are not able to provide the Service. The timelines for such return and refund will be according to the specific Service you have availed or within the time period provided in our policies (as applicable). In case you do not raise a refund claim within the stipulated time, than this would make you ineligible for a refund.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed in accordance with the laws of India.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in <strong>GUNTUR, Andhra Pradesh</strong>.</p>
              </div>

              <div className="flex gap-3">
                <span className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} shrink-0`}>•</span>
                <p>All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website.</p>
              </div>
            </div>

            {/* Footer Note */}
            <div className={`mt-8 pt-6 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                For any questions or concerns regarding these Terms & Conditions, please visit our{' '}
                <a href="/contact" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}>
                  Contact Us
                </a>{' '}
                page.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
