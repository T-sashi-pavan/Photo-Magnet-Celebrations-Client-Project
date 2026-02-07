import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Optimize for production
  reactStrictMode: true,
  // Reduce size by removing source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
