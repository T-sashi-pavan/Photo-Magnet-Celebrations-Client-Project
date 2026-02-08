'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, Upload, Check } from 'lucide-react';
import { PRODUCTS, calculateCustomPrice, getPricePerUnit } from '@/lib/products';
import ImageCropper from '@/components/ImageCropper';
import { getCroppedImg, uploadToCloudinary } from '@/lib/imageUtils';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import CustomerReviews from '@/components/CustomerReviews';
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

export default function RectangleProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const rectangleImages = [
    { image: 'https://picsum.photos/seed/rect1/1000/800?grayscale', text: 'Landscape View' },
    { image: 'https://picsum.photos/seed/rect2/1000/800?grayscale', text: 'Wide Frame' },
    { image: 'https://picsum.photos/seed/rect3/1000/800?grayscale', text: 'Panoramic Shot' },
    { image: 'https://picsum.photos/seed/rect4/1000/800?grayscale', text: 'Group Photo' },
    { image: 'https://picsum.photos/seed/rect5/1000/800?grayscale', text: 'Family Portrait' },
    { image: 'https://picsum.photos/seed/rect6/1000/800?grayscale', text: 'Scenic Beauty' },
    { image: 'https://picsum.photos/seed/rect7/1000/800?grayscale', text: 'Wide Angle' },
    { image: 'https://picsum.photos/seed/rect8/1000/800?grayscale', text: 'Perfect View' },
  ];

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [withStand, setWithStand] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
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

  const product = PRODUCTS.find(p => 
    p.id === (withStand ? 'rectangle-with-stand' : 'rectangle-without-stand')
  )!;

  const aspectRatio = orientation === 'portrait' ? '3:4' : '4:3';
  const dimensions = orientation === 'portrait' ? '2.7" W × 3.8" L' : '3.8" W × 2.7" L';

  const price = calculateCustomPrice(product, quantity);
  const pricePerUnit = getPricePerUnit(product, quantity);
  const standPrice = 40;

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
        packageDetails: `${product.description} - ${orientation === 'portrait' ? 'Portrait (2.7" × 3.8")' : 'Landscape (3.8" × 2.7")'}`,
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
            items={rectangleImages}
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
              Rectangle Photo Magnets
            </h1>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} drop-shadow-lg`}>
              Perfect for landscape photos and group pictures
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
          <span className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-semibold`}>Rectangle Photo Magnets</span>
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
                  alt="Example rectangle magnet"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mt-3 text-center`}>
                This is how your magnet will look
              </p>
            </div>

            <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-lg shadow-xl p-6 border`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-4`}>Upload Your Photo</h2>
              
              {!uploadedImage ? (
                <div className={`border-2 border-dashed ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] hover:border-[#3a3a3a] hover:bg-[#141414]' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'} rounded-lg p-12 text-center transition-colors`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload size={48} className={`mx-auto ${isDark ? 'text-[#c8c8c8]' : 'text-gray-400'} mb-4`} />
                    <p className={`text-lg font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>Click to upload</p>
                    <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>or drag and drop</p>
                    <p className={`text-xs ${isDark ? 'text-[#c8c8c8]' : 'text-gray-500'} mt-2`}>PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              ) : (
                <div>
                  <ImageCropper
                    image={uploadedImage}
                    aspectRatio={aspectRatio as any}
                    onCropComplete={setCroppedAreaPixels}
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className={`mt-4 w-full px-4 py-2 text-sm font-semibold ${isDark ? 'text-[#c8c8c8] hover:text-[#f0f0f0] hover:bg-[#2a2a2a]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-6">
            <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-lg shadow-xl p-8 border`}>
              <div className="mb-6">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-2`}>Rectangle Photo Magnets</h1>
                <p className={`text-base ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Premium Acrylic Photo Magnets</p>
                <div className={`mt-3 inline-block px-4 py-2 ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} border rounded-md`}>
                  <span className={`text-sm font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Frame Size: {dimensions}</span>
                </div>
              </div>

              {/* Orientation Option */}
              <div className="mb-6">
                <label className={`block font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-3`}>Orientation:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`p-4 rounded-md border transition-all ${
                      orientation === 'portrait'
                        ? 'border-blue-500 bg-blue-950/30 shadow-lg'
                        : isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] hover:border-[#3a3a3a]' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-20 mx-auto mb-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-200 border-gray-300'} rounded border`}></div>
                      <div className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Portrait</div>
                      <div className={`text-xs ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mt-1`}>2.7" × 3.8"</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`p-4 rounded-md border transition-all ${
                      orientation === 'landscape'
                        ? 'border-blue-500 bg-blue-950/30 shadow-lg'
                        : isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] hover:border-[#3a3a3a]' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-20 h-16 mx-auto mb-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-200 border-gray-300'} rounded border`}></div>
                      <div className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Landscape</div>
                      <div className={`text-xs ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} mt-1`}>3.8" × 2.7"</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Stand Option */}
              <div className="mb-6">
                <label className={`block font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-3`}>Stand Option:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setWithStand(true)}
                    className={`p-4 rounded-md border transition-all ${
                      withStand
                        ? 'border-green-500 bg-green-950/30 shadow-lg'
                        : isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] hover:border-[#3a3a3a]' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-green-900/30 rounded border border-green-700/50 flex items-center justify-center">
                        <Check className="text-green-400" size={32} />
                      </div>
                      <div className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>With Stand</div>
                      <div className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Premium Acrylic</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setWithStand(false)}
                    className={`p-4 rounded-md border transition-all ${
                      !withStand
                        ? 'border-blue-500 bg-blue-950/30 shadow-lg'
                        : isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] hover:border-[#3a3a3a]' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-2 ${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-200 border-gray-300'} rounded border flex items-center justify-center`}>
                        <Minus className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`} size={32} />
                      </div>
                      <div className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>Without Stand</div>
                      <div className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Magnetic Only</div>
                    </div>
                  </button>
                </div>
                
                {withStand && (
                  <div className="mt-3 p-3 bg-blue-950/30 border border-blue-800 rounded-md">
                    <p className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                      Stand option includes <strong className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>+₹{standPrice} per piece</strong> for premium acrylic stand
                    </p>
                  </div>
                )}
              </div>

              {/* Price Display */}
              <div className={`${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6 mb-6`}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className={`text-3xl font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>₹{price}</span>
                  <span className={`text-base ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>for {quantity} piece{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className={`text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>
                  ₹{pricePerUnit} per piece {withStand && `(includes ₹${standPrice} stand)`}
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
                <label className={`block font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-3`}>Select Quantity:</label>
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
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`w-24 h-12 text-center text-xl font-bold ${isDark ? 'text-[#f0f0f0] bg-[#0d0d0d] border-[#2a2a2a]' : 'text-gray-900 bg-white border-gray-200'} border rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none`}
                  />
                  
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-12 h-12 rounded-md border ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d] text-[#f0f0f0] hover:border-[#3a3a3a] hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'} flex items-center justify-center transition-all`}
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
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>Premium acrylic quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>High-resolution photo print</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>Portrait & Landscape options</span>
                </div>
                {withStand && (
                  <div className="flex items-center gap-3">
                    <Check className="text-green-500" size={20} />
                    <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>Includes premium acrylic stand</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className={`${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} font-medium`}>Fast delivery</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!uploadedImage || isUploading}
                className={`w-full px-8 py-4 ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-md font-semibold text-base transition-all shadow-lg hover:shadow-xl ${!uploadedImage || isUploading ? (isDark ? 'disabled:bg-[#2a2a2a] disabled:text-[#c8c8c8]' : 'disabled:bg-gray-300 disabled:text-gray-500') : ''} disabled:cursor-not-allowed`}
              >
                {isUploading ? 'Processing...' : uploadedImage ? `Add to Cart - ₹${price}` : 'Upload Photo First'}
              </button>
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
