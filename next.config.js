/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
   allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig