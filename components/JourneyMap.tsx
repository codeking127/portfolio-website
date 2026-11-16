"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { journey, route, type PlaceId } from "@/data/profile";

/*
 * Journey map: a blank outline of India (Wikimedia, CC BY-SA 3.0) with a red push pin for each place I've lived.
 * A small airplane flies between them in order, and the dotted flight track appears right behind it
 * (both are driven by the same clock, so they stay in sync). The legs are curved so they never cross.
 * Clicking a pin opens a box with what happened there.
 */

// The overlay uses the image's own pixel size, so pin percentages map straight onto it.
const W = 960;
const H = 1120;
const at = (id: PlaceId) => {
  const s = journey.find((j) => j.id === id)!;
  return [(s.x / 100) * W, (s.y / 100) * H] as const;
};

// How far each leg bows sideways (negative = west, positive = east). Chosen so no two legs cross:
// school → college swings west, college → internship a little east, internship → now swings wide east.
const BOW = [-110, 90, 260];

const legs = route.slice(1).map((id, i) => {
  const [x1, y1] = at(route[i]);
  const [x2, y2] = at(id);
  const cx = (x1 + x2) / 2 + BOW[i];
  const cy = (y1 + y2) / 2;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
});
// one continuous path for the airplane to follow
const flightPath = legs.map((d, i) => (i === 0 ? d : d.replace(/^M[^Q]+/, ""))).join(" ");

// timing of the flight: it plays once each time the map appears (and again on "Replay flight")
const FLY_MS = 8000;
const START_DELAY_MS = 600;
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

