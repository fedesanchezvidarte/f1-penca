import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.pravatar.cc'], // Allow Pravatar profile images for beta users
  },
};

export default nextConfig;
