import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,

  },
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: 'img.clerk.com' }

    ]
  }
};

export default nextConfig;
