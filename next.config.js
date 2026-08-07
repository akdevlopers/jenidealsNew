/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jenideals.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'lightweight-deluxe-kinds-too.trycloudflare.com',
      },
      {
        protocol: 'http',
        hostname: 'admin.jenideals.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.jenideals.com',
      },
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/holidays',
        destination: 'https://admin.jenideals.com/holidays',
      },
      {
        source: '/holidays/:path*',
        destination: 'https://admin.jenideals.com/holidays/:path*',
      },
    ];
  },
}

module.exports = nextConfig
