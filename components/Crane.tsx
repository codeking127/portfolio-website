"use client";
import { useEffect, useRef, useState } from "react";

/*
 * A sheet of paper that folds into an origami model and back.
 * Every model is a list of triangles (facets). Unfolded, each facet lies flat as one slice of the same
 * square sheet, so switching models looks like: unfold to the flat square, then fold the new model.
 */

type Pt = [number, number];
type Tri = [Pt, Pt, Pt];
export type ModelId = "crane" | "flower" | "bunny";

type Model = {
  name: string;
  facets: Tri[];
  shade: number[]; // index into palette, per facet
  order: number[]; // drawing order, back to front
  palette: string[];
  shadow: string;
};

const C: Pt = [100, 70];
const P = (r: number, deg: number): Pt => [100 + r * Math.cos((deg * Math.PI) / 180), 70 + r * Math.sin((deg * Math.PI) / 180)];

/** The flat sheet: a square around the centre cut into n fan triangles (n must be a multiple of 4). */
function squareFan(n: number): Tri[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const d = (i * 400) / n;
    if (d < 100) pts.push([50 + d, 20]);
    else if (d < 200) pts.push([150, 20 + d - 100]);
    else if (d < 300) pts.push([150 - (d - 200), 120]);
    else pts.push([50, 120 - (d - 300)]);
  }
  return pts.map((p, i) => [C, p, pts[(i + 1) % n]]);
}

// Crane, side view facing right: raised body point, long tail, neck with folded-down head, wings.
const crane: Model = {
  name: "crane",
  facets: [
    [[102, 64], [182, 77], [117, 88]], // far wing
    [[84, 86], [55, 11], [89, 91]], // tail, lit
    [[89, 91], [55, 11], [95, 94]], // tail, shaded
    [[113, 92], [158, 29], [119, 90]], // neck, lit
    [[119, 90], [158, 29], [126, 88]], // neck, shaded
    [[100, 50], [79, 90], [102, 102]], // body, left
    [[100, 50], [125, 90], [102, 102]], // body, right
    [[100, 50], [91, 76], [104, 79]], // body ridge
    [[150, 38], [159, 28], [187, 53]], // head, top
    [[150, 38], [187, 53], [155, 43]], // head, underside
    [[96, 72], [14, 115], [104, 86]], // near wing, lit
    [[104, 86], [14, 115], [111, 100]], // near wing, shaded
  ],
  shade: [4, 1, 3, 2, 3, 2, 4, 0, 2, 4, 0, 2],
  order: [0, 1, 2, 3, 4, 8, 9, 5, 6, 7, 10, 11],
  palette: ["var(--crane-0)", "var(--crane-1)", "var(--crane-2)", "var(--crane-3)", "var(--crane-4)"],
  shadow: "rgba(20,60,100,.14)",
};

// Eight-petal flower, seen from above: each petal is a broad kite folded along its centre crease
// (lit half / shaded half), around a small pale centre.
const flowerFacets: Tri[] = [];
const flowerShade: number[] = [];
for (let k = 0; k < 8; k++) {
  const a = -90 + k * 45;
  const q = P(9, a); // where the petal starts
  const tip = P(60, a);
  flowerFacets.push([q, P(34, a - 21), tip], [q, tip, P(34, a + 21)]);
  flowerShade.push(k % 2 ? 1 : 0, k % 2 ? 3 : 2);
}
for (let j = 0; j < 4; j++) {
  flowerFacets.push([C, P(17, j * 90 - 45), P(17, j * 90 + 45)]);
  flowerShade.push(4);
}
const flower: Model = {
  name: "flower",
  facets: flowerFacets,
  shade: flowerShade,
  order: flowerFacets.map((_, i) => i),
  palette: ["#ffe066", "#ffcf33", "#f2b705", "#d99a00", "#fff2a8"],
  shadow: "rgba(120,90,0,.16)",
};

