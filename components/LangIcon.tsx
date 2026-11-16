"use client";
import { useEffect, useState } from "react";

// One letter from each language I speak or am learning: English, Hindi, Japanese, French.
const GLYPHS = [
  { ch: "A", lang: "English" },
  { ch: "अ", lang: "Hindi" },
  { ch: "あ", lang: "Japanese" },
  { ch: "É", lang: "French" },
];

/** Dock icon for the languages window: the letter flips to the next language every couple of seconds. */
export default function LangIcon() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % GLYPHS.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="lang-icon" aria-hidden="true" title={GLYPHS[i].lang}>
      <span key={i} className="lang-glyph">{GLYPHS[i].ch}</span>
    </span>
  );
}
