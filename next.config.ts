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
  // Enable Turbopack configuration (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
