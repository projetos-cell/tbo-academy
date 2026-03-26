import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  allowedDevOrigins: [
    "http://127.0.0.1:3002",
    "http://localhost:3002",
    "http://academy.localhost:3002",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
}

export default nextConfig
