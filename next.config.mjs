/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com", port: "", protocol: "https" },
    ],
  },
};

export default nextConfig;
