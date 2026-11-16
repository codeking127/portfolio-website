"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { intro, links } from "@/data/profile";
import { DesktopContext, type DesktopApi, type PhotoInfo, type WinId } from "./desktop-context";
import Window, { type WinState } from "./Window";
import Dock from "./Dock";
import Crane from "./Crane";
import Clock from "./Clock";
import RoleFlip from "./RoleFlip";
import { About, Animals, Code, Journey, Languages, Music, Origami, Runs, ext } from "./WindowContents";

// Where each window first appears (left as a share of the desktop width, top in px) and its title bar text.
const WINDOWS: Record<WinId, { title: string; left: string; top: string }> = {
  about: { title: "about.txt", left: "calc(100% - 720px)", top: "max(330px, calc(16% + 230px))" },
  // the main window: opens large and centred
  code: { title: "Code — Projects", left: "calc(50% - min(490px, 50vw - 24px))", top: "40px" },
  music: { title: "Music", left: "30%", top: "70px" },
  run: { title: "Runs", left: "48%", top: "44px" },
  lang: { title: "Languages", left: "12%", top: "300px" },
  origami: { title: "Origami", left: "36%", top: "140px" },
  journey: { title: "Journey", left: "18%", top: "60px" },
  animals: { title: "animals.txt", left: "60%", top: "320px" },
  photo: { title: "photo", left: "30%", top: "60px" },
};
const IDS = Object.keys(WINDOWS) as WinId[];

const MENU: [WinId, string][] = [
  ["about", "About"], ["code", "Code"], ["journey", "Journey"], ["music", "Music"], ["run", "Runs"], ["lang", "Languages"],
  ["origami", "Origami"], ["animals", "Animals"],
];
const ROLES: [WinId, string][] = [
  ["code", "⌘ Writes code"], ["journey", "Journey"], ["run", "Runs"], ["music", "Plays instruments"],
  ["origami", "Folds origami"], ["lang", "Learns languages"], ["animals", "Loves animals"],
];
// Only these sit on the desktop; everything else lives in the dock below.
const ICONS: [WinId, string, "doc" | "fold"][] = [
  ["about", "about.txt", "doc"], ["journey", "Journey", "fold"], ["code", "Code", "fold"],
];

const initialWins = () =>
  Object.fromEntries(
    IDS.map((id) => [id, { status: id === "about" ? "open" : "closed", animate: false, z: id === "about" ? 11 : 10, left: WINDOWS[id].left, top: WINDOWS[id].top, nonce: 0 }]),
  ) as Record<WinId, WinState>;

const isPhone = () => window.matchMedia("(max-width: 900px)").matches;

