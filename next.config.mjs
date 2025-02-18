/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
