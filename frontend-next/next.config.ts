import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  serverExternalPackages: ['pdfkit'],
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:3000/api/v1';
    return [
      {
        source: '/proxy/:path*',
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
