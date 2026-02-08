'use client';

import { useState } from 'react';
import { isServiceableState, calculateDeliveryCharge } from '@/lib/products';
import DomeGallery from '@/components/DomeGallery';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import CustomerReviews from '@/components/CustomerReviews';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Square, RectangleHorizontal } from 'lucide-react';

interface CartItem {
  productId: string;
  productName: string;
  packageDetails: string;
  quantity: number;
  price: number;
  croppedImageUrl: string;
  category: string;
}

interface CheckoutFormData {
  name: string;
  whatsapp: string;
  address: string;
  pincode: string;
  state: string;
  email?: string;
}

declare global {
  interface Window {
    Cashfree: any;
  }
}

// Create a cart context for sharing across pages
if (typeof window !== 'undefined') {
  (window as any).cartItems = (window as any).cartItems || [];
  (window as any).setCartItems = (window as any).setCartItems || (() => {});
}

export default function Home() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { showToast } = useToast();

  // Store cart in window for cross-page access
  if (typeof window !== 'undefined') {
    (window as any).cartItems = cartItems;
    (window as any).setCartItems = setCartItems;
  }

  const handleAddToCart = (item: CartItem) => {
    setCartItems([...cartItems, item]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const calculateTotals = (state: string) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate delivery charge based on first item's category
    const deliveryCharge = cartItems.length > 0 
      ? calculateDeliveryCharge(cartItems[0].category, totalQuantity, state)
      : 0;
    
    const total = subtotal + deliveryCharge;
    
    return { subtotal, deliveryCharge, total };
  };

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    if (!isServiceableState(formData.state)) {
      showToast('We currently only deliver to Telangana and Andhra Pradesh', 'error');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const { total } = calculateTotals(formData.state);

      // Create Cashfree order
      const orderResponse = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerName: formData.name,
          customerPhone: formData.whatsapp,
          customerEmail: formData.email || undefined,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        console.error('Order creation failed:', orderData);
        const errorMsg = orderData.message || orderData.error || 'Failed to create order';
        const hint = orderData.hint || '';
        throw new Error(`${errorMsg}${hint ? ' - ' + hint : ''}`);
      }

      const { orderId, paymentSessionId } = orderData;

      // Load Cashfree SDK
      const cashfree = await window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox',
      });

      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        returnUrl: `${window.location.origin}/?payment=success&order_id=${orderId}`,
      };

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          console.error('Payment error:', result.error);
          showToast('Payment failed. Please try again.', 'error');
          setIsProcessingPayment(false);
          return;
        }

        if (result.redirect) {
          const verifyResponse = await fetch('/api/cashfree/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });

          if (!verifyResponse.ok) {
            throw new Error('Failed to verify payment');
          }

          const verifyData = await verifyResponse.json();

          if (verifyData.isValid) {
            showToast('Payment successful! Your order has been placed.', 'success');
            setCartItems([]);
            if (typeof window !== 'undefined') {
              (window as any).cartItems = [];
            }
          } else {
            showToast('Payment verification failed. Please contact support.', 'error');
          }
        }

        setIsProcessingPayment(false);
      });
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('An error occurred during checkout. Please try again.', 'error');
      setIsProcessingPayment(false);
    }
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
      <Header cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* 3D Dome Gallery Hero */}
      <div className="relative" style={{ height: '70vh', minHeight: '400px', maxHeight: '800px' }}>
        <DomeGallery
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={false}
          overlayBlurColor={isDark ? "#141414" : "#f9fafb"}
          imageBorderRadius="20px"
          openedImageBorderRadius="24px"
        />
        
        {/* Floating Title Overlay */}
        <div className="absolute top-4 md:top-8 left-0 right-0 z-10 text-center pointer-events-none px-4">
          <div className={`inline-block px-4 py-2 md:px-6 md:py-3 ${isDark ? 'bg-[#1a1a1a]/80 border-[#2a2a2a]' : 'bg-white/80 border-gray-200'} backdrop-blur-md border rounded-full shadow-lg`}>
            <span className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-bold text-sm md:text-lg tracking-wide`}>Photo Magnet Celebrations</span>
          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 pointer-events-none">
          <Link
            href="/products/square"
            className={`pointer-events-auto group px-6 py-3 md:px-8 md:py-4 ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-md font-semibold text-sm md:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2`}
          >
            <span className="hidden sm:inline">Shop Square Magnets</span>
            <span className="sm:hidden">Square Magnets</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products/rectangle"
            className={`pointer-events-auto px-6 py-3 md:px-8 md:py-4 ${isDark ? 'bg-transparent text-[#f0f0f0] border-2 border-[#f0f0f0] hover:bg-[#f0f0f0] hover:text-[#141414]' : 'bg-transparent text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white'} rounded-md font-semibold text-sm md:text-lg hover:scale-105 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2`}
          >
            <span className="hidden sm:inline">Shop Rectangle Magnets</span>
            <span className="sm:hidden">Rectangle Magnets</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Product Selection Section */}
      <div className={`${isDark ? 'bg-[#0d0d0d]' : 'bg-white'} py-12 md:py-20`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-3 md:mb-4`}>
              Choose Your Style
            </h2>
            <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} text-base md:text-lg max-w-2xl mx-auto`}>
              Select from our premium photo magnet collections. Perfect for any occasion!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Square Magnets Block */}
            <Link href="/products/square" className="group">
              <div className={`relative ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'} rounded-lg shadow-xl overflow-hidden border transition-all hover:shadow-2xl hover:scale-105 duration-300`}>
                {/* Image Container */}
                <div className={`relative h-60 md:h-80 overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 to-gray-50'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Square size={100} className={`md:w-[120px] md:h-[120px] ${isDark ? 'text-[#3a3a3a]' : 'text-gray-300'}`} strokeWidth={1.5} />
                  </div>
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent' : 'bg-gradient-to-t from-gray-50/80 via-transparent to-transparent'}`} />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'} rounded-lg flex items-center justify-center border`}>
                      <Square className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`} size={20} />
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Square Magnets</h3>
                  </div>
                  
                  <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} text-sm md:text-base mb-4 md:mb-6`}>
                    Perfect square format for classic memories. Ideal for portraits and square photos.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-semibold text-sm md:text-base`}>Starting at ₹99</span>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-[#dcdcdc]' : 'text-gray-700'} text-sm md:text-base font-semibold group-hover:gap-3 transition-all`}>
                      Customize Now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </Link>

            {/* Rectangle Magnets Block */}
            <Link href="/products/rectangle" className="group">
              <div className={`relative ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]' : 'bg-gray-50 border-gray-200 hover:border-gray-300'} rounded-lg shadow-xl overflow-hidden border transition-all hover:shadow-2xl hover:scale-105 duration-300`}>
                {/* Image Container */}
                <div className={`relative h-60 md:h-80 overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a]' : 'bg-gradient-to-br from-gray-100 to-gray-50'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RectangleHorizontal size={140} className={`md:w-[160px] md:h-[160px] ${isDark ? 'text-[#3a3a3a]' : 'text-gray-300'}`} strokeWidth={1.5} />
                  </div>
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent' : 'bg-gradient-to-t from-gray-50/80 via-transparent to-transparent'}`} />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'} rounded-lg flex items-center justify-center border`}>
                      <RectangleHorizontal className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`} size={20} />
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Rectangle Magnets</h3>
                  </div>
                  
                  <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} text-sm md:text-base mb-4 md:mb-6`}>
                    Versatile rectangle format with optional stand. Great for landscape photos and group pictures.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-semibold text-sm md:text-base`}>Starting at ₹149</span>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-[#dcdcdc]' : 'text-gray-700'} text-sm md:text-base font-semibold group-hover:gap-3 transition-all`}>
                      Customize Now
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <CustomerReviews />

      <Footer />
    </div>
  );
}
