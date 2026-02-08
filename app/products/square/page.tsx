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
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const CircularGallery = dynamic(() => import('@/components/CircularGallery'), {
  ssr: false,
});

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

  const squareImages = [
    { image: 'https://picsum.photos/seed/square1/800/800?grayscale', text: 'Beautiful Moment' },
    { image: 'https://picsum.photos/seed/square2/800/800?grayscale', text: 'Special Memory' },
    { image: 'https://picsum.photos/seed/square3/800/800?grayscale', text: 'Perfect Frame' },
    { image: 'https://picsum.photos/seed/square4/800/800?grayscale', text: 'Cherished Time' },
    { image: 'https://picsum.photos/seed/square5/800/800?grayscale', text: 'Forever Yours' },
    { image: 'https://picsum.photos/seed/square6/800/800?grayscale', text: 'Magic Moment' },
    { image: 'https://picsum.photos/seed/square7/800/800?grayscale', text: 'Sweet Memories' },
    { image: 'https://picsum.photos/seed/square8/800/800?grayscale', text: 'Happy Days' },
  ];

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
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Gallery Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] mb-8 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="absolute inset-0">
          <CircularGallery
            items={squareImages}
            bend={6}
            borderRadius={0.11}
            textColor="#1f2937"
            font="bold 28px sans-serif"
            scrollSpeed={1.4}
            scrollEase={0.15}
            autoRotate={true}
            autoRotateSpeed={0.2}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 pointer-events-none">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 drop-shadow-sm mb-2">
              Square Photo Magnets
            </h1>
            <p className="text-lg md:text-xl text-gray-700 drop-shadow-sm">
              Perfect square frames for your memorable moments
            </p>
          </div>
        </div>
      </section>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span className="cursor-pointer hover:text-gray-900 font-medium" onClick={() => router.push('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Square Photo Magnets</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image Upload & Cropper */}
          <div className="space-y-6">
            {/* Example Reference Image */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-gray-700">💡</span>
                Example Reference
              </h3>
              <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src="/PHOTOS/SQUARE3.png"
                  alt="Example square magnet"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center">
                This is how your square magnet will look
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Photo</h2>
              
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-semibold text-gray-900 mb-2">Click to upload</p>
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
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Square Photo Magnets</h1>
                <p className="text-base text-gray-600">Perfect for your fridge - Without Stand</p>
                <div className="mt-3 inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-md">
                  <span className="text-sm font-semibold text-gray-800">Frame Size: 2" × 2" (Square)</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{price}</span>
                  <span className="text-base text-gray-600">for {quantity} piece{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  ₹{pricePerUnit} per piece
                </div>
              </div>

              {/* Volume Pricing Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Volume Discounts:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.priceTiers?.map((tier, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border transition-all ${
                        quantity >= tier.minQuantity && quantity <= tier.maxQuantity
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-700">
                        {tier.minQuantity === tier.maxQuantity
                          ? `${tier.minQuantity} pc`
                          : `${tier.minQuantity}-${tier.maxQuantity === Infinity ? '∞' : tier.maxQuantity} pcs`
                        }
                      </div>
                      <div className="text-lg font-bold text-gray-900">₹{tier.pricePerUnit}/pc</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-900 mb-3">Select Quantity:</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 h-12 text-center text-xl font-bold text-gray-900 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                  
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <Plus size={20} />
                  </button>

                  <span className="text-gray-600 ml-2 font-medium">pieces</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="text-gray-700 font-medium">High-quality photo print</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="text-gray-700 font-medium">Strong magnetic backing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="text-gray-700 font-medium">1:1 Square aspect ratio</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="text-gray-700 font-medium">Fast delivery on bulk orders</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!uploadedImage || isUploading}
                className="w-full px-8 py-4 bg-gray-900 text-white rounded-md font-semibold text-base hover:bg-gray-800 transition-all shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processing...' : uploadedImage ? `Add to Cart - ₹${price}` : 'Upload Photo First'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </div>
  );
}
