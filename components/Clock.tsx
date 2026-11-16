"use client";
import { useEffect, useState } from "react";

/** Menu-bar date and time. Rendered empty on the server so it never mismatches the visitor's clock. */
export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span>&nbsp;</span>;
  return (
    <>
      <span>{now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}</span>
      <span>{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
    </>
  );
}
