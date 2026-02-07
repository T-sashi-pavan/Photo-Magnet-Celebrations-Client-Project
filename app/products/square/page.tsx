'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Upload, Check } from 'lucide-react';
import { PRODUCTS, calculateCustomPrice, getPricePerUnit } from '@/lib/products';
import ImageCropper from '@/components/ImageCropper';
import { getCroppedImg, uploadToCloudinary } from '@/lib/imageUtils';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';

interface CartItem {
  productId: string;
  productName: string;
  packageDetails: string;
  quantity: number;
  price: number;
  croppedImageUrl: string;
  category: string;
}

export default function SquareProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const product = PRODUCTS.find(p => p.id === 'square-no-stand')!;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Sync with global cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCartItems((window as any).cartItems || []);
    }
  }, []);

  const price = calculateCustomPrice(product, quantity);
  const pricePerUnit = getPricePerUnit(product, quantity);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    if (!uploadedImage || !croppedAreaPixels) {
      showToast('Please upload and crop your photo first', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(uploadedImage, croppedAreaPixels);
      const imageUrl = await uploadToCloudinary(croppedBlob);

      const newItem = {
        productId: product.id,
        productName: product.name,
        packageDetails: product.description,
        quantity,
        price,
        croppedImageUrl: imageUrl,
        category: product.category
      };

      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      if (typeof window !== 'undefined') {
        (window as any).cartItems = updatedCart;
      }

      showToast('Added to cart successfully!', 'success');
      setUploadedImage(null);
      setCroppedAreaPixels(null);
      setQuantity(1);
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to process image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    if (typeof window !== 'undefined') {
      (window as any).cartItems = updatedCart;
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      <Header cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-700">
          <span className="cursor-pointer hover:text-amber-700 font-medium" onClick={() => router.push('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-amber-800 font-bold">Square Photo Magnets</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image Upload & Cropper */}
          <div className="space-y-6">
            {/* Example Reference Image */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-amber-700">💡</span>
                Example Reference
              </h3>
              <div className="relative w-full aspect-square bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl overflow-hidden border-2 border-amber-200">
                <img
                  src="/PHOTOS/SQUARE3.png"
                  alt="Example square magnet"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center font-medium">
                This is how your square magnet will look
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Photo</h2>
              
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-amber-300 rounded-xl p-12 text-center bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload size={64} className="mx-auto text-amber-400 mb-4" />
                    <p className="text-lg font-semibold text-gray-800 mb-2">Click to upload</p>
                    <p className="text-sm text-gray-600">or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              ) : (
                <div>
                  <ImageCropper
                    image={uploadedImage}
                    aspectRatio={product.aspectRatio}
                    onCropComplete={setCroppedAreaPixels}
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="mt-4 w-full px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-amber-100">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Square Photo Magnets</h1>
                <p className="text-lg text-gray-700">Perfect for your fridge - Without Stand</p>
                <div className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-lg shadow-sm">
                  <span className="text-sm font-bold text-amber-900">Frame Size: 2" × 2" (Square)</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-amber-700">₹{price}</span>
                  <span className="text-lg text-gray-700">for {quantity} piece{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  ₹{pricePerUnit} per piece
                </div>
              </div>

              {/* Volume Pricing Info */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Volume Discounts:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.priceTiers?.map((tier, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        quantity >= tier.minQuantity && quantity <= tier.maxQuantity
                          ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {tier.minQuantity === tier.maxQuantity
                          ? `${tier.minQuantity} pc`
                          : `${tier.minQuantity}-${tier.maxQuantity === Infinity ? '∞' : tier.maxQuantity} pcs`
                        }
                      </div>
                      <div className="text-lg font-bold text-amber-700">₹{tier.pricePerUnit}/pc</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block font-bold text-gray-900 mb-3">Select Quantity:</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-lg border-2 border-amber-300 bg-white flex items-center justify-center text-amber-700 hover:border-amber-500 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus size={20} className="text-amber-700" />
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 h-12 text-center text-xl font-bold text-gray-900 bg-white border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                  />
                  
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg border-2 border-amber-300 bg-white flex items-center justify-center text-amber-700 hover:border-amber-500 hover:bg-amber-50 transition-all"
                  >
                    <Plus size={20} className="text-amber-700" />
                  </button>

                  <span className="text-gray-700 ml-2 font-medium">pieces</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="text-amber-700" size={20} />
                  <span className="text-gray-800 font-medium">High-quality photo print</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-amber-700" size={20} />
                  <span className="text-gray-800 font-medium">Strong magnetic backing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-amber-700" size={20} />
                  <span className="text-gray-800 font-medium">1:1 Square aspect ratio</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-amber-700" size={20} />
                  <span className="text-gray-800 font-medium">Fast delivery on bulk orders</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!uploadedImage || isUploading}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processing...' : uploadedImage ? `Add to Cart - ₹${price}` : 'Upload Photo First'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
