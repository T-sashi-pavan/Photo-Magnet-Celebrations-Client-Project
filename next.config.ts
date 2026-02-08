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
  // Exclude admin folder from build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'admin': 'commonjs admin'
      });
    }
    return config;
  },
};

export default nextConfig;
