"use client";
import { useEffect } from "react";
import { aboutThisMac } from "@/data/profile";
import Crane from "./Crane";

/** The joke "About This Mac" card from the crane menu: specs that are really facts about me. */
export default function AboutThisMac({ onClose, onMore, onProjects }: { onClose: () => void; onMore: () => void; onProjects: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="mac-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mac-card" role="dialog" aria-modal="true" aria-label="About This Mac">
        <div className="lights mac-lights">
          <button aria-label="Close About This Mac" title="Close" onClick={onClose} />
          <button aria-hidden="true" tabIndex={-1} />
          <button aria-hidden="true" tabIndex={-1} />
        </div>
        <div className="mac-crane"><Crane foldAfter={250} label="Paper crane" /></div>
        <h2>{aboutThisMac.name}</h2>
        <div className="muted">{aboutThisMac.version}</div>
        <dl className="mac-specs">
          {aboutThisMac.specs.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mac-btns">
          <button onClick={onMore}>More Info…</button>
          <button onClick={onProjects}>View Projects…</button>
        </div>
      </div>
    </div>
  );
}
