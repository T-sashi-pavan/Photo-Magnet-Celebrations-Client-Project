'use client';

import { useEffect } from 'react';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function GoogleAd({
  adSlot,
  adFormat = 'auto',
  adLayout,
  fullWidthResponsive = true,
  className = '',
}: GoogleAdProps) {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  useEffect(() => {
    if (typeof window !== 'undefined' && adClient) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [adClient]);

  // Don't show ads if AdSense ID is not configured
  if (!adClient || adClient === 'YOUR_ADSENSE_ID_HERE') {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
