'use client';

import { useState } from 'react';
import { SERVICEABLE_STATES, isServiceableState } from '@/lib/products';
import { validateCoupon, calculateDiscount } from '@/lib/coupons';

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
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Rajesh Kumar"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            WhatsApp Number *
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.whatsapp ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="9876543210"
          />
          {errors.whatsapp && <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email (Optional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="rajesh@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="H.No 12-34, Jubilee Hills, Hyderabad"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pincode *
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.pincode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="500034"
            />
            {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State *
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              {SERVICEABLE_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.length} items)</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span className="font-semibold">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="font-semibold">₹{total}</span>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apply Coupon Code (Optional)
              </label>
              
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g., sis123"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-semibold">✓ {appliedCoupon.toUpperCase()}</span>
                    <span className="text-sm text-green-600">(50% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-sm text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>✕</span> {couponError}
                </p>
              )}
              
              {couponSuccess && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <span>✓</span> {couponSuccess}
                </p>
              )}
            </div>

            {/* Discount Display */}
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount (50%)</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            {/* Final Total */}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Final Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Pay ₹${finalTotal}`}
        </button>
      </form>
    </div>
  );
}
