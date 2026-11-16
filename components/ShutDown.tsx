"use client";
import { useEffect, useState } from "react";

/** "Shut Down…" from the crane menu: the screen goes dark, then a joke, then you can turn it back on. */
export default function ShutDown({ onWake }: { onWake: () => void }) {
  const [step, setStep] = useState(0); // 0 = going dark, 1 = message
  useEffect(() => {
    const t = setTimeout(() => setStep(1), 1400);
    const key = () => onWake();
    window.addEventListener("keydown", key);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", key);
    };
  }, [onWake]);

  return (
    <div className="shutdown" role="dialog" aria-label="Shut down">
      {step === 1 && (
        <div className="shutdown-msg">
          <p>It&apos;s now safe to close this tab.</p>
          <p className="muted">Just kidding. Thanks for stopping by ( ^ ω ^ )</p>
          <button onClick={onWake}>Turn back on</button>
        </div>
      )}
    </div>
  );
}
