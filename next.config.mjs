/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization globally - semua pages jadi dynamic
  output: 'standalone',
  experimental: {
    // Force all pages to be server-side rendered
  },
  // Ini yang paling penting: skip prerender untuk semua pages
  generateBuildId: async () => {
    return 'valley-pedia-build';
  },
};

export default nextConfig;
