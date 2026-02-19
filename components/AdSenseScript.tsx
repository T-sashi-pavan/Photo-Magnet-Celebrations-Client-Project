import Script from 'next/script';

export default function AdSenseScript() {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  // Don't load script if AdSense ID is not configured
  if (!adClient || adClient === 'YOUR_ADSENSE_ID_HERE') {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
