import type { NextConfig } from "next";
import { URL } from "url";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'images.unsplash.com',
        port: '',
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
