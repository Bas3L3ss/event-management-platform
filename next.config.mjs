/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["date-fns"],
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
