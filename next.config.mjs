/** @type {import('next').NextConfig} */
const nextConfig = {
  // Jangan pakai output:'standalone' di Vercel - ini justru bikin 404
  // Vercel sudah handle deployment sendiri
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
