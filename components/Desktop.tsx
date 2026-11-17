"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { intro } from "@/data/profile";
import { DesktopContext, type DesktopApi, type PhotoInfo, type WinId } from "./desktop-context";
import Window, { type WinState } from "./Window";
import Dock, { AppGrid } from "./Dock";
import LoginNotification from "./LoginNotification";
import Crane, { MODELS, type ModelId } from "./Crane";
import MenuBar from "./MenuBar";
import AboutThisMac from "./AboutThisMac";
import ShutDown from "./ShutDown";
import { chime, ping } from "./sfx";
import RoleFlip from "./RoleFlip";
import { About, Animals, Code, Journey, Languages, Music, Origami, Runs } from "./WindowContents";

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

const initialWins = () =>
  Object.fromEntries(
    IDS.map((id) => [id, { status: "closed", animate: false, z: 10, left: WINDOWS[id].left, top: WINDOWS[id].top, nonce: 0, max: false }]),
  ) as Record<WinId, WinState>;

const isPhone = () => window.matchMedia("(max-width: 900px)").matches;

export default function Desktop() {
  const [wins, setWins] = useState(initialWins);
  const [photo, setPhoto] = useState<PhotoInfo | null>(null);
  const [macOpen, setMacOpen] = useState(false); // "About This Mac"
  const [asleep, setAsleep] = useState(false); // "Shut Down…"
  const [craneSignal, setCraneSignal] = useState(0);
  const [origami, setOrigami] = useState<ModelId>("crane");
  const [hopping, setHopping] = useState(false); // the paper model is lifting off and dropping back down
  const [phone, setPhone] = useState(false);
  const hopBusy = useRef(false);
  const zTop = useRef(20);
  const deskRef = useRef<HTMLElement>(null);
  const winsRef = useRef(wins);
  winsRef.current = wins;

  const patch = useCallback((id: WinId, p: Partial<WinState>) => setWins((w) => ({ ...w, [id]: { ...w[id], ...p } })), []);

  const open = useCallback((id: WinId) => {
    // the music window opens with a ping (allowed here, since the visitor just clicked)
    if (id === "music" && winsRef.current.music.status === "closed") ping();
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

  const WINDOW_IDS = IDS.filter((id) => id !== "photo");
  // "Make a mess": open every window, one after another so each plays its own entrance
  const openAll = () => {
    if (isPhone()) return open("about");
    WINDOW_IDS.forEach((id, i) => setTimeout(() => open(id), i * 160));
  };
  // "Tidy up": close everything that's open
  const closeAll = () => IDS.forEach((id) => { if (winsRef.current[id].status === "open") close(id); });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Hovering the paper model (or tapping it on a phone): it lifts off, opens flat in the air and drops back
  // down folded into the next model, so visitors see there's a crane, a flower and a rabbit.
  const hop = useCallback((to?: ModelId) => {
    if (hopBusy.current) return;
    const ids = Object.keys(MODELS) as ModelId[];
    const next = to ?? ids[(ids.indexOf(origami) + 1) % ids.length];
    if (next === origami) return;
    hopBusy.current = true;
    setHopping(true);
    setOrigami(next);
    // unfolding (0.8s) + folding the new model (1.4s), plus a beat before it can hop again
    setTimeout(() => { hopBusy.current = false; setHopping(false); }, 2600);
  }, [origami]);

  // Phones have no hover, so while the paper model is on screen it hops to the next model by itself every
  // few seconds, until the visitor taps it themselves (then they know it's interactive).
  const hopRef = useRef(hop);
  hopRef.current = hop;
  const craneRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  useEffect(() => {
    // iOS Safari only shows :active (the touch versions of the hover effects) once a touch listener exists
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);
  useEffect(() => {
    const el = craneRef.current;
    if (!phone || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting && !touched.current) timer = window.setInterval(() => !touched.current && hopRef.current(), 6000);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [phone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close("photo"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const api: DesktopApi = useMemo(
    () => ({ open, close, openPhoto, isOpen: (id) => wins[id].status !== "closed", origami, setOrigami }),
    [open, close, openPhoto, wins, origami],
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

      <MenuBar
        onAbout={() => setMacOpen(true)}
        onMess={openAll}
        onTidy={closeAll}
        onFoldCrane={() => setCraneSignal((n) => n + 1)}
        onChime={chime}
        onShutDown={() => { setMacOpen(false); setAsleep(true); }}
      />

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
        </div>

        <div className="craneWrap" ref={craneRef}>
          <div
            className={`hopper ${hopping ? "hop" : ""}`}
            onMouseEnter={() => !phone && hop()}
            onAnimationEnd={() => setHopping(false)}
          >
            <Crane model={origami} toggleSignal={craneSignal} onActivate={phone ? () => { touched.current = true; hop(); } : undefined} />
          </div>
          {/* the three models; the one on show is highlighted, and each can be picked */}
          <div className="models" role="group" aria-label="Origami models">
            {(Object.keys(MODELS) as ModelId[]).map((id) => (
              <button key={id} className={id === origami ? "on" : ""} aria-pressed={id === origami} onClick={() => { touched.current = true; hop(id); }}>
                {MODELS[id].name}
              </button>
            ))}
          </div>
          <div className="cap">{phone ? "Tap it to fold the next one" : "Hover to refold · click to unfold"}</div>
        </div>

        {/* phones get a home-screen grid of apps instead of the dock */}
        {phone && <AppGrid />}

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
            onToggleMax={() => setWins((w) => ({ ...w, [id]: { ...w[id], max: !w[id].max, z: ++zTop.current } }))}
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
          onToggleMax={() => setWins((w) => ({ ...w, photo: { ...w.photo, max: !w.photo.max, z: ++zTop.current } }))}
        >
          {photo && (
            <>
              <Image src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes="560px" />
              <div className="pcap">{photo.cap}</div>
            </>
          )}
        </Window>
      </main>

      {!phone && <Dock />}
      <LoginNotification onOpen={() => open("about")} />
      {macOpen && (
        <AboutThisMac
          onClose={() => setMacOpen(false)}
          onMore={() => { setMacOpen(false); open("about"); }}
          onProjects={() => { setMacOpen(false); open("code"); }}
        />
      )}
      {asleep && <ShutDown onWake={() => { setAsleep(false); chime(); }} />}
    </DesktopContext.Provider>
  );
}
