"use client";
import { useRef } from "react";

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

export default function Window({ id, title, state, className = "", onClose, onFocus, onFolded, onMove, onToggleMax, children }: Props) {
  const ref = useRef<HTMLElement>(null);
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
