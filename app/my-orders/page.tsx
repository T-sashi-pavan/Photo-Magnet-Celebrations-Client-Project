'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';
import { Package, Calendar, MapPin, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  whatsapp: string;
  email?: string;
  address: string;
  pincode: string;
  state: string;
  productType: 'square' | 'rectangle';
  orientation?: 'portrait' | 'landscape';
  withStand: boolean | null;
  quantity: number;
  totalPrice: number;
  deliveryCharge: number;
  couponApplied?: string;
  discount: number;
  finalAmount: number;
  croppedImageUrl: string;
  paymentId: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function MyOrdersPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Try to load recent orders from localStorage
    const recentOrderIds = localStorage.getItem('recentOrders');
    if (recentOrderIds) {
      fetchOrdersByIds(JSON.parse(recentOrderIds));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrdersByIds = async (orderIds: string[]) => {
    setLoading(true);
    try {
      const orderPromises = orderIds.map(id =>
        fetch(`/api/orders/${id}`).then(res => res.json())
      );
      const orderResults = await Promise.all(orderPromises);
      const fetchedOrders = orderResults
        .filter(result => result.success)
        .map(result => result.order);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchOrders = async () => {
    if (!searchPhone && !searchEmail) {
      alert('Please enter phone number or email to search');
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchPhone) query.append('phone', searchPhone);
      if (searchEmail) query.append('email', searchEmail);

      const response = await fetch(`/api/orders/search?${query}`);
      const data = await response.json();
      
      if (data.success && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        alert('No orders found with this information');
        setOrders([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'preparing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <>
      <Header cartItemCount={0} onCartClick={() => {}} />
      <div className={`min-h-screen ${isDark ? 'bg-[#121212]' : 'bg-gray-50'} py-8 px-4`}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className={`${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
            <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
              Track Your Orders
            </h1>
            
            {/* Search Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Search by Phone Number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className={`px-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-[#2a2a2a] border-[#3a3a3a] text-[#f0f0f0]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <input
                type="email"
                placeholder="Search by Email (optional)"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className={`px-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-[#2a2a2a] border-[#3a3a3a] text-[#f0f0f0]' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <button
              onClick={searchOrders}
              className="mt-4 w-full md:w-auto px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Search Orders
            </button>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className={isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className={`${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-lg shadow-lg p-12 text-center`}>
              <Package className={`mx-auto mb-4 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-400'}`} size={64} />
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                No Orders Yet
              </h2>
              <p className={`mb-6 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                Search for your orders using your phone number or email
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleOrder(order.orderId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                            {order.orderId}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className={`flex items-center gap-1 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                            <Calendar size={16} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className={`flex items-center gap-1 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                            <Package size={16} />
                            {order.productType.toUpperCase()} × {order.quantity}
                          </div>
                          <div className={`flex items-center gap-1 font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                            <CreditCard size={16} />
                            ₹{order.finalAmount}
                          </div>
                        </div>
                      </div>
                      {expandedOrder === order.orderId ? (
                        <ChevronUp size={24} className={isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} />
                      ) : (
                        <ChevronDown size={24} className={isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.orderId && (
                    <div className={`border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} p-6`}>
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Product Image */}
                        <div>
                          <img
                            src={order.croppedImageUrl}
                            alt="Product"
                            className="w-full rounded-lg border-2 border-orange-500/30"
                          />
                        </div>

                        {/* Order Details */}
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <h4 className={`font-bold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                              Product Details
                            </h4>
                            <div className={`text-sm space-y-1 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                              <p><strong>Type:</strong> {order.productType.toUpperCase()}</p>
                              {order.orientation && <p><strong>Orientation:</strong> {order.orientation}</p>}
                              {order.withStand !== null && (
                                <p><strong>Stand:</strong> {order.withStand ? 'With Stand' : 'Without Stand'}</p>
                              )}
                              <p><strong>Quantity:</strong> {order.quantity} piece(s)</p>
                            </div>
                          </div>

                          <div>
                            <h4 className={`font-bold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                              Delivery Address
                            </h4>
                            <div className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                              <p>{order.customerName}</p>
                              <p>{order.address}</p>
                              <p>{order.pincode}, {order.state}</p>
                              <p>{order.whatsapp}</p>
                              {order.email && <p>{order.email}</p>}
                            </div>
                          </div>

                          <div>
                            <h4 className={`font-bold mb-2 ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                              Payment Details
                            </h4>
                            <div className={`text-sm space-y-1 ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                              <p><strong>Subtotal:</strong> ₹{order.totalPrice}</p>
                              <p><strong>Delivery:</strong> ₹{order.deliveryCharge}</p>
                              {order.discount > 0 && (
                                <p className="text-green-500"><strong>Discount:</strong> -₹{order.discount}</p>
                              )}
                              <p className={`text-lg font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                                <strong>Total:</strong> ₹{order.finalAmount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
