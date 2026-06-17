"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState } from "react";

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════
   FALLBACK
══════════════════════════════════════════════════════ */

const FALLBACK: GoalData = {
  current:  21.00,
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

/* ══════════════════════════════════════════════════════
   ANIMATED COUNTER — int duży, grosze małe ale WIDOCZNE
══════════════════════════════════════════════════════ */

function AnimatedCounter({ value }: { value: number }) {
  const mv     = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 12 });
  const trans  = useTransform(spring, (v) => v.toFixed(2));
  const [display, setDisplay] = useState("0.00");

  useEffect(() => {
    const t = setTimeout(() => mv.set(value), 300);
    return () => clearTimeout(t);
  }, [value, mv]);

  useEffect(() => trans.on("change", setDisplay), [trans]);

  const dotIdx = display.indexOf(".");
  const intPart = display.slice(0, dotIdx);
  const decPart = display.slice(dotIdx + 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px" }}>
      {/* Integer — bardzo duży */}
      <span
        style={{
          fontFamily:           "var(--font-syne), sans-serif",
          fontSize:             "clamp(2.8rem, 12vw, 3.6rem)",
          fontWeight:           900,
          lineHeight:           1,
          letterSpacing:        "-0.04em",
          background:           "linear-gradient(160deg, #ffdd57 0%, #ff9a00 40%, #ff4500 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          backgroundClip:       "text",
        }}
      >
        {intPart}
      </span>

      {/* Decimal separator + grosze — wyraźne, nie ukryte */}
      <div
        style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "flex-start",
          marginBottom:   "6px",
          gap:            "0px",
        }}
      >
        <span
          style={{
            fontSize:   "14px",
            fontWeight: 800,
            color:      "#ff9a00",
            lineHeight: 1.1,
            opacity:    0.9,
          }}
        >
          ,{decPart}
        </span>
        <span
          style={{
            fontSize:      "10px",
            fontWeight:    700,
            color:         "#ffb347",
            letterSpacing: "0.02em",
            opacity:       0.8,
          }}
        >
          PLN
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SEGMENTED PROGRESS — nowy styl zamiast zwykłego bara
══════════════════════════════════════════════════════ */

