'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useToast } from '@/components/ToastProvider';
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
  X,
  Truck
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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (!token) {
      router.push('/');
      return;
    }

    // Migrate old order statuses first
    migrateOrders();
    
    fetchData();

    // Check if order was just confirmed
    const confirmed = searchParams.get('confirmed');
    if (confirmed) {
      alert(`Order ${confirmed} confirmed successfully!`);
    }
  }, []);

  const migrateOrders = async () => {
    try {
      const token = Cookies.get('admin_token');
      const response = await fetch('/api/orders/migrate-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        console.log('Migration completed:', data);
      } else {
        console.error('Migration failed:', data.message);
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
  };

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

  const { showToast } = useToast();

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const token = Cookies.get('admin_token');
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the order in state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
        showToast(`Order ${orderId} status updated to ${newStatus}`, 'success');
      } else {
        showToast('Failed to update: ' + data.message, 'error');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-amber-500/30 p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-100 mb-1 sm:mb-2">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-amber-200/70">Photo Magnet Celebrations</p>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={fetchData}
                className="flex-1 sm:flex-none p-2.5 sm:p-3 bg-stone-700/50 border border-amber-500/50 rounded-lg text-amber-100 hover:bg-stone-600/50 transition-all"
                title="Refresh"
              >
                <RefreshCw size={18} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl border border-amber-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200/70 text-xs sm:text-sm mb-1">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-100">{orders.length}</p>
              </div>
              <ShoppingCart className="text-amber-400" size={32} />
            </div>
          </div>
          
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl border border-amber-500/30 p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200/70 text-xs sm:text-sm mb-1">Pending Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-400">
                  {orders.filter(o => o.orderStatus === 'pending').length}
                </p>
              </div>
              <Clock className="text-orange-400" size={32} />
            </div>
          </div>
          
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-xl border border-amber-500/30 p-4 sm:p-5 md:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-200/70 text-xs sm:text-sm mb-1">Total Stock</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">
                  {stock.reduce((sum, s) => sum + s.quantity, 0)}
                </p>
              </div>
              <Package className="text-green-400" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl border-2 border-b-0 border-amber-500/30 p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-stone-700/50 text-amber-200/70 hover:bg-stone-600/50'
              }`}
            >
              <span className="hidden sm:inline">Orders ({orders.length})</span>
              <span className="sm:hidden">Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
                activeTab === 'stock'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'bg-stone-700/50 text-amber-200/70 hover:bg-stone-600/50'
              }`}
            >
              <span className="hidden sm:inline">Stock Management</span>
              <span className="sm:hidden">Stock</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-stone-800/50 backdrop-blur-sm rounded-b-xl sm:rounded-b-2xl border-2 border-t-0 border-amber-500/30 p-3 sm:p-4 md:p-6 shadow-2xl">
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
                        className="bg-stone-700/30 border border-amber-500/20 rounded-xl p-3 sm:p-4 md:p-6 hover:border-amber-400/40 transition-all"
                      >
                        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                          {/* Image */}
                          <div className="flex flex-row lg:flex-col items-center justify-center lg:items-start gap-2 sm:gap-3">
                            <img
                              src={order.croppedImageUrl}
                              alt="Order"
                              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg border-2 border-amber-500/30 flex-shrink-0"
                            />
                            <a
                              href={order.croppedImageUrl}
                              download={`${order.orderId}.jpg`}
                              className="px-2 py-1.5 sm:px-3 sm:py-2 bg-amber-600/20 border border-amber-500/50 rounded-lg text-amber-100 hover:bg-amber-600/30 transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                              </svg>
                              <span className="hidden sm:inline">Download</span>
                              <span className="sm:hidden">DL</span>
                            </a>
                          </div>

                          {/* Order Details */}
                          <div className="lg:col-span-2 space-y-1.5 sm:space-y-2">
                            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                              <h3 className="text-sm sm:text-base md:text-lg font-bold text-amber-100 break-all">{order.orderId}</h3>
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                                order.orderStatus === 'delivered' 
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                  : order.orderStatus === 'shipped'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                                  : order.orderStatus === 'preparing' 
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                  : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                              }`}>
                                {order.orderStatus.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm md:text-base text-amber-100"><strong>Customer:</strong> {order.customerName}</p>
                            <p className="text-xs sm:text-sm text-amber-200/80 break-all"><strong>Phone:</strong> {order.whatsapp}</p>
                            {order.email && <p className="text-xs sm:text-sm text-amber-200/80 break-all"><strong>Email:</strong> {order.email}</p>}
                            <p className="text-xs sm:text-sm text-amber-200/80"><strong>Address:</strong> {order.address}, {order.pincode}, {order.state}</p>
                            <p className="text-xs sm:text-sm text-amber-200/80">
                              <strong>Product:</strong> {order.productType.toUpperCase()}
                              {order.productType === 'rectangle' && (order.withStand ? ' with Stand' : ' without Stand')}
                              {order.orientation && ` (${order.orientation})`}
                            </p>
                            <p className="text-xs sm:text-sm text-amber-200/80"><strong>Quantity:</strong> {order.quantity} pieces</p>
                            {order.couponApplied && (
                              <p className="text-xs sm:text-sm text-green-300"><strong>Coupon:</strong> {order.couponApplied} (-₹{order.discount})</p>
                            )}
                          </div>

                          {/* Price & Status Controls */}
                          <div className="space-y-3 sm:space-y-4">
                            <div className="text-center lg:text-right">
                              <p className="text-amber-200/70 text-xs sm:text-sm">Total Price</p>
                              <p className="text-xl sm:text-2xl font-bold text-amber-100">₹{order.finalAmount}</p>
                            </div>
                            <div className="text-center lg:text-right text-xs sm:text-sm text-amber-200/60">
                              <p className="break-words">Ordered: {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            
                            {/* Status Update Controls - Redesigned */}
                            <div className="bg-gradient-to-br from-stone-800/80 to-stone-900/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-amber-500/30 shadow-lg">
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <p className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5 sm:gap-2">
                                  <Package size={14} className="sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">Order Status</span>
                                  <span className="sm:hidden">Status</span>
                                </p>
                                {updatingStatus === order.orderId && (
                                  <RefreshCw size={12} className="sm:w-3.5 sm:h-3.5 animate-spin text-amber-400" />
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                {/* Pending */}
                                <button
                                  onClick={() => updateOrderStatus(order.orderId, 'pending')}
                                  disabled={updatingStatus === order.orderId}
                                  className={`relative px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                                    order.orderStatus === 'pending'
                                      ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20'
                                      : 'bg-stone-700/40 text-amber-200/60 border border-stone-600/50 hover:bg-yellow-500/10 hover:border-yellow-500/50'
                                  }`}
                                >
                                  {order.orderStatus === 'pending' && (
                                    <CheckCircle size={10} className="sm:w-3 sm:h-3 absolute top-0.5 sm:top-1 right-0.5 sm:right-1 text-yellow-400" />
                                  )}
                                  <Clock size={12} className="sm:w-3.5 sm:h-3.5 mx-auto mb-0.5 sm:mb-1" />
                                  PENDING
                                </button>

                                {/* Preparing */}
                                <button
                                  onClick={() => updateOrderStatus(order.orderId, 'preparing')}
                                  disabled={updatingStatus === order.orderId}
                                  className={`relative px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                                    order.orderStatus === 'preparing'
                                      ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                                      : 'bg-stone-700/40 text-amber-200/60 border border-stone-600/50 hover:bg-blue-500/10 hover:border-blue-500/50'
                                  }`}
                                >
                                  {order.orderStatus === 'preparing' && (
                                    <CheckCircle size={10} className="sm:w-3 sm:h-3 absolute top-0.5 sm:top-1 right-0.5 sm:right-1 text-blue-400" />
                                  )}
                                  <Package size={12} className="sm:w-3.5 sm:h-3.5 mx-auto mb-0.5 sm:mb-1" />
                                  PREPARING
                                </button>

                                {/* Shipped */}
                                <button
                                  onClick={() => updateOrderStatus(order.orderId, 'shipped')}
                                  disabled={updatingStatus === order.orderId}
                                  className={`relative px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                                    order.orderStatus === 'shipped'
                                      ? 'bg-purple-500/20 text-purple-300 border-2 border-purple-500 shadow-lg shadow-purple-500/20'
                                      : 'bg-stone-700/40 text-amber-200/60 border border-stone-600/50 hover:bg-purple-500/10 hover:border-purple-500/50'
                                  }`}
                                >
                                  {order.orderStatus === 'shipped' && (
                                    <CheckCircle size={10} className="sm:w-3 sm:h-3 absolute top-0.5 sm:top-1 right-0.5 sm:right-1 text-purple-400" />
                                  )}
                                  <Truck size={12} className="sm:w-3.5 sm:h-3.5 mx-auto mb-0.5 sm:mb-1" />
                                  SHIPPED
                                </button>

                                {/* Delivered */}
                                <button
                                  onClick={() => updateOrderStatus(order.orderId, 'delivered')}
                                  disabled={updatingStatus === order.orderId}
                                  className={`relative px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                                    order.orderStatus === 'delivered'
                                      ? 'bg-green-500/20 text-green-300 border-2 border-green-500 shadow-lg shadow-green-500/20'
                                      : 'bg-stone-700/40 text-amber-200/60 border border-stone-600/50 hover:bg-green-500/10 hover:border-green-500/50'
                                  }`}
                                >
                                  {order.orderStatus === 'delivered' && (
                                    <CheckCircle size={10} className="sm:w-3 sm:h-3 absolute top-0.5 sm:top-1 right-0.5 sm:right-1 text-green-400" />
                                  )}
                                  <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5 mx-auto mb-0.5 sm:mb-1" />
                                  DELIVERED
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'stock' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {stock.map((item) => {
                    const status = getStockStatus(item.quantity);
                    const isEditing = editingStock === item._id;

                    return (
                      <div
                        key={item._id}
                        className="bg-stone-700/30 border border-amber-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-amber-400/40 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="min-w-0 flex-1 pr-2">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-amber-100 mb-1 break-words">
                              {getStockLabel(item.productType, item.withStand)}
                            </h3>
                            <p className="text-amber-200/60 text-xs sm:text-sm break-words">
                              Updated: {new Date(item.updatedAt).toLocaleString()}
                            </p>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => startEditStock(item)}
                              className="p-2 bg-stone-600/50 border border-amber-500/50 rounded-lg text-amber-200 hover:bg-stone-500/50 transition-all flex-shrink-0"
                            >
                              <Edit2 size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-3 sm:space-y-4">
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                              min="0"
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-stone-600/50 border border-amber-500/50 rounded-lg text-amber-100 text-center text-xl sm:text-2xl font-bold focus:ring-2 focus:ring-amber-500/30 focus:border-transparent outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveStock(item)}
                                className="flex-1 py-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-300 hover:bg-green-600/30 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                              >
                                <Save size={14} className="sm:w-4 sm:h-4" />
                                Save
                              </button>
                              <button
                                onClick={cancelEditStock}
                                className="flex-1 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 hover:bg-red-600/30 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                              >
                                <X size={14} className="sm:w-4 sm:h-4" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-1.5 sm:gap-2 ${status.color}`}>
                              {status.icon}
                              <span className="text-xs sm:text-sm font-semibold">
                                {item.quantity === 0 ? 'Out of Stock' : item.quantity < 20 ? 'Low Stock' : 'In Stock'}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className={`text-3xl sm:text-4xl font-bold ${status.color}`}>
                                {item.quantity}
                              </p>
                              <p className="text-amber-200/60 text-xs sm:text-sm">units</p>
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
