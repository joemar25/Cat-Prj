import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Add aliases to the Webpack configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@lottie": path.resolve(__dirname, "public/lottie"),
    };
    return config;
  },
};

export default nextConfig;