import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/teams",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors https://*.microsoft.com https://*.cloud.microsoft https://teams.microsoft.com https://*.teams.microsoft.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
