'use client';

import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { validateCoupon, calculateDiscount } from '@/lib/coupons';
import { useTheme } from './ThemeProvider';

interface CartItem {
  productId: string;
  productName: string;
  packageDetails: string;
  quantity: number;
  price: number;
  croppedImageUrl: string;
  category: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [usedCoupons, setUsedCoupons] = useState<string[]>([]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = appliedCoupon ? calculateDiscount(subtotal, 50) : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    setCouponError('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (appliedCoupon) {
      setCouponError('A coupon has already been applied');
      return;
    }

    const validation = validateCoupon(couponCode.toLowerCase().trim(), usedCoupons);

    if (validation.isValid) {
      setAppliedCoupon(couponCode.toLowerCase().trim());
      setUsedCoupons([...usedCoupons, couponCode.toLowerCase().trim()]);
      setCouponCode('');
    } else {
      setCouponError(validation.error || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-[480px] ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} shadow-2xl z-50 transform transition-transform flex flex-col border-l`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'} border-b`}>
          <div className="flex items-center gap-3">
            <ShoppingBag className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`} size={28} />
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Your Cart</h2>
              <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>{cartItems.length} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} rounded-full transition-colors`}
          >
            <X size={24} className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={80} className={`${isDark ? 'text-[#3a3a3a]' : 'text-gray-300'} mb-4`} />
              <h3 className={`text-xl font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>Your cart is empty</h3>
              <p className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mb-6`}>Add some magnets to get started!</p>
              <button
                onClick={onClose}
                className={`px-6 py-3 ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-md font-semibold transition-all shadow-lg`}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className={`flex gap-4 p-4 ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'} border rounded-md hover:shadow-xl transition-all`}>
                  <img
                    src={item.croppedImageUrl}
                    alt={item.productName}
                    className={`w-20 h-20 object-cover rounded-md ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} border`}
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>{item.productName}</h4>
                    <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>{item.packageDetails}</p>
                    <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Quantity: {item.quantity}</p>
                    <p className={`text-lg font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mt-1`}>₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 text-red-500 hover:bg-red-500/20 rounded-md transition-colors h-fit"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className={`${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'} border-t p-6 space-y-4`}>
            {/* Coupon Section */}
            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
                Have a Coupon?
              </label>
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g., sis123)"
                    className={`flex-1 px-4 py-2 ${isDark ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#f0f0f0] placeholder:text-[#c8c8c8]' : 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400'} border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                    maxLength={6}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={`px-6 py-2 ${isDark ? 'bg-green-600 text-[#f0f0f0] hover:bg-green-500' : 'bg-green-600 text-white hover:bg-green-500'} rounded-md font-semibold transition-all shadow-lg`}
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className={`flex items-center justify-between p-3 ${isDark ? 'bg-green-950/50 border-green-800' : 'bg-green-50 border-green-200'} border rounded-md`}>
                  <div>
                    <span className={`${isDark ? 'text-green-400' : 'text-green-700'} font-semibold`}>✓ {appliedCoupon.toUpperCase()}</span>
                    <span className={`text-sm ${isDark ? 'text-green-500' : 'text-green-600'} ml-2`}>(50% OFF)</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className={`text-sm ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} font-semibold`}
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && (
                <p className={`mt-2 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>✕ {couponError}</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="space-y-2">
              <div className={`flex justify-between ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              {appliedCoupon && (
                <div className={`flex justify-between ${isDark ? 'text-green-400' : 'text-green-600'} font-semibold`}>
                  <span>Discount (50%)</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className={`flex justify-between text-xl font-bold ${isDark ? 'text-[#f0f0f0] border-[#2a2a2a]' : 'text-gray-900 border-gray-200'} pt-2 border-t`}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className={`w-full px-6 py-4 ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-md font-semibold text-lg transition-all shadow-lg`}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
