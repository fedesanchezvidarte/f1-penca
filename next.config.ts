import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'i.pravatar.cc'], // Allow Google and Pravatar profile images
  },
};

export default nextConfig;
