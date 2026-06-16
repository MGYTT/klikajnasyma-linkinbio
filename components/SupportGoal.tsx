"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */

interface Supporter {
  name:   string;
  emoji:  string;
  amount: string;
  time:   string;
}

interface GoalData {
  current:    number;
  target:     number;
  label:      string;
  reward:     string;
  currency:   string;
  supporters: Supporter[];
}

/* ═══════════════════════════════════════════════════════
   FALLBACK DATA (gdy JSON niedostępny)
═══════════════════════════════════════════════════════ */

const FALLBACK: GoalData = {
  current:  21,
  target:   400,
  label:    "Upgrade Stanowiska 🎙️",
  reward:   "Dziękuję każdej osobie za wsparcie! Razem dojedziemy do celu 🚀",
  currency: "PLN",
  supporters: [
    { name: "Iza",        emoji: "🔥", amount: "5,00 PLN", time: "rok temu" },
    { name: "Akwasowiec", emoji: "💛", amount: "6,00 PLN", time: "rok temu" },
    { name: "Mdz",        emoji: "⭐", amount: "5,00 PLN", time: "rok temu" },
    { name: "Iza",        emoji: "🌊", amount: "5,00 PLN", time: "rok temu" },
  ],
};

/* ═══════════════════════════════════════════════════════
   ANIMATED AMOUNT
═══════════════════════════════════════════════════════ */

