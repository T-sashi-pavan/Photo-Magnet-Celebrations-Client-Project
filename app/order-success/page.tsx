'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';
import { CheckCircle, Package, Truck, Mail, Phone, MapPin, Calendar, Hash, CreditCard } from 'lucide-react';

function OrderSuccessContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [allRecentOrders, setAllRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data.order);
          
          // Try to load other recent orders
          const recentOrderIds = localStorage.getItem('recentOrders');
          if (recentOrderIds) {
            const orderIds = JSON.parse(recentOrderIds);
            const otherOrderIds = orderIds.filter((id: string) => id !== orderId);
            if (otherOrderIds.length > 0) {
              const orderPromises = otherOrderIds.map((id: string) =>
                fetch(`/api/orders/${id}`).then(res => res.json())
              );
              const orderResults = await Promise.all(orderPromises);
              const otherOrders = orderResults
                .filter(result => result.success)
                .map(result => result.order);
              setAllRecentOrders(otherOrders);
            }
          }
        } else {
          console.error('Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  if (loading) {
    return (
      <>
        <Header cartItemCount={0} onCartClick={() => {}} />
        <div className={`min-h-screen ${isDark ? 'bg-[#121212]' : 'bg-gray-50'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}>Loading order details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!orderDetails) {
    return (
      <>
        <Header cartItemCount={0} onCartClick={() => {}} />
        <div className={`min-h-screen ${isDark ? 'bg-[#121212]' : 'bg-gray-50'} flex items-center justify-center`}>
          <div className="text-center">
            <p className={`text-xl ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Order not found</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header cartItemCount={0} onCartClick={() => {}} />
      <main className={`min-h-screen ${isDark ? 'bg-[#121212]' : 'bg-gray-50'} py-12`}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
              Order Placed Successfully!
            </h1>
            <p className={`text-lg ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              Thank you for your order. We've sent confirmation details to your email and WhatsApp.
            </p>
          </div>

          {/* Order Details Card */}
          <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-8 mb-6`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
              Order Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Order ID */}
              <div className="flex items-start gap-3">
                <Hash className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1`} size={20} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Order ID</p>
                  <p className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>{orderDetails.orderId}</p>
                </div>
              </div>

              {/* Order Date */}
              <div className="flex items-start gap-3">
                <Calendar className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1`} size={20} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Order Date</p>
                  <p className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                    {new Date(orderDetails.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-start gap-3">
                <CreditCard className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1`} size={20} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Payment Status</p>
                  <p className="font-semibold text-green-600">Paid</p>
                </div>
              </div>

              {/* Order Status */}
              <div className="flex items-start gap-3">
                <Package className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1`} size={20} />
                <div>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Order Status</p>
                  <p className={`font-semibold capitalize ${
                    orderDetails.orderStatus === 'preparing' ? 'text-blue-600' :
                    orderDetails.orderStatus === 'shipped' ? 'text-purple-600' :
                    orderDetails.orderStatus === 'delivered' ? 'text-green-600' :
                    'text-yellow-600'
                  }`}>
                    {orderDetails.orderStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className={`border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} pt-6 mb-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Product Information
              </h3>
              <div className="flex gap-4">
                {orderDetails.croppedImageUrl && (
                  <img
                    src={orderDetails.croppedImageUrl}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                )}
                <div className="flex-1">
                  <p className={`font-semibold text-lg mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                    {orderDetails.productType.toUpperCase()} Photo Magnet
                  </p>
                  <div className={`space-y-1 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                    {orderDetails.orientation && (
                      <p><strong>Orientation:</strong> {orderDetails.orientation}</p>
                    )}
                    {orderDetails.withStand !== null && (
                      <p><strong>Stand:</strong> {orderDetails.withStand ? 'With Stand' : 'Without Stand'}</p>
                    )}
                    <p><strong>Quantity:</strong> {orderDetails.quantity} piece(s)</p>
                    <p><strong>Price per unit:</strong> ₹{orderDetails.pricePerUnit}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className={`border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} pt-6 mb-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Delivery Address
              </h3>
              <div className="flex items-start gap-3">
                <MapPin className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-500'} mt-1`} size={20} />
                <div className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                  <p className="font-semibold">{orderDetails.customerName}</p>
                  <p>{orderDetails.address}</p>
                  <p>{orderDetails.pincode}, {orderDetails.state}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Phone size={16} />
                      {orderDetails.whatsapp}
                    </span>
                    {orderDetails.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={16} />
                        {orderDetails.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className={`border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} pt-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Payment Summary
              </h3>
              <div className={`space-y-2 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'}`}>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{orderDetails.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>₹{orderDetails.deliveryCharge}</span>
                </div>
                {orderDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({orderDetails.couponApplied})</span>
                    <span>-₹{orderDetails.discount}</span>
                  </div>
                )}
                <div className={`flex justify-between text-xl font-bold pt-2 border-t ${isDark ? 'border-[#2a2a2a] text-[#f0f0f0]' : 'border-gray-200 text-gray-900'}`}>
                  <span>Total Paid</span>
                  <span>₹{orderDetails.finalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border rounded-xl shadow-lg p-8 mb-6`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
              Order Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-500 shrink-0" size={24} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Order Placed</p>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Your order has been received</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 ${orderDetails.orderStatus === 'pending' ? 'opacity-50' : ''}`}>
                <Package className={`${orderDetails.orderStatus !== 'pending' ? 'text-green-500' : isDark ? 'text-[#a0a0a0]' : 'text-gray-400'} shrink-0`} size={24} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Order Preparing</p>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>We're preparing your order</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 ${['pending', 'preparing'].includes(orderDetails.orderStatus) ? 'opacity-50' : ''}`}>
                <Truck className={`${orderDetails.orderStatus === 'shipped' || orderDetails.orderStatus === 'delivered' ? 'text-green-500' : isDark ? 'text-[#a0a0a0]' : 'text-gray-400'} shrink-0`} size={24} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Shipped</p>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Your order is on the way</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 ${orderDetails.orderStatus !== 'delivered' ? 'opacity-50' : ''}`}>
                <CheckCircle className={`${orderDetails.orderStatus === 'delivered' ? 'text-green-500' : isDark ? 'text-[#a0a0a0]' : 'text-gray-400'} shrink-0`} size={24} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Delivered</p>
                  <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Order delivered successfully</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                isDark
                  ? 'bg-[#1a1a1a] border-[#2a2a2a] text-[#f0f0f0] hover:bg-[#2a2a2a]'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } border`}
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Print Order
            </button>
          </div>
        </div>

        {/* Other Orders in This Purchase */}
        {allRecentOrders.length > 0 && (
          <div className={`mt-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
              Other Orders in This Purchase
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {allRecentOrders.map((order) => (
                <div
                  key={order._id}
                  className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-50'} rounded-lg p-4 border ${isDark ? 'border-[#3a3a3a]' : 'border-gray-200'}`}
                >
                  <div className="flex gap-4">
                    <img
                      src={order.croppedImageUrl}
                      alt="Product"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className={`font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                        {order.orderId}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                        {order.productType.toUpperCase()} × {order.quantity}
                      </p>
                      <p className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                        ₹{order.finalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <>
        <Header cartItemCount={0} onCartClick={() => {}} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
