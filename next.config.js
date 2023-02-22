/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['antd-mobile'],
  },
}

module.exports = nextConfig