export default function Desktop() {
  const [wins, setWins] = useState(initialWins);
  const [photo, setPhoto] = useState<PhotoInfo | null>(null);
  const zTop = useRef(20);
  const deskRef = useRef<HTMLElement>(null);

  const patch = useCallback((id: WinId, p: Partial<WinState>) => setWins((w) => ({ ...w, [id]: { ...w[id], ...p } })), []);

  const open = useCallback((id: WinId) => {
    setWins((w) => {
      const next = { ...w };
      if (isPhone() && id !== "photo") {
        // phones show one window at a time as a sheet
        IDS.forEach((o) => { if (o !== id && next[o].status !== "closed") next[o] = { ...next[o], status: "closed" }; });
      }
      const cur = next[id];
      const z = ++zTop.current;
      if (cur.status === "open" && id !== "photo") next[id] = { ...cur, z };
      else next[id] = { ...cur, status: "open", animate: true, z, nonce: cur.nonce + 1 };
      return next;
    });
  }, []);

  const close = useCallback((id: WinId) => {
    patch(id, { status: "folding" });
    // safety net: if the fold animation never reports back (e.g. animations disabled), still close
    setTimeout(() => setWins((w) => (w[id].status === "folding" ? { ...w, [id]: { ...w[id], status: "closed" } } : w)), 900);
  }, [patch]);

  const openPhoto = useCallback((p: PhotoInfo) => {
    setPhoto(p);
    const desk = deskRef.current;
    if (desk && !isPhone()) {
      const w = Math.min(560, window.innerWidth - 32);
      patch("photo", { left: Math.max(16, (desk.clientWidth - w) / 2) + "px", top: Math.max(40, window.scrollY + 50) + "px" });
    }
    open("photo");
  }, [open, patch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close("photo"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const api: DesktopApi = useMemo(
    () => ({ open, close, openPhoto, isOpen: (id) => wins[id].status !== "closed" }),
    [open, close, openPhoto, wins],
  );

  const content: Record<Exclude<WinId, "photo">, React.ReactNode> = {
    about: <About />, code: <Code />, music: <Music />, run: <Runs />, lang: <Languages />,
    origami: <Origami />, journey: <Journey />, animals: <Animals />,
  };

  return (
    <DesktopContext.Provider value={api}>
      <svg className="wall" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <polygon points="0,0 520,0 180,420" opacity=".35" />
        <polygon points="520,0 1100,0 760,380" opacity=".18" />
        <polygon points="1100,0 1600,0 1600,520" opacity=".3" />
        <polygon points="180,420 760,380 420,1000" opacity=".14" />
        <polygon points="760,380 1600,520 1180,1000" opacity=".22" />
        <polygon points="0,560 420,1000 0,1000" opacity=".28" />
      </svg>

      <header className="menubar">
        <span className="logo">aryan.os</span>
        <div className="menus">
          {MENU.map(([id, label]) => <button key={id} onClick={() => open(id)}>{label}</button>)}
        </div>
        <div className="right">
          <a href={links.linkedin} {...ext}>LinkedIn ↗</a>
          <Clock />
        </div>
      </header>

      <main className="desk" ref={deskRef}>
        <div className="intro">
          <div className="hi"><span className="pulse" aria-hidden="true" />{intro.hello}</div>
          <h1>{intro.firstName}<br />{intro.lastName}</h1>
          <div className="roleline">
            {intro.rolePrefix} <RoleFlip words={intro.roles} />
          </div>
          <p className="desc">
            {intro.description.map((seg, i) =>
              typeof seg === "string" ? (
                <span key={i}>{seg}</span>
              ) : (
                <button key={i} className="ilink" onClick={() => open(seg.open)}>{seg.text}</button>
              ),
            )}
          </p>
          <div className="roles">
            {ROLES.map(([id, label]) => <button key={id + label} onClick={() => open(id)}>{label}</button>)}
          </div>
        </div>

        <div className="craneWrap">
          <Crane />
          <div className="cap">Click the crane</div>
        </div>

        <div className="icons">
          {ICONS.map(([id, label, kind]) => (
            <button key={id} className="icon" onClick={() => open(id)}>
              <span className={kind} />
              {label}
            </button>
          ))}
        </div>

        {IDS.filter((id): id is Exclude<WinId, "photo"> => id !== "photo").map((id) => (
          <Window
            key={`${id}-${wins[id].nonce}`}
            id={id}
            title={WINDOWS[id].title}
            state={wins[id]}
            onClose={() => close(id)}
            onFocus={() => patch(id, { z: ++zTop.current })}
            onFolded={() => patch(id, { status: "closed" })}
            onMove={(l, t) => patch(id, { left: l + "px", top: t + "px" })}
          >
            {content[id]}
          </Window>
        ))}

        <Window
          key={`photo-${wins.photo.nonce}`}
          id="photo"
          title={photo ? photo.src.split("/").pop()! : "photo"}
          state={wins.photo}
          onClose={() => close("photo")}
          onFocus={() => patch("photo", { z: ++zTop.current })}
          onFolded={() => patch("photo", { status: "closed" })}
          onMove={(l, t) => patch("photo", { left: l + "px", top: t + "px" })}
        >
          {photo && (
            <>
              <Image src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes="560px" />
              <div className="pcap">{photo.cap}</div>
            </>
          )}
        </Window>
      </main>

      <Dock />
    </DesktopContext.Provider>
  );
}
