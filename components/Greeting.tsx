"use client";
import { useEffect, useState } from "react";

export default function Greeting({ items }: { items: [string, string][] }) {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setOut(true);
      t = setTimeout(() => {
        setI((n) => (n + 1) % items.length);
        setOut(false);
      }, 300);
    }, 1800);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [items.length]);
  return (
    <>
      <div className={`greet ${out ? "out" : ""}`} lang="mul">{items[i][0]}</div>
      <div className="muted">{items[i][1]}</div>
    </>
  );
}