export default function JourneyMap() {
  const [open, setOpen] = useState<PlaceId | null>(null);
  const [reached, setReached] = useState(0); // how many stops the plane has reached so far
  const [flight, setFlight] = useState(0); // bump to replay
  const [done, setDone] = useState(false);
  const stop = journey.find((j) => j.id === open);
  const trackRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const legRefs = useRef<(SVGPathElement | null)[]>([]);

  // One clock moves the plane, reveals the dotted track behind it,
  // and drops each pin the moment the plane reaches that place.
  useEffect(() => {
    const track = trackRef.current;
    const plane = planeRef.current;
    if (!track || !plane) return;
    const total = track.getTotalLength();
    // where along the whole track each stop sits: 0 for the first, then the sum of the legs before it
    const stopAt = [0];
    legRefs.current.forEach((leg, i) => stopAt.push(stopAt[i] + (leg?.getTotalLength() ?? 0)));
    let shown = -1;
    const show = (n: number) => {
      if (n !== shown) {
        shown = n;
        setReached(n);
      }
    };
    setDone(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.strokeDashoffset = "0";
      plane.style.display = "none";
      show(route.length);
      setDone(true);
      return;
    }
    show(0);
    track.style.strokeDashoffset = "1";
    plane.style.opacity = "0";
    const start = performance.now() + START_DELAY_MS;
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      if (t >= 0) {
        const k = Math.min(1, t / FLY_MS);
        const len = easeInOut(k) * total;
        const here = track.getPointAtLength(len);
        const a = track.getPointAtLength(Math.max(0, len - 1));
        const b = track.getPointAtLength(Math.min(total, len + 1));
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        plane.setAttribute("transform", `translate(${here.x.toFixed(1)} ${here.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
        plane.style.opacity = "1";
        track.style.strokeDashoffset = String(1 - len / total);
        show(stopAt.filter((d) => d <= len + 2).length);
        if (k >= 1) {
          // landed: the plane fades away, everything else stays
          plane.style.transition = "opacity .8s";
          plane.style.opacity = "0";
          setDone(true);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    plane.style.transition = "";
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [flight]);

  const current = reached > 0 ? journey.find((j) => j.id === route[reached - 1]) : undefined;
  const isReached = (id: PlaceId) => route.indexOf(id) < reached;

  return (
    <div className="jmap" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
      <Image src="/assets/india-outline.png" alt="Map of India" width={W} height={H} sizes="460px" className="jmap-img" priority={false} />

      <svg className="jmap-overlay" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          {/* reveals the dotted track up to wherever the plane is */}
          <mask id="track-reveal">
            <path ref={trackRef} d={flightPath} className="track-mask" pathLength={1} />
          </mask>
          <radialGradient id="pin-head" cx="35%" cy="32%" r="70%">
            <stop offset="0" stopColor="#ff8a80" />
            <stop offset=".45" stopColor="#e53935" />
            <stop offset="1" stopColor="#8e1414" />
          </radialGradient>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <g mask="url(#track-reveal)">
          {legs.map((d, i) => (
            <path
              key={d}
              d={d}
              className="track"
              ref={(el) => {
                legRefs.current[i] = el;
              }}
            />
          ))}
        </g>

        {journey.map((s) => {
          const [x, y] = at(s.id);
          const isCurrent = current?.id === s.id;
          return (
            <g
              key={s.id}
              className={`pin ${isReached(s.id) ? "shown" : ""} ${open === s.id ? "on" : ""} ${s.now && done ? "now" : ""}`}
              transform={`translate(${x} ${y})`}
            >
              {s.now && done && <circle r="34" className="pin-pulse" />}
              {/* top view of a red push pin: soft shadow, glossy round head, small highlight */}
              <ellipse cx="7" cy="9" rx="20" ry="18" className="pin-shadow" filter="url(#pin-shadow)" />
              <circle r="20" fill="url(#pin-head)" className="pin-head" />
              <circle r="20" className="pin-rim" />
              <ellipse cx="-6" cy="-7" rx="6.5" ry="4.5" className="pin-shine" transform="rotate(-35 -6 -7)" />
              {/* the place where the plane is gets the tag box instead of a plain name */}
              {!isCurrent && <text x="30" y="8" className="pin-label">{s.place}</text>}
            </g>
          );
        })}

        {/* airplane, top view, nose pointing along the track */}
        <g className="plane" ref={planeRef}>
          <g transform="scale(1.6)">
            <path d="M15,0 C15,-1.6 13,-2.2 11,-2.2 L-9,-2 C-12,-2 -13,-1 -13,0 C-13,1 -12,2 -9,2 L11,2.2 C13,2.2 15,1.6 15,0 Z" className="plane-body" />
            <path d="M5,-1.8 L-3,-15 L-7,-15 L-2,-1.8 Z M5,1.8 L-3,15 L-7,15 L-2,1.8 Z" className="plane-wing" />
            <path d="M-8,-1.6 L-12,-7 L-14,-7 L-12,-1.4 Z M-8,1.6 L-12,7 L-14,7 L-12,1.4 Z" className="plane-wing" />
          </g>
        </g>
      </svg>

      {/* what's at the place the plane has just reached */}
      {current && !stop && (
        <div key={current.id} className="stop-tag" style={{ left: `calc(${current.x}% + 20px)`, top: `${current.y}%` }} aria-live="polite">
          {current.tag}
        </div>
      )}

      {/* real buttons over the pins (only once they've appeared), so pins work with the keyboard too */}
      {journey.filter((s) => isReached(s.id)).map((s) => (
        <button
          key={s.id}
          className="pin-hit"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          aria-label={`${s.place}: ${s.title}`}
          aria-expanded={open === s.id}
          onClick={() => setOpen(open === s.id ? null : s.id)}
        />
      ))}

      {stop && (
        <div
          key={stop.id}
          className="pin-box"
          role="dialog"
          aria-label={stop.place}
          style={{ left: `calc(${stop.x}% + 26px)`, top: `calc(${stop.y}% - 18px)` }}
        >
          <button className="pin-box-close" aria-label="Close" onClick={() => setOpen(null)}>×</button>
          <div className="pin-box-when">{stop.tag}</div>
          <h4>{stop.title}</h4>
          <p>{stop.text}</p>
        </div>
      )}

      {done && (
        <button className="replay" onClick={() => { setOpen(null); setFlight((f) => f + 1); }}>
          ↻ Replay flight
        </button>
      )}
      {done && !stop && <div className="jmap-hint">Tap a pin to see what happened there</div>}
    </div>
  );
}
