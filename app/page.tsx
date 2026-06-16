"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import Avatar from "@/components/Avatar";
import SupportGoal  from "@/components/SupportGoal";
import DonateTicker from "@/components/DonateTicker";

/* ═══════════════════════════════════════════════════════
   FLOATING EMOJIS
═══════════════════════════════════════════════════════ */

interface EmojiItem {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const SUMMER_EMOJIS = [
  "☀️","🌊","🍋","🌸","⭐","🦋","🌺","✨","🍊","🌴",
];

function FloatingEmojis() {
  const [items, setItems] = useState<EmojiItem[]>([]);

  useEffect(() => {
    const generated: EmojiItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      emoji: SUMMER_EMOJIS[i % SUMMER_EMOJIS.length],
      x: 4 + (i * 9.4) % 88,
      size: 13 + (i * 3) % 13,
      duration: 12 + (i * 2.3) % 14,
      delay: (i * 1.9) % 10,
    }));
    setItems(generated);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: `${item.x}%`,
            bottom: "-40px",
            fontSize: `${item.size}px`,
            opacity: 0,
            animation: `emojiFloat ${item.duration}s ease-in infinite`,
            animationDelay: `${item.delay}s`,
            userSelect: "none",
            willChange: "transform, opacity",
          }}
        >
          {item.emoji}
        </div>
      ))}

      <style>{`
        @keyframes emojiFloat {
          0%   { transform: translateY(0px) rotate(0deg);   opacity: 0;    }
          6%   { opacity: 0.32; }
          88%  { opacity: 0.18; }
          100% { transform: translateY(-105vh) rotate(28deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */

function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3
               19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
               10-4.48 10-10S17.52 2 12 2zm0 18
               c-4.41 0-8-3.59-8-8s3.59-8 8-8
               8 3.59 8 8-3.59 8-8 8zm.31-8.86
               c-1.77-.45-2.34-.94-2.34-1.67
               0-.84.78-1.43 2.03-1.43
               1.32 0 1.81.63 1.85 1.56h1.64
               c-.05-1.28-.83-2.46-2.38-2.84V5h-2v1.72
               c-1.43.3-2.58 1.21-2.58 2.61
               0 1.67 1.38 2.5 3.4 3.01
               1.95.48 2.34 1.19 2.34 1.9
               0 .54-.39 1.4-2.03 1.4
               -1.54 0-2.14-.69-2.22-1.56H9.5
               c.09 1.63 1.31 2.54 2.81 2.83V19h2v-1.71
               c1.44-.28 2.58-1.1 2.59-2.61
               -.01-2.07-1.77-2.79-3.59-3.24z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515
               .074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25
               a18.27 18.27 0 0 0-5.487 0
               18.07 18.07 0 0 0-.617-1.25
               .077.077 0 0 0-.079-.037
               A19.736 19.736 0 0 0 3.677 4.37
               a.07.07 0 0 0-.032.027
               C.533 9.046-.32 13.58.099 18.057
               a.082.082 0 0 0 .031.057
               2.053 2.053 0 0 0 .588.244
               19.414 19.414 0 0 0 2.595.638
               .076.076 0 0 0 .084-.026
               c.462-.63.874-1.295 1.226-1.994
               a.076.076 0 0 0-.041-.106
               19.574 19.574 0 0 1-2.553-1.215
               .077.077 0 0 1-.008-.128
               16.44 16.44 0 0 0 .372-.292
               a.074.074 0 0 1 .077-.01
               c3.928 1.793 8.18 1.793 12.062 0
               a.074.074 0 0 1 .078.01
               c.12.098.246.198.373.292
               a.077.077 0 0 1-.006.127
               19.454 19.454 0 0 1-2.554 1.215
               a.076.076 0 0 0-.041.107
               c.36.698.772 1.362 1.225 1.993
               a.076.076 0 0 0 .084.028
               19.522 19.522 0 0 0 2.596-.637
               .077.077 0 0 0 .032-.055
               c.5-5.177-.838-9.674-3.549-13.66
               a.061.061 0 0 0-.031-.03z
               M8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419
               0-1.333.956-2.419 2.157-2.419
               1.21 0 2.176 1.096 2.157 2.42
               0 1.333-.956 2.418-2.157 2.418z
               m7.975 0c-1.183 0-2.157-1.085-2.157-2.419
               0-1.333.955-2.419 2.157-2.419
               1.21 0 2.176 1.096 2.157 2.42
               0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   LINKS DATA
═══════════════════════════════════════════════════════ */

const LINKS = [
  {
    href:     "https://tipply.pl/@MGYT",
    label:    "Wesprzyj mnie 💛",
    sublabel: "Postaw kawę przez Tipply",
    icon:     <HeartIcon />,
    iconBg:   "linear-gradient(135deg, #ff6b6b, #ff8e53)",
    delay:    0.38,
  },
  {
    href:     "https://www.tiktok.com/coin?rc=39K9KC8X",
    label:    "Tańsze Monety TikTok",
    sublabel: "Doładuj korzystniej przez mój link",
    icon:     <CoinIcon />,
    iconBg:   "linear-gradient(135deg, #ffd93d, #ff8c00)",
    delay:    0.52,
  },
  {
    href:     "https://discord.gg/AwaTdZ2Qqg",
    label:    "Dołącz na Discord",
    sublabel: "Serwer klikajnasyma",
    icon:     <DiscordIcon />,
    iconBg:   "linear-gradient(135deg, #4dd0e1, #0288d1)",
    delay:    0.66,
  },
];

/* ═══════════════════════════════════════════════════════
   STATS DATA
═══════════════════════════════════════════════════════ */

const STATS = [
  { emoji: "🎯", value: "TikTok", label: "Twórca"  },
  { emoji: "💬", value: "Discord", label: "Serwer" },
  { emoji: "☀️", value: "2026",    label: "Sezon"  },
];

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main
      style={{ position: "relative", zIndex: 2 }}
      className="flex flex-col items-center min-h-dvh w-full px-4 sm:px-6 py-14 sm:py-20"
    >

      {/* ── Floating emojis layer ─────────────────────── */}
      <FloatingEmojis />

{/* ── Donate Ticker ───────────────────────────── */}
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
  style={{
    width:        "100%",
    maxWidth:     "24rem",
    marginBottom: "1.5rem",
  }}
>
  <DonateTicker />
</motion.div>

      {/* ══════════════════════════════════════════════
          PROFILE SECTION
      ══════════════════════════════════════════════ */}
      <section className="flex flex-col items-center gap-5 w-full max-w-sm">

        {/* Avatar */}
        <Avatar />

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily:              "var(--font-syne), sans-serif",
            fontWeight:              800,
            fontSize:                "clamp(2rem, 8vw, 2.7rem)",
            letterSpacing:           "-0.025em",
            textAlign:               "center",
            lineHeight:              1.1,
            background:              "linear-gradient(135deg, #ff8c00 0%, #ff4500 55%, #e65100 100%)",
            WebkitBackgroundClip:    "text",
            WebkitTextFillColor:     "transparent",
            backgroundClip:          "text",
          }}
        >
          klikajnasyma
        </motion.h1>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize:   "14px",
            color:      "#999",
            textAlign:  "center",
            lineHeight: 1.65,
          }}
        >
          Twórca treści · TikTok &amp; Discord
          <br />
          <span style={{ color: "#ff8c00", fontWeight: 600 }}>
            klikajnasyma.pl
          </span>
        </motion.p>

        {/* Summer badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "7px",
            padding:        "7px 18px",
            borderRadius:   "999px",
            background:     "rgba(255,255,255,0.62)",
            border:         "1.5px solid rgba(255,185,65,0.38)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            fontSize:       "12px",
            fontWeight:     600,
            color:          "#cc6000",
            boxShadow:      "0 2px 16px rgba(255,160,60,0.14)",
            userSelect:     "none",
          }}
        >
          <span>☀️</span>
          <span>Lato 2026</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Aktywny twórca</span>
        </motion.div>

      </section>

      {/* ══════════════════════════════════════════════
          DIVIDER
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
        style={{
          margin:     "2.2rem 0 2rem",
          width:      "100%",
          maxWidth:   "24rem",
          height:     "1px",
          background: "linear-gradient(to right, transparent, rgba(255,165,60,0.35), transparent)",
          transformOrigin: "center",
        }}
      />

      {/* ══════════════════════════════════════════════
          LINKS SECTION
      ══════════════════════════════════════════════ */}
      <section
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "12px",
          width:         "100%",
          maxWidth:      "24rem",
        }}
      >
        {LINKS.map((link) => (
          <LinkCard
            key={link.href}
            href={link.href}
            label={link.label}
            sublabel={link.sublabel}
            icon={link.icon}
            iconBg={link.iconBg}
            delay={link.delay}
          />
        ))}
      </section>

      {/* ══════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.84, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop:           "2.2rem",
          display:             "flex",
          width:               "100%",
          maxWidth:            "24rem",
          borderRadius:        "18px",
          overflow:            "hidden",
          border:              "1.5px solid rgba(255,255,255,0.75)",
          backdropFilter:      "blur(18px)",
          WebkitBackdropFilter:"blur(18px)",
          background:          "rgba(255,255,255,0.38)",
          boxShadow:           "0 4px 24px rgba(255,160,60,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              flex:           1,
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              padding:        "16px 8px",
              gap:            "3px",
              background:     "rgba(255,255,255,0.42)",
              borderRight:    i < STATS.length - 1
                                ? "1px solid rgba(255,175,60,0.15)"
                                : "none",
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1 }}>
              {stat.emoji}
            </span>
            <span
              style={{
                fontSize:      "13px",
                fontWeight:    700,
                color:         "#cc5f00",
                letterSpacing: "-0.02em",
                marginTop:     "2px",
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize:   "10px",
                color:      "#aaa",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

{/* ── Support Goal ────────────────────────────── */}
<div style={{ marginTop: "1rem", width: "100%", maxWidth: "24rem" }}>
  <SupportGoal />
</div>

      {/* ══════════════════════════════════════════════
          SOCIAL HINT
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop:    "1.8rem",
          display:      "flex",
          alignItems:   "center",
          gap:          "10px",
          width:        "100%",
          maxWidth:     "24rem",
          padding:      "13px 18px",
          borderRadius: "14px",
          background:   "rgba(255,255,255,0.42)",
          border:       "1.5px solid rgba(255,255,255,0.80)",
          backdropFilter:      "blur(16px)",
          WebkitBackdropFilter:"blur(16px)",
          boxShadow:    "0 2px 14px rgba(255,150,50,0.08)",
        }}
      >
        <div
          style={{
            flexShrink:     0,
            width:          "36px",
            height:         "36px",
            borderRadius:   "10px",
            background:     "linear-gradient(135deg, #ffcc02, #ff9500)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       "18px",
            boxShadow:      "0 3px 10px rgba(255,160,0,0.25)",
          }}
        >
          🎬
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize:   "13px",
              fontWeight: 600,
              color:      "#333",
              lineHeight: 1.3,
            }}
          >
            Obserwuj na TikToku
          </div>
          <div
            style={{
              fontSize: "11px",
              color:    "#aaa",
              marginTop: "2px",
            }}
          >
            @klikajnasyma
          </div>
        </div>
        <div style={{ color: "#ffaa00", fontSize: "18px" }}>→</div>
      </motion.div>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.15 }}
        style={{
          marginTop:  "3rem",
          fontSize:   "11px",
          color:      "#c0a080",
          textAlign:  "center",
          userSelect: "none",
          lineHeight: 1.7,
        }}
      >
        <div>© {new Date().getFullYear()} klikajnasyma.pl</div>
        <div style={{ marginTop: "2px", opacity: 0.6 }}>
          Made with ☀️ &amp; 💛
        </div>
      </motion.footer>

    </main>
  );
}