// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(
  __dirname,
  "src/visual-edits/component-tagger-loader.js"
);

const nextConfig: NextConfig = {
  // We removed `output: "export"` earlier so API routes + Stripe work.

  // Allow dev access from your LAN IP (192.168.2.63:3000)
  // so the future Next.js versions won't block /_next/* requests.
  allowedDevOrigins: ["192.168.2.63:3000"],

  images: {
    // Disable Next Image optimization (no dedicated image server)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  outputFileTracingRoot: path.resolve(__dirname, "../../"),

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER],
      },
    },
  },
};

export default nextConfig;
