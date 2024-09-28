/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "27mb",
    },
  },
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        hostname: "iydadvcfuuolbgpildmx.supabase.co",
        port: "",
        protocol: "https",
      },
      { hostname: "img.clerk.com", port: "", protocol: "https" },
    ],
  },
};

export default nextConfig;
