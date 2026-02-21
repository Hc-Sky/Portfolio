import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/Portfolio" : undefined,
  assetPrefix: isProd ? "/Portfolio/" : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/Portfolio" : "",
  },
};

export default nextConfig;
