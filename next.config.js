/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com'],
  },
  transpilePackages: ['framer-motion'],
}

module.exports = nextConfig