// Rabbit, sitting and facing left, with two tall ears.
const bunny: Model = {
  name: "rabbit",
  facets: [
    [[96, 62], [116, 10], [104, 60]], // 0 back ear, lit
    [[104, 60], [116, 10], [108, 64]], // 1 back ear, shaded
    [[130, 58], [162, 84], [120, 90]], // 2 back highlight
    [[120, 92], [160, 118], [164, 86]], // 3 rump
    [[120, 92], [164, 86], [130, 58]], // 4 back
    [[120, 92], [130, 58], [90, 70]], // 5 shoulder
    [[120, 92], [90, 70], [72, 118]], // 6 front
    [[120, 92], [72, 118], [160, 118]], // 7 belly
    [[128, 118], [164, 118], [150, 94]], // 8 haunch
    [[162, 90], [178, 84], [170, 104]], // 9 tail
    [[90, 70], [72, 118], [96, 104]], // 10 chest
    [[92, 68], [54, 70], [74, 94]], // 11 head, top
    [[92, 68], [74, 94], [100, 88]], // 12 head, cheek
    [[66, 118], [90, 118], [80, 104]], // 13 front paw
    [[84, 66], [76, 8], [92, 64]], // 14 front ear, lit
    [[92, 64], [76, 8], [98, 66]], // 15 front ear, shaded
  ],
  shade: [3, 4, 0, 3, 1, 2, 1, 3, 4, 0, 2, 1, 3, 2, 0, 2],
  order: [0, 1, 3, 4, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  palette: ["#fffbd6", "#f9f29a", "#efe56a", "#dccf45", "#c4b62f"],
  shadow: "rgba(110,100,20,.16)",
};

export const MODELS: Record<ModelId, Model> = { crane, flower, bunny };
const FANS: Record<number, Tri[]> = {};
const fan = (n: number) => (FANS[n] ??= squareFan(n));

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function pointsAt(m: Model, i: number, t: number) {
  const n = m.facets.length;
  const d = i * (0.4 / (n - 1));
  const lt = ease(Math.max(0, Math.min(1, (t - d) / 0.6))); // staggered: each facet folds a beat after the last
  const sq = fan(n)[i];
  return sq
    .map((s, k) => `${(s[0] + (m.facets[i][k][0] - s[0]) * lt).toFixed(1)},${(s[1] + (m.facets[i][k][1] - s[1]) * lt).toFixed(1)}`)
    .join(" ");
}

type Props = {
  /** which model to show; changing it unfolds the current one and folds the new one */
  model?: ModelId;
  /** fold from a flat sheet after this many ms when it first appears */
  foldAfter?: number;
  /** change this number to toggle fold/unfold from outside */
  toggleSignal?: number;
  label?: string;
  /** if given, a click/tap calls this instead of unfolding the model */
  onActivate?: () => void;
};

export default function Crane({ model = "crane", foldAfter = 500, toggleSignal = 0, label, onActivate }: Props) {
  const [shown, setShown] = useState<ModelId>(model);
  const polys = useRef<(SVGPolygonElement | null)[]>([]);
  const state = useRef(0);
  const raf = useRef(0);
  const pendingFold = useRef(false);
  const shownRef = useRef(shown);
  shownRef.current = shown;

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw = (t: number) => {
    const m = MODELS[shownRef.current];
    polys.current.slice(0, m.facets.length).forEach((p, i) => p?.setAttribute("points", pointsAt(m, i, t)));
  };

  const to = (target: number, dur = 1400, done?: () => void) => {
    cancelAnimationFrame(raf.current);
    const from = state.current;
    const t0 = performance.now();
    const ms = reduced() ? 1 : dur;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      state.current = from + (target - from) * k;
      draw(state.current);
      if (k < 1) raf.current = requestAnimationFrame(step);
      else done?.();
    };
    raf.current = requestAnimationFrame(step);
  };
  const toggle = () => to(state.current > 0.5 ? 0 : 1);

  // first appearance: start flat, then fold
  useEffect(() => {
    draw(0);
    const id = setTimeout(() => to(1), foldAfter);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a new model was picked: unfold to the flat sheet, swap, then fold the new one
  useEffect(() => {
    if (model === shownRef.current) return;
    to(0, 800, () => {
      pendingFold.current = true;
      setShown(model);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  // after the swap renders, draw the new facets flat and fold them up
  useEffect(() => {
    draw(state.current);
    if (pendingFold.current) {
      pendingFold.current = false;
      to(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleSignal]);

  const m = MODELS[shown];
  return (
    <svg
      className="crane"
      viewBox="0 0 200 140"
      role="img"
      aria-label={label ?? `Paper ${m.name}. Click to unfold it into a square and fold it back.`}
      onClick={onActivate ?? toggle}
    >
      <ellipse cx="100" cy="128" rx="62" ry="4.5" fill={m.shadow} />
      {m.order.map((i) => (
        <polygon
          key={`${shown}-${i}`}
          ref={(el) => {
            polys.current[i] = el;
          }}
          points={pointsAt(m, i, state.current)}
          fill={m.palette[m.shade[i]]}
          stroke="rgba(255,255,255,.35)"
          strokeWidth=".5"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
