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
  // Enable SWC minification for better performance
  swcMinify: true,
  // Reduce size by removing source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
