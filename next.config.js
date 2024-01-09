const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return process.env.NODE_ENV !== 'production'
      ? [
          { source: '/api/:path*', destination: `${BASE_URL}/api/:path*` },
          { source: '/auth/:path*', destination: `${BASE_URL}/auth/:path*` },
        ]
      : [];
  },
};

module.exports = nextConfig;
