import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output:'export',
  disDir:'out',
  images:{
    unoptimized:true,
  },
  basePath:'',
  assetPrefix:'./',
  trailingSlash :true,
};

export default nextConfig;
