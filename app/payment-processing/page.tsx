'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function PaymentProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const processPayment = async () => {
      let cashfreeOrderId: string | null = null;
      try {
        console.log('====== PAYMENT PROCESSING STARTED ======');
        console.log('window.location.href:', window.location.href);
        
        cashfreeOrderId = searchParams?.get('cashfree_order_id');
        const paymentStatus = searchParams?.get('payment_status');

        console.log('URL Parameters:', { cashfreeOrderId, paymentStatus });

        if (!cashfreeOrderId) {
          console.error('❌ No cashfree_order_id in URL');
          setStatus('failed');
          setMessage('Order ID not found');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        console.log('Processing payment for Cashfree order:', cashfreeOrderId);

        // Get stored order data from localStorage
        const storedOrderData = localStorage.getItem('pendingOrder');
        console.log('localStorage pendingOrder exists:', !!storedOrderData);
        console.log('localStorage pendingOrder RAW:', storedOrderData);
        
        if (!storedOrderData) {
          console.error('❌ No pendingOrder in localStorage');
          console.log('All localStorage keys:', Object.keys(localStorage));
          setStatus('failed');
          setMessage('Order data not found. Your payment was successful, but order details are missing. Please contact support with order ID: ' + cashfreeOrderId);
          return;
        }

        let pendingOrderData;
        try {
          pendingOrderData = JSON.parse(storedOrderData);
          console.log('✅ Successfully parsed pendingOrder:', pendingOrderData);
        } catch (parseError: any) {
          console.error('❌ Failed to parse localStorage data:', parseError);
          setStatus('failed');
          setMessage('Invalid order data format. Please contact support with order ID: ' + cashfreeOrderId);
          return;
        }

        // Check if items array exists
        if (!pendingOrderData.items || !Array.isArray(pendingOrderData.items) || pendingOrderData.items.length === 0) {
          console.error('❌ Invalid order data structure:', pendingOrderData);
          console.log('pendingOrderData.items type:', typeof pendingOrderData.items);
          console.log('pendingOrderData.items isArray:', Array.isArray(pendingOrderData.items));
          console.log('pendingOrderData.items length:', pendingOrderData.items?.length);
          setStatus('failed');
          setMessage('Invalid order data. Please try placing the order again.');
          return;
        }

        console.log(`✅ Found ${pendingOrderData.items.length} items to process`);

        // Verify payment
        setMessage('Verifying payment...');
        const verifyResponse = await fetch('/api/cashfree/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: cashfreeOrderId }),
        });

        const verifyData = await verifyResponse.json();
        console.log('Payment verification:', verifyData);

        if (!verifyResponse.ok) {
          console.error('Payment verification API failed:', verifyData);
          setStatus('failed');
          setMessage('Payment verification failed. Please contact support with order ID: ' + cashfreeOrderId);
          return;
        }

        if (verifyData.status !== 'SUCCESS') {
          console.error('Payment not successful. Status:', verifyData.status, verifyData);
          setStatus('failed');
          setMessage(`Payment verification failed: ${verifyData.orderStatus || 'Unknown status'}. Please contact support.`);
          return;
        }

        console.log('✅ Payment verified successfully');

        // Create order in database
        setMessage(`Creating ${pendingOrderData.items.length} order(s)...`);
        
        const createdOrderIds: string[] = [];
        
        // Create separate orders for each item in cart
        for (let i = 0; i < pendingOrderData.items.length; i++) {
          const item = pendingOrderData.items[i];
          console.log(`Creating order ${i + 1}/${pendingOrderData.items.length}:`, item);
          
          let createOrderResponse;
          let createOrderDataResult;
          
          try {
            const orderPayload = {
              ...item,
              totalPrice: pendingOrderData.totalPrice / pendingOrderData.items.length, // Distribute total
              deliveryCharge: pendingOrderData.deliveryCharge,
              couponApplied: pendingOrderData.couponApplied,
              discount: pendingOrderData.discount / pendingOrderData.items.length, // Distribute discount
              finalAmount: pendingOrderData.finalAmount / pendingOrderData.items.length, // Distribute final amount
              paymentId: verifyData.payment_id || cashfreeOrderId,
              paymentStatus: 'success',
            };
            
            console.log(`Order ${i + 1} payload:`, orderPayload);
            
            createOrderResponse = await fetch('/api/orders/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(orderPayload),
            });
            
            console.log(`Order ${i + 1} response status:`, createOrderResponse.status, createOrderResponse.statusText);
            
            const responseText = await createOrderResponse.text();
            console.log(`Order ${i + 1} response text:`, responseText);
            
            createOrderDataResult = JSON.parse(responseText);
            console.log(`Order ${i + 1} parsed result:`, createOrderDataResult);
          } catch (fetchError: any) {
            console.error(`❌ Order ${i + 1} fetch/parse error:`, fetchError);
            console.error(`Error stack:`, fetchError.stack);
            setStatus('failed');
            setMessage(`Failed to create order ${i + 1}. Network error: ${fetchError.message}. Please contact support with payment ID: ${verifyData.payment_id || cashfreeOrderId}`);
            return;
          }

          if (!createOrderResponse.ok || !createOrderDataResult.success) {
            console.error(`❌ Order ${i + 1} creation failed:`, createOrderDataResult);
            setStatus('failed');
            setMessage(`Failed to create order ${i + 1}. Error: ${createOrderDataResult.message || 'Unknown error'}. Please contact support with payment ID: ${verifyData.payment_id || cashfreeOrderId}`);
            return;
          }
          
          console.log(`✅ Order ${i + 1} created: ${createOrderDataResult.orderId}`);
          createdOrderIds.push(createOrderDataResult.orderId);
        }

        console.log(`✅ All ${createdOrderIds.length} orders created successfully:`, createdOrderIds);

        
        // Clear stored order data
        localStorage.removeItem('pendingOrder');

        // Store created order IDs for viewing
        localStorage.setItem('recentOrders', JSON.stringify(createdOrderIds));

        // Clear cart from both window and localStorage
        if (typeof window !== 'undefined') {
          (window as any).cartItems = [];
          localStorage.removeItem('cartItems');
        }

        setStatus('success');
        setMessage(`${createdOrderIds.length} order(s) created successfully! Redirecting...`);
        
        // Redirect to order success page with first order ID
        setTimeout(() => {
          router.push(`/order-success?orderId=${createdOrderIds[0]}`);
        }, 2000);

      } catch (error: any) {
        console.error('❌ Payment processing error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error type:', error.constructor.name);
        setStatus('failed');
        setMessage(`An error occurred while processing your payment: ${error.message}. Please contact support with payment ID: ${cashfreeOrderId || 'N/A'}`);
      }
    };

    processPayment();
  }, [searchParams, router]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
      <Header cartItemCount={0} onCartClick={() => {}} />
      
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className={`max-w-md w-full p-8 rounded-lg shadow-lg text-center ${
          isDark ? 'bg-[#1e1e1e]' : 'bg-white'
        }`}>
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Processing Payment
              </h2>
              <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                {message}
              </p>
              <p className={`mt-2 text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                Please do not close this window...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
              <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                {message}
              </p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h2>
              <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                {message}
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Return Home
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function PaymentProcessing() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header cartItemCount={0} onCartClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <PaymentProcessingContent />
    </Suspense>
  );
}
