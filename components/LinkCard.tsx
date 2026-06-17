"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

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
  badge?:    string;       // opcjonalny badge np. "HOT" "NOWE"
  pulse?:    boolean;      // czy ikona ma pulsować
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

  function onReset() { rawX.set(0); rawY.set(0); }

  return { rotateX, rotateY, glareX, glareY, onMouseMove, onReset };
}

/* ══════════════════════════════════════════════════════
   ARROW
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
   EXTERNAL BADGE
══════════════════════════════════════════════════════ */

function ExtIcon() {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ marginLeft: "4px", opacity: 0.40, flexShrink: 0 }}
    >
      <path
        d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6"
        stroke="currentColor" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   PARTICLE — losowe iskierki przy hover
══════════════════════════════════════════════════════ */

interface Particle { id: number; x: number; y: number; angle: number; }

function Particles({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generuj cząsteczki gdy active zmienia się na true
  useState(() => {
    if (active) {
      const p = Array.from({ length: 6 }, (_, i) => ({
        id:    i,
        x:     40 + Math.random() * 20,
        y:     50,
        angle: (i / 6) * 360,
      }));
      setParticles(p);
    } else {
      setParticles([]);
    }
  });

  return (
    <AnimatePresence>
      {active && particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0, x: "48px", y: "24px" }}
          animate={{
            opacity: [1, 0.8, 0],
            scale:   [0, 1, 0.5],
            x:       `${p.x + Math.cos(p.angle) * 30}px`,
            y:       `${p.y + Math.sin(p.angle) * 20}px`,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: p.id * 0.04 }}
          style={{
            position:     "absolute",
            width:        "5px",
            height:       "5px",
            borderRadius: "50%",
            background:   `hsl(${30 + p.id * 12}, 100%, 65%)`,
            pointerEvents:"none",
            zIndex:       10,
          }}
        />
      ))}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════
   LINK CARD — MAIN
══════════════════════════════════════════════════════ */

