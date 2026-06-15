"use client";

import { useEffect, useState } from "react";

interface EmojiItem {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const SUMMER_EMOJIS = ["☀️","🌊","🍋","🌸","⭐","🦋","🌺","✨","🍊","🌴"];

export default function FloatingEmojis() {
  const [items, setItems] = useState<EmojiItem[]>([]);

  useEffect(() => {
    const generated: EmojiItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      emoji: SUMMER_EMOJIS[i % SUMMER_EMOJIS.length],
      x: 5 + (i * 9.5) % 90,
      size: 14 + (i * 3) % 12,
      duration: 12 + (i * 2.3) % 14,
      delay: (i * 1.8) % 10,
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
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style>{`
        @keyframes emojiFloat {
          0%   { transform: translateY(0)   rotate(0deg);  opacity: 0;   }
          8%   { opacity: 0.35; }
          85%  { opacity: 0.2; }
          100% { transform: translateY(-105vh) rotate(25deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}