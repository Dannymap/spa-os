/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nails/core"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
