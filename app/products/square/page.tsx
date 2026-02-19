'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { PRODUCTS, calculateCustomPrice, getPricePerUnit } from '@/lib/products';
import { getCroppedImg, uploadToCloudinary } from '@/lib/imageUtils';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import CustomerReviews from '@/components/CustomerReviews';
import ImageUploadSlot from '@/components/ImageUploadSlot';
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

interface ImageSlot {
  rawImage: string;
  croppedPixels: any;
  confirmed: boolean;
}

export default function SquareProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([{ rawImage: '', croppedPixels: null, confirmed: false }]);
  const [isUploading, setIsUploading] = useState(false);

  // Update image slots when quantity changes
  useEffect(() => {
    setImageSlots(prev => {
      const newSlots = Array(quantity).fill(null).map((_, index) => 
        prev[index] || { rawImage: '', croppedPixels: null, confirmed: false }
      );
      return newSlots;
    });
  }, [quantity]);

  // Load cart from localStorage and sync with global cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          (window as any).cartItems = parsedCart;
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      } else {
        setCartItems((window as any).cartItems || []);
      }
    }
  }, []);

  const price = calculateCustomPrice(product, quantity);
  const pricePerUnit = getPricePerUnit(product, quantity);

  // Convert AspectRatio type to number
  const getAspectRatioNumber = (ratio: string): number => {
    switch (ratio) {
      case '1:1': return 1;
      case '3:4': return 0.75;
      case '4:3': return 1.33;
      default: return 1;
    }
  };

  const handleImageConfirm = (slotIndex: number, imageData: string, croppedPixels: any) => {
    if (!imageData) {
      // Clear the slot
      setImageSlots(prev => {
        const updated = [...prev];
        updated[slotIndex] = { rawImage: '', croppedPixels: null, confirmed: false };
        return updated;
      });
      return;
    }

    setImageSlots(prev => {
      const updated = [...prev];
      updated[slotIndex] = { rawImage: imageData, croppedPixels, confirmed: true };
      return updated;
    });
  };

  const allImagesConfirmed = imageSlots.every(slot => slot.confirmed);

  const handleAddToCart = async () => {
    if (!allImagesConfirmed) {
      showToast(' Please upload all images for the selected quantity', 'error');
      return;
    }

    setIsUploading(true);
    try {
      // Process and upload all images
      const uploadPromises = imageSlots.map(async (slot) => {
        const croppedBlob = await getCroppedImg(slot.rawImage, slot.croppedPixels);
        const imageUrl = await uploadToCloudinary(croppedBlob);
        return imageUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Create separate cart items for each image
      const newItems = imageUrls.map((imageUrl, index) => ({
        productId: product.id,
        productName: product.name,
        packageDetails: product.description,
        quantity: 1, // Each item is 1 piece with its own image
        price: pricePerUnit,
        croppedImageUrl: imageUrl,
        category: product.category
      }));

      const updatedCart = [...cartItems, ...newItems];
      setCartItems(updatedCart);
      if (typeof window !== 'undefined') {
        (window as any).cartItems = updatedCart;
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }

      showToast(`Added ${quantity} item(s) to cart successfully!`, 'success');
      
      // Reset to initial state
      setQuantity(1);
      setImageSlots([{ rawImage: '', croppedPixels: null, confirmed: false }]);
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to process images. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    if (typeof window !== 'undefined') {
      (window as any).cartItems = updatedCart;
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
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
    <div className={`min-h-screen ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
      <Header cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Gallery Hero Section */}
      <section className={`relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-6 md:mb-8 ${isDark ? 'bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]' : 'bg-gradient-to-b from-gray-100 to-gray-50'}`}>
        <div className="absolute inset-0">
          <CircularGallery
            items={squareImages}
            bend={6}
            borderRadius={0.11}
            textColor={isDark ? "#f0f0f0" : "#111827"}
            font="bold 28px sans-serif"
            scrollSpeed={1.4}
            scrollEase={0.15}
            autoRotate={true}
            autoRotateSpeed={0.2}
          />
        </div>
        <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-[#141414]/40' : 'bg-white/40'} pointer-events-none px-4`}>
          <div className="text-center">
            <h1 className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} drop-shadow-lg mb-2`}>
              Square Photo Magnets
            </h1>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} drop-shadow-lg`}>
              Perfect square frames for your memorable moments
            </p>
          </div>
        </div>
      </section>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className={`mb-6 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
          <span className={`cursor-pointer ${isDark ? 'hover:text-[#f0f0f0]' : 'hover:text-gray-900'} font-medium`} onClick={() => router.push('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-semibold`}>Square Photo Magnets</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image Upload & Cropper */}
          <div className="space-y-6">
            {/* Example Reference Image */}
            <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-lg shadow-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-3 flex items-center gap-2`}>
                <span className={`${isDark ? 'text-[#dcdcdc]' : 'text-gray-700'}`}>💡</span>
                Example Reference
              </h3>
              <div className={`relative w-full aspect-square ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'} rounded-lg overflow-hidden border`}>
                <img
                  src="/PHOTOS/SQUARE3.png"
                  alt="Example square magnet"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mt-3 text-center`}>
                This is how your square magnet will look
              </p>
            </div>

            <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-lg shadow-xl p-6 border`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-4 flex items-center justify-between`}>
                <span>Upload Your Photos</span>
                <span className={`text-sm font-normal ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                  {imageSlots.filter(s => s.confirmed).length} / {quantity} uploaded
                </span>
              </h2>
              
              {/* Upload Slots Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {imageSlots.map((slot, index) => (
                  <ImageUploadSlot
                    key={index}
                    slotIndex={index}
                    aspectRatio={getAspectRatioNumber(product.aspectRatio)}
                    onConfirm={handleImageConfirm}
                    confirmedImage={slot.confirmed ? slot.rawImage : null}
                    isDark={isDark}
                  />
                ))}
              </div>

              <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-blue-50 border-blue-200'} border`}>
                <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-700'} flex items-start gap-2`}>
                  <span className="text-blue-500 font-bold">ℹ</span>
                  <span>Upload one image for each quantity. Click on any slot to upload and adjust your photo. Maximum {quantity} images.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-6">
            <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-lg shadow-xl p-8 border`}>
              <div className="mb-6">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>Square Photo Magnets</h1>
                <p className={`text-base ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Perfect for your fridge - Without Stand</p>
                <div className={`mt-3 inline-block px-4 py-2 ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} border rounded-md`}>
                  <span className={`text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Frame Size: 2" × 2" (Square)</span>
                </div>
              </div>

              {/* Price Display */}
              <div className={`${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6 mb-6`}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className={`text-3xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>₹{price}</span>
                  <span className={`text-base ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>for {quantity} piece{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>
                  ₹{pricePerUnit} per piece
                </div>
              </div>

              {/* Volume Pricing Info */}
              <div className="mb-6">
                <h3 className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-3`}>Volume Discounts:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.priceTiers?.map((tier, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md border transition-all ${
                        quantity >= tier.minQuantity && quantity <= tier.maxQuantity
                          ? 'border-blue-500 bg-blue-950/30 shadow-lg'
                          : isDark ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className={`text-sm font-medium ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                        {tier.minQuantity === tier.maxQuantity
                          ? `${tier.minQuantity} pc`
                          : `${tier.minQuantity}-${tier.maxQuantity === Infinity ? '∞' : tier.maxQuantity} pcs`
                        }
                      </div>
                      <div className={`text-lg font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>₹{tier.pricePerUnit}/pc</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className={`block font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-3`}>Select Quantity: (Max 12)</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`w-12 h-12 rounded-md border ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] text-[#f0f0f0] hover:border-[#3a3a3a] hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'} flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                  >
                    <Minus size={20} />
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(12, val)));
                    }}
                    className={`w-24 h-12 text-center text-xl font-bold ${isDark ? 'text-[#f0f0f0] bg-[#0d0d0d] border-[#2a2a2a]' : 'text-gray-900 bg-white border-gray-200'} border rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none`}
                  />
                  
                  <button
                    onClick={() => setQuantity(Math.min(12, quantity + 1))}
                    disabled={quantity >= 12}
                    className={`w-12 h-12 rounded-md border ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] text-[#f0f0f0] hover:border-[#3a3a3a] hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'} flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                  >
                    <Plus size={20} />
                  </button>

                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} ml-2 font-medium`}>pieces</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>High-quality photo print</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>Strong magnetic backing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>1:1 Square aspect ratio</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>Fast delivery on bulk orders</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!allImagesConfirmed || isUploading}
                className={`w-full px-8 py-4 ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-md font-semibold text-base transition-all shadow-lg hover:shadow-xl ${!allImagesConfirmed || isUploading ? (isDark ? 'disabled:bg-[#2a2a2a] disabled:text-[#c8c8c8]' : 'disabled:bg-gray-300 disabled:text-gray-500') : ''} disabled:cursor-not-allowed`}
              >
                {isUploading ? 'Processing...' : allImagesConfirmed ? `Add ${quantity} Item${quantity > 1 ? 's' : ''} to Cart - ₹${price}` : `Upload All ${quantity} Image${quantity > 1 ? 's' : ''} First`}
              </button>

              {!allImagesConfirmed && (
                <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} text-center mt-3`}>
                  Please upload and confirm all {quantity} image{quantity > 1 ? 's' : ''} to proceed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    <CustomerReviews />

    <Footer />
    </div>
  );
}
