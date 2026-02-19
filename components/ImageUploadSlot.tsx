'use client';

import { useState } from 'react';
import { X, Check, Upload as UploadIcon } from 'lucide-react';
import ImageCropper from '@/components/ImageCropper';
import { useTheme } from '@/components/ThemeProvider';
import { AspectRatio } from '@/types';

interface ImageUploadSlotProps {
  slotIndex: number;
  aspectRatio: number;
  onConfirm: (slotIndex: number, imageData: string, croppedPixels: any) => void;
  confirmedImage: string | null;
  isDark: boolean;
}

export default function ImageUploadSlot({ 
  slotIndex, 
  aspectRatio, 
  onConfirm, 
  confirmedImage,
  isDark 
}: ImageUploadSlotProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Convert numeric aspect ratio to AspectRatio type
  const getAspectRatioType = (ratio: number): AspectRatio => {
    if (ratio === 1) return '1:1';
    if (ratio === 0.75) return '3:4';
    if (ratio === 1.33 || ratio > 1.3) return '4:3';
    return '1:1'; // default
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOk = () => {
    if (uploadedImage && croppedAreaPixels) {
      setPreviewImage(uploadedImage);
      setShowPreview(true);
      setShowCropper(false);
    }
  };

  const handleCancel = () => {
    setUploadedImage(null);
    setCroppedAreaPixels(null);
    setShowCropper(false);
  };

  const handleConfirmUpload = () => {
    if (uploadedImage && croppedAreaPixels) {
      onConfirm(slotIndex, uploadedImage, croppedAreaPixels);
      setShowPreview(false);
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setUploadedImage(null);
    setCroppedAreaPixels(null);
    setPreviewImage(null);
  };

  const handleChangeImage = () => {
    onConfirm(slotIndex, '', null); // Clear the confirmed image
    setUploadedImage(null);
    setCroppedAreaPixels(null);
    setPreviewImage(null);
  };

  return (
    <>
      {/* Small Upload Block */}
      <div className={`relative ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg`}>
        {confirmedImage ? (
          // Confirmed Image Preview
          <div className="relative w-full aspect-square group">
            <img 
              src={confirmedImage} 
              alt={`Slot ${slotIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/50'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
              <button
                onClick={handleChangeImage}
                className={`px-4 py-2 ${isDark ? 'bg-[#f0f0f0] text-[#141414]' : 'bg-white text-gray-900'} rounded-lg font-semibold text-sm hover:scale-105 transition-transform`}
              >
                Change
              </button>
            </div>
            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
              <Check size={16} className="text-white" />
            </div>
            <div className={`absolute bottom-0 left-0 right-0 ${isDark ? 'bg-[#141414]/90' : 'bg-gray-900/90'} text-white text-xs py-1 px-2 text-center font-medium`}>
              Image {slotIndex + 1}
            </div>
          </div>
        ) : (
          // Upload Button
          <div className="w-full aspect-square">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id={`upload-slot-${slotIndex}`}
            />
            <label 
              htmlFor={`upload-slot-${slotIndex}`}
              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer ${isDark ? 'hover:bg-[#0d0d0d]' : 'hover:bg-gray-50'} transition-colors`}
            >
              <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} flex items-center justify-center mb-2`}>
                <UploadIcon size={24} className={isDark ? 'text-[#c8c8c8]' : 'text-gray-600'} />
              </div>
              <span className={`text-xs font-semibold ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                Image {slotIndex + 1}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Cropper Modal */}
      {showCropper && uploadedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-4xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Adjust Your Image - Slot {slotIndex + 1}
              </h3>
            </div>

            {/* Cropper */}
            <div className="p-6">
              <div className="relative w-full" style={{ height: '400px' }}>
                <ImageCropper
                  image={uploadedImage}
                  aspectRatio={getAspectRatioType(aspectRatio)}
                  onCropComplete={setCroppedAreaPixels}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className={`px-6 py-4 border-t ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'} flex gap-3 justify-end`}>
              <button
                onClick={handleCancel}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${isDark ? 'bg-[#2a2a2a] text-[#c8c8c8] hover:bg-[#3a3a3a]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleOk}
                disabled={!croppedAreaPixels}
                className={`px-8 py-2.5 rounded-lg font-semibold transition-all ${isDark ? 'bg-[#f0f0f0] text-[#141414] hover:bg-[#dcdcdc]' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Confirmation Modal */}
      {showPreview && previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-2xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'}`}>
                Preview - Image {slotIndex + 1}
              </h3>
            </div>

            {/* Preview Image */}
            <div className="p-8">
              <div className={`relative w-full aspect-square ${isDark ? 'bg-[#0d0d0d]' : 'bg-gray-100'} rounded-lg overflow-hidden border-2 ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                <img 
                  src={previewImage} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`text-center mt-4 text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>
                This is how your photo will appear on the magnet
              </p>
            </div>

            {/* Footer Buttons */}
            <div className={`px-6 py-4 border-t ${isDark ? 'border-[#2a2a2a] bg-[#0d0d0d]' : 'border-gray-200 bg-gray-50'} flex gap-3 justify-end`}>
              <button
                onClick={handleCancelPreview}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${isDark ? 'bg-[#2a2a2a] text-[#c8c8c8] hover:bg-[#3a3a3a]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className={`px-8 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${isDark ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                <Check size={18} />
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
