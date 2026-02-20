import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/Portfolio",
  assetPrefix: "/Portfolio/",
};

export default nextConfig;
