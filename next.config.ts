import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Blokuje ładowanie strony w iframe (clickjacking)
          {
            key:   "X-Frame-Options",
            value: "DENY",
          },
          // Blokuje MIME sniffing
          {
            key:   "X-Content-Type-Options",
            value: "nosniff",
          },
          // Wymusza HTTPS przez 2 lata
          {
            key:   "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Kontrola referrer
          {
            key:   "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Wyłącza zbędne funkcje przeglądarki
          {
            key:   "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Content Security Policy
          {
            key:   "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // XSS Protection (legacy browsers)
          {
            key:   "X-XSS-Protection",
            value: "1; mode=block",
          },
          // DNS Prefetch Control
          {
            key:   "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },

      // Cache dla statycznych assetów
      {
        source: "/static/(.*)",
        headers: [
          {
            key:   "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Cache dla JSON danych
      {
        source: "/:path*.json",
        headers: [
          {
            key:   "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=30",
          },
        ],
      },
    ];
  },

  // Ukryj nagłówek X-Powered-By: Next.js
  poweredByHeader: false,

  // Wymusz trailing slash consistency
  trailingSlash: false,
};

export default nextConfig;