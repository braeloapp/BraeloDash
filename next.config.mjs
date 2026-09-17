/** @type {import('next').NextConfig} */
const upstream = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ""
)
  .trim()
  .replace(/\/$/, "");

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "**.blob.core.windows.net" },
      { protocol: "https", hostname: "**.azurewebsites.net" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "react-icons/fi",
      "chart.js",
      "react-chartjs-2",
      "primeicons",
      "primereact",
    ],
  },
  async rewrites() {
    if (!upstream) return [];
    return [
      {
        source: "/api-backend/:path*",
        destination: `${upstream}/:path*`,
      },
    ];
  },
};

export default nextConfig;
