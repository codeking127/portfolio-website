"use client";
import { useLayoutEffect, useRef } from "react";

export type WinStatus = "closed" | "open" | "folding";

export type WinState = {
  status: WinStatus;
  animate: boolean; // play the unfold animation when shown
  z: number;
  left: string; // css value: "52%" by default, px once dragged
  top: string;
  nonce: number; // bumping it remounts the window so the unfold plays again
  max: boolean; // expanded to the full desktop width (green button / double-click title bar)
};

type Props = {
  id: string;
  title: string;
  state: WinState;
  className?: string;
  onClose: () => void;
  onFocus: () => void;
  onFolded: () => void;
  onMove: (left: number, top: number) => void;
  onToggleMax: () => void;
  children: React.ReactNode;
};

const isPhone = () => window.matchMedia("(max-width: 900px)").matches;
// room kept free at the bottom of the screen for the dock (its height plus a gap)
const DOCK_SPACE = 96;

export default function Window({ id, title, state, className = "", onClose, onFocus, onFolded, onMove, onToggleMax, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  // On laptops, keep a newly opened window fully on screen: it must clear the dock at the bottom and the
  // right edge, so tall windows (like Runs) never open half-hidden. Its contents scroll inside instead.
  useLayoutEffect(() => {
    const win = ref.current;
    const desk = win?.parentElement;
    if (!win || !desk || isPhone() || state.max || state.status !== "open") return;
    const bottom = window.innerHeight - 30 - DOCK_SPACE; // visible desktop height above the dock
    let top = win.offsetTop;
    let left = win.offsetLeft;
    if (top + win.offsetHeight > bottom) top = Math.max(8, bottom - win.offsetHeight);
    if (left + win.offsetWidth > desk.clientWidth - 8) left = Math.max(8, desk.clientWidth - 8 - win.offsetWidth);
    if (left < 8) left = 8;
    if (top !== win.offsetTop || left !== win.offsetLeft) onMove(left, top);
    // only when the window (re)appears; dragging afterwards is up to the visitor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.nonce, state.status]);

  if (state.status === "closed") return null;

  const anim = state.status === "folding" ? "folding" : state.animate ? "unfold" : "";

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPhone() || state.max || (e.target as HTMLElement).closest("button")) return;
    const win = ref.current;
    const desk = win?.parentElement;
    if (!win || !desk) return;
    const bar = e.currentTarget;
    const d = desk.getBoundingClientRect();
    const w = win.getBoundingClientRect();
    const ox = e.clientX - w.left;
    const oy = e.clientY - w.top;
    bar.setPointerCapture(e.pointerId);
    bar.classList.add("dragging");
    const move = (ev: PointerEvent) => {
      const x = Math.max(-w.width + 80, Math.min(d.width - 80, ev.clientX - d.left - ox));
      const y = Math.max(0, ev.clientY - d.top - oy);
      win.style.left = x + "px";
      win.style.top = y + "px";
    };
    const up = () => {
      bar.classList.remove("dragging");
      bar.removeEventListener("pointermove", move);
      onMove(parseFloat(win.style.left), parseFloat(win.style.top));
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up, { once: true });
  };

  return (
    <section
      ref={ref}
      id={`w-${id}`}
      className={`win w-${id} ${anim} ${state.max ? "max" : ""} ${className}`}
      style={{ zIndex: state.z, left: state.left, top: state.top }}
      onPointerDown={onFocus}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && state.status === "folding") onFolded();
      }}
      aria-label={title}
    >
      <div
        className="bar"
        onPointerDown={startDrag}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) onToggleMax();
        }}
      >
        {/* phones: windows are full-screen sheets, closed with a big back button instead of tiny traffic lights */}
        <button className="back" onClick={onClose} aria-label={`Close ${title}`}>
          <svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2L2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Home
        </button>
        <div className="lights">
          <button aria-label={`Close ${title}`} title="Close" onClick={onClose} />
          <button aria-label={`Minimise ${title}`} title="Minimise" onClick={onClose} />
          <button
            aria-label={state.max ? `Restore ${title}` : `Expand ${title} to full width`}
            title={state.max ? "Restore" : "Expand to full width"}
            aria-pressed={state.max}
            onClick={onToggleMax}
          />
        </div>
        <span className="t">{title}</span>
      </div>
      <div className="wbody">{children}</div>
    </section>
  );
}
