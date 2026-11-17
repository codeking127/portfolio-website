"use client";
import { useState } from "react";

const HINT = "Hover or tap a bar to see the run. Green is the 10K.";

export default function RunChart({ runs }: { runs: [string, number, string, string][] }) {
  const [tip, setTip] = useState(HINT);
  const max = Math.max(...runs.map((r) => r[1]));
  return (
    <>
      <div className="runs" onPointerLeave={() => setTip(HINT)}>
        {runs.map(([d, km, t, p]) => (
          <div key={d} className={km >= 9.9 ? "best" : ""} onPointerEnter={() => setTip(`${d} · ${km} km · ${t} · ${p} /km`)}>
            <small>{km >= 9.9 ? "10K" : ""}</small>
            <i style={{ height: `${(km / max) * 82}%` }} />
          </div>
        ))}
      </div>
      <div className="runaxis">
        <span>{runs[0][0]}</span>
        <span>A recent slice</span>
        <span>{runs[runs.length - 1][0]}</span>
      </div>
      <div className="runtip">{tip}</div>
    </>
  );
}
