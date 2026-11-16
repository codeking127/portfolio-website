"use client";
import { useEffect, useRef, useState } from "react";

const WHITES: [string, number, string][] = [
  ["C", 261.63, "a"], ["D", 293.66, "s"], ["E", 329.63, "d"], ["F", 349.23, "f"],
  ["G", 392, "g"], ["A", 440, "h"], ["B", 493.88, "j"], ["C", 523.25, "k"],
];
const BLACKS: [number, number][] = [[0, 277.18], [1, 311.13], [3, 369.99], [4, 415.3], [5, 466.16]];

/** A one-octave Casio you can click or play with A–K. Sound starts on the first key press. */
export default function Casio() {
  const ctx = useRef<AudioContext | null>(null);
  const [lcd, setLcd] = useState("PIANO 001");
  const [lit, setLit] = useState<string | null>(null);

  const play = (freq: number, name: string, keyId: string) => {
    try {
      ctx.current ??= new AudioContext();
      const ac = ctx.current;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.9);
      o.connect(g).connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 1);
    } catch {
      /* no audio available: keys still light up */
    }
    setLcd("NOTE " + name);
    setLit(keyId);
    setTimeout(() => setLit((k) => (k === keyId ? null : k)), 180);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const i = WHITES.findIndex((w) => w[2] === e.key.toLowerCase());
      if (i >= 0) play(WHITES[i][1], WHITES[i][0], "w" + i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="casio">
      <div className="top">
        <span>CASIO · Aryan edition</span>
        <span className="lcd">{lcd}</span>
      </div>
      <div className="keys">
        {WHITES.map(([n, f, k], i) => (
          <div key={"w" + i} className={`w ${lit === "w" + i ? "on" : ""}`} onPointerDown={() => play(f, n, "w" + i)}>
            {k.toUpperCase()}
          </div>
        ))}
        {BLACKS.map(([i, f]) => (
          <button
            key={"b" + i}
            aria-label="sharp key"
            className={`b ${lit === "b" + i ? "on" : ""}`}
            style={{ left: `calc(${(i + 1) * 12.5}% - 3.75%)` }}
            onPointerDown={() => play(f, "#", "b" + i)}
          />
        ))}
      </div>
    </div>
  );
}
