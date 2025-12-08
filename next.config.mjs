// next.config.mjs
import path from "node:path";

const LOADER = path.resolve(
  process.cwd(),
  "src/visual-edits/component-tagger-loader.js"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // We removed `output: "export"` earlier so API routes + Stripe work.

  // Allow dev access from your LAN IP (192.168.2.63:3000)
  // so future Next.js versions won't block /_next/* requests.
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

  // Keep your previous setting for output tracing root
  outputFileTracingRoot: path.resolve(process.cwd(), "../../"),

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
