'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { AspectRatio } from '@/types';

interface ImageCropperProps {
  image: string;
  aspectRatio: AspectRatio;
  onCropComplete: (croppedAreaPixels: any) => void;
}

export default function ImageCropper({ image, aspectRatio, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const getAspectRatioValue = (ratio: AspectRatio): number => {
    switch (ratio) {
      case '1:1':
        return 1;
      case '3:4':
        return 3 / 4;
      case '4:3':
        return 4 / 3;
      default:
        return 1;
    }
  };

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  return (
    <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={getAspectRatioValue(aspectRatio)}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        style={{
          containerStyle: {
            backgroundColor: '#1a1a1a',
          },
        }}
      />
      
      {/* Zoom Control - Positioned at bottom to avoid grid overlap */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-gray-300">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-32 h-2 accent-amber-600 cursor-pointer"
          />
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">{zoom.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
}
