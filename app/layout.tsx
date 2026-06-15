import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics }     from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const BASE_URL = "https://klikajnasyma.pl";

export const metadata: Metadata = {
  title:       "klikajnasyma",
  description: "Wszystkie ważne linki klikajnasyma — wesprzyj, TikTok, Discord.",
  metadataBase: new URL(BASE_URL),
  manifest: "/manifest.json",

  openGraph: {
    title:       "klikajnasyma",
    description: "Wszystkie ważne linki w jednym miejscu.",
    url:         BASE_URL,
    siteName:    "klikajnasyma",
    locale:      "pl_PL",
    type:        "website",
    images: [
      {
        url:    "/opengraph-image.png",
        width:  1200,
        height: 630,
        alt:    "klikajnasyma — link in bio",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "klikajnasyma",
    description: "Wszystkie ważne linki w jednym miejscu.",
    images:      ["/opengraph-image.png"],
  },

  robots: {
    index:  true,
    follow: true,
  },

  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor:   "#ffecd2",
  width:        "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <div className="bg-summer" />
        <div className="blob blob-sun" />
        <div className="blob blob-sea" />
        <div className="blob blob-coral" />
        <div className="blob blob-lemon" />

        <div className="shape shape-circle sc-1" />
        <div className="shape shape-circle sc-2" />
        <div className="shape shape-circle sc-3" />
        <div className="shape shape-circle sc-4" />
        <div className="shape shape-dot sd-1" />
        <div className="shape shape-dot sd-2" />
        <div className="shape shape-dot sd-3" />
        <div className="shape shape-dot sd-4" />
        <div className="shape shape-dot sd-5" />
        <div className="shape shape-plus sp-1">+</div>
        <div className="shape shape-plus sp-2">+</div>
        <div className="shape shape-plus sp-3">+</div>

        <svg className="shape shape-sun" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="10" stroke="#ff8c00" strokeWidth="2.5" />
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <line key={i} x1="28" y1="6" x2="28" y2="13"
              stroke="#ff8c00" strokeWidth="2.5" strokeLinecap="round"
              transform={`rotate(${deg} 28 28)`}
            />
          ))}
        </svg>

        <div className="wave-container" style={{ height: "120px" }}>
          <svg className="wave-svg" viewBox="0 0 1440 120"
            preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60
                     C1260,100 1440,20 1440,60 L1440,120 L0,120 Z"
              fill="rgba(255,200,100,0.13)" />
            <path d="M0,80 C200,40 400,110 600,75 C800,40 1000,110 1200,75
                     C1350,50 1440,80 1440,80 L1440,120 L0,120 Z"
              fill="rgba(77,208,225,0.10)" />
          </svg>
          <svg className="wave-svg-2" viewBox="0 0 1440 80"
            preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40
                     L1440,80 L0,80 Z"
              fill="rgba(255,160,60,0.08)" />
          </svg>
        </div>

        {children}
        <Analytics />
<SpeedInsights />
      </body>
    </html>
  );
}