import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // This will ignore all TypeScript errors
  },
  outputFileTracingRoot: require('path').join(__dirname),
  // You can add more Next.js config options here later if needed
};

export default nextConfig;
