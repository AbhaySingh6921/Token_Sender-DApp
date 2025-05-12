import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',         // Required for static export
  trailingSlash: true,      // Required for IPFS
  assetPrefix: './',        // IPFS-safe paths
  images: {
    unoptimized: true,      // Required for static export
  },
  distDir: 'out',           // Optional: default is `.next`, but export goes to `out/`
};

export default nextConfig;
// export const config = {