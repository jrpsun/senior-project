import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL:
      process.env.NODE_ENV === "production"
        ? "https://fb4c-171-6-148-23.ngrok-free.app"
        : "http://localhost:8000",
  },
  experimental: {
    turbo: {},
  },
};

export default nextConfig;
