"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface DonateEntry {
  name:   string;
  amount: string;
  emoji:  string;
}

function TickerItem({ entry }: { entry: DonateEntry }) {
  return (
    <div
      style={{
        display:    "inline-flex",
        alignItems: "center",
        gap:        "6px",
        padding:    "0 28px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width:        "4px",
          height:       "4px",
          borderRadius: "50%",
          background:   "rgba(255,140,0,0.4)",
          flexShrink:   0,
        }}
      />
      <span style={{ fontSize: "13px" }}>{entry.emoji}</span>
      <span style={{ fontSize: "12px", fontWeight: 500, color: "#999" }}>
        Ostatni donate:
      </span>
      <span style={{ fontSize: "12px", fontWeight: 700, color: "#cc5500", letterSpacing: "-0.01em" }}>
        {entry.name}
      </span>
      <span
        style={{
          fontSize:     "12px",
          fontWeight:   700,
          color:        "#ff8c00",
          background:   "rgba(255,140,0,0.10)",
          padding:      "1px 7px",
          borderRadius: "999px",
          border:       "1px solid rgba(255,140,0,0.18)",
        }}
      >
        {entry.amount}
      </span>
    </div>
  );
}

export default function DonateTicker() {
  const trackRef           = useRef<HTMLDivElement>(null);
  const [width, setWidth]  = useState(0);
  const [donates, setDonates] = useState<DonateEntry[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch from public/donates.json */
  useEffect(() => {
    fetch("/donates.json")
      .then((r) => r.json())
      .then((data) => {
        setDonates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (trackRef.current && donates.length > 0) {
      setWidth(trackRef.current.scrollWidth / 2);
    }
  }, [donates]);

  if (loading || donates.length === 0) return null;

  const items = [...donates, ...donates, ...donates, ...donates];

  return (
    <div
      style={{
        width:               "100%",
        maxWidth:            "24rem",
        overflow:            "hidden",
        borderRadius:        "14px",
        background:          "rgba(255,255,255,0.48)",
        border:              "1.5px solid rgba(255,255,255,0.85)",
        backdropFilter:      "blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        boxShadow:           "0 3px 18px rgba(255,150,50,0.09), inset 0 1px 0 rgba(255,255,255,0.95)",
        position:            "relative",
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position:      "absolute",
          left:          0, top: 0, bottom: 0,
          width:         "40px",
          background:    "linear-gradient(to right, rgba(255,252,248,0.95), transparent)",
          zIndex:        2,
          pointerEvents: "none",
          borderRadius:  "14px 0 0 14px",
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position:      "absolute",
          right:         0, top: 0, bottom: 0,
          width:         "40px",
          background:    "linear-gradient(to left, rgba(255,252,248,0.95), transparent)",
          zIndex:        2,
          pointerEvents: "none",
          borderRadius:  "0 14px 14px 0",
        }}
      />

      <div style={{ padding: "9px 0", display: "flex", overflow: "hidden" }}>
        <motion.div
          ref={trackRef}
          animate={{ x: width ? [0, -width] : 0 }}
          transition={{
            duration:   18,
            repeat:     Infinity,
            ease:       "linear",
            repeatType: "loop",
          }}
          style={{ display: "flex", alignItems: "center", willChange: "transform" }}
        >
          {items.map((entry, i) => (
            <TickerItem key={i} entry={entry} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}