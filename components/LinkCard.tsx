"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, type ReactNode } from "react";
import { useTrackClick } from "@/hooks/useTrackClick";

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */

interface LinkCardProps {
  href:      string;
  label:     string;
  sublabel?: string;
  icon:      ReactNode;
  iconBg:    string;
  delay?:    number;
  badge?:    string;
  pulse?:    boolean;
}

/* ══════════════════════════════════════════════════════
   RIPPLE HOOK
══════════════════════════════════════════════════════ */

interface Ripple { id: number; x: number; y: number; size: number; }

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function addRipple(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.0;
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;
    const id   = Date.now() + Math.random();
    setRipples((p) => [...p, { id, x, y, size }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 750);
  }

  return { ripples, addRipple };
}

/* ══════════════════════════════════════════════════════
   3D TILT HOOK
══════════════════════════════════════════════════════ */

function useTilt() {
  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const glareX  = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY  = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
  }

  function onReset() {
    rawX.set(0);
    rawY.set(0);
  }

  return { rotateX, rotateY, glareX, glareY, onMouseMove, onReset };
}

/* ══════════════════════════════════════════════════════
   ARROW ICON
══════════════════════════════════════════════════════ */

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.5 8h11M10 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   EXTERNAL ICON
══════════════════════════════════════════════════════ */

function ExtIcon() {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ marginLeft: "4px", opacity: 0.38, flexShrink: 0 }}
    >
      <path
        d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   LINK CARD
══════════════════════════════════════════════════════ */

