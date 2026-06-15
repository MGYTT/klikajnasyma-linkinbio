import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "klikajnasyma — wszystkie linki w jednym miejscu";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          "1200px",
          height:         "630px",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          background:     "linear-gradient(135deg, #fff9f0 0%, #ffe8c8 35%, #ffd4a8 60%, #e0f7fa 100%)",
          position:       "relative",
          overflow:       "hidden",
          fontFamily:     "sans-serif",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position:     "absolute",
            top:          "-80px",
            right:        "-80px",
            width:        "500px",
            height:       "500px",
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(255,180,60,0.4) 0%, transparent 70%)",
            filter:       "blur(60px)",
            display:      "flex",
          }}
        />
        <div
          style={{
            position:     "absolute",
            bottom:       "-60px",
            left:         "-60px",
            width:        "400px",
            height:       "400px",
            borderRadius: "50%",
            background:   "radial-gradient(circle, rgba(77,208,225,0.35) 0%, transparent 70%)",
            filter:       "blur(60px)",
            display:      "flex",
          }}
        />

        {/* Avatar circle */}
        <div
          style={{
            width:          "130px",
            height:         "130px",
            borderRadius:   "50%",
            background:     "conic-gradient(from 0deg, #ffb347, #ff6b6b, #ffd93d, #4dd0e1, #ffb347)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            marginBottom:   "28px",
            boxShadow:      "0 8px 40px rgba(255,140,60,0.35)",
            padding:        "4px",
          }}
        >
          <div
            style={{
              width:          "122px",
              height:         "122px",
              borderRadius:   "50%",
              background:     "linear-gradient(135deg, #fff3e0, #e0f7fa)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       "52px",
              fontWeight:     900,
            }}
          >
            KS
          </div>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize:      "72px",
            fontWeight:    900,
            background:    "linear-gradient(135deg, #ff8c00, #ff4500)",
            backgroundClip:"text",
            color:         "transparent",
            letterSpacing: "-2px",
            marginBottom:  "14px",
            display:       "flex",
          }}
        >
          klikajnasyma
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize:      "26px",
            color:         "#999",
            fontWeight:    500,
            marginBottom:  "36px",
            display:       "flex",
          }}
        >
          Twórca treści · TikTok & Discord
        </div>

        {/* Link pills row */}
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { emoji: "💛", label: "Wesprzyj",   bg: "linear-gradient(135deg,#ff6b6b,#ff8e53)" },
            { emoji: "🪙", label: "TikTok Coins", bg: "linear-gradient(135deg,#ffd93d,#ff8c00)" },
            { emoji: "💬", label: "Discord",     bg: "linear-gradient(135deg,#4dd0e1,#0288d1)" },
          ].map((pill) => (
            <div
              key={pill.label}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "10px",
                padding:        "12px 24px",
                borderRadius:   "999px",
                background:     "rgba(255,255,255,0.65)",
                border:         "2px solid rgba(255,255,255,0.9)",
                fontSize:       "22px",
                fontWeight:     700,
                color:          "#333",
              }}
            >
              <div
                style={{
                  width:          "36px",
                  height:         "36px",
                  borderRadius:   "10px",
                  background:     pill.bg,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "18px",
                }}
              >
                {pill.emoji}
              </div>
              {pill.label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position:   "absolute",
            bottom:     "28px",
            fontSize:   "20px",
            color:      "#ffaa55",
            fontWeight: 600,
            display:    "flex",
          }}
        >
          klikajnasyma.pl
        </div>
      </div>
    ),
    { ...size }
  );
}