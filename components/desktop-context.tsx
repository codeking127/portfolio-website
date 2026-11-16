"use client";
import { createContext, useContext } from "react";
import type { ModelId } from "./Crane";

export type WinId = "about" | "code" | "music" | "run" | "lang" | "origami" | "journey" | "animals" | "photo";

export type PhotoInfo = { src: string; alt: string; cap: string; w: number; h: number };

export type DesktopApi = {
  open: (id: WinId) => void;
  close: (id: WinId) => void;
  openPhoto: (p: PhotoInfo) => void;
  isOpen: (id: WinId) => boolean;
  /** the origami shown on the desktop and in the Origami window */
  origami: ModelId;
  setOrigami: (m: ModelId) => void;
};

export const DesktopContext = createContext<DesktopApi | null>(null);

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside <Desktop>");
  return ctx;
}
