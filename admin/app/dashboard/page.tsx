'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  Package, 
  ShoppingCart, 
  LogOut, 
  RefreshCw, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Edit2,
  Save,
  X
} from 'lucide-react';

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
  withStand: boolean | null; // null for square
  quantity: number;
  totalPrice: number;
  deliveryCharge: number;
  couponApplied?: string;
  discount: number;
  finalAmount: number;
  croppedImageUrl: string;
  paymentId: string;
  orderStatus: string;
  createdAt: string;
}

interface Stock {
  _id: string;
  productType: 'square' | 'rectangle';
  withStand: boolean | null; // null for square
  quantity: number;
  updatedAt: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (!token) {
      router.push('/');
      return;
    }

    fetchData();

    // Check if order was just confirmed
    const confirmed = searchParams.get('confirmed');
    if (confirmed) {
      alert(`Order ${confirmed} confirmed successfully!`);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      const [ordersRes, stockRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/stock', { headers }),
      ]);

      const ordersData = await ordersRes.json();
      const stockData = await stockRes.json();

      if (ordersData.success) setOrders(ordersData.orders);
      if (stockData.success) setStock(stockData.stock);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('admin_token');
    router.push('/');
  };

  const startEditStock = (stockItem: Stock) => {
    setEditingStock(stockItem._id);
    setEditQuantity(stockItem.quantity);
  };

  const cancelEditStock = () => {
    setEditingStock(null);
    setEditQuantity(0);
  };

  const saveStock = async (stockItem: Stock) => {
    try {
      const token = Cookies.get('admin_token');
      const response = await fetch('/api/stock', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType: stockItem.productType,
          withStand: stockItem.withStand,
          quantity: editQuantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
        setEditingStock(null);
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock');
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'text-red-400', icon: <X size={16} /> };
    if (quantity < 20) return { color: 'text-orange-400', icon: <TrendingDown size={16} /> };
    return { color: 'text-green-400', icon: <TrendingUp size={16} /> };
  };

  const getStockLabel = (productType: string, withStand: boolean | null) => {
    if (productType === 'square') {
      return 'SQUARE';
    }
    return `${productType.toUpperCase()} ${withStand ? 'with Stand' : 'without Stand'}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-2xl border-2 border-amber-500/30 p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-100 mb-2">Admin Dashboard</h1>
              <p className="text-amber-200/70">Photo Magnet Celebrations</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={fetchData}
                className="p-3 bg-stone-700/50 border border-amber-500/50 rounded-lg text-amber-100 hover:bg-stone-600/50 transition-all"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-600/30 transition-all flex items-center gap-2"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200/70 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-amber-100">{orders.length}</p>
              </div>
              <ShoppingCart className="text-amber-400" size={40} />
            </div>
          </div>
          
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200/70 text-sm mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-orange-400">
                  {orders.filter(o => o.orderStatus === 'pending').length}
                </p>
              </div>
              <Clock className="text-orange-400" size={40} />
            </div>
          </div>
          
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl border border-amber-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200/70 text-sm mb-1">Total Stock</p>
                <p className="text-3xl font-bold text-green-400">
                  {stock.reduce((sum, s) => sum + s.quantity, 0)}
                </p>
              </div>
              <Package className="text-green-400" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-t-2xl border-2 border-b-0 border-amber-500/30 p-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-stone-700/50 text-amber-200/70 hover:bg-stone-600/50'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'stock'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-stone-700/50 text-amber-200/70 hover:bg-stone-600/50'
              }`}
            >
              Stock Management
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-b-2xl border-2 border-t-0 border-amber-500/30 p-6 shadow-2xl">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="animate-spin text-amber-400 mx-auto mb-4" size={40} />
              <p className="text-amber-200/70">Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="text-amber-400/50 mx-auto mb-4" size={60} />
                      <p className="text-amber-200/70">No orders yet</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-stone-700/30 border border-amber-500/20 rounded-xl p-6 hover:border-amber-400/40 transition-all"
                      >
                        <div className="grid md:grid-cols-4 gap-6">
                          {/* Image */}
                          <div className="flex justify-center md:justify-start">
                            <img
                              src={order.croppedImageUrl}
                              alt="Order"
                              className="w-32 h-32 object-cover rounded-lg border-2 border-amber-500/30"
                            />
                          </div>

                          {/* Order Details */}
                          <div className="md:col-span-2 space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="text-lg font-bold text-amber-100">{order.orderId}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.orderStatus === 'confirmed' 
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                  : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                              }`}>
                                {order.orderStatus.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-amber-100"><strong>Customer:</strong> {order.customerName}</p>
                            <p className="text-amber-200/80"><strong>Phone:</strong> {order.whatsapp}</p>
                            {order.email && <p className="text-amber-200/80"><strong>Email:</strong> {order.email}</p>}
                            <p className="text-amber-200/80"><strong>Address:</strong> {order.address}, {order.pincode}, {order.state}</p>
                            <p className="text-amber-200/80">
                              <strong>Product:</strong> {order.productType.toUpperCase()}
                              {order.productType === 'rectangle' && (order.withStand ? ' with Stand' : ' without Stand')}
                              {order.orientation && ` (${order.orientation})`}
                            </p>
                            <p className="text-amber-200/80"><strong>Quantity:</strong> {order.quantity} pieces</p>
                            {order.couponApplied && (
                              <p className="text-green-300"><strong>Coupon:</strong> {order.couponApplied} (-₹{order.discount})</p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="space-y-2">
                            <div className="text-right">
                              <p className="text-amber-200/70 text-sm">Total Price</p>
                              <p className="text-2xl font-bold text-amber-100">₹{order.finalAmount}</p>
                            </div>
                            <div className="text-right text-sm text-amber-200/60">
                              <p>Ordered: {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'stock' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stock.map((item) => {
                    const status = getStockStatus(item.quantity);
                    const isEditing = editingStock === item._id;

                    return (
                      <div
                        key={item._id}
                        className="bg-stone-700/30 border border-amber-500/20 rounded-xl p-6 hover:border-amber-400/40 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-amber-100 mb-1">
                              {getStockLabel(item.productType, item.withStand)}
                            </h3>
                            <p className="text-amber-200/60 text-sm">
                              Updated: {new Date(item.updatedAt).toLocaleString()}
                            </p>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => startEditStock(item)}
                              className="p-2 bg-stone-600/50 border border-amber-500/50 rounded-lg text-amber-200 hover:bg-stone-500/50 transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-4">
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                              min="0"
                              className="w-full px-4 py-3 bg-stone-600/50 border border-amber-500/50 rounded-lg text-amber-100 text-center text-2xl font-bold focus:ring-2 focus:ring-amber-500/30 focus:border-transparent outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveStock(item)}
                                className="flex-1 py-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/30 transition-all flex items-center justify-center gap-2"
                              >
                                <Save size={16} />
                                Save
                              </button>
                              <button
                                onClick={cancelEditStock}
                                className="flex-1 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-600/30 transition-all flex items-center justify-center gap-2"
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-2 ${status.color}`}>
                              {status.icon}
                              <span className="text-sm font-semibold">
                                {item.quantity === 0 ? 'Out of Stock' : item.quantity < 20 ? 'Low Stock' : 'In Stock'}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className={`text-4xl font-bold ${status.color}`}>
                                {item.quantity}
                              </p>
                              <p className="text-amber-200/60 text-sm">units</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-neutral-900 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-200 text-lg">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
