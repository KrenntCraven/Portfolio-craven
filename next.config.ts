import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compress responses at the framework level
  compress: true,

  // Canonicalize the host to the apex domain (https://krenntcraven.com).
  // NOTE: Vercel must have the apex domain set as primary (with www -> apex),
  // otherwise the platform's apex -> www redirect will loop against the
  // www -> apex rule below.
  redirects: async () => [
    {
      // Default Vercel deployment URL -> canonical custom domain
      source: "/:path*",
      has: [
        {
          type: "host",
          value: "krennt-craven.vercel.app",
        },
      ],
      destination: "https://krenntcraven.com/:path*",
      permanent: true,
    },
    {
      // www -> apex, so the served host matches the canonical/OG/JSON-LD URLs
      source: "/:path*",
      has: [
        {
          type: "host",
          value: "www.krenntcraven.com",
        },
      ],
      destination: "https://krenntcraven.com/:path*",
      permanent: true,
    },
  ],

  // HTTP caching headers for static assets, fonts, and images
  headers: async () => [
    {
      // Immutable hashed build assets (JS, CSS chunks)
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      // Optimised images served by next/image
      source: "/_next/image",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        },
      ],
    },
    {
      // Static files in /public (favicon, avatar, badges, etc.)
      source: "/:path((?:.*\\.(?:ico|png|jpg|jpeg|webp|avif|svg|gif))$)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        },
      ],
    },
    {
      // Font files
      source: "/:path((?:.*\\.(?:woff|woff2|ttf|otf))$)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      // Data routes (RSC payloads) — short cache + revalidate
      source: "/_next/data/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=60, stale-while-revalidate=3600",
        },
      ],
    },
  ],
};

export default nextConfig;
