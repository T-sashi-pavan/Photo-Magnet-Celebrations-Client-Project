'use client';

import { useTheme } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
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
              <Shield className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`} size={40} />
              <h1 className={`text-4xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Privacy Policy
              </h1>
            </div>
            <p className={`text-lg ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              Last updated on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
            </p>
          </div>

          {/* Content */}
          <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-8 space-y-8`}>
            {/* Introduction */}
            <section>
              <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'} leading-relaxed`}>
                This Privacy Policy describes how <strong className={isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}>PHOTO MAGNET CELEBRATIONS</strong> ("we", "us", or "our") collects, uses, and protects your personal information when you use our website and services. We are committed to ensuring that your privacy is protected and your personal information is handled in accordance with applicable laws.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                1. Information We Collect
              </h2>
              <div className={`space-y-4 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Personal Information:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Phone Number / WhatsApp Number</li>
                    <li>Delivery Address (including PIN code and state)</li>
                    <li>Payment Information (processed securely through Cashfree)</li>
                  </ul>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Order Information:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Product customization details (size, orientation, quantity)</li>
                    <li>Uploaded photos and images</li>
                    <li>Order history and transaction details</li>
                    <li>Coupon codes used</li>
                  </ul>
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Technical Information:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>IP address</li>
                    <li>Shopping cart data (stored locally)</li>
                    <li>Theme preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                2. How We Use Your Information
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p className="mb-3">We use your personal information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing and fulfilling your orders</li>
                  <li>Creating custom photo magnets as per your specifications</li>
                  <li>Processing payments securely through our payment gateway partner (Cashfree)</li>
                  <li>Sending order confirmations, updates, and shipping notifications via SMS and email</li>
                  <li>Notifying our admin team about new orders</li>
                  <li>Providing customer support and responding to inquiries</li>
                  <li>Improving our website and services</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                3. Third-Party Services
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p className="mb-3">We use the following third-party services to operate our business:</p>
                <ul className="space-y-3">
                  <li>
                    <strong className={isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}>Cashfree (Payment Gateway):</strong> For secure payment processing. Your payment information is handled directly by Cashfree in compliance with PCI-DSS standards.
                  </li>
                  <li>
                    <strong className={isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}>Cloudinary:</strong> For storing and processing uploaded images securely.
                  </li>
                  <li>
                    <strong className={isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}>MongoDB:</strong> For secure database storage of order information.
                  </li>
                  <li>
                    <strong className={isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}>SMS/Email Service Providers:</strong> For sending order notifications and updates.
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                4. Data Security
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p className="mb-3">We take the security of your personal information seriously and implement appropriate measures including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Secure HTTPS encryption for all data transmission</li>
                  <li>Secure payment processing through certified payment gateways</li>
                  <li>Password-protected admin access</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                </ul>
                <p className="mt-3">
                  However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Cookies and Local Storage */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                5. Cookies and Local Storage
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p className="mb-3">Our website uses browser local storage to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your shopping cart items</li>
                  <li>Save your theme preferences (light/dark mode)</li>
                  <li>Improve your user experience</li>
                </ul>
                <p className="mt-3">
                  This data is stored locally in your browser and can be cleared at any time through your browser settings.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                6. Data Retention
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order and transaction data may be retained for accounting and legal compliance purposes.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                7. Your Rights
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information (subject to legal obligations)</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Lodge a complaint with relevant data protection authorities</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, please contact us using the information provided below.
                </p>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                8. Information Sharing
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who help us operate our business (payment processors, hosting providers, etc.)</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>With your explicit consent</li>
                  <li>In connection with a business transfer or merger (you will be notified)</li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                9. Children's Privacy
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p>
                  Our services are not directed to children under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                10. Changes to This Privacy Policy
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                11. Governing Law
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p>
                  This Privacy Policy is governed by the laws of India. Any disputes relating to this policy shall be subject to the exclusive jurisdiction of the courts in GUNTUR, Andhra Pradesh.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className={`pt-6 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                12. Contact Us
              </h2>
              <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <p className="mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Business Name:</strong> PHOTO MAGNET CELEBRATIONS</p>
                  <p>
                    <strong>Address:</strong> Flat No-3C, Anuradha Nilayam, 4/2, Panduranga Nagar, Nagaralu, Industrial Estate, Andhra Pradesh, PIN: 522034
                  </p>
                  <p>
                    <strong>Phone:</strong> <a href="tel:+919491620772" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}>+91 9491620772</a>
                  </p>
                  <p>
                    <strong>Email:</strong> <a href="mailto:photomagnetcelebrations@gmail.com" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}>photomagnetcelebrations@gmail.com</a>
                  </p>
                  <div className="mt-4">
                    <a href="/contact" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline font-medium`}>
                      View full contact information →
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
