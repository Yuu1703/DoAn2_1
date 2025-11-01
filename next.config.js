/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
    optimizeCss: false,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
