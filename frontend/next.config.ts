import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
