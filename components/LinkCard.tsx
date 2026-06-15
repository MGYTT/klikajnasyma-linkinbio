"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */

interface LinkCardProps {
  href:      string;
  label:     string;
  sublabel?: string;
  icon:      ReactNode;
  iconBg:    string;
  delay?:    number;
}

/* ═══════════════════════════════════════════════════════
   RIPPLE EFFECT HOOK
═══════════════════════════════════════════════════════ */

interface Ripple {
  id:   number;
  x:    number;
  y:    number;
  size: number;
}

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function addRipple(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;
    const id   = Date.now();

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  }

  return { ripples, addRipple };
}

/* ═══════════════════════════════════════════════════════
   3D TILT HOOK
═══════════════════════════════════════════════════════ */

function useTilt() {
  const ref        = useRef<HTMLAnchorElement>(null);
  const rawX       = useMotionValue(0);
  const rawY       = useMotionValue(0);
  const springX    = useSpring(rawX, { stiffness: 200, damping: 20 });
  const springY    = useSpring(rawY, { stiffness: 200, damping: 20 });
  const rotateX    = useTransform(springY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY    = useTransform(springX, [-0.5, 0.5], ["-4deg", "4deg"]);
  const brightness = useTransform(springX, [-0.5, 0, 0.5], [0.97, 1, 1.03]);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width  - 0.5);
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return { ref, rotateX, rotateY, brightness, onMouseMove, onMouseLeave };
}

/* ═══════════════════════════════════════════════════════
   ARROW ICON
═══════════════════════════════════════════════════════ */

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 7.5h10M9 3.5l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   EXTERNAL LINK BADGE
═══════════════════════════════════════════════════════ */

function ExternalBadge() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", marginLeft: "4px", opacity: 0.45 }}
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

/* ═══════════════════════════════════════════════════════
   LINK CARD COMPONENT
═══════════════════════════════════════════════════════ */

