import type { NextConfig } from "next";

const BACKEND_URL = process.env.FASTAPI_URL ?? (process.env.NODE_ENV === "production" ? undefined : "http://localhost:8000");
if (!BACKEND_URL) throw new Error("FASTAPI_URL is not set");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;