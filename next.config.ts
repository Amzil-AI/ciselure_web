import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
};

export default nextConfig;
