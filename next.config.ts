import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static — deployable to any host (Vercel, Netlify, S3, cPanel).
  output: 'export',
  trailingSlash: true,
  images: {
    // Required for `output: 'export'`; every image we ship is already an
    // optimised SVG so there is nothing for the optimiser to do anyway.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
