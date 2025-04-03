import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com","bxuljpwvbmlhebjvjwgd.supabase.co"], 
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" }
        ]
      }
    ];
  }
};

export default nextConfig;
