'use client';

import { useState } from 'react';
import { SERVICEABLE_STATES, isServiceableState } from '@/lib/products';
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

interface CheckoutFormData {
  name: string;
  whatsapp: string;
  address: string;
  pincode: string;
  state: string;
  email?: string;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmit: (formData: CheckoutFormData) => void;
  calculateTotals: (state: string) => { subtotal: number; deliveryCharge: number; total: number };
  isProcessing: boolean;
}

export default function CheckoutForm({ cartItems, onSubmit, calculateTotals, isProcessing }: CheckoutFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    whatsapp: '',
    address: '',
    pincode: '',
    state: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [usedCoupons, setUsedCoupons] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Enter valid 10-digit mobile number';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter valid 6-digit pincode';
    }

    if (!formData.state) {
      newErrors.state = 'Please select a state';
    } else if (!isServiceableState(formData.state)) {
      newErrors.state = 'We only deliver to Telangana and Andhra Pradesh';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Coupon handlers
  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');

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
      setCouponSuccess(`Coupon applied! ${validation.discountPercentage}% discount activated`);
      setCouponCode('');
    } else {
      setCouponError(validation.error || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const { subtotal, deliveryCharge, total } = calculateTotals(formData.state);
  
  // Calculate discount if coupon applied
  const discount = appliedCoupon ? calculateDiscount(total, 50) : 0;
  const finalTotal = total - discount;

  return (
    <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-md border p-8`}>
      <h2 className={`text-2xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-6`}>Checkout</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-md ${isDark ? 'text-[#f0f0f0] placeholder-[#c8c8c8] bg-[#0d0d0d]' : 'text-gray-900 placeholder-gray-400 bg-gray-50'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
              errors.name ? 'border-red-500' : isDark ? 'border-[#2a2a2a]' : 'border-gray-200'
            }`}
            placeholder="Rajesh Kumar"
          />
          {errors.name && <p className={`mt-1 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.name}</p>}
        </div>

        <div>
          <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
            WhatsApp Number *
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            className={`w-full px-4 py-3 border rounded-md ${isDark ? 'text-[#f0f0f0] placeholder-[#c8c8c8] bg-[#0d0d0d]' : 'text-gray-900 placeholder-gray-400 bg-gray-50'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
              errors.whatsapp ? 'border-red-500' : isDark ? 'border-[#2a2a2a]' : 'border-gray-200'
            }`}
            placeholder="9876543210"
          />
          {errors.whatsapp && <p className={`mt-1 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.whatsapp}</p>}
        </div>

        <div>
          <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
            Email (Optional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-md ${isDark ? 'text-[#f0f0f0] placeholder-[#c8c8c8] bg-[#0d0d0d] border-[#2a2a2a]' : 'text-gray-900 placeholder-gray-400 bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
            placeholder="rajesh@example.com"
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
            Delivery Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 border rounded-md ${isDark ? 'text-[#f0f0f0] placeholder-[#c8c8c8] bg-[#0d0d0d]' : 'text-gray-900 placeholder-gray-400 bg-gray-50'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
              errors.address ? 'border-red-500' : isDark ? 'border-[#2a2a2a]' : 'border-gray-200'
            }`}
            placeholder="H.No 12-34, Jubilee Hills, Hyderabad"
          />
          {errors.address && <p className={`mt-1 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
              Pincode *
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md ${isDark ? 'text-[#f0f0f0] placeholder-[#c8c8c8] bg-[#0d0d0d]' : 'text-gray-900 placeholder-gray-400 bg-gray-50'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
                errors.pincode ? 'border-red-500' : isDark ? 'border-[#2a2a2a]' : 'border-gray-200'
              }`}
              placeholder="500034"
            />
            {errors.pincode && <p className={`mt-1 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.pincode}</p>}
          </div>

          <div>
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
              State *
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md ${isDark ? 'text-[#f0f0f0] bg-[#0d0d0d]' : 'text-gray-900 bg-gray-50'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${
                errors.state ? 'border-red-500' : isDark ? 'border-[#2a2a2a]' : 'border-gray-200'
              }`}
            >
              <option value="" className={isDark ? 'bg-[#0d0d0d] text-[#c8c8c8]' : 'bg-gray-50 text-gray-400'}>Select State</option>
              {SERVICEABLE_STATES.map((state) => (
                <option key={state} value={state} className={isDark ? 'bg-[#0d0d0d] text-[#f0f0f0]' : 'bg-gray-50 text-gray-900'}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className={`mt-1 text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.state}</p>}
          </div>
        </div>

        {/* Order Summary */}
        <div className={`border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} pt-6 mt-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-4`}>Order Summary</h3>
          
          <div className="space-y-2">
            <div className={`flex justify-between ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <div className={`flex justify-between ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
              <span>Delivery Charge</span>
              <span className="font-semibold">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className={`flex justify-between ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} pt-2 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <span>Total</span>
              <span className="font-semibold">₹{total}</span>
            </div>

            {/* Coupon Code Section */}
            <div className={`pt-4 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>
                Apply Coupon Code (Optional)
              </label>
              
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g., sis123"
                    className={`flex-1 px-4 py-2 border rounded-md ${isDark ? 'text-[#f0f0f0] placeholder-[#c8c8c8] bg-[#0d0d0d] border-[#2a2a2a]' : 'text-gray-900 placeholder-gray-400 bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className={`px-6 py-2 bg-green-600 rounded-md font-semibold hover:bg-green-500 transition-all ${isDark ? 'text-[#f0f0f0]' : 'text-white'}`}
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-950/50 border border-green-800 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-semibold">✓ {appliedCoupon.toUpperCase()}</span>
                    <span className="text-sm text-green-500">(50% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-sm text-red-400 hover:text-red-300 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className={`mt-2 text-sm ${isDark ? 'text-red-400' : 'text-red-600'} flex items-center gap-1`}>
                  <span>✕</span> {couponError}
                </p>
              )}
              
              {couponSuccess && (
                <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                  <span>✓</span> {couponSuccess}
                </p>
              )}
            </div>

            {/* Discount Display */}
            {appliedCoupon && (
              <div className="flex justify-between text-green-400 font-semibold">
                <span>Discount (50%)</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            {/* Final Total */}
            <div className={`flex justify-between text-xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} pt-2 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <span>Final Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full px-6 py-4 ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-md font-semibold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing ? 'Processing...' : `Pay ₹${finalTotal}`}
        </button>
      </form>
    </div>
  );
}
