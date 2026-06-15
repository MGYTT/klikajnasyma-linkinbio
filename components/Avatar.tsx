"use client";

import { motion } from "framer-motion";

export default function Avatar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-28 h-28 mx-auto"
    >
      {/* Spinning summer gradient ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          padding: "3px",
          background:
            "conic-gradient(from 0deg, #ffb347, #ff6b6b, #ffd93d, #4dd0e1, #ffb347)",
          animation: "avatarSpin 5s linear infinite",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "9999px",
            background: "#fff8f0",
          }}
        />
      </div>

      {/* Inner circle */}
      <div
        style={{
          position: "absolute",
          inset: "3px",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #fff3e0, #e0f7fa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800,
            fontSize: "1.6rem",
            background: "linear-gradient(135deg, #ff8c00, #ff4500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            userSelect: "none",
          }}
        >
          KS
        </span>
      </div>

      {/* Sun glow beneath */}
      <div
        style={{
          position: "absolute",
          inset: "-10px",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(255,180,60,0.45) 0%, transparent 70%)",
          filter: "blur(14px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <style>{`
        @keyframes avatarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}