function AnimatedAmount({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const spring    = useSpring(motionVal, { stiffness: 55, damping: 16 });
  const displayed = useTransform(spring, (v) => v.toFixed(2));
  const [display, setDisplay] = useState("0.00");

  useEffect(() => {
    const timeout = setTimeout(() => motionVal.set(value), 400);
    return () => clearTimeout(timeout);
  }, [value, motionVal]);

  useEffect(() => {
    return displayed.on("change", setDisplay);
  }, [displayed]);

  const [intPart, decPart] = display.split(".");

  return (
    <>
      <span>{intPart}</span>
      <span style={{ fontSize: "clamp(1rem, 4vw, 1.3rem)", opacity: 0.55, fontWeight: 700 }}>
        ,{decPart}
      </span>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   MILESTONE MARKER
═══════════════════════════════════════════════════════ */

function MilestoneMarker({
  pct,
  reached,
  label,
}: {
  pct:     number;
  reached: boolean;
  label:   string;
}) {
  return (
    <div
      style={{
        position:  "absolute",
        left:      `${Math.min(pct, 98)}%`,
        top:       "50%",
        transform: "translate(-50%, -50%)",
        zIndex:    3,
      }}
    >
      <motion.div
        animate={{
          background: reached
            ? "linear-gradient(135deg, #ff8c00, #ff5722)"
            : "rgba(0,0,0,0.10)",
          boxShadow: reached
            ? "0 0 12px rgba(255,140,0,0.55)"
            : "none",
        }}
        transition={{ duration: 0.5 }}
        style={{
          width:        "13px",
          height:       "13px",
          borderRadius: "50%",
          border:       reached
            ? "2px solid rgba(255,255,255,0.95)"
            : "2px solid rgba(0,0,0,0.12)",
        }}
      />
      <div
        style={{
          position:      "absolute",
          top:           "16px",
          left:          "50%",
          transform:     "translateX(-50%)",
          fontSize:      "9px",
          color:         reached ? "#ff8c00" : "#ccc",
          fontWeight:    700,
          whiteSpace:    "nowrap",
          transition:    "color 0.3s",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUPPORTER PILL
═══════════════════════════════════════════════════════ */

function SupporterPill({ supporter, index }: { supporter: Supporter; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0   }}
      transition={{ duration: 0.4, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:             "flex",
        alignItems:          "center",
        gap:                 "9px",
        padding:             "8px 11px",
        borderRadius:        "12px",
        background:          hovered
          ? "rgba(255,255,255,0.78)"
          : "rgba(255,255,255,0.52)",
        border:              hovered
          ? "1px solid rgba(255,200,80,0.4)"
          : "1px solid rgba(255,255,255,0.82)",
        backdropFilter:      "blur(10px)",
        WebkitBackdropFilter:"blur(10px)",
        boxShadow:           hovered
          ? "0 4px 16px rgba(255,150,50,0.12)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition:          "background 0.2s, border 0.2s, box-shadow 0.2s",
        cursor:              "default",
      }}
    >
      <div
        style={{
          width:          "30px",
          height:         "30px",
          borderRadius:   "9px",
          background:     "rgba(255,200,80,0.15)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "15px",
          flexShrink:     0,
          border:         "1px solid rgba(255,200,80,0.2)",
        }}
      >
        {supporter.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize:      "12px",
            fontWeight:    600,
            color:         "#333",
            whiteSpace:    "nowrap",
            overflow:      "hidden",
            textOverflow:  "ellipsis",
            letterSpacing: "-0.01em",
          }}
        >
          {supporter.name}
        </div>
        <div style={{ fontSize: "10px", color: "#c0a070", marginTop: "1px", fontWeight: 500 }}>
          {supporter.time}
        </div>
      </div>

      <motion.div
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.2 }}
        style={{
          fontSize:      "11px",
          fontWeight:    700,
          color:         "#ff8c00",
          background:    "rgba(255,140,0,0.10)",
          border:        "1px solid rgba(255,140,0,0.18)",
          padding:       "3px 8px",
          borderRadius:  "999px",
          whiteSpace:    "nowrap",
          flexShrink:    0,
          letterSpacing: "-0.01em",
        }}
      >
        +{supporter.amount}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CIRCULAR PROGRESS ARC
═══════════════════════════════════════════════════════ */

function CircularProgress({ pct }: { pct: number }) {
  const radius      = 28;
  const stroke      = 4;
  const normalised  = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const offset      = circumference * (1 - Math.min(pct, 1));

  return (
    <svg width={radius * 2} height={radius * 2} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={radius} cy={radius} r={normalised}
        fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={stroke} />
      <motion.circle
        cx={radius} cy={radius} r={normalised}
        fill="none" stroke="url(#arcGrad)"
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ffd93d" />
          <stop offset="50%"  stopColor="#ff8c00" />
          <stop offset="100%" stopColor="#ff5722" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   LOADING SKELETON
═══════════════════════════════════════════════════════ */

function Skeleton() {
  return (
    <div
      style={{
        borderRadius:         "22px",
        background:           "rgba(255,255,255,0.45)",
        border:               "1.5px solid rgba(255,255,255,0.85)",
        backdropFilter:       "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding:              "20px 16px",
        display:              "flex",
        flexDirection:        "column",
        gap:                  "12px",
      }}
    >
      {[80, 100, 60, 40].map((w, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
          style={{
            height:       "12px",
            width:        `${w}%`,
            borderRadius: "999px",
            background:   "rgba(255,180,60,0.15)",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUPPORT GOAL — MAIN
═══════════════════════════════════════════════════════ */

export default function SupportGoal() {
  const [data,           setData]           = useState<GoalData | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [showSupporters, setShowSupporters] = useState(false);
  const [lastUpdated,    setLastUpdated]    = useState<string>("");

  /* ── Fetch JSON ───────────────────────────────────── */
  useEffect(() => {
    const load = () => {
      fetch(`/support-goal.json?t=${Date.now()}`) // cache bust
        .then((r) => {
          if (!r.ok) throw new Error("fetch failed");
          return r.json();
        })
        .then((json: GoalData) => {
          setData(json);
          setLastUpdated(new Date().toLocaleTimeString("pl-PL", {
            hour:   "2-digit",
            minute: "2-digit",
          }));
          setLoading(false);
        })
        .catch(() => {
          setData(FALLBACK);
          setLoading(false);
        });
    };

    load();

    // Auto-refresh co 60 sekund
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  /* ── Loading state ────────────────────────────────── */
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.58, delay: 0.96 }}
        style={{ width: "100%", maxWidth: "24rem" }}
      >
        <Skeleton />
      </motion.div>
    );
  }

  const goal      = data!;
  const pct       = goal.current / goal.target;
  const pctDisp   = Math.round(pct * 100);
  const remaining = +(goal.target - goal.current).toFixed(2);

  /* ── Milestones (dynamiczne na podstawie targetu) ── */
  const milestones = [
    { pct: 25,  value: goal.target * 0.25, label: `${goal.target * 0.25} zł`  },
    { pct: 50,  value: goal.target * 0.50, label: `${goal.target * 0.50} zł`  },
    { pct: 75,  value: goal.target * 0.75, label: `${goal.target * 0.75} zł`  },
    { pct: 100, value: goal.target,        label: `${goal.target} 🏆`          },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.58, delay: 0.96, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: "24rem" }}
    >
      <div
        style={{
          borderRadius:         "22px",
          background:           "rgba(255,255,255,0.50)",
          border:               "1.5px solid rgba(255,255,255,0.88)",
          backdropFilter:       "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:            "0 6px 32px rgba(255,150,50,0.12), inset 0 1.5px 0 rgba(255,255,255,0.95)",
          overflow:             "hidden",
        }}
      >

        {/* ══ TOP BANNER ══════════════════════════════ */}
        <div
          style={{
            background:   "linear-gradient(135deg, rgba(255,210,80,0.20), rgba(255,120,50,0.13))",
            padding:      "13px 16px 11px",
            borderBottom: "1px solid rgba(255,210,80,0.18)",
            display:      "flex",
            alignItems:   "center",
            gap:          "8px",
          }}
        >
          <span style={{ fontSize: "17px" }}>🎯</span>
          <span
            style={{
              fontSize:      "12px",
              fontWeight:    700,
              color:         "#cc5500",
              letterSpacing: "-0.01em",
              flex:          1,
            }}
          >
            {goal.label}
          </span>

          {/* Last updated indicator */}
          {lastUpdated && (
            <span
              style={{
                fontSize:   "9px",
                color:      "#ccc",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              ↻ {lastUpdated}
            </span>
          )}

          {/* Pulsing % badge */}
          <motion.div
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontSize:     "11px",
              fontWeight:   700,
              color:        "#fff",
              background:   "linear-gradient(135deg, #ff8c00, #ff5722)",
              padding:      "3px 9px",
              borderRadius: "999px",
              boxShadow:    "0 2px 10px rgba(255,140,0,0.35)",
              flexShrink:   0,
            }}
          >
            {pctDisp}%
          </motion.div>
        </div>

        {/* ══ MAIN BODY ════════════════════════════════ */}
        <div
          style={{
            padding:       "16px 16px 18px",
            display:       "flex",
            flexDirection: "column",
            gap:           "14px",
          }}
        >

          {/* ── Amount counter ──────────────────────── */}
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "16px",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <CircularProgress pct={pct} />
              <div
                style={{
                  position:       "absolute",
                  inset:          0,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "14px",
                }}
              >
                💰
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                <span
                  style={{
                    fontFamily:           "var(--font-syne), sans-serif",
                    fontSize:             "clamp(2rem, 9vw, 2.6rem)",
                    fontWeight:           800,
                    background:           "linear-gradient(135deg, #ff8c00, #ff5722)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor:  "transparent",
                    backgroundClip:       "text",
                    lineHeight:           1,
                    letterSpacing:        "-0.03em",
                  }}
                >
                  <AnimatedAmount value={goal.current} />
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffaa55", marginBottom: "2px" }}>
                  {goal.currency}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "11px", color: "#ccc" }}>cel:</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#bbb", letterSpacing: "-0.02em" }}>
                  {goal.target} {goal.currency}
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1   }}
                transition={{ delay: 1.2, duration: 0.4 }}
                style={{
                  display:      "inline-flex",
                  alignItems:   "center",
                  gap:          "4px",
                  marginTop:    "4px",
                  padding:      "3px 9px",
                  borderRadius: "999px",
                  background:   "rgba(255,200,80,0.13)",
                  border:       "1px solid rgba(255,200,80,0.25)",
                  fontSize:     "10.5px",
                  fontWeight:   600,
                  color:        "#cc6600",
                  width:        "fit-content",
                }}
              >
                <span>⚡</span>
                <span>Brakuje {remaining} {goal.currency}</span>
              </motion.div>
            </div>
          </div>

          {/* ── Progress bar ────────────────────────── */}
          <div style={{ position: "relative", paddingBottom: "22px" }}>
            <div
              style={{
                height:       "10px",
                borderRadius: "999px",
                background:   "rgba(0,0,0,0.07)",
                overflow:     "visible",
                position:     "relative",
              }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(pct * 100, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position:     "absolute",
                  left:         0, top: 0,
                  height:       "100%",
                  borderRadius: "999px",
                  background:   "linear-gradient(to right, #ffd93d, #ff8c00, #ff5722)",
                  boxShadow:    "0 2px 10px rgba(255,140,0,0.40)",
                }}
              />

              {/* Striped texture */}
              <motion.div
                initial={{ width: "0%", opacity: 0 }}
                animate={{ width: `${Math.min(pct * 100, 100)}%`, opacity: 0.18 }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position:        "absolute",
                  left:            0, top: 0,
                  height:          "100%",
                  borderRadius:    "999px",
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
                  pointerEvents:   "none",
                }}
              />

              {/* Glowing tip */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position:      "absolute",
                  top:           "50%",
                  left:          `${Math.min(pct * 100, 99)}%`,
                  transform:     "translate(-50%, -50%)",
                  width:         "16px",
                  height:        "16px",
                  borderRadius:  "50%",
                  background:    "#ff8c00",
                  boxShadow:     "0 0 12px rgba(255,140,0,0.7)",
                  zIndex:        4,
                  pointerEvents: "none",
                }}
              />

              {/* Dynamic milestones */}
              {milestones.map((m) => (
                <MilestoneMarker
                  key={m.pct}
                  pct={m.pct}
                  reached={goal.current >= m.value}
                  label={m.label}
                />
              ))}
            </div>
          </div>

          {/* ── Mini stats ──────────────────────────── */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              {
                label: "Wspierający",
                value: String(goal.supporters.length),
                emoji: "👥",
              },
              {
                label: "Średnio",
                value: goal.supporters.length > 0
                  ? `${(goal.current / goal.supporters.length).toFixed(1)} zł`
                  : "—",
                emoji: "📊",
              },
              {
                label: "Pozostało",
                value: `${remaining} zł`,
                emoji: "🏁",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                style={{
                  flex:           1,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  gap:            "3px",
                  padding:        "9px 6px",
                  borderRadius:   "12px",
                  background:     "rgba(255,255,255,0.45)",
                  border:         "1px solid rgba(255,255,255,0.82)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ fontSize: "14px" }}>{stat.emoji}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#cc5500", letterSpacing: "-0.02em" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: "9px", color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ── Reward hint ─────────────────────────── */}
          <div
            style={{
              display:      "flex",
              alignItems:   "flex-start",
              gap:          "8px",
              padding:      "11px 13px",
              borderRadius: "14px",
              background:   "rgba(255,210,80,0.10)",
              border:       "1px solid rgba(255,210,80,0.24)",
            }}
          >
            <span style={{ fontSize: "15px", flexShrink: 0 }}>🎁</span>
            <p style={{ fontSize: "11.5px", color: "#996000", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
              {goal.reward}
            </p>
          </div>

          {/* ── CTA button ──────────────────────────── */}
          <motion.a
            href="https://tipply.pl/@MGYT"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{   scale: 0.97 }}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "8px",
              padding:        "14px",
              borderRadius:   "15px",
              background:     "linear-gradient(135deg, #ff8c00 0%, #ff5722 100%)",
              color:          "#fff",
              fontWeight:     700,
              fontSize:       "14px",
              textDecoration: "none",
              boxShadow:      "0 7px 28px rgba(255,140,0,0.38)",
              letterSpacing:  "-0.01em",
              position:       "relative",
              overflow:       "hidden",
            }}
          >
            <motion.div
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
              style={{
                position:      "absolute",
                top:           0, left: 0,
                width:         "40%",
                height:        "100%",
                background:    "linear-gradient(105deg, transparent, rgba(255,255,255,0.28), transparent)",
                pointerEvents: "none",
              }}
            />
            <span style={{ fontSize: "16px" }}>💛</span>
            <span>Wesprzyj mnie teraz</span>
          </motion.a>

          {/* ── Supporters toggle ───────────────────── */}
          <motion.button
            onClick={() => setShowSupporters((s) => !s)}
            whileHover={{ scale: 1.02 }}
            whileTap={{   scale: 0.98 }}
            style={{
              background:     "rgba(255,255,255,0.38)",
              border:         "1px solid rgba(255,255,255,0.75)",
              borderRadius:   "12px",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "6px",
              fontSize:       "11.5px",
              color:          "#bba070",
              fontWeight:     600,
              padding:        "9px 0",
              outline:        "none",
              width:          "100%",
              backdropFilter: "blur(8px)",
              letterSpacing:  "0.01em",
              transition:     "background 0.2s",
            }}
          >
            <motion.span
              animate={{ rotate: showSupporters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block", fontSize: "10px" }}
            >
              ▼
            </motion.span>
            <span>
              {showSupporters
                ? "Ukryj wspierających"
                : `${goal.supporters.length} ostatnie wsparcia`}
            </span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width:        "6px",
                height:       "6px",
                borderRadius: "50%",
                background:   "#ff8c00",
                boxShadow:    "0 0 5px rgba(255,140,0,0.6)",
                flexShrink:   0,
              }}
            />
          </motion.button>

          {/* ── Supporters list ─────────────────────── */}
          <motion.div
            initial={false}
            animate={{
              height:  showSupporters ? "auto" : 0,
              opacity: showSupporters ? 1 : 0,
            }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "2px" }}>
              {goal.supporters.map((s, i) => (
                <SupporterPill key={i} supporter={s} index={i} />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}