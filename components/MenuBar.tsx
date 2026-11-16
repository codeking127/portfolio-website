"use client";
import { useEffect, useRef, useState } from "react";
import { links } from "@/data/profile";
import Clock from "./Clock";

type Props = {
  onAbout: () => void; // "About This Mac"
  onMess: () => void; // open every window
  onTidy: () => void; // close every window
  onFoldCrane: () => void;
  onChime: () => void;
  onShutDown: () => void;
};

const CraneLogo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 9l9 3-3 7z" fill="currentColor" opacity=".55" />
    <path d="M11 12l11-7-8 11z" fill="currentColor" />
    <path d="M8 19l3-7 3 4z" fill="currentColor" opacity=".8" />
  </svg>
);

/**
 * Top bar. On laptops the options sit right in the bar like a Mac menu bar;
 * on phones, where they don't fit, the crane logo opens them as a dropdown.
 */
export default function MenuBar({ onAbout, onMess, onTidy, onFoldCrane, onChime, onShutDown }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const items: { label: string; hint?: string; run: () => void }[] = [
    { label: "About This Mac", run: onAbout },
    { label: "Make a Mess", hint: "opens everything", run: onMess },
    { label: "Tidy Up", hint: "closes everything", run: onTidy },
    { label: "Fold the Origami", run: onFoldCrane },
    { label: "Play Chime", run: onChime },
    { label: "Shut Down…", run: onShutDown },
  ];

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <header className="menubar">
      <div className="logo-menu" ref={menuRef}>
        <button className={`logo-btn ${open ? "on" : ""}`} aria-haspopup="menu" aria-expanded={open} aria-label="aryan.os menu" onClick={() => setOpen((o) => !o)}>
          <CraneLogo />
        </button>
        {open && (
          <div className="dropdown" role="menu">
            {items.map((it, i) => (
              <span key={it.label} style={{ display: "contents" }}>
                {(i === 1 || i === 5) && <hr />}
                <button role="menuitem" onClick={() => { setOpen(false); it.run(); }}>
                  {it.label} {it.hint && <kbd>{it.hint}</kbd>}
                </button>
              </span>
            ))}
            <hr />
            <a role="menuitem" href={links.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Connect on LinkedIn ↗</a>
          </div>
        )}
      </div>
      <span className="logo">aryan.os</span>
      <nav className="menus" aria-label="Menu">
        {items.map((it) => (
          <button key={it.label} onClick={it.run} title={it.hint}>{it.label}</button>
        ))}
      </nav>
      <div className="right">
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <Clock />
      </div>
    </header>
  );
}
