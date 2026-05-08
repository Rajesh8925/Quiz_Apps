import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quiz-apps-my-7jy8.onrender.com/api';

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
