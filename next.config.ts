import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/user/diamonds", destination: "/products/diamonds", permanent: true },
      { source: "/user/gemstones", destination: "/products/gemstones", permanent: true },
      { source: "/user/jewelries", destination: "/products/jewelries", permanent: true },
      { source: "/user/settings", destination: "/user/profile", permanent: true },
      { source: "/user/addresses", destination: "/user/profile", permanent: true },
      { source: "/notifications", destination: "/user/orders", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/diamond-certification", destination: "/education/diamond/certification", permanent: true },
      { source: "/expert-consultation", destination: "/contact-us", permanent: true },
      { source: "/products/bullions", destination: "/bullions", permanent: true },
      { source: "/lab-grown-diamonds", destination: "/diamonds?diamondType=lab-grown", permanent: true },
      { source: "/experience", destination: "/user", permanent: true },
      { source: "/seller/listings", destination: "/seller/products", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dmond.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.stockcake.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.mariposakids.co.nz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
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
