// Tiny sound effects made with Web Audio, so the site ships no audio files.
// Browsers only allow sound after the visitor has interacted with the page; until then these stay silent.

type Note = [freq: number, delay: number, length: number, type?: OscillatorType, volume?: number];

function playNotes(notes: Note[]) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new Ctx();
    const play = () => {
      notes.forEach(([freq, delay, len, type = "sine", vol = 0.12]) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.value = freq;
        const t = ac.currentTime + delay;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        o.connect(g).connect(ac.destination);
        o.start(t);
        o.stop(t + len + 0.05);
      });
      const end = Math.max(...notes.map((n) => n[1] + n[2])) * 1000 + 300;
      setTimeout(() => ac.close(), end);
    };
    if (ac.state === "running") play();
    else ac.resume().then(() => (ac.state === "running" ? play() : ac.close())).catch(() => ac.close());
  } catch {
    /* no audio available */
  }
}

/** Soft two-note "glass" chime, used by the login notification. */
export const chime = () => playNotes([[1318.5, 0, 0.5], [1760, 0.09, 0.7]]);

/** Bright marimba-like ping, played when the music window opens. */
export const ping = () =>
  playNotes([
    [1046.5, 0, 0.35, "triangle", 0.16],
    [1568, 0.07, 0.5, "sine", 0.1],
    [2093, 0.14, 0.6, "sine", 0.06],
  ]);
