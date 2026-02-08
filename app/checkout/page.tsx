'use client';

import { useState, useEffect } from 'react';
import CheckoutForm from '@/components/CheckoutForm';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomerReviews from '@/components/CustomerReviews';
import { useToast } from '@/components/ToastProvider';
import { isServiceableState, calculateDeliveryCharge } from '@/lib/products';
import { useTheme } from '@/components/ThemeProvider';

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

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCartItems((window as any).cartItems || []);
    }
  }, []);

  const calculateTotals = (state: string) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
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

        if (result.paymentDetails) {
          const verifyResponse = await fetch('/api/cashfree/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.status === 'SUCCESS') {
            // Create order in database and send notifications
            try {
              const { subtotal, deliveryCharge, total } = calculateTotals(formData.state);
              const appliedCoupon = (window as any).appliedCoupon || null;
              const discount = (window as any).couponDiscount || 0;
              
              // For square products, withStand should be null (no stand concept)
              const productType = cartItems[0].category;
              const withStand = productType === 'square' ? null : ((cartItems[0] as any).withStand || false);
              
              await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customerName: formData.name,
                  whatsapp: formData.whatsapp,
                  email: formData.email,
                  address: formData.address,
                  pincode: formData.pincode,
                  state: formData.state,
                  productType: productType,
                  orientation: (cartItems[0] as any).orientation,
                  withStand: withStand,
                  quantity: cartItems[0].quantity,
                  pricePerUnit: cartItems[0].price / cartItems[0].quantity,
                  totalPrice: subtotal,
                  deliveryCharge: deliveryCharge,
                  couponApplied: appliedCoupon,
                  discount: discount,
                  finalAmount: total,
                  croppedImageUrl: cartItems[0].croppedImageUrl,
                  paymentId: verifyData.payment_id || orderId,
                }),
              });
            } catch (orderError) {
              console.error('Failed to create order record:', orderError);
              // Don't fail the payment flow, just log the error
            }

            showToast('Payment successful! Order confirmed.', 'success');
            if (typeof window !== 'undefined') {
              (window as any).cartItems = [];
            }
            setCartItems([]);
            setTimeout(() => router.push('/?payment=success'), 2000);
          } else {
            showToast('Payment verification failed. Please contact support.', 'error');
          }
        }
      });
    } catch (error: any) {
      console.error('Checkout error:', error);
      showToast(error.message || 'Failed to process payment. Please try again.', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
        <Header cartItemCount={0} onCartClick={() => {}} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-4`}>Your cart is empty</h2>
            <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mb-6`}>Add some items to your cart to proceed</p>
            <button
              onClick={() => router.push('/')}
              className={`px-6 py-3 ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-md font-semibold shadow-lg`}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
      <Header cartItemCount={cartItems.length} onCartClick={() => router.back()} />
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className={`mb-6 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
          <span className={`cursor-pointer ${isDark ? 'hover:text-[#f0f0f0]' : 'hover:text-gray-900'} font-medium`} onClick={() => router.push('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className={`cursor-pointer ${isDark ? 'hover:text-[#f0f0f0]' : 'hover:text-gray-900'} font-medium`} onClick={() => router.back()}>Cart</span>
          <span className="mx-2">/</span>
          <span className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-bold`}>Checkout</span>
        </div>

        <h1 className={`text-3xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-8`}>Checkout</h1>

        {/* Cart Summary */}
        <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-md border p-6 mb-6`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-4`}>Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div key={index} className={`flex items-center gap-4 pb-3 ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} border-b last:border-0`}>
                <img
                  src={item.croppedImageUrl}
                  alt={item.productName}
                  className={`w-16 h-16 object-cover rounded-md border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}
                />
                <div className="flex-1">
                  <h4 className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>{item.productName}</h4>
                  <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>{item.quantity} pieces</p>
                </div>
                <div className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>₹{item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Form */}
        <CheckoutForm
          cartItems={cartItems}
          onSubmit={handleCheckoutSubmit}
          calculateTotals={calculateTotals}
          isProcessing={isProcessingPayment}
        />
      </div>
      </div>

      <CustomerReviews />

      <Footer />
    </div>
  );
}
