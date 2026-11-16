"use client";
import { useEffect, useRef, useState } from "react";
import { notification } from "@/data/profile";
import { chime } from "./sfx";

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
