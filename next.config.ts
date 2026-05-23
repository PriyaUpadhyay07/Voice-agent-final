import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Redirect removed to prevent interference with Lisa dashboard
  /*
  async redirects() {
    return [
      {
        source: '/',
        destination: '/demo',
        permanent: true,
      },
    ];
  },
  */
};

export default nextConfig;
