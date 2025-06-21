import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "modest-sturgeon-180.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