export default function LinkCard({
  href,
  label,
  sublabel,
  icon,
  iconBg,
  delay   = 0,
  badge,
  pulse   = false,
}: LinkCardProps) {
  const { ripples, addRipple }                 = useRipple();
  const { rotateX, rotateY, glareX, glareY,
          onMouseMove, onReset }               = useTilt();
  const [hovered, setHovered]                  = useState(false);
  const [clicked, setClicked]                  = useState(false);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    addRipple(e);
    setClicked(true);
    // Haptic na mobile
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
      }}
      whileHover={{ scale: 1.028 }}
      whileTap={{   scale: 0.972 }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { onReset(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      onClick={handleClick}
      aria-label={label}
    >
      {/* ─── Outer glow (za kartą, nie na niej) ───── */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0,
          scale:   hovered ? 1 : 0.85,
        }}
        transition={{ duration: 0.35 }}
        style={{
          position:     "absolute",
          inset:        "-6px",
          borderRadius: "28px",
          background:   `${iconBg.includes("gradient") ? iconBg : `linear-gradient(135deg, ${iconBg}, transparent)`}`,
          filter:       "blur(18px)",
          opacity:      0.22,
          zIndex:       -1,
          pointerEvents:"none",
        }}
      />

      {/* ─── Card shell ──────────────────────────── */}
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
          transition:          "background 0.25s, border 0.25s, box-shadow 0.25s",
        }}
      >

        {/* ── Glare — podąża za kursorem ─────────── */}
        <motion.div
          style={{
            position:      "absolute",
            inset:         0,
            borderRadius:  "22px",
            background:    `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28) 0%, transparent 65%)`,
            opacity:       hovered ? 1 : 0,
            pointerEvents: "none",
            zIndex:        1,
            transition:    "opacity 0.3s",
          }}
        />

        {/* ── Shimmer sweep on enter ─────────────── */}
        <motion.div
          initial={{ x: "-110%", opacity: 0 }}
          animate={{
            x:       hovered ? ["−110%", "210%"] : "-110%",
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position:      "absolute",
            top:           0, left: 0,
            width:         "55%",
            height:        "100%",
            background:    "linear-gradient(105deg, transparent, rgba(255,255,255,0.52), transparent)",
            pointerEvents: "none",
            zIndex:        2,
          }}
        />

        {/* ── Top edge highlight ─────────────────── */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position:      "absolute",
            top:           0, left: "15%",
            width:         "70%",
            height:        "1px",
            background:    "linear-gradient(to right, transparent, rgba(255,210,80,0.85), transparent)",
            pointerEvents: "none",
            zIndex:        2,
          }}
        />

        {/* ── Bottom edge shadow line ────────────── */}
        <motion.div
          animate={{ opacity: hovered ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position:      "absolute",
            bottom:        0, left: "20%",
            width:         "60%",
            height:        "1px",
            background:    "linear-gradient(to right, transparent, rgba(255,150,50,0.4), transparent)",
            pointerEvents: "none",
            zIndex:        2,
          }}
        />

        {/* ── Ripples ────────────────────────────── */}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.45 }}
            animate={{ scale: 1, opacity: 0    }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{
              position:     "absolute",
              left:         r.x,
              top:          r.y,
              width:        r.size,
              height:       r.size,
              borderRadius: "50%",
              background:   "rgba(255,180,60,0.22)",
              pointerEvents:"none",
              zIndex:       3,
            }}
          />
        ))}

        {/* ── ICON BADGE ─────────────────────────── */}
        <div style={{ position: "relative", flexShrink: 0, zIndex: 4 }}>
          {/* Pulsing ring (opcjonalne) */}
          {pulse && (
            <motion.div
              animate={{
                scale:   [1, 1.55, 1],
                opacity: [0.5, 0,   0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position:     "absolute",
                inset:        "-5px",
                borderRadius: "18px",
                background:   iconBg,
                filter:       "blur(2px)",
                zIndex:       -1,
              }}
            />
          )}

          <motion.div
            animate={{
              scale:  hovered ? 1.10 : 1,
              rotate: hovered ? [0, -7, 7, -3, 0] : 0,
              boxShadow: hovered
                ? ["0 4px 14px rgba(0,0,0,0.18)", "0 8px 24px rgba(0,0,0,0.22)"]
                : "0 3px 10px rgba(0,0,0,0.12)",
            }}
            transition={{
              scale:     { duration: 0.28, ease: "easeOut" },
              rotate:    { duration: 0.5,  ease: "easeInOut", delay: 0.04 },
              boxShadow: { duration: 0.28 },
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
            }}
          >
            {/* Gloss overlay na ikonie */}
            <div
              style={{
                position:     "absolute",
                top:          0, left: 0,
                width:        "100%",
                height:       "50%",
                borderRadius: "15px 15px 0 0",
                background:   "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)",
                pointerEvents:"none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>{icon}</div>
          </motion.div>

          {/* ── Badge (HOT / NOWE) ─────────────── */}
          {badge && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -8  }}
              transition={{ delay: delay + 0.3, type: "spring", stiffness: 260 }}
              style={{
                position:     "absolute",
                top:          "-8px",
                right:        "-10px",
                background:   "linear-gradient(135deg,#ff4757,#ff6b81)",
                color:        "#fff",
                fontSize:     "8px",
                fontWeight:   800,
                padding:      "2px 5px",
                borderRadius: "6px",
                boxShadow:    "0 2px 8px rgba(255,70,87,0.5)",
                letterSpacing:"0.04em",
                textTransform:"uppercase",
                border:       "1.5px solid rgba(255,255,255,0.9)",
                whiteSpace:   "nowrap",
                zIndex:       5,
              }}
            >
              {badge}
            </motion.div>
          )}
        </div>

        {/* ── TEXT ───────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, zIndex: 4 }}>
          {/* Label */}
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "0px",
            }}
          >
            <motion.span
              animate={{ color: hovered ? "#111" : "#2a2a2a" }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize:     "15.5px",
                fontWeight:   700,
                lineHeight:   1.3,
                whiteSpace:   "nowrap",
                overflow:     "hidden",
                textOverflow: "ellipsis",
                letterSpacing:"-0.015em",
              }}
            >
              {label}
            </motion.span>
            <ExtIcon />
          </div>

          {/* Sublabel */}
          <AnimatePresence>
            {sublabel && (
              <motion.div
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: hovered ? 0.80 : 0.50, y: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  fontSize:     "11.5px",
                  color:        "#999",
                  marginTop:    "3px",
                  whiteSpace:   "nowrap",
                  overflow:     "hidden",
                  textOverflow: "ellipsis",
                  letterSpacing:"0.01em",
                }}
              >
                {sublabel}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated underline on hover */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height:          "1.5px",
              marginTop:       "4px",
              background:      "linear-gradient(to right, rgba(255,160,50,0.8), transparent)",
              borderRadius:    "999px",
              transformOrigin: "left",
              width:           "70%",
            }}
          />
        </div>

        {/* ── ARROW ──────────────────────────────── */}
        <motion.div
          animate={{
            x: hovered ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
            animate={{ color: hovered ? "#ff8c00" : "#ddd" }}
            transition={{ duration: 0.22 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Arrow />
          </motion.div>
        </motion.div>

      </div>

      {/* ── Click feedback overlay ─────────────────── */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position:      "absolute",
              inset:         0,
              borderRadius:  "22px",
              background:    "rgba(255,200,80,0.15)",
              pointerEvents: "none",
              zIndex:        10,
            }}
          />
        )}
      </AnimatePresence>
    </motion.a>
  );
}