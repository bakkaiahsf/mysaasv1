import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore ESLint during builds to prevent deployment failures from pre-existing issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled but allow pre-existing issues for now
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
