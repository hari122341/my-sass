import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,

  },
  eslint: {

    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: 'img.clerk.com' }

    ]
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!
  }
};

export default nextConfig;
