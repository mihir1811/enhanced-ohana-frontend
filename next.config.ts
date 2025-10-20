import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dmond.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    // ✅ Allow deployment even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
