import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    loader: 'custom',
    loaderFile: './supabase-image-loader.ts',
  },
};

export default nextConfig;