export default function LinkCard({
  href,
  label,
  sublabel,
  icon,
  iconBg,
  delay = 0,
}: LinkCardProps) {
  const { ripples, addRipple }                   = useRipple();
  const { ref, rotateX, rotateY, brightness,
          onMouseMove, onMouseLeave }             = useTilt();
  const [hovered, setHovered]                    = useState(false);
  const [pressed, setPressed]                    = useState(false);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"

      /* ── Entry animation ── */
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}

      /* ── 3D tilt style ── */
      style={{
        rotateX,
        rotateY,
        filter:          `brightness(${brightness})`,
        transformStyle:  "preserve-3d",
        textDecoration:  "none",
        display:         "block",
        borderRadius:    "20px",
        perspective:     "800px",
      }}

      /* ── Hover / tap ── */
      whileHover={{ scale: 1.025 }}
      whileTap={{   scale: 0.975 }}

      /* ── Events ── */
      onMouseMove={onMouseMove}
      onMouseLeave={() => { onMouseLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={addRipple}

      /* ── Accessibility ── */
      aria-label={label}
    >
      {/* ── Card shell ───────────────────────────────── */}
      <div
        style={{
          position:            "relative",
          overflow:            "hidden",
          borderRadius:        "20px",
          padding:             "15px 18px",
          display:             "flex",
          alignItems:          "center",
          gap:                 "14px",
          background:          hovered
            ? "rgba(255,255,255,0.68)"
            : "rgba(255,255,255,0.50)",
          border:              hovered
            ? "1.5px solid rgba(255,210,120,0.55)"
            : "1.5px solid rgba(255,255,255,0.85)",
          backdropFilter:      "blur(24px)",
          WebkitBackdropFilter:"blur(24px)",
          boxShadow:           hovered
            ? `0 10px 48px rgba(255,140,50,0.20),
               0 2px  12px rgba(0,0,0,0.07),
               inset 0 1.5px 0 rgba(255,255,255,0.95)`
            : `0 4px  24px rgba(255,150,50,0.09),
               0 1px   5px rgba(0,0,0,0.05),
               inset 0 1.5px 0 rgba(255,255,255,0.95)`,
          transition: "background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
        }}
      >

        {/* ── Shimmer sweep on hover ─────────────────── */}
        <motion.div
          initial={{ x: "-110%" }}
          animate={{ x: hovered ? "210%" : "-110%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{
            position:   "absolute",
            top:        0,
            left:       0,
            width:      "55%",
            height:     "100%",
            background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            pointerEvents: "none",
            zIndex:     1,
          }}
        />

        {/* ── Top edge glow line ─────────────────────── */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position:     "absolute",
            top:          0,
            left:         "20%",
            width:        "60%",
            height:       "1px",
            background:   "linear-gradient(to right, transparent, rgba(255,200,80,0.7), transparent)",
            pointerEvents:"none",
            zIndex:       2,
          }}
        />

        {/* ── Ripples ───────────────────────────────── */}
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{
              position:     "absolute",
              left:         r.x,
              top:          r.y,
              width:        r.size,
              height:       r.size,
              borderRadius: "50%",
              background:   "rgba(255,170,60,0.18)",
              pointerEvents:"none",
              zIndex:       3,
              animation:    "rippleExpand 0.7s ease-out forwards",
            }}
          />
        ))}

        {/* ── Icon badge ────────────────────────────── */}
        <motion.div
          animate={{
            scale:  hovered ? 1.08 : 1,
            rotate: hovered ? [0, -6, 6, 0] : 0,
          }}
          transition={{
            scale:  { duration: 0.25, ease: "easeOut" },
            rotate: { duration: 0.45, ease: "easeInOut", delay: 0.05 },
          }}
          style={{
            flexShrink:     0,
            width:          "48px",
            height:         "48px",
            borderRadius:   "14px",
            background:     iconBg,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            color:          "#fff",
            boxShadow:      hovered
              ? "0 6px 20px rgba(0,0,0,0.18)"
              : "0 3px 10px rgba(0,0,0,0.12)",
            transition:     "box-shadow 0.25s ease",
            zIndex:         4,
            position:       "relative",
          }}
        >
          {/* Icon inner glow */}
          <div
            style={{
              position:   "absolute",
              inset:      0,
              borderRadius: "14px",
              background: "rgba(255,255,255,0.15)",
              opacity:    hovered ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          />
          {icon}
        </motion.div>

        {/* ── Text block ────────────────────────────── */}
        <div
          style={{
            flex:    1,
            minWidth: 0,
            zIndex:  4,
            position:"relative",
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize:       "15px",
              fontWeight:     600,
              color:          hovered ? "#1a1a2e" : "#2d2d2d",
              lineHeight:     1.3,
              whiteSpace:     "nowrap",
              overflow:       "hidden",
              textOverflow:   "ellipsis",
              letterSpacing:  "-0.01em",
              transition:     "color 0.2s ease",
              display:        "flex",
              alignItems:     "center",
            }}
          >
            {label}
            <ExternalBadge />
          </div>

          {/* Sublabel */}
          {sublabel && (
            <motion.div
              animate={{ opacity: hovered ? 0.75 : 0.5 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize:     "11.5px",
                color:        "#999",
                marginTop:    "3px",
                whiteSpace:   "nowrap",
                overflow:     "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "0.01em",
              }}
            >
              {sublabel}
            </motion.div>
          )}
        </div>

        {/* ── Arrow ─────────────────────────────────── */}
        <motion.div
          animate={{
            x:     hovered ? 3   : 0,
            color: hovered ? "#ff8c00" : "#ccc",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            flexShrink: 0,
            zIndex:     4,
            position:   "relative",
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Pill background on hover */}
          <motion.div
            animate={{
              opacity: hovered ? 1 : 0,
              scale:   hovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.22 }}
            style={{
              position:     "absolute",
              inset:        "-6px -8px",
              borderRadius: "999px",
              background:   "rgba(255,160,50,0.12)",
            }}
          />
          <ArrowIcon />
        </motion.div>

      </div>

      {/* ── Ripple keyframe ───────────────────────────── */}
      <style>{`
        @keyframes rippleExpand {
          0%   { transform: scale(0);   opacity: 1;   }
          100% { transform: scale(1);   opacity: 0;   }
        }
      `}</style>
    </motion.a>
  );
}