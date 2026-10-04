import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve local photography (public/images) as AVIF/WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
