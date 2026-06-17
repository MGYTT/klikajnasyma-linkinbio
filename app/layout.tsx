import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { StructuredData } from "@/app/structured-data";

const syne = Syne({
  subsets:  ["latin"],
  variable: "--font-syne",
  display:  "swap",
  weight:   ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor:  "#ff8c00",
  width:       "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title:       "klikajnasyma — Link in Bio",
  description: "Twórca treści · TikTok & Discord · klikajnasyma.pl",
  metadataBase: new URL("https://klikajnasyma.pl"),
  openGraph: {
    title:       "klikajnasyma",
    description: "Twórca treści · TikTok & Discord",
    url:         "https://klikajnasyma.pl",
    siteName:    "klikajnasyma.pl",
    images:      [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale:      "pl_PL",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "klikajnasyma",
    description: "Twórca treści · TikTok & Discord",
    images:      ["/og-image.png"],
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={syne.variable}>
      <body style={{ margin: 0, padding: 0 }}>
        {/* Tło */}
        <Background />
        {children}
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}

/* ══════════════════════════════════════════════════════
   BACKGROUND — wielowarstwowe, żywe tło
══════════════════════════════════════════════════════ */

function Background() {
  return (
    <>
      {/* Warstwa 1 — base gradient */}
      <div
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     0,
          background: "linear-gradient(160deg, #fff8ee 0%, #fff3e0 30%, #ffecd2 60%, #ffe0b2 100%)",
        }}
      />

      {/* Warstwa 2 — noise texture */}
      <div
        style={{
          position:         "fixed",
          inset:            0,
          zIndex:           0,
          backgroundImage:  `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize:   "128px 128px",
          opacity:          0.028,
          pointerEvents:    "none",
        }}
      />

      {/* Warstwa 3 — animated blobs */}
      <div
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     0,
          overflow:   "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Blob 1 — top left, duży, wolny */}
        <div style={{
          position:     "absolute",
          top:          "-15%",
          left:         "-10%",
          width:        "60vw",
          height:       "60vw",
          maxWidth:     "520px",
          maxHeight:    "520px",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          background:   "radial-gradient(circle at 40% 40%, rgba(255,200,80,0.28) 0%, rgba(255,160,50,0.14) 50%, transparent 75%)",
          animation:    "blob1 18s ease-in-out infinite",
          filter:       "blur(32px)",
          willChange:   "transform, border-radius",
        }} />

        {/* Blob 2 — bottom right, średni */}
        <div style={{
          position:     "absolute",
          bottom:       "-10%",
          right:        "-8%",
          width:        "50vw",
          height:       "50vw",
          maxWidth:     "420px",
          maxHeight:    "420px",
          borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%",
          background:   "radial-gradient(circle at 60% 60%, rgba(255,120,50,0.22) 0%, rgba(255,90,30,0.10) 50%, transparent 75%)",
          animation:    "blob2 22s ease-in-out infinite",
          filter:       "blur(28px)",
          willChange:   "transform, border-radius",
        }} />

        {/* Blob 3 — center right, mały, szybszy */}
        <div style={{
          position:     "absolute",
          top:          "35%",
          right:        "-5%",
          width:        "35vw",
          height:       "35vw",
          maxWidth:     "280px",
          maxHeight:    "280px",
          borderRadius: "70% 30% 50% 50% / 40% 60% 40% 60%",
          background:   "radial-gradient(circle at 50% 50%, rgba(255,220,100,0.20) 0%, transparent 70%)",
          animation:    "blob3 14s ease-in-out infinite",
          filter:       "blur(22px)",
          willChange:   "transform, border-radius",
        }} />

        {/* Blob 4 — top right, akcentowy */}
        <div style={{
          position:     "absolute",
          top:          "-5%",
          right:        "10%",
          width:        "30vw",
          height:       "30vw",
          maxWidth:     "240px",
          maxHeight:    "240px",
          borderRadius: "50% 50% 40% 60% / 60% 40% 70% 30%",
          background:   "radial-gradient(circle at 50% 40%, rgba(255,170,60,0.18) 0%, transparent 70%)",
          animation:    "blob4 16s ease-in-out infinite",
          filter:       "blur(18px)",
          willChange:   "transform, border-radius",
        }} />

        {/* Blob 5 — bottom left, chłodniejszy */}
        <div style={{
          position:     "absolute",
          bottom:       "5%",
          left:         "-5%",
          width:        "40vw",
          height:       "40vw",
          maxWidth:     "320px",
          maxHeight:    "320px",
          borderRadius: "30% 70% 60% 40% / 50% 40% 60% 50%",
          background:   "radial-gradient(circle at 40% 60%, rgba(255,240,160,0.16) 0%, transparent 70%)",
          animation:    "blob5 20s ease-in-out infinite",
          filter:       "blur(26px)",
          willChange:   "transform, border-radius",
        }} />
      </div>

      {/* Warstwa 4 — vignette overlay */}
      <div
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        0,
          background:    "radial-gradient(ellipse at center, transparent 40%, rgba(255,220,160,0.12) 100%)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes blob1 {
          0%,100% { transform: translate(0px, 0px)   scale(1);    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
          25%      { transform: translate(30px,-20px) scale(1.04); border-radius: 40% 60% 40% 60% / 60% 40% 60% 40%; }
          50%      { transform: translate(-15px,25px) scale(0.97); border-radius: 50% 50% 60% 40% / 40% 60% 50% 50%; }
          75%      { transform: translate(20px, 10px) scale(1.02); border-radius: 70% 30% 50% 50% / 50% 50% 40% 60%; }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0px, 0px)   scale(1);    border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
          30%      { transform: translate(-25px,15px) scale(1.05); border-radius: 60% 40% 50% 50% / 40% 60% 40% 60%; }
          60%      { transform: translate(18px,-22px) scale(0.96); border-radius: 30% 70% 60% 40% / 50% 50% 60% 40%; }
          80%      { transform: translate(-10px,8px)  scale(1.03); border-radius: 50% 50% 40% 60% / 60% 40% 50% 50%; }
        }
        @keyframes blob3 {
          0%,100% { transform: translate(0px, 0px)   scale(1);    border-radius: 70% 30% 50% 50% / 40% 60% 40% 60%; }
          33%      { transform: translate(15px,-18px) scale(1.06); border-radius: 50% 50% 70% 30% / 60% 40% 50% 50%; }
          66%      { transform: translate(-20px,12px) scale(0.95); border-radius: 40% 60% 40% 60% / 50% 50% 60% 40%; }
        }
        @keyframes blob4 {
          0%,100% { transform: translate(0px, 0px)   scale(1);    border-radius: 50% 50% 40% 60% / 60% 40% 70% 30%; }
          40%      { transform: translate(-18px,20px) scale(1.04); border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%; }
          70%      { transform: translate(22px,-12px) scale(0.98); border-radius: 40% 60% 50% 50% / 50% 50% 60% 40%; }
        }
        @keyframes blob5 {
          0%,100% { transform: translate(0px, 0px)   scale(1);    border-radius: 30% 70% 60% 40% / 50% 40% 60% 50%; }
          35%      { transform: translate(20px,-15px) scale(1.03); border-radius: 50% 50% 40% 60% / 60% 40% 50% 50%; }
          65%      { transform: translate(-12px,20px) scale(0.97); border-radius: 60% 40% 70% 30% / 40% 60% 40% 60%; }
        }
      `}</style>
    </>
  );
}