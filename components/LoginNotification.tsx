"use client";
import { useEffect, useRef, useState } from "react";
import { notification } from "@/data/profile";

/**
 * macOS-style banner shown once when the site loads: slides in from the top right with a soft chime,
 * fades away after a few seconds (hovering keeps it), and opens about.txt if clicked.
 */
export default function LoginNotification({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = () => {
    setPhase((p) => (p === "in" ? "out" : p));
    // remove it even if the exit animation never reports back (background tab, reduced motion)
    setTimeout(() => setPhase("hidden"), 450);
  };
  const startTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(hide, notification.visibleMs);
  };

  useEffect(() => {
    const show = setTimeout(() => {
      setPhase("in");
      chime();
      startTimer();
    }, notification.delayMs);
    return () => {
      clearTimeout(show);
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`notif ${phase}`}
      role="status"
      aria-live="polite"
      onMouseEnter={() => timer.current && clearTimeout(timer.current)}
      onMouseLeave={startTimer}
      onAnimationEnd={(e) => {
        if (e.animationName === "notifOut") setPhase("hidden");
      }}
    >
      <button
        className="notif-main"
        onClick={() => {
          onOpen();
          hide();
        }}
      >
        <span className="notif-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M2 9l9 3-3 7z" fill="#92d2f3" />
            <path d="M11 12l11-7-8 11z" fill="#3f9cd3" />
            <path d="M8 19l3-7 3 4z" fill="#2a77ab" />
          </svg>
        </span>
        <span className="notif-text">
          <span className="notif-top">
            <b>{notification.app}</b>
            <span>now</span>
          </span>
          <span className="notif-title">{notification.title}</span>
          <span className="notif-body">{notification.body}</span>
        </span>
      </button>
      <button className="notif-close" aria-label="Dismiss notification" onClick={hide}>×</button>
    </div>
  );
}

/** A short two-note "glass" chime made with Web Audio, so no sound file is needed.
 *  Browsers may block sound until the visitor has interacted with the site; then this stays silent. */
function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new Ctx();
    const play = () => {
      [
        [1318.5, 0, 0.5],
        [1760, 0.09, 0.7],
      ].forEach(([freq, delay, len]) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "sine";
        o.frequency.value = freq;
        const t = ac.currentTime + delay;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        o.connect(g).connect(ac.destination);
        o.start(t);
        o.stop(t + len + 0.05);
      });
      setTimeout(() => ac.close(), 1200);
    };
    if (ac.state === "running") play();
    else ac.resume().then(() => (ac.state === "running" ? play() : ac.close())).catch(() => ac.close());
  } catch {
    /* no audio available */
  }
}
