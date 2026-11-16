"use client";
import { useEffect, useState } from "react";

/** Cycles through words; each new one folds down into place like a paper flap. */
export default function RoleFlip({ words, every = 2200 }: { words: string[]; every?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), every);
    return () => clearInterval(id);
  }, [words.length, every]);
  return (
    <span className="flip" aria-live="polite">
      <span key={i} className="flip-word">{words[i]}</span>
    </span>
  );
}
