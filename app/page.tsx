'use client';

import { useState } from 'react';
import { isServiceableState, calculateDeliveryCharge } from '@/lib/products';
import NewHeroSection from '@/components/NewHeroSection';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';

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

      <NewHeroSection />
    </div>
  );
}