export default function LinkCard({
  href,
  label,
  sublabel,
  icon,
  iconBg,
  delay  = 0,
  badge,
  pulse  = false,
}: LinkCardProps) {
  const { ripples, addRipple } = useRipple();
  const {
    rotateX, rotateY,
    glareX,  glareY,
    onMouseMove, onReset,
  } = useTilt();

  const trackClick           = useTrackClick();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  /* ── glare background — obliczony jako string ── */
  const [glarePos, setGlarePos] = useState("50% 50%");

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    onMouseMove(e);
    const r  = e.currentTarget.getBoundingClientRect();
    const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    setGlarePos(`${gx}% ${gy}%`);
  }

  function handleMouseLeave() {
    onReset();
    setHovered(false);
    setGlarePos("50% 50%");
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    addRipple(e);
    trackClick(label);
    setClicked(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
    setTimeout(() => setClicked(false), 600);
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        textDecoration: "none",
        display:        "block",
        borderRadius:   "22px",
        outline:        "none",
        position:       "relative",
        WebkitTapHighlightColor: "transparent",
      }}
      whileHover={{ scale: 1.028 }}
      whileTap={{   scale: 0.972 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={handleClick}
    >

      {/* ── Outer glow ─────────────────────────────── */}
      <motion.div
        animate={{ opacity: hovered ? 0.22 : 0, scale: hovered ? 1 : 0.88 }}
        transition={{ duration: 0.32 }}
        style={{
          position:      "absolute",
          inset:         "-6px",
          borderRadius:  "28px",
          background:    iconBg,
          filter:        "blur(20px)",
          zIndex:        -1,
          pointerEvents: "none",
        }}
      />

      {/* ── Card shell ─────────────────────────────── */}
      <div
        style={{
          position:            "relative",
          overflow:            "hidden",
          borderRadius:        "22px",
          padding:             "14px 16px",
          display:             "flex",
          alignItems:          "center",
          gap:                 "14px",
          background:          hovered
            ? "rgba(255,255,255,0.72)"
            : "rgba(255,255,255,0.52)",
          border:              hovered
            ? "1.5px solid rgba(255,210,120,0.60)"
            : "1.5px solid rgba(255,255,255,0.88)",
          backdropFilter:      "blur(26px)",
          WebkitBackdropFilter:"blur(26px)",
          boxShadow:           hovered
            ? "0 12px 48px rgba(255,140,50,0.22), 0 3px 12px rgba(0,0,0,0.08), inset 0 1.5px 0 rgba(255,255,255,0.98)"
            : "0 4px 24px rgba(255,150,50,0.09), 0 1px 5px rgba(0,0,0,0.05), inset 0 1.5px 0 rgba(255,255,255,0.95)",
          transition:          "background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
        }}
      >

        {/* ── Glare — state zamiast MotionValue jako CSS ── */}
        <div
          style={{
            position:      "absolute",
            inset:         0,
            borderRadius:  "22px",
            background:    `radial-gradient(circle at ${glarePos}, rgba(255,255,255,0.26) 0%, transparent 62%)`,
            opacity:       hovered ? 1 : 0,
            pointerEvents: "none",
            zIndex:        1,
            transition:    "opacity 0.3s ease",
          }}
        />

        {/* ── Shimmer sweep ───────────────────────── */}
        <motion.div
          animate={{
            x:       hovered ? "220%" : "-110%",
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position:      "absolute",
            top:           0, left: 0,
            width:         "55%",
            height:        "100%",
            background:    "linear-gradient(105deg, transparent, rgba(255,255,255,0.48), transparent)",
            pointerEvents: "none",
            zIndex:        2,
          }}
        />

        {/* ── Top edge glow ───────────────────────── */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          style={{
            position:      "absolute",
            top:           0, left: "15%",
            width:         "70%",
            height:        "1px",
            background:    "linear-gradient(to right, transparent, rgba(255,210,80,0.80), transparent)",
            pointerEvents: "none",
            zIndex:        2,
          }}
        />

        {/* ── Ripples ─────────────────────────────── */}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0   }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position:      "absolute",
              left:          r.x,
              top:           r.y,
              width:         r.size,
              height:        r.size,
              borderRadius:  "50%",
              background:    "rgba(255,180,60,0.20)",
              pointerEvents: "none",
              zIndex:        3,
            }}
          />
        ))}

        {/* ── ICON ────────────────────────────────── */}
        <div style={{ position: "relative", flexShrink: 0, zIndex: 4 }}>

          {/* Pulse ring */}
          {pulse && (
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position:     "absolute",
                inset:        "-5px",
                borderRadius: "19px",
                background:   iconBg,
                filter:       "blur(3px)",
                zIndex:       -1,
              }}
            />
          )}

          <motion.div
            animate={{
              scale:  hovered ? 1.10 : 1,
              rotate: hovered ? [0, -7, 7, -3, 0] : 0,
            }}
            transition={{
              scale:  { duration: 0.26, ease: "easeOut"   },
              rotate: { duration: 0.48, ease: "easeInOut", delay: 0.04 },
            }}
            style={{
              width:          "50px",
              height:         "50px",
              borderRadius:   "15px",
              background:     iconBg,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              color:          "#fff",
              position:       "relative",
              overflow:       "hidden",
              boxShadow:      hovered
                ? "0 8px 22px rgba(0,0,0,0.20)"
                : "0 3px 10px rgba(0,0,0,0.12)",
              transition:     "box-shadow 0.26s ease",
            }}
          >
            {/* Gloss */}
            <div
              style={{
                position:      "absolute",
                top: 0, left: 0,
                width:         "100%",
                height:        "50%",
                borderRadius:  "15px 15px 0 0",
                background:    "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              {icon}
            </div>
          </motion.div>

          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: -8  }}
              transition={{ delay: delay + 0.28, type: "spring", stiffness: 260, damping: 16 }}
              style={{
                position:      "absolute",
                top:           "-8px",
                right:         "-10px",
                background:    "linear-gradient(135deg, #ff4757, #ff6b81)",
                color:         "#fff",
                fontSize:      "9px",
                fontWeight:    800,
                padding:       "2px 6px",
                borderRadius:  "7px",
                boxShadow:     "0 2px 8px rgba(255,70,87,0.45)",
                letterSpacing: "0.03em",
                border:        "1.5px solid rgba(255,255,255,0.92)",
                whiteSpace:    "nowrap",
                zIndex:        5,
                lineHeight:    1.4,
              }}
            >
              {badge}
            </motion.div>
          )}
        </div>

        {/* ── TEXT ────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, zIndex: 4 }}>

          {/* Label row */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize:      "15.5px",
                fontWeight:    700,
                color:         hovered ? "#111" : "#2a2a2a",
                lineHeight:    1.3,
                whiteSpace:    "nowrap",
                overflow:      "hidden",
                textOverflow:  "ellipsis",
                letterSpacing: "-0.015em",
                transition:    "color 0.2s ease",
              }}
            >
              {label}
            </span>
            <ExtIcon />
          </div>

          {/* Sublabel */}
          {sublabel && (
            <div
              style={{
                fontSize:      "11.5px",
                color:         "#999",
                marginTop:     "3px",
                whiteSpace:    "nowrap",
                overflow:      "hidden",
                textOverflow:  "ellipsis",
                letterSpacing: "0.01em",
                opacity:       hovered ? 0.8 : 0.5,
                transition:    "opacity 0.22s ease",
              }}
            >
              {sublabel}
            </div>
          )}

          {/* Animated underline */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height:          "1.5px",
              marginTop:       "5px",
              background:      "linear-gradient(to right, rgba(255,160,50,0.85), transparent)",
              borderRadius:    "999px",
              transformOrigin: "left",
              width:           "68%",
            }}
          />
        </div>

        {/* ── ARROW ───────────────────────────────── */}
        <motion.div
          animate={{ x: hovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          style={{
            flexShrink:     0,
            zIndex:         4,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            position:       "relative",
          }}
        >
          {/* Arrow pill bg */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.22 }}
            style={{
              position:     "absolute",
              inset:        "-7px -9px",
              borderRadius: "999px",
              background:   "rgba(255,160,50,0.13)",
            }}
          />
          <motion.div
            animate={{ color: hovered ? "#ff8c00" : "#ccc" }}
            transition={{ duration: 0.22 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Arrow />
          </motion.div>
        </motion.div>

      </div>

      {/* ── Click flash overlay ────────────────────── */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0    }}
            exit={{    opacity: 0    }}
            transition={{ duration: 0.5 }}
            style={{
              position:      "absolute",
              inset:         0,
              borderRadius:  "22px",
              background:    "rgba(255,200,80,0.16)",
              pointerEvents: "none",
              zIndex:        10,
            }}
          />
        )}
      </AnimatePresence>

    </motion.a>
  );
}