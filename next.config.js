/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Đảm bảo sử dụng pages directory
  experimental: {
    // Không sử dụng app directory
  },
}

export default nextConfig;
