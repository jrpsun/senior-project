import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_BASE_URL: process.env.NODE_ENV === "production" ? "https://api.example.com" : "http://localhost:8000",
  },
};

export default nextConfig;
