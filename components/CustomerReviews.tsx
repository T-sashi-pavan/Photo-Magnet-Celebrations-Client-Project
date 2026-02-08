'use client';

import { Star } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const videos = [
  'https://res.cloudinary.com/dlujb9uqv/video/upload/v1770561133/WhatsApp_Video_2026-02-07_at_11.22.37_PM_yhxaw2.mp4',
  'https://res.cloudinary.com/dlujb9uqv/video/upload/v1770561324/WhatsApp_Video_2026-02-07_at_11.22.56_PM_f6cgtl.mp4',
];

export default function CustomerReviews() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-[#0d0d0d] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'} py-6 md:py-8 border-t`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-4 md:mb-6">
          <h3 className={`text-lg md:text-xl font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} mb-1`}>Customer Reviews</h3>
          <p className={`text-xs md:text-sm ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Real feedback from our customers</p>
        </div>

        {/* Review Card */}
        <div className={`${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-gray-200'} rounded-lg border p-3 md:p-4`}>
          {/* Customer Info & Rating */}
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`w-8 h-8 md:w-10 md:h-10 ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'} rounded-full flex items-center justify-center border`}>
                <span className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} font-semibold text-xs md:text-sm`}>KK</span>
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} text-xs md:text-sm`}>Kittu Kumar</p>
                <p className={`text-[10px] md:text-xs ${isDark ? 'text-[#c8c8c8]' : 'text-gray-600'}`}>Verified Purchase</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
          </div>

          {/* Review Message */}
          <p className={`${isDark ? 'text-[#f0f0f0]' : 'text-gray-900'} text-xs md:text-sm mb-2 md:mb-3`}>
            Super! Amazing quality and fast delivery. Loved the magnets!
          </p>

          {/* Videos */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {videos.map((videoUrl, index) => (
              <div key={index} className={`relative aspect-video ${isDark ? 'bg-[#0d0d0d] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'} rounded-md overflow-hidden border`}>
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
