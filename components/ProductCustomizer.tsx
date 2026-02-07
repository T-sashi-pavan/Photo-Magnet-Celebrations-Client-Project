'use client';

import { useState } from 'react';
import { PRODUCTS, Product, ProductPackage, calculateCustomPrice, getPricePerUnit } from '@/lib/products';
import ImageCropper from './ImageCropper';
import { getCroppedImg, uploadToCloudinary } from '@/lib/imageUtils';
import { useToast } from './ToastProvider';

interface CartItem {
  productId: string;
  productName: string;
  packageDetails: string;
  quantity: number;
  price: number;
  croppedImageUrl: string;
  category: string;
}

interface ProductCustomizerProps {
  onAddToCart: (item: CartItem) => void;
}

export default function ProductCustomizer({ onAddToCart }: ProductCustomizerProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage | null>(null);
  const [customQuantity, setCustomQuantity] = useState<string>('');
  const [useCustomQuantity, setUseCustomQuantity] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedPackage(product.packages[0]);
    setUseCustomQuantity(false);
    setCustomQuantity('');
  };

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
    if (!selectedProduct || !uploadedImage || !croppedAreaPixels) {
      showToast('Please complete all steps before adding to cart', 'error');
      return;
    }

    let finalQuantity: number;
    let finalPrice: number;

    if (useCustomQuantity && customQuantity) {
      finalQuantity = parseInt(customQuantity);
      
      // Validate minimum order for event stall
      if (selectedProduct.minimumOrder && finalQuantity < selectedProduct.minimumOrder) {
        showToast(`Minimum order is ${selectedProduct.minimumOrder} pieces for this product`, 'error');
        return;
      }

      finalPrice = calculateCustomPrice(selectedProduct, finalQuantity);
      
      if (finalPrice === 0) {
        showToast('Invalid quantity selected', 'error');
        return;
      }
    } else {
      if (!selectedPackage) {
        showToast('Please select a package or enter custom quantity', 'error');
        return;
      }
      finalQuantity = selectedPackage.quantity;
      finalPrice = selectedPackage.price;
    }

    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(uploadedImage, croppedAreaPixels);
      const imageUrl = await uploadToCloudinary(croppedBlob);

      onAddToCart({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        packageDetails: selectedProduct.description,
        quantity: finalQuantity,
        price: finalPrice,
        croppedImageUrl: imageUrl,
        category: selectedProduct.category
      });

      setUploadedImage(null);
      setCroppedAreaPixels(null);
      showToast('Added to cart successfully!', 'success');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('upload_preset')) {
        showToast('Cloudinary setup incomplete. Please check setup guide.', 'error');
      } else {
        showToast(`Failed to process image: ${errorMessage}`, 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" id="customize">
      <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Customize Your Photo Magnets
      </h2>

      {/* Product Selection */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Step 1: Choose Product Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                selectedProduct?.id === product.id
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <h4 className="font-bold text-lg mb-2 text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <div className="text-sm font-semibold text-blue-600">
                {product.minimumOrder 
                  ? `Min Order: ${product.minimumOrder} pcs`
                  : `From ₹${product.packages[0].price}`
                }
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <>
          {/* Package Selection */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Step 2: Select Quantity
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              
              {/* Toggle between preset packages and custom quantity */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setUseCustomQuantity(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    !useCustomQuantity
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Quick Select Packages
                </button>
                <button
                  onClick={() => setUseCustomQuantity(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    useCustomQuantity
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Enter Custom Quantity
                </button>
              </div>

              {!useCustomQuantity ? (
                // Preset packages
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {selectedProduct.packages.map((pkg) => (
                      <button
                        key={pkg.quantity}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedPackage?.quantity === pkg.quantity
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {pkg.quantity}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">pieces</div>
                          <div className="text-lg font-bold text-blue-600">
                            ₹{pkg.price}
                          </div>
                          {pkg.label && (
                            <div className="mt-2 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                              {pkg.label}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {selectedPackage && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-gray-600">
                          <span className="font-semibold">{selectedPackage.quantity} pieces</span>
                          <span className="text-sm text-gray-500 ml-2">
                            (₹{(selectedPackage.price / selectedPackage.quantity).toFixed(2)}/pc)
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          Total: ₹{selectedPackage.price}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Custom quantity input
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter Quantity:
                    </label>
                    <input
                      type="number"
                      min={selectedProduct.minimumOrder || 1}
                      value={customQuantity}
                      onChange={(e) => setCustomQuantity(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter quantity ${selectedProduct.minimumOrder ? `(min ${selectedProduct.minimumOrder})` : ''}`}
                    />
                  </div>

                  {customQuantity && parseInt(customQuantity) > 0 && (
                    <>
                      {selectedProduct.minimumOrder && parseInt(customQuantity) < selectedProduct.minimumOrder ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-600 font-semibold">
                            Minimum order is {selectedProduct.minimumOrder} pieces for this product
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-semibold">
                              {customQuantity} pieces
                            </span>
                            <span className="text-gray-600">
                              @ ₹{getPricePerUnit(selectedProduct, parseInt(customQuantity))}/piece
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-green-200">
                            <span className="text-lg font-bold text-gray-900">Total:</span>
                            <span className="text-2xl font-bold text-green-600">
                              ₹{calculateCustomPrice(selectedProduct, parseInt(customQuantity))}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Pricing tiers info */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Volume Discounts:</p>
                        <div className="space-y-1">
                          {selectedProduct.priceTiers?.map((tier, index) => (
                            <div key={index} className="text-sm text-gray-600 flex justify-between">
                              <span>
                                {tier.minQuantity === tier.maxQuantity
                                  ? `${tier.minQuantity} piece${tier.minQuantity > 1 ? 's' : ''}`
                                  : `${tier.minQuantity}-${tier.maxQuantity === Infinity ? '∞' : tier.maxQuantity} pieces`
                                }
                              </span>
                              <span className="font-semibold text-blue-600">₹{tier.pricePerUnit}/pc</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Step 3: Upload & Crop Your Photo
            </h3>
            
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                >
                  Choose Image
                </label>
                <p className="mt-4 text-sm text-gray-600">
                  Upload a high-quality photo for your magnet
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <ImageCropper
                  image={uploadedImage}
                  aspectRatio={selectedProduct.aspectRatio}
                  onCropComplete={setCroppedAreaPixels}
                />
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-800"
                  >
                    Change Image
                  </button>
                  <p className="text-sm text-gray-500">
                    Drag to reposition • Scroll to zoom
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAddToCart}
              disabled={!uploadedImage || isUploading || (useCustomQuantity && !customQuantity)}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading 
                ? 'Processing...' 
                : useCustomQuantity && customQuantity
                  ? `Add to Cart - ₹${calculateCustomPrice(selectedProduct, parseInt(customQuantity))}`
                  : `Add to Cart - ₹${selectedPackage?.price || 0}`
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
}
