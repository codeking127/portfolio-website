"use client";
import { links } from "@/data/profile";
import { useDesktop, type WinId } from "./desktop-context";
import LangIcon from "./LangIcon";

export const APPS: { id: WinId; label: string; bg: string; icon: React.ReactNode }[] = [
  {
    id: "about", label: "About", bg: "#f7f3ea",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#3b55d9" strokeWidth="1.8"><circle cx="12" cy="9" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>,
  },
  {
    id: "code", label: "Code", bg: "#1d2230",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#8ab8ff" strokeWidth="2" strokeLinecap="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" /></svg>,
  },
  {
    id: "music", label: "Music", bg: "#ec6b5d",
    icon: <svg viewBox="0 0 24 24" fill="#fff"><path d="M9 17.5A2.5 2.5 0 1 1 7 15V5l11-2v11.5a2.5 2.5 0 1 1-2-2.45V6.4L9 7.7z" /></svg>,
  },
  {
    id: "run", label: "Runs", bg: "#28c08a",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="15" cy="4.5" r="1.8" fill="#fff" /><path d="M6 21l3.5-5 3 2 1-6 3 3h3M8.5 10l3-2.5 2.5 1.5" /></svg>,
  },
  {
    id: "lang", label: "Languages", bg: "#3b55d9",
    icon: <LangIcon />,
  },
  {
    id: "origami", label: "Origami", bg: "#fff",
    icon: <svg viewBox="0 0 24 24"><path d="M2 9l9 3-3 7z" fill="#92d2f3" /><path d="M11 12l11-7-8 11z" fill="#3f9cd3" /><path d="M8 19l3-7 3 4z" fill="#2a77ab" /></svg>,
  },
  {
    id: "journey", label: "Journey", bg: "#1e2a44",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#ffd36b" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 12h18" /></svg>,
  },
  {
    id: "animals", label: "Animals", bg: "#ffe9c7",
    icon: <svg viewBox="0 0 24 24" fill="#b5651d"><ellipse cx="12" cy="16" rx="4.5" ry="3.8" /><circle cx="6" cy="10.5" r="2" /><circle cx="18" cy="10.5" r="2" /><circle cx="9.3" cy="6.5" r="2" /><circle cx="14.7" cy="6.5" r="2" /></svg>,
  },
];

// LinkedIn and GitHub are real <a> links, so they always open in a new tab
const LINKS = [
  { label: "LinkedIn", href: links.linkedin, bg: "#0a66c2", icon: <svg viewBox="0 0 24 24" fill="#fff"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21h-4z" /></svg> },
  { label: "GitHub", href: links.github, bg: "#16181d", icon: <svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg> },
];

/** The Mac-style dock along the bottom (laptops and tablets). */
export default function Dock() {
  const { open, isOpen } = useDesktop();
  return (
    <nav className="dock" aria-label="Dock">
      {APPS.map((a) => (
        <button key={a.id} className={`app ${isOpen(a.id) ? "open" : ""}`} style={{ background: a.bg }} aria-label={a.label} onClick={() => open(a.id)}>
          {a.icon}
          <span className="tip">{a.label}</span>
        </button>
      ))}
      <span className="sep" />
      {LINKS.map((l) => (
        <a key={l.label} className="app" href={l.href} target="_blank" rel="noopener noreferrer" style={{ background: l.bg }} aria-label={l.label}>
          {l.icon}
          <span className="tip">{l.label}</span>
        </a>
      ))}
    </nav>
  );
}

/** Phones: the same apps as a home-screen grid with names under the icons, instead of a sideways-scrolling dock. */
export function AppGrid() {
  const { open } = useDesktop();
  return (
    <nav className="appgrid" aria-label="Apps">
      {APPS.map((a) => (
        <button key={a.id} className="gapp" onClick={() => open(a.id)}>
          <span className="gicon" style={{ background: a.bg }}>{a.icon}</span>
          {a.label}
        </button>
      ))}
      {LINKS.map((l) => (
        <a key={l.label} className="gapp" href={l.href} target="_blank" rel="noopener noreferrer">
          <span className="gicon" style={{ background: l.bg }}>{l.icon}</span>
          {l.label}
        </a>
      ))}
    </nav>
  );
}
