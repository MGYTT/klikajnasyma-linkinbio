"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LinkCard     from "@/components/LinkCard";
import Avatar       from "@/components/Avatar";
import SupportGoal  from "@/components/SupportGoal";
import DonateTicker from "@/components/DonateTicker";

/* ══════════════════════════════════════════════════════
   FLOATING EMOJIS
══════════════════════════════════════════════════════ */

interface EmojiItem {
  id: number; emoji: string; x: number;
  size: number; duration: number; delay: number;
}

const SUMMER_EMOJIS = ["☀️","🌊","🍋","🌸","⭐","🦋","🌺","✨","🍊","🌴"];

function FloatingEmojis() {
  const [items, setItems] = useState<EmojiItem[]>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: 10 }, (_, i) => ({
        id:       i,
        emoji:    SUMMER_EMOJIS[i % SUMMER_EMOJIS.length],
        x:        4 + (i * 9.4) % 88,
        size:     13 + (i * 3) % 13,
        duration: 12 + (i * 2.3) % 14,
        delay:    (i * 1.9) % 10,
      }))
    );
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position:       "absolute",
            left:           `${item.x}%`,
            bottom:         "-40px",
            fontSize:       `${item.size}px`,
            opacity:        0,
            animation:      `emojiFloat ${item.duration}s ease-in infinite`,
            animationDelay: `${item.delay}s`,
            userSelect:     "none",
            willChange:     "transform, opacity",
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style>{`
        @keyframes emojiFloat {
          0%   { transform: translateY(0px) rotate(0deg);     opacity: 0;   }
          6%   { opacity: 0.28; }
          88%  { opacity: 0.15; }
          100% { transform: translateY(-105vh) rotate(28deg); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════ */

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
               10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8
               s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86
               c-1.77-.45-2.34-.94-2.34-1.67 0-.84.78-1.43 2.03-1.43
               1.32 0 1.81.63 1.85 1.56h1.64c-.05-1.28-.83-2.46-2.38-2.84V5
               h-2v1.72c-1.43.3-2.58 1.21-2.58 2.61 0 1.67 1.38 2.5 3.4 3.01
               1.95.48 2.34 1.19 2.34 1.9 0 .54-.39 1.4-2.03 1.4
               -1.54 0-2.14-.69-2.22-1.56H9.5c.09 1.63 1.31 2.54 2.81 2.83
               V19h2v-1.71c1.44-.28 2.58-1.1 2.59-2.61
               -.01-2.07-1.77-2.79-3.59-3.24z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0
               0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0
               0-5.487 0 18.07 18.07 0 0 0-.617-1.25.077.077 0 0
               0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0
               0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0
               0 .031.057 2.053 2.053 0 0 0 .588.244 19.414 19.414 0 0
               0 2.595.638.076.076 0 0 0 .084-.026c.462-.63.874-1.295
               1.226-1.994a.076.076 0 0 0-.041-.106 19.574 19.574 0 0
               1-2.553-1.215.077.077 0 0 1-.008-.128 16.44 16.44 0 0
               0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793
               12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077
               0 0 1-.006.127 19.454 19.454 0 0 1-2.554 1.215.076.076 0 0
               0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0
               .084.028 19.522 19.522 0 0 0 2.596-.637.077.077 0 0 0
               .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0
               0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419
               0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42
               0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085
               -2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096
               2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   LINKS
══════════════════════════════════════════════════════ */

const LINKS = [
  {
    href:     "https://tipply.pl/@MGYT",
    label:    "Wesprzyj mnie",
    sublabel: "Postaw kawę przez Tipply ☕",
    icon:     <HeartIcon />,
    iconBg:   "linear-gradient(135deg, #ff6b6b, #ff8e53)",
    delay:    0.38,
    badge:    "💛",
    pulse:    true,
  },
  {
    href:     "https://www.tiktok.com/coin?rc=39K9KC8X",
    label:    "Tańsze Monety TikTok",
    sublabel: "Doładuj korzystniej przez mój link",
    icon:     <CoinIcon />,
    iconBg:   "linear-gradient(135deg, #ffd93d, #ff8c00)",
    delay:    0.52,
    badge:    "🔥",
    pulse:    false,
  },
  {
    href:     "https://discord.gg/AwaTdZ2Qqg",
    label:    "Dołącz na Discord",
    sublabel: "Serwer klikajnasyma",
    icon:     <DiscordIcon />,
    iconBg:   "linear-gradient(135deg, #4dd0e1, #0288d1)",
    delay:    0.66,
    badge:    undefined,
    pulse:    false,
  },
];

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main
      style={{ position: "relative", zIndex: 2 }}
      className="flex flex-col items-center min-h-dvh w-full px-4 sm:px-6 py-12 sm:py-18"
    >
      <FloatingEmojis />

      {/* ── Donate Ticker ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0   }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: "24rem", marginBottom: "1.6rem" }}
      >
        <DonateTicker />
      </motion.div>

      {/* ══ PROFILE ════════════════════════════════ */}
      <section className="flex flex-col items-center gap-4 w-full max-w-sm">

        <Avatar />

        {/* ── Nazwa — biała z delikatnym cieniem ── */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.58, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily:   "var(--font-syne), sans-serif",
            fontWeight:   900,
            fontSize:     "clamp(2.1rem, 9vw, 2.8rem)",
            letterSpacing:"-0.028em",
            textAlign:    "center",
            lineHeight:   1.1,
            color:        "#ffffff",
            textShadow:   "0 2px 24px rgba(255,140,60,0.35), 0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          klikajnasyma
        </motion.h1>

        {/* ── Bio ──────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize:   "13.5px",
            color:      "#999",
            textAlign:  "center",
            lineHeight: 1.7,
            margin:     0,
          }}
        >
          Twórca treści · TikTok &amp; Discord
          <br />
          <span style={{ color: "#ff8c00", fontWeight: 700 }}>
            klikajnasyma.pl
          </span>
        </motion.p>

        {/* ── Lato badge ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 6 }}
          animate={{ opacity: 1, scale: 1,    y: 0 }}
          transition={{ duration: 0.48, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display:             "inline-flex",
            alignItems:          "center",
            gap:                 "7px",
            padding:             "7px 18px",
            borderRadius:        "999px",
            background:          "rgba(255,255,255,0.58)",
            border:              "1.5px solid rgba(255,190,70,0.36)",
            backdropFilter:      "blur(14px)",
            WebkitBackdropFilter:"blur(14px)",
            fontSize:            "12px",
            fontWeight:          600,
            color:               "#cc6000",
            boxShadow:           "0 3px 16px rgba(255,160,60,0.12)",
            userSelect:          "none",
          }}
        >
          <span>☀️</span>
          <span>Lato 2026</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>Aktywny twórca</span>
        </motion.div>

      </section>

      {/* ══ DIVIDER ════════════════════════════════ */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
        style={{
          margin:          "2rem 0 1.8rem",
          width:           "100%",
          maxWidth:        "24rem",
          height:          "1px",
          background:      "linear-gradient(to right, transparent, rgba(255,165,60,0.32), transparent)",
          transformOrigin: "center",
        }}
      />

      {/* ══ LINKS ══════════════════════════════════ */}
      <section
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "11px",
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
            badge={link.badge}
            pulse={link.pulse}
          />
        ))}
      </section>

      {/* ══ SUPPORT GOAL ═══════════════════════════ */}
      <div style={{ marginTop: "1.8rem", width: "100%", maxWidth: "24rem" }}>
        <SupportGoal />
      </div>

      {/* ══ FOOTER ═════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        style={{
          marginTop:  "3rem",
          fontSize:   "11px",
          color:      "#c0a080",
          textAlign:  "center",
          userSelect: "none",
          lineHeight: 1.8,
        }}
      >
        <div>© {new Date().getFullYear()} klikajnasyma.pl</div>
        <div style={{ opacity: 0.6, marginTop: "2px" }}>Made with ☀️ &amp; 💛</div>
      </motion.footer>

    </main>
  );
}