function SegmentedProgress({
  pct,
  current,
  target,
}: {
  pct:     number;
  current: number;
  target:  number;
}) {
  const segments = 20;
  const filled   = Math.round(pct * segments);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Segments */}
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        {Array.from({ length: segments }).map((_, i) => {
          const isActive  = i < filled;
          const isEdge    = i === filled - 1;
          const milestone = i === 4 || i === 9 || i === 14 || i === 19;

          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{
                delay:    0.4 + i * 0.04,
                duration: 0.35,
                ease:     [0.22, 1, 0.36, 1],
              }}
              style={{
                flex:          milestone ? "0 0 6px" : "1",
                height:        milestone ? "22px" : "14px",
                borderRadius:  "4px",
                background:    isActive
                  ? `linear-gradient(160deg, #ffe566, #ff9a00 60%, #ff4500)`
                  : "rgba(0,0,0,0.07)",
                boxShadow:     isEdge
                  ? "0 0 12px rgba(255,150,0,0.8), 0 0 4px rgba(255,200,0,0.6)"
                  : isActive
                  ? "0 2px 6px rgba(255,120,0,0.25)"
                  : "none",
                position:      "relative",
                overflow:      "hidden",
                transformOrigin: "bottom",
              }}
            >
              {/* Shimmer na aktywnym */}
              {isActive && (
                <motion.div
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{
                    duration:    1.8,
                    repeat:      Infinity,
                    repeatDelay: Math.random() * 3 + 2,
                    ease:        "easeInOut",
                  }}
                  style={{
                    position:   "absolute",
                    inset:      0,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Labels pod progress */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
        }}
      >
        <span style={{ fontSize: "10px", color: "#ff9a00", fontWeight: 700 }}>
          0 zł
        </span>
        {[25, 50, 75].map((p) => (
          <span
            key={p}
            style={{
              fontSize:  "10px",
              color:     current >= (target * p / 100) ? "#ff9a00" : "#ddd",
              fontWeight:700,
              transition:"color 0.4s",
            }}
          >
            {target * p / 100} zł
          </span>
        ))}
        <span
          style={{
            fontSize:  "10px",
            color:     current >= target ? "#ff9a00" : "#ddd",
            fontWeight:700,
          }}
        >
          {target} 🏆
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STAT PILL — nowy styl inline
══════════════════════════════════════════════════════ */

function StatPill({
  emoji,
  value,
  label,
  delay,
}: {
  emoji: string;
  value: string;
  label: string;
  delay: number;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex:           1,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            "4px",
        padding:        "11px 8px",
        borderRadius:   "16px",
        background:     hov
          ? "rgba(255,255,255,0.72)"
          : "rgba(255,255,255,0.44)",
        border:         hov
          ? "1px solid rgba(255,200,80,0.50)"
          : "1px solid rgba(255,255,255,0.80)",
        backdropFilter: "blur(12px)",
        boxShadow:      hov
          ? "0 8px 24px rgba(255,150,50,0.18)"
          : "0 2px 8px rgba(0,0,0,0.05)",
        transition:     "all 0.22s ease",
        cursor:         "default",
      }}
    >
      <motion.span
        animate={{ scale: hov ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ fontSize: "18px", lineHeight: 1 }}
      >
        {emoji}
      </motion.span>
      <span
        style={{
          fontSize:      "13px",
          fontWeight:    800,
          color:         "#cc5500",
          letterSpacing: "-0.02em",
          lineHeight:    1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize:      "9px",
          color:         "#bbb",
          fontWeight:    600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          textAlign:     "center",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   SUPPORTER ROW — minimalistyczny, czytelny
══════════════════════════════════════════════════════ */

function SupporterRow({
  s,
  index,
}: {
  s:     Supporter;
  index: number;
}) {
  const [hov, setHov] = useState(false);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:             "flex",
        alignItems:          "center",
        gap:                 "10px",
        padding:             "10px 12px",
        borderRadius:        "14px",
        background:          hov
          ? "rgba(255,255,255,0.80)"
          : "rgba(255,255,255,0.48)",
        border:              hov
          ? "1px solid rgba(255,200,80,0.40)"
          : "1px solid rgba(255,255,255,0.80)",
        backdropFilter:      "blur(12px)",
        WebkitBackdropFilter:"blur(12px)",
        boxShadow:           hov
          ? "0 6px 20px rgba(255,150,50,0.14)"
          : "0 2px 6px rgba(0,0,0,0.04)",
        transition:          "all 0.2s ease",
        cursor:              "default",
        overflow:            "hidden",
        position:            "relative",
      }}
    >
      {/* Kolorowy lewy border */}
      <div
        style={{
          position:     "absolute",
          left:         0, top: 0, bottom: 0,
          width:        "3px",
          borderRadius: "3px 0 0 3px",
          background:   index === 0
            ? "linear-gradient(180deg,#ffd700,#ffaa00)"
            : index === 1
            ? "linear-gradient(180deg,#c0c0c0,#999)"
            : index === 2
            ? "linear-gradient(180deg,#cd7f32,#a05820)"
            : "rgba(255,200,80,0.3)",
          opacity: hov ? 1 : 0.7,
          transition: "opacity 0.2s",
        }}
      />

      {/* Medal lub emoji */}
      <div
        style={{
          width:          "36px",
          height:         "36px",
          borderRadius:   "11px",
          background:     "linear-gradient(135deg,rgba(255,230,100,0.22),rgba(255,160,50,0.14))",
          border:         "1px solid rgba(255,200,80,0.22)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "18px",
          flexShrink:     0,
        }}
      >
        {medals[index] ?? s.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize:      "13px",
            fontWeight:    700,
            color:         "#222",
            letterSpacing: "-0.015em",
            whiteSpace:    "nowrap",
            overflow:      "hidden",
            textOverflow:  "ellipsis",
          }}
        >
          {s.name}
        </div>
        <div
          style={{
            fontSize:  "10.5px",
            color:     "#c0a070",
            fontWeight:500,
            marginTop: "1px",
          }}
        >
          {s.time}
        </div>
      </div>

      {/* Kwota */}
      <motion.div
        animate={{ scale: hov ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          fontSize:      "12.5px",
          fontWeight:    800,
          color:         "#ff7a00",
          background:    "linear-gradient(135deg,rgba(255,210,80,0.20),rgba(255,140,0,0.12))",
          border:        "1px solid rgba(255,160,40,0.25)",
          padding:       "5px 10px",
          borderRadius:  "999px",
          whiteSpace:    "nowrap",
          flexShrink:    0,
          letterSpacing: "-0.01em",
        }}
      >
        +{s.amount}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════════ */

function Skeleton() {
  return (
    <div
      style={{
        borderRadius:         "24px",
        background:           "rgba(255,255,255,0.50)",
        border:               "1.5px solid rgba(255,255,255,0.88)",
        backdropFilter:       "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding:              "24px 18px",
        display:              "flex",
        flexDirection:        "column",
        gap:                  "16px",
      }}
    >
      {[70, 100, 85, 50, 90].map((w, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
          style={{
            height:       i === 1 ? "20px" : "12px",
            width:        `${w}%`,
            borderRadius: "999px",
            background:   "linear-gradient(90deg,rgba(255,210,80,0.18),rgba(255,160,60,0.10))",
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */

export default function SupportGoal() {
  const [data,           setData]           = useState<GoalData | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [showSupporters, setShowSupporters] = useState(false);
  const [lastUpdated,    setLastUpdated]    = useState("");
  const [pulse,          setPulse]          = useState(false);

  useEffect(() => {
    const load = () => {
      fetch(`/support-goal.json?t=${Date.now()}`)
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((json: GoalData) => {
          setData(json);
          setLastUpdated(
            new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
          );
          setPulse(true);
          setTimeout(() => setPulse(false), 800);
          setLoading(false);
        })
        .catch(() => { setData(FALLBACK); setLoading(false); });
    };

    load();
    const iv = setInterval(load, 60_000);
    return () => clearInterval(iv);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.5, delay: 0.9 }}
        style={{ width: "100%", maxWidth: "24rem" }}
      >
        <Skeleton />
      </motion.div>
    );
  }

  const goal      = data!;
  const pct       = Math.min(goal.current / goal.target, 1);
  const pctDisp   = Math.round(pct * 100);
  const remaining = +(goal.target - goal.current).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.6, delay: 0.94, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: "24rem" }}
    >
      {/* Karta */}
      <div
        style={{
          borderRadius:         "24px",
          background:           "rgba(255,255,255,0.54)",
          border:               "1.5px solid rgba(255,255,255,0.92)",
          backdropFilter:       "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow:
            "0 8px 40px rgba(255,140,50,0.14), 0 2px 8px rgba(0,0,0,0.05), inset 0 1.5px 0 rgba(255,255,255,0.98)",
          overflow:   "hidden",
          position:   "relative",
        }}
      >

        {/* Gradient top line */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            position:           "absolute",
            top: 0, left: 0, right: 0,
            height:             "3px",
            background:         "linear-gradient(90deg,#ffe066,#ff9a00,#ff4500,#ff9a00,#ffe066)",
            backgroundSize:     "200% 100%",
          }}
        />

        {/* ── HEADER ─────────────────────────────── */}
        <div
          style={{
            background:   "linear-gradient(135deg,rgba(255,230,90,0.20),rgba(255,130,50,0.12))",
            padding:      "14px 16px 12px",
            borderBottom: "1px solid rgba(255,220,100,0.16)",
            display:      "flex",
            alignItems:   "center",
            gap:          "8px",
            marginTop:    "3px",
          }}
        >
          {/* Target emoji bouncing */}
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0 }}
          >
            🎯
          </motion.span>

          <span
            style={{
              fontSize:      "12.5px",
              fontWeight:    700,
              color:         "#b84d00",
              letterSpacing: "-0.015em",
              flex:          1,
            }}
          >
            {goal.label}
          </span>

          {/* Refresh time */}
          {lastUpdated && (
            <motion.span
              key={lastUpdated}
              animate={{ opacity: pulse ? [0, 1] : 0.45 }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize:   "9px",
                color:      pulse ? "#ff9a00" : "#ccc",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              ↻ {lastUpdated}
            </motion.span>
          )}

          {/* % badge */}
          <motion.div
            animate={{
              boxShadow: [
                "0 2px 10px rgba(255,140,0,0.30)",
                "0 4px 20px rgba(255,140,0,0.60)",
                "0 2px 10px rgba(255,140,0,0.30)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize:     "11.5px",
              fontWeight:   800,
              color:        "#fff",
              background:   "linear-gradient(135deg,#ffaa00,#ff4500)",
              padding:      "4px 11px",
              borderRadius: "999px",
              letterSpacing:"-0.01em",
              flexShrink:   0,
            }}
          >
            {pctDisp}%
          </motion.div>
        </div>

        {/* ── BODY ───────────────────────────────── */}
        <div
          style={{
            padding:       "20px 16px 22px",
            display:       "flex",
            flexDirection: "column",
            gap:           "18px",
          }}
        >

          {/* ── HERO COUNT ─────────────────────────── */}
          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              padding:        "20px 16px 16px",
              borderRadius:   "20px",
              background:     "linear-gradient(160deg,rgba(255,252,235,0.9),rgba(255,240,200,0.7))",
              border:         "1px solid rgba(255,220,100,0.30)",
              boxShadow:      "inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 18px rgba(255,160,50,0.10)",
              position:       "relative",
              overflow:       "hidden",
              gap:            "4px",
            }}
          >
            {/* Subtle background glow */}
            <div
              style={{
                position:     "absolute",
                top:          "-30px",
                left:         "50%",
                transform:    "translateX(-50%)",
                width:        "200px",
                height:       "120px",
                borderRadius: "50%",
                background:   "radial-gradient(circle,rgba(255,180,60,0.25) 0%,transparent 70%)",
                filter:       "blur(20px)",
                pointerEvents:"none",
              }}
            />

            {/* Animated number */}
            <AnimatedCounter value={goal.current} />

            {/* Cel */}
            <div
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        "6px",
                marginTop:  "2px",
              }}
            >
              <span
                style={{
                  fontSize:     "10px",
                  color:        "#bbb",
                  fontWeight:   600,
                  background:   "rgba(0,0,0,0.05)",
                  padding:      "2px 7px",
                  borderRadius: "6px",
                }}
              >
                cel
              </span>
              <span
                style={{
                  fontSize:   "14px",
                  fontWeight: 700,
                  color:      "#999",
                  letterSpacing:"-0.02em",
                }}
              >
                {goal.target},00 {goal.currency}
              </span>
            </div>

            {/* Brakuje pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "5px",
                marginTop:    "8px",
                padding:      "5px 12px",
                borderRadius: "999px",
                background:   "rgba(255,210,80,0.16)",
                border:       "1px solid rgba(255,210,80,0.32)",
                fontSize:     "11.5px",
                fontWeight:   700,
                color:        "#cc6000",
                letterSpacing:"-0.01em",
              }}
            >
              <motion.span
                animate={{ rotate: [0, 20, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
              >
                ⚡
              </motion.span>
              Brakuje jeszcze {remaining},00 {goal.currency}
            </motion.div>
          </div>

          {/* ── SEGMENTED PROGRESS ─────────────────── */}
          <SegmentedProgress
            pct={pct}
            current={goal.current}
            target={goal.target}
          />

          {/* ── STATS ──────────────────────────────── */}
          <div style={{ display: "flex", gap: "8px" }}>
            <StatPill
              emoji="👥"
              value={String(goal.supporters.length)}
              label="Wspierający"
              delay={0.55}
            />
            <StatPill
              emoji="💰"
              value={
                goal.supporters.length > 0
                  ? `${(goal.current / goal.supporters.length).toFixed(1)} zł`
                  : "—"
              }
              label="Średnio"
              delay={0.65}
            />
            <StatPill
              emoji="🏁"
              value={`${remaining} zł`}
              label="Pozostało"
              delay={0.75}
            />
          </div>

          {/* ── REWARD ─────────────────────────────── */}
          <div
            style={{
              display:      "flex",
              alignItems:   "flex-start",
              gap:          "10px",
              padding:      "13px 14px",
              borderRadius: "16px",
              background:   "linear-gradient(135deg,rgba(255,235,100,0.14),rgba(255,180,60,0.08))",
              border:       "1px solid rgba(255,220,100,0.26)",
              boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.80)",
            }}
          >
            <motion.span
              animate={{ rotate: [0, -12, 8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ fontSize: "20px", flexShrink: 0 }}
            >
              🎁
            </motion.span>
            <p
              style={{
                fontSize:   "11.5px",
                color:      "#995500",
                lineHeight: 1.65,
                fontWeight: 500,
                margin:     0,
              }}
            >
              {goal.reward}
            </p>
          </div>

          {/* ── CTA ────────────────────────────────── */}
          <motion.a
            href="https://tipply.pl/@MGYT"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{   scale: 0.97,  y: 0 }}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "10px",
              padding:        "15px",
              borderRadius:   "16px",
              background:     "linear-gradient(135deg,#ffb300 0%,#ff6600 55%,#ff3d00 100%)",
              color:          "#fff",
              fontWeight:     800,
              fontSize:       "15px",
              textDecoration: "none",
              boxShadow:
                "0 8px 30px rgba(255,120,0,0.45), inset 0 1px 0 rgba(255,255,255,0.22)",
              letterSpacing:  "-0.015em",
              position:       "relative",
              overflow:       "hidden",
            }}
          >
            {/* Shimmer */}
            <motion.div
              animate={{ x: ["-130%", "230%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
              style={{
                position:      "absolute",
                inset:         0,
                width:         "45%",
                background:    "linear-gradient(105deg,transparent,rgba(255,255,255,0.32),transparent)",
                pointerEvents: "none",
              }}
            />
            <motion.span
              animate={{ scale: [1, 1.18, 1], rotate: [0, -12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: "19px" }}
            >
              💛
            </motion.span>
            <span>Wesprzyj mnie teraz</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              style={{ opacity: 0.85 }}
            >
              →
            </motion.span>
          </motion.a>

          {/* ── TOGGLE ─────────────────────────────── */}
          <motion.button
            onClick={() => setShowSupporters((s) => !s)}
            whileHover={{ scale: 1.015 }}
            whileTap={{   scale: 0.985 }}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "8px",
              padding:        "10px",
              borderRadius:   "14px",
              background:     "rgba(255,255,255,0.40)",
              border:         "1px solid rgba(255,255,255,0.78)",
              cursor:         "pointer",
              outline:        "none",
              width:          "100%",
              fontSize:       "12px",
              fontWeight:     600,
              color:          "#bb9060",
              backdropFilter: "blur(8px)",
              letterSpacing:  "0.01em",
              transition:     "background 0.2s",
            }}
          >
            {/* Chevron */}
            <motion.span
              animate={{ rotate: showSupporters ? 180 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: "9px", display: "inline-block" }}
            >
              ▼
            </motion.span>

            <span>
              {showSupporters
                ? "Ukryj wspierających"
                : `Pokaż ${goal.supporters.length} wspierających`}
            </span>

            {/* Live dot — poprawiony, nie migający jak szalony */}
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.4, 0.9] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width:        "7px",
                height:       "7px",
                borderRadius: "50%",
                background:   "#ff9a00",
                boxShadow:    "0 0 6px rgba(255,150,0,0.6)",
                flexShrink:   0,
              }}
            />
          </motion.button>

          {/* ── SUPPORTERS LIST ────────────────────── */}
          <AnimatePresence initial={false}>
            {showSupporters && (
              <motion.div
                key="list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{    height: 0, opacity: 0 }}
                transition={{ duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    gap:           "7px",
                    paddingTop:    "2px",
                  }}
                >
                  {goal.supporters.map((s, i) => (
                    <SupporterRow key={i} s={s} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
}