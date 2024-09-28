/** @type {import('next').NextConfig} */
const nextConfig = {
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
