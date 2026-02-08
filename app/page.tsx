'use client';

import { useState } from 'react';
import { isServiceableState, calculateDeliveryCharge } from '@/lib/products';
import DomeGallery from '@/components/DomeGallery';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ToastProvider';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* 3D Dome Gallery Hero */}
      <div className="relative" style={{ height: '85vh', minHeight: '500px' }}>
        <DomeGallery
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={false}
          overlayBlurColor="#f9fafb"
          imageBorderRadius="20px"
          openedImageBorderRadius="24px"
        />
        
        {/* Floating Title Overlay */}
        <div className="absolute top-8 left-0 right-0 z-10 text-center pointer-events-none">
          <div className="inline-block px-6 py-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg">
            <span className="text-gray-800 font-bold text-lg tracking-wide">Photo Magnet Celebrations</span>
          </div>
          <h1 className="mt-4 text-5xl md:text-7xl font-bold text-gray-900 drop-shadow-sm">
            Drag to Explore
          </h1>
          <p className="mt-2 text-gray-600 text-lg md:text-xl font-medium">Click any image to enlarge</p>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-wrap gap-4 justify-center px-4 pointer-events-none">
          <Link
            href="/products/square"
            className="pointer-events-auto group px-8 py-4 bg-gray-900 text-white rounded-md font-semibold text-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:scale-105 inline-flex items-center gap-2"
          >
            Shop Square Magnets
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products/rectangle"
            className="pointer-events-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-md font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            Shop Rectangle Magnets
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Product Selection Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Style
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select from our premium photo magnet collections. Perfect for any occasion!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Square Magnets Block */}
            <Link href="/products/square" className="group">
              <div className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg hover:scale-105 duration-300">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Square size={120} className="text-gray-300" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Square className="text-gray-700" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Square Magnets</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Perfect square format for classic memories. Ideal for portraits and square photos.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-semibold">Starting at ₹99</span>
                    <div className="flex items-center gap-2 text-gray-700 font-semibold group-hover:gap-3 transition-all">
                      Customize Now
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </Link>

            {/* Rectangle Magnets Block */}
            <Link href="/products/rectangle" className="group">
              <div className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg hover:scale-105 duration-300">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RectangleHorizontal size={160} className="text-gray-300" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <RectangleHorizontal className="text-gray-700" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Rectangle Magnets</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Versatile rectangle format with optional stand. Great for landscape photos and group pictures.
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-semibold">Starting at ₹149</span>
                    <div className="flex items-center gap-2 text-gray-700 font-semibold group-hover:gap-3 transition-all">
                      Customize Now
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
