/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://hrm-psi-opal.vercel.app/api/:path*',  // Deployed backend
      },
    ]
  },
}

export default nextConfig

