"use client";
import { useEffect, useRef } from "react";

// Flat sheet: a square cut into 12 fan triangles around its centre (the creases you see when you unfold a crane).
const PER: [number, number][] = [
  [50, 20], [83.3, 20], [116.7, 20], [150, 20], [150, 53.3], [150, 86.7],
  [150, 120], [116.7, 120], [83.3, 120], [50, 120], [50, 86.7], [50, 53.3],
];
const SQ = PER.map((p, i) => [[100, 70], p, PER[(i + 1) % 12]] as [number, number][]);

// Folded crane, side view facing right: raised body point, long tail, neck with a folded-down head,
// near wing swept low toward the viewer, far wing behind. Each flap is split on its crease (lit / shaded side).
const CR: [number, number][][] = [
  [[102, 64], [182, 77], [117, 88]], // 0 far wing (behind)
  [[84, 86], [55, 11], [89, 91]], // 1 tail, lit half
  [[89, 91], [55, 11], [95, 94]], // 2 tail, shaded half
  [[113, 92], [158, 29], [119, 90]], // 3 neck, lit half
  [[119, 90], [158, 29], [126, 88]], // 4 neck, shaded half
  [[100, 50], [79, 90], [102, 102]], // 5 body, left face
  [[100, 50], [125, 90], [102, 102]], // 6 body, right face
  [[100, 50], [91, 76], [104, 79]], // 7 body ridge highlight
  [[150, 38], [159, 28], [187, 53]], // 8 head, top
  [[150, 38], [187, 53], [155, 43]], // 9 head, underside
  [[96, 72], [14, 115], [104, 86]], // 10 near wing, lit half
  [[104, 86], [14, 115], [111, 100]], // 11 near wing, shaded half
];
const SHADE = [4, 1, 3, 2, 3, 2, 4, 0, 2, 4, 0, 2];
const ORDER = [0, 1, 2, 3, 4, 8, 9, 5, 6, 7, 10, 11]; // back to front

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function pointsAt(i: number, t: number) {
  const d = i * (0.4 / (CR.length - 1));
  const lt = ease(Math.max(0, Math.min(1, (t - d) / 0.6))); // staggered: each facet folds a beat after the last
  return SQ[i]
    .map((s, k) => `${(s[0] + (CR[i][k][0] - s[0]) * lt).toFixed(1)},${(s[1] + (CR[i][k][1] - s[1]) * lt).toFixed(1)}`)
    .join(" ");
}

type Props = {
  /** fold from a flat sheet after this many ms when it first appears */
  foldAfter?: number;
  /** change this number to toggle fold/unfold from outside */
  toggleSignal?: number;
  label?: string;
};

export default function Crane({ foldAfter = 500, toggleSignal = 0, label = "Paper crane. Click to unfold it into a square and fold it back." }: Props) {
  const polys = useRef<(SVGPolygonElement | null)[]>([]);
  const state = useRef(0);
  const raf = useRef(0);

  const draw = (t: number) => polys.current.forEach((p, i) => p?.setAttribute("points", pointsAt(i, t)));

  const to = (target: number) => {
    cancelAnimationFrame(raf.current);
    const from = state.current;
    const t0 = performance.now();
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 1400;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      state.current = from + (target - from) * k;
      draw(state.current);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  const toggle = () => to(state.current > 0.5 ? 0 : 1);

  useEffect(() => {
    draw(0);
    const id = setTimeout(() => to(1), foldAfter);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleSignal]);

  return (
    <svg className="crane" viewBox="0 0 200 140" role="img" aria-label={label} onClick={toggle}>
      <ellipse cx="100" cy="124" rx="62" ry="4.5" fill="rgba(20,60,100,.14)" />
      {ORDER.map((i) => (
        <polygon
          key={i}
          ref={(el) => {
            polys.current[i] = el;
          }}
          points={pointsAt(i, 0)}
          fill={`var(--crane-${SHADE[i]})`}
          stroke="rgba(255,255,255,.35)"
          strokeWidth=".5"